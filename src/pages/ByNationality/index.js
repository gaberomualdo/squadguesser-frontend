import './styles.css';
import { PrimaryButton, SecondaryButton } from '../../components/';
import React, { useState } from 'react';

export default function ByNationality(props) {
  const [correctTeam, setCorrectTeam] = useState('');
  const [teamFormation, setTeamFormation] = useState([]);
  const [teams, setTeams] = useState([]);
  const [wrongTeams, setWrongTeams] = useState([]);
  const [guessedCorrectTeam, setGuessedCorrectTeam] = useState(false);

  const guessTeam = (e) => {
    if (e === correctTeam) {
      setGuessedCorrectTeam(true);
    } else {
      setWrongTeams([...wrongTeams, e]);
    }
  };

  const newTeam = () => {
    (async () => {
      const data = await (await fetch('http://localhost:6773/teams/by-league/Premier League')).json();
      const { name, formation } = await (await fetch('http://localhost:6773/team/random/by-league/Premier League')).json();
      setWrongTeams([]);
      setGuessedCorrectTeam(false);

      setTeamFormation(formation);
      setCorrectTeam(name);
      setTeams(data);
    })();
  };

  if (teams.length === 0 || correctTeam === '' || teamFormation.length === 0) {
    newTeam();
  }

  return (
    <div className='fullheight-section bynationalitypage gamepage'>
      <div className='side-section'>
        <div className={`panel side-panel guessteam ${guessedCorrectTeam ? 'doneguessing' : ''}`}>
          <h1 className='title'>Guess The Team!</h1>
          <div className='teams'>
            {teams.map((e, i) => {
              const isWrong = wrongTeams.indexOf(e) > -1;
              const isCorrect = e === correctTeam && guessedCorrectTeam;
              return (
                <PrimaryButton
                  key={i}
                  className={`button ${isWrong ? 'wrong' : ''} ${isCorrect || isWrong ? 'active' : ''}`}
                  color={isWrong ? 'var(--danger)' : 'var(--primary)'}
                  text={`${e} ${isWrong ? '' : ''}${isCorrect ? '' : ''}`}
                  onClick={isWrong ? () => {} : () => guessTeam(e)}
                />
              );
            })}
          </div>
          <button
            class='newchallenge'
            onClick={() => {
              newTeam();
            }}
          >
            New Game &rarr;
          </button>
        </div>
        <div className='panel side-panel hints'>
          <h1 className='title'>Hints</h1>
        </div>
      </div>
      <div className='panel main'>
        <div className='formation'>
          {teamFormation.map((player) => (
            <div className='player' style={{ left: `${player.positionCoords.x}%`, bottom: `${player.positionCoords.y}%` }}>
              <p className='name'>{guessedCorrectTeam ? player.name : player.nationality.split('Republic of Ireland').join('Ireland')}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='side-section newgame-section'>
        <div className='panel side-panel newgame'>
          <h1 className='title'>New Game</h1>
          <button
            onClick={() => {
              newTeam();
            }}
            class='newchallenge'
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
