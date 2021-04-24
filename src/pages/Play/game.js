/* eslint-disable no-restricted-globals */
import './game-styles/misc.css';
import './game-styles/guessteam.css';
import './game-styles/extras-section.css';
import './game-styles/mobile.css';
import './game-styles/details.css';
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  Pitch,
  PitchTop,
  Formation,
  TeamSheetTable,
  TeamInformationTable,
  ResponsiveContainer,
} from '../../components';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APIBaseURL } from '../../lib/config';
import { toBase64, fromBase64, getAverageRating } from '../../lib/utils';
import getStats from '../../lib/stats';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const axios = require('axios');

const urlGameParam = 'game';

export default function Game(props) {
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
  const [gameComplete, setGameComplete] = useState(false);

  const [copiedShareURL, setCopiedShareURL] = useState(false);

  const getShareURL = () => {
    return window.location.href;
  };

  const endGame = (gaveUp = false) => {
    if (!gameComplete) {
      // game has not already ended
      setGameComplete(true);

      const currentGameOverData = {
        type: props.dailyChallenge ? 'dailychallenge' : 'nationality',
        league: props.league,
        correctAnswer: gameData.correctTeam,
        correctAnswerRating: getAverageRating(gameData.fifaMiscData.ratings),
        won: !gaveUp,
        hintsUsed: [teamsEliminated.length > 0, nameLettersShown.length > 0, showRatings, showTransferBudget].filter((e) => e === true).length,
        wrongGuesses: gameData.wrongTeams.length,
      };

      if (props.loggedIn) {
        const token = localStorage.getItem('authtoken');
        axios({
          method: 'put',
          baseURL: APIBaseURL,
          url: `/api/profiles/me/game/`,
          data: currentGameOverData,
          headers: {
            'x-auth-token': token,
          },
        })
          .catch((err) => {
            try {
              alert(err.response.data.errors[0].msg);
            } catch (err) {
              alert('Error: Internal or Server Error Occurred');
            }
          })
          .then(() => {
            props.reloadUser(true);
          });
      }
    }
  };

  const guessTeam = (e) => {
    if (e === gameData.correctTeam) {
      setGameData({ ...gameData, doneGuessing: true });
      endGame();
    } else {
      setGameData({ ...gameData, wrongTeams: [...gameData.wrongTeams, e] });
    }
  };

  const newTeam = async (gameCode = '', onlyUpdateWithGameCode = false) => {
    const { league } = props;
    const data = await (await fetch(`${APIBaseURL}/teams/by-league/onlynamesandlogos/${league}`)).json();
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
    setGameComplete(false);
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
    <div className='game-outer-container'>
      <ResponsiveContainer>
        <style>
          {`.navbar-container {
          background-color: rgba(44, 62, 80, 0.8);
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
        }
      `}
        </style>
        <div className='fullheight-section bynationalitypage gamepage' activetab={activeTab}>
          <div className='tab-select'>
            <div className='tab-select-row'>
              <div className='bg'></div>
              <button className='main-section' onClick={() => setActiveTab('main-section')}>
                <i className='fas fa-users'></i>&nbsp; Squad
              </button>
              <button className='guess-section' onClick={() => setActiveTab('guess-section')}>
                <i className='fas fa-play'></i>&nbsp; Guess
              </button>
              <button className='misc-section' onClick={() => setActiveTab('misc-section')}>
                <i className='fas fa-toolbox'></i>&nbsp; Hints &amp; Stats
              </button>
            </div>
          </div>
          <div className='side-section guess-section'>
            <div className={`panel side-panel guessteam ${gameData.doneGuessing ? 'doneguessing' : ''}`}>
              <h1 className='title'>
                {gameData.doneGuessing ? (
                  <>
                    <i className='fas fa-check mr'></i> Correct
                  </>
                ) : (
                  <>
                    <i className='fas fa-play mr'></i> Make a Guess
                  </>
                )}
              </h1>
              <div className='teams'>
                {gameData.teams.map((e, i) => {
                  const { name } = e;
                  const isWrong = gameData.wrongTeams.indexOf(name) > -1;
                  const isCorrect = name === gameData.correctTeam && gameData.doneGuessing;
                  return (
                    <PrimaryButton
                      key={`${i}${isWrong ? '-wrong' : ''}`}
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
                          endGame(true);
                          setGameData({ ...gameData, doneGuessing: true });
                        }
                  }
                  text={
                    gameData.doneGuessing ? (
                      <>
                        Hide Answer <i className='fas fa-eye-slash ml'></i>
                      </>
                    ) : (
                      <>
                        Show Answer <i className='fas fa-eye ml'></i>
                      </>
                    )
                  }
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
              league={props.league ? props.league : ''}
            />
            <Formation
              showAnswer={gameData.doneGuessing}
              isGame={true}
              players={gameData.teamFormation.map((player, i) => {
                return {
                  gameType: ['alternate-team', 'initials'][Math.floor(Math.random() * 2)],
                  alternateTeamImageURL: player.nationality.flagURL.split('/2/').join('/6/'),
                  alternateTeamName: player.nationality.name,
                  imageURL: player.photoURL.split('/5/').join('/6/'),
                  x: player.positionCoords.x,
                  y: player.positionCoords.y,
                  name: player.shortName,
                  fullName: player.name,
                  age: player.age,
                  fifaRating: player.fifaRating,
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
            {!props.dailyChallenge ? (
              <Link to='/play'>
                <SecondaryButton className='menu-btn' text={<>&larr; Back to Menu</>} />
              </Link>
            ) : null}

            <div className='panel side-panel hints'>
              <h1 className='title'>
                <i className='fas fa-list mr'></i> Hints
              </h1>
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
                color='var(--primary)'
                text='Reduce Guess Pool by 50%'
              />
              <PrimaryButton
                color='var(--primary)'
                className={nameLettersShown.length > 0 ? 'disabled' : ''}
                onClick={() => {
                  const newNameLettersShown = [];
                  while (newNameLettersShown.length < 1) {
                    const randIdx = Math.floor(Math.random() * gameData.correctTeam.length);
                    if (newNameLettersShown.indexOf(randIdx) > -1) continue;
                    if (gameData.correctTeam[randIdx] === ' ') continue;
                    newNameLettersShown.push(randIdx);
                  }
                  setNameLettersShown(newNameLettersShown);
                }}
                text='Show 1 Letter of Team Name'
              />
              <PrimaryButton
                className={showRatings ? 'disabled' : ''}
                onClick={() => {
                  setShowRatings(true);
                }}
                color='var(--primary)'
                text='Show Team Ratings'
              />
              <PrimaryButton
                className={showTransferBudget ? 'disabled' : ''}
                onClick={() => {
                  setShowTransferBudget(true);
                }}
                color='var(--primary)'
                text='Show Transfer Budget'
              />
            </div>
            <div className='panel side-panel stats'>
              <h1 className='title'>
                <i className='fas fa-calculator mr'></i> Stats
              </h1>
              {props.loggedIn ? (
                <div className='container'>
                  <div className='row'>
                    {[
                      ['Rating', props.user.rating],
                      ['Leaderboard', `#${props.user.leaderboardPosition}`],
                    ].map((e, i) => (
                      <div className='title-number' key={i}>
                        <h1>{e[0]}</h1>
                        <p>{e[1]}</p>
                      </div>
                    ))}
                  </div>
                  {[
                    [
                      `${props.dailyChallenge ? 'Daily Challenge' : props.league} w/l Ratio`,
                      (() => {
                        const wl = getStats(props.user.gamesPlayed, props.dailyChallenge ? 'dailychallenge' : props.league, 'win-loss');
                        const wlPercent = Math.round((wl[0] / (wl[0] + wl[1])) * 100);
                        return (
                          <>
                            {wl[0]}:{wl[1]} <span>~{isNaN(wlPercent) ? '0' : wlPercent}%</span>
                          </>
                        );
                      })(),
                    ],
                    [
                      `${props.dailyChallenge ? 'Daily Challenge' : props.league} Streak`,
                      <>
                        {getStats(props.user.gamesPlayed, props.dailyChallenge ? 'dailychallenge' : props.league, 'streak')} <span>games</span>
                      </>,
                    ],
                    [
                      `${props.dailyChallenge ? 'Daily Challenge' : props.league} Best Streak`,
                      <>
                        {getStats(props.user.gamesPlayed, props.dailyChallenge ? 'dailychallenge' : props.league, 'longest-streak')}{' '}
                        <span>games</span>
                      </>,
                    ],
                  ].map((e, i) => (
                    <div className='title-number' key={i}>
                      <h1>{e[0]}</h1>
                      <p>{e[1]}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <PrimaryButton
                  text={
                    <>
                      <i className='fas fa-sign-in-alt mr'></i>Sign In To Get Stats
                    </>
                  }
                  onClick={() => props.setAuthModal(true, true)}
                />
              )}
            </div>
          </div>
        </div>
        <div className={`panel details-section ${gameData.doneGuessing ? '' : 'blurred'}`}>
          <div className='left'>
            <h1 className='details-title'>
              <i className='fas fa-th-list mr'></i>Team Sheet
            </h1>
            <TeamSheetTable players={gameData.teamFormation} includeRatingPotential={false} />
          </div>
          <div className='right'>
            <div className='team-information'>
              <h1 className='details-title'>
                <i className='fas fa-info-circle mr'></i>Team Information
              </h1>
              <TeamInformationTable
                squad={{
                  name: gameData.correctTeam,
                  fifaMiscData: {
                    ratings: gameData.fifaMiscData ? gameData.fifaMiscData.ratings : { defense: 0, attack: 0, midfield: 0 },
                    transferBudgetDollars: gameData.fifaMiscData ? gameData.fifaMiscData.transferBudgetDollars : 0,
                  },
                }}
              />
            </div>
            <div className='share box'>
              <h1 className='details-title'>
                <i className='fas fa-share-alt mr'></i>Share Game
              </h1>
              <div className='section'>
                <div className='input-container'>
                  <input
                    type='text'
                    onClick={(e) => {
                      e.target.setSelectionRange(0, e.target.value.length);
                    }}
                    value={getShareURL()}
                    onInput={(e) => e.preventDefault()}
                  />
                  <CopyToClipboard
                    text={getShareURL()}
                    onCopy={() => {
                      setCopiedShareURL(true);
                      setTimeout(() => {
                        setCopiedShareURL(false);
                      }, 750);
                    }}
                  >
                    <button className={`copy ${copiedShareURL ? 'copied' : ''}`}>
                      {copiedShareURL ? (
                        <>
                          <i className='fas fa-thumbs-up'></i> <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <i className='fas fa-copy'></i> <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </CopyToClipboard>
                </div>
                <div className='grid'>
                  <button style={{ '--bg': '#00aced' }}>
                    <i className='fab fa-twitter'></i>
                    <p>
                      <span>Twitter</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                  <button style={{ '--bg': 'var(--lighterdark-1)' }}>
                    <i className='fas fa-envelope'></i>
                    <p>
                      <span>Email</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                  <button style={{ '--bg': '#3b5998' }}>
                    <i className='fab fa-facebook-f'></i>
                    <p>
                      <span>Facebook</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                  <button style={{ '--bg': '#25D366' }}>
                    <i className='fab fa-whatsapp'></i>
                    <p>
                      <span>WhatsApp</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                  <button style={{ '--bg': '#FF4500' }}>
                    <i className='fab fa-reddit-alien'></i>
                    <p>
                      <span>Reddit</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                  <button style={{ '--bg': '#49a9e9' }}>
                    <i className='fab fa-telegram-plane'></i>
                    <p>
                      <span>Telegram</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                  <button style={{ '--bg': '#45668e' }}>
                    <i className='fab fa-vk'></i>
                    <p>
                      <span>VK</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                  <button style={{ '--bg': '#00c80f' }}>
                    <i className='fab fa-weixin'></i>
                    <p>
                      <span>WeChat</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                  <button style={{ '--bg': '#2c4762' }}>
                    <i className='fab fa-tumblr'></i>
                    <p>
                      <span>Tumblr</span>
                      <i className='fas fa-share'></i>
                    </p>
                  </button>
                </div>
              </div>
            </div>
            <div className='how-to'>
              <h1 className='details-title'>
                <i className='fas fa-question-circle mr'></i>How To Play
              </h1>
              <p>SquadGuessr is a puzzle game where players try to guess a given squad based on limited information.</p>
              <ul>
                <li>To make a guess, click on your guess on the bar on the left.</li>
                <li>To give up and see the answer, click the Show Answer button.</li>
                <li>
                  If you're signed in, showing the answer or making three wrong guesses counts as a loss and will decrease your rating accordingly.
                </li>
                <li>If you're having trouble with a game, try using a hint.</li>
              </ul>
              <p>{/* <em style={{ opacity: 0.6 }}>&mdash; Gabriel Romualdo, April 2021</em> */}</p>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
