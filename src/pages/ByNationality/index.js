import './styles.css';
import { PrimaryButton } from '../../components/';
import React, { useState, useEffect } from 'react';
import FitText from 'react-fittext';

export default function ByNationality(props) {
  const [gameData, setGameData] = useState({
    wrongTeams: [],
    teamFormation: [],
    correctTeam: '',
    teams: [],
    guessedCorrectTeam: false,
  });

  const guessTeam = (e) => {
    if (e === gameData.correctTeam) {
      setGameData({ ...gameData, guessedCorrectTeam: true });
    } else {
      setGameData({ ...gameData, wrongTeams: [...gameData.wrongTeams, e] });
    }
  };

  const newTeam = async () => {
    const league = 'Premier League';
    const data = await (await fetch(`http://localhost:6773/teams/by-league/${league}`)).json();
    const { name, formation, ...extraData } = await (await fetch(`http://localhost:6773/team/random/by-league/${league}`)).json();
    setGameData({
      wrongTeams: [],
      teamFormation: formation,
      correctTeam: name,
      teams: data,
      ...extraData,
    });
  };

  useEffect(() => {
    newTeam();
  }, []);

  return (
    <div className='fullheight-section bynationalitypage gamepage'>
      <div className='side-section'>
        <div className={`panel side-panel guessteam ${gameData.guessedCorrectTeam ? 'doneguessing' : ''}`}>
          <h1 className='title'>{gameData.guessedCorrectTeam ? 'Correct!' : 'Guess The Team!'}</h1>
          <div className='teams'>
            {gameData.teams.map((e, i) => {
              const isWrong = gameData.wrongTeams.indexOf(e) > -1;
              const isCorrect = e === gameData.correctTeam && gameData.guessedCorrectTeam;
              return (
                <PrimaryButton
                  key={i}
                  className={`button ${isWrong ? 'wrong' : ''} ${isCorrect || isWrong ? 'active' : ''}`}
                  color={isWrong ? 'var(--danger)' : 'var(--primary)'}
                  text={`${e} ${isWrong ? '' : ''}${isCorrect ? '' : ''}`}
                  onClick={
                    isWrong
                      ? () => {}
                      : () => {
                          guessTeam(e);
                        }
                  }
                />
              );
            })}
          </div>
          <button
            className='newchallenge'
            onClick={() => {
              newTeam();
            }}
          >
            New Game &rarr;
          </button>
        </div>
      </div>
      <div className='panel main'>
        <div className='pitch'>
          {[...Array(21)].map((x, i) => (
            <div key={i} style={{ top: `${(100 / 21) * i}%`, height: `${100 / 21}%` }} className={`line ${i % 2 == 0 ? 'even' : 'odd'}`}></div>
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
        </div>
        <div className='top'>
          <div className='left'>
            <img src={gameData.logoURL} alt='Team Logo' />
            <h1>
              {gameData.correctTeam.split('').map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </h1>
          </div>
        </div>
        <div className='formation'>
          {gameData.teamFormation.map((player, i) => {
            const flagURL = player.nationality.flagURL.split('/2/').join('/6/');
            const playerURL = player.photoURL.split('/5/').join('/6/');
            const showAnswer = gameData.guessedCorrectTeam;
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
      <div className='side-section newgame-section'>
        <div className='panel side-panel newgame'>
          <h1 className='title'>Select League</h1>
          <button
            onClick={() => {
              newTeam();
            }}
            className='newchallenge'
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
