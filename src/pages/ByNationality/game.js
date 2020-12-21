/* eslint-disable no-restricted-globals */
import './game-styles/misc.css';
import './game-styles/guessteam.css';
import './game-styles/formation.css';
import './game-styles/pitch.css';
import './game-styles/pitch-top.css';
import './game-styles/extras-section.css';
import './game-styles/mobile.css';
import { PrimaryButton, TertiaryButton } from '../../components';
import React, { useState, useEffect } from 'react';
import commaNumber from 'comma-number';
import { APIBaseURL } from '../../lib/config';
import { toBase64, fromBase64 } from '../../lib/utils';

const halfStar = (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
    <path d='M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524v-12.005zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z' />
  </svg>
);
const fullStar = (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
    <path d='M12 .288l2.833 8.718h9.167l-7.417 5.389 2.833 8.718-7.416-5.388-7.417 5.388 2.833-8.718-7.416-5.389h9.167z' />
  </svg>
);
const emptyStar = (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
    <path d='M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z' />
  </svg>
);
const urlGameParam = 'game';

export default function ByNationalityGame(props) {
  const [gameData, setGameData] = useState({
    wrongTeams: [],
    teamFormation: [],
    correctTeam: '',
    teams: [],
    doneGuessing: false,
  });

  const [showRatings, setShowRatings] = useState(false);
  const [showTransferBudget, setShowTransferBudget] = useState(false);
  const [nameLettersShown, setNameLettersShown] = useState([]);
  const [teamsEliminated, setTeamsEliminated] = useState([]);
  const [activeTab, setActiveTab] = useState('main-section');

  const guessTeam = (e) => {
    if (e === gameData.correctTeam) {
      setGameData({ ...gameData, doneGuessing: true });
    } else {
      setGameData({ ...gameData, wrongTeams: [...gameData.wrongTeams, e] });
    }
  };

  const newTeam = async (gameCode = '', onlyUpdateWithGameCode = false) => {
    const { league } = props;
    const data = await (await fetch(`${APIBaseURL}/teams/by-league/${league}`)).json();
    let teamAPIURL = `${APIBaseURL}/team/random/by-league/${league}`;
    const teamNames = data.map((e) => e.name);

    if (gameCode) {
      let gameCodeWasValid = false;
      try {
        const decodedTeam = fromBase64(gameCode);
        if (teamNames.indexOf(decodedTeam) > -1) {
          teamAPIURL = `${APIBaseURL}/team/${decodedTeam}`;
          gameCodeWasValid = true;
        }
      } catch (err) {}
      if (!gameCodeWasValid && onlyUpdateWithGameCode) {
        return;
      }
    }

    const { name, formation, ...extraData } = await (await fetch(teamAPIURL)).json();

    if (!gameCode) {
      const url = new URL(window.location.href);
      url.searchParams.set(urlGameParam, toBase64(name));
      const urlStr = url.toString();
      history.replaceState({}, 'Navigate to New Page', urlStr);
    }

    setGameData({
      wrongTeams: [],
      teamFormation: formation,
      correctTeam: name,
      teams: data,
      ...extraData,
    });
    setShowRatings(false);
    setShowTransferBudget(false);
    setNameLettersShown([]);
    setTeamsEliminated([]);
    setActiveTab('main-section');
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(urlGameParam)) {
      const param = urlParams.get(urlGameParam);
      return newTeam(param);
    }
    newTeam();
  }, []);

  return (
    <div className='fullheight-section bynationalitypage gamepage' activetab={activeTab}>
      <div className='tab-select'>
        <div className='tab-select-row'>
          <div className='bg'></div>
          <button className='main-section' onClick={() => setActiveTab('main-section')}>
            Squad
          </button>
          <button className='guess-section' onClick={() => setActiveTab('guess-section')}>
            Guess
          </button>
          <button className='misc-section' onClick={() => setActiveTab('misc-section')}>
            Hints &amp; Stats
          </button>
        </div>
      </div>
      <div className='side-section guess-section'>
        <div className={`panel side-panel guessteam ${gameData.doneGuessing ? 'doneguessing' : ''}`}>
          <h1 className='title'>{gameData.doneGuessing ? 'Correct!' : 'Make a Guess:'}</h1>
          <div className='teams'>
            {gameData.teams.map((e, i) => {
              const { name } = e;
              const isWrong = gameData.wrongTeams.indexOf(name) > -1;
              const isCorrect = name === gameData.correctTeam && gameData.doneGuessing;
              return (
                <PrimaryButton
                  key={i}
                  className={`button ${isWrong ? 'wrong' : ''} ${isCorrect || isWrong ? 'active' : ''} ${
                    teamsEliminated.indexOf(i) > -1 ? 'disabled' : ''
                  }`}
                  color={isWrong ? 'var(--danger)' : 'var(--primary)'}
                  style={{ '--bg-url': `url(${e.logoURL})` }}
                  text={`${name} ${isWrong ? '' : ''}${isCorrect ? '' : ''}`}
                  onClick={
                    isWrong
                      ? () => {}
                      : () => {
                          guessTeam(name);
                        }
                  }
                />
              );
            })}
          </div>
          <div className='bottom-buttons'>
            {gameData.doneGuessing && !props.dailyChallenge ? (
              <TertiaryButton
                className='newchallenge'
                onClick={() => {
                  newTeam();
                }}
                text={<>New Game &rarr;</>}
              />
            ) : null}
            <TertiaryButton
              className='light'
              onClick={
                gameData.doneGuessing
                  ? () => {
                      setGameData({ ...gameData, doneGuessing: false, wrongTeams: [] });
                    }
                  : () => {
                      setGameData({ ...gameData, doneGuessing: true });
                    }
              }
              text={gameData.doneGuessing ? <>&larr; Hide Answer</> : <>Show Answer&nbsp;&nbsp;👀</>}
            />
          </div>
        </div>
      </div>
      <div className='panel main main-section'>
        <div className='pitch'>
          {[...Array(21)].map((x, i) => (
            <div key={i} style={{ top: `${(100 / 21) * i}%`, height: `${100 / 21}%` }} className={`line ${i % 2 === 0 ? 'even' : 'odd'}`}></div>
          ))}
          <div className='midline'></div>
          <div className='center circle dot'></div>
          <div className='center circle'></div>
          <div className='box small gk top'></div>
          <div className='box small gk bottom'></div>
          <div className='box large gk top'></div>
          <div className='box large gk bottom'></div>
          <div className='circle dot gk top'></div>
          <div className='circle dot gk bottom'></div>
          <div className='overlay'></div>
          <p className='site-title'>SquadGuessr</p>
        </div>
        <div
          className={`top ${
            gameData.doneGuessing || showRatings || showTransferBudget || nameLettersShown.length > 0 ? 'show-answer' : 'hide-answer'
          }`}
        >
          <div className='header'>
            <div className='box'>
              <h1>Guess That Team!</h1>
              <p>Each flag and its position represents a player in a team.</p>
              {!props.dailyChallenge ? <p style={{ marginTop: '.35rem' }}>Team league: {props.league}</p> : null}
            </div>
          </div>
          <div className='left'>
            <div className='logo-container'>
              {gameData.doneGuessing || nameLettersShown.length > 0 ? (
                <div className='logo box'>
                  {gameData.doneGuessing ? <img src={gameData.logoURL} alt='Team Logo' /> : null}
                  <h1>
                    {gameData.correctTeam.split('').map((l, i) => {
                      const fillerLetter = l === ' ' ? <>&nbsp; </> : '_ ';
                      const letter = l + ' ';
                      const showLetter = !gameData.doneGuessing && nameLettersShown.indexOf(i) > -1;
                      return (
                        <span key={i} style={gameData.doneGuessing ? {} : { textTransform: 'uppercase' }}>
                          {gameData.doneGuessing ? l : showLetter ? letter : fillerLetter}
                        </span>
                      );
                    })}
                  </h1>
                </div>
              ) : null}
              <div className='row'>
                <div className='stars'>
                  {gameData.stars && (gameData.doneGuessing || showRatings)
                    ? Array(Math.floor(gameData.stars))
                        .fill(fullStar)
                        .concat(Array((gameData.stars % 1) / 0.5).fill(halfStar))
                        .concat(Array(5 - Math.ceil(gameData.stars)).fill(emptyStar))
                        .map((e, i) => <span key={i}>{e}</span>)
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div className='right'>
            <div className='info box'>
              {gameData.fifaMiscData && (gameData.doneGuessing || showTransferBudget) ? (
                <p className='budget'>
                  Transfer Budget: <strong>${commaNumber(gameData.fifaMiscData.transferBudgetDollars)}</strong>
                </p>
              ) : null}
              {gameData.fifaMiscData && (gameData.doneGuessing || showRatings) ? (
                <p className='rating'>
                  Rating:&nbsp;
                  <strong>
                    {Object.keys(gameData.fifaMiscData.ratings)
                      .map((e) => {
                        return `${gameData.fifaMiscData.ratings[e]} ${e.slice(0, 3).toUpperCase()}`;
                      })
                      .join(' • ')}
                  </strong>
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className='formation'>
          {gameData.teamFormation.map((player, i) => {
            const flagURL = player.nationality.flagURL.split('/2/').join('/6/');
            const playerURL = player.photoURL.split('/5/').join('/6/');
            const showAnswer = gameData.doneGuessing;
            let { x, y } = player.positionCoords;
            return (
              <div className={`player ${showAnswer ? 'show-player' : 'show-flag'}`} key={i} style={{ left: `${x}%`, bottom: `${y}%` }}>
                <img src={flagURL} alt='' className='flag' />
                <img src={playerURL} alt='' className='player' />
                <p className='name'>
                  <span>{showAnswer ? player.shortName : player.nationality.name}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className='side-section extras-section misc-section'>
        {props.dailyChallenge ? (
          <div className='panel side-panel dailychallenge'>
            <h1 className='title'>Daily Challenge</h1>
            <div className='title-number'>
              <h1>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][new Date().getMonth()]}</h1>
              <p>{new Date().getDate()}</p>
            </div>
          </div>
        ) : null}
        {!props.dailyChallenge ? <PrimaryButton className='menu-btn' onClick={() => props.setPage('play')} text={<>&larr; Back to Menu</>} /> : null}
        <div className='panel side-panel stats'>
          <h1 className='title'>Your Stats</h1>
          <PrimaryButton text='Sign In to Get Your Stats' />
        </div>
        <div className='panel side-panel hints'>
          <h1 className='title'>Hints</h1>
          <PrimaryButton
            className={teamsEliminated.length > 0 ? 'disabled' : ''}
            onClick={() => {
              const newTeamsEliminated = [];
              while (newTeamsEliminated.length < Math.floor(gameData.teams.length / 2)) {
                const randIdx = Math.floor(Math.random() * gameData.teams.length);
                if (newTeamsEliminated.indexOf(randIdx) === -1 && gameData.teams[randIdx].name !== gameData.correctTeam)
                  newTeamsEliminated.push(randIdx);
              }
              setTeamsEliminated(newTeamsEliminated);
            }}
            color='#9b59b6'
            text='Reduce Guess Pool by 50%'
          />
          <PrimaryButton
            color='#9b59b6'
            className={nameLettersShown.length > 0 ? 'disabled' : ''}
            onClick={() => {
              const newNameLettersShown = [];
              while (newNameLettersShown.length < 2) {
                const randIdx = Math.floor(Math.random() * gameData.correctTeam.length);
                if (newNameLettersShown.indexOf(randIdx) > -1) continue;
                if (gameData.correctTeam[randIdx] === ' ') continue;
                newNameLettersShown.push(randIdx);
              }
              setNameLettersShown(newNameLettersShown);
            }}
            text='Show 2 Letters of Team Name'
          />
          <PrimaryButton
            className={showRatings ? 'disabled' : ''}
            onClick={() => {
              setShowRatings(true);
            }}
            color='#9b59b6'
            text='Show Team Ratings'
          />
          <PrimaryButton
            className={showTransferBudget ? 'disabled' : ''}
            onClick={() => {
              setShowTransferBudget(true);
            }}
            color='#9b59b6'
            text='Show Transfer Budget'
          />
        </div>
        {/* <div className='panel side-panel share'>
          <h1 className='title'>Share</h1>
          <PrimaryButton color='var(--info)' text='Download Challenge' />
          <PrimaryButton color='var(--info)' text='Download Challenge Answer' />
        </div> */}
      </div>
    </div>
  );
}
