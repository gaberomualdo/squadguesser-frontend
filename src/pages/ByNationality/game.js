/* eslint-disable no-restricted-globals */
import './game-styles/misc.css';
import './game-styles/guessteam.css';
import './game-styles/pitch-top.css';
import './game-styles/extras-section.css';
import './game-styles/mobile.css';
import { PrimaryButton, TertiaryButton, Pitch, PitchTop, Formation } from '../../components';
import React, { useState, useEffect } from 'react';
import commaNumber from 'comma-number';
import { APIBaseURL } from '../../lib/config';
import { toBase64, fromBase64 } from '../../lib/utils';

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
        <Pitch />
        <PitchTop
          showAnswer={gameData.doneGuessing || showRatings || showTransferBudget || nameLettersShown.length > 0}
          showLeague={!props.dailyChallenge}
          showTeamName={gameData.doneGuessing || nameLettersShown.length > 0}
          showTeamLogo={gameData.doneGuessing}
          teamLogoURL={gameData.logoURL}
          teamName={gameData.correctTeam.split('').map((l, i) => {
            const fillerLetter = l === ' ' ? <>&nbsp; </> : '_ ';
            const letter = l + ' ';
            const showLetter = !gameData.doneGuessing && nameLettersShown.indexOf(i) > -1;
            return (
              <span key={i} style={gameData.doneGuessing ? {} : { textTransform: 'uppercase' }}>
                {gameData.doneGuessing ? l : showLetter ? letter : fillerLetter}
              </span>
            );
          })}
          showStars={gameData.stars && (gameData.doneGuessing || showRatings)}
          stars={gameData.stars}
          showTransferBudget={gameData.fifaMiscData && (gameData.doneGuessing || showTransferBudget)}
          transferBudgetDollars={gameData.fifaMiscData ? gameData.fifaMiscData.transferBudgetDollars : 0}
          showRatings={gameData.fifaMiscData && (gameData.doneGuessing || showRatings)}
          ratings={gameData.fifaMiscData ? gameData.fifaMiscData.ratings : { defense: 0, attack: 0, midfield: 0 }}
        />
        <Formation
          showAnswer={gameData.doneGuessing}
          players={gameData.teamFormation.map((player, i) => {
            return {
              flagURL: player.nationality.flagURL.split('/2/').join('/6/'),
              playerURL: player.photoURL.split('/5/').join('/6/'),
              x: player.positionCoords.x,
              y: player.positionCoords.y,
              nationalityName: player.nationality.name,
              name: player.shortName,
            };
          })}
        />
      </div>
      <div className='side-section extras-section misc-section'>
        {props.dailyChallenge ? (
          <div className='panel side-panel dailychallenge'>
            <h1 className='title'>
              Daily <br />
              Challenge
            </h1>
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
      </div>
    </div>
  );
}
