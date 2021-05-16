import React, { useState } from 'react';
import seedrandom from 'seedrandom';
import { Formation, Pitch, PitchTop, PlayButton, ResponsiveContainer } from '../../../components';
import { siteTitle } from '../../../lib/config';
import gameTypes from '../../../lib/gameTypes';
import './styles.css';

export default function ExampleGames(props) {
  const games = props.games.slice(0, 6);
  const [selectedGame, setSelectedGame] = useState(0);
  const activeSquad = games[selectedGame];
  let itemTypes = [];

  if (activeSquad) {
    const generator = seedrandom(selectedGame);
    for (let i = 0; i < activeSquad.formation.length; i++) {
      itemTypes.push(['alternate-team', ...gameTypes][Math.floor(generator() * 2)]);
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--darker)', padding: '3.5rem 0' }} className='homepage-example-games-outer'>
      <ResponsiveContainer>
        <div className='homepage-example-games'>
          <div className='left'>
            <div className='meta'>
              <h1>Here's An Example</h1>
              <p>A few solved examples to kickstart your {siteTitle} experience.</p>
            </div>
            <div className='inner'>
              <div className='buttons'>
                {games.map((e, i) => (
                  <button key={i} className={i === selectedGame ? 'active' : ''} onClick={() => setSelectedGame(i)}>
                    <img src={e.logoURL} alt={e.name} /> <span>{e.name}</span>
                  </button>
                ))}
              </div>
              <PlayButton
                name={`Try Playing A Game`}
                description={`${siteTitle} games are just like this! Play now.`}
                className='primary'
                style={{ width: '100%' }}
                icon={<i className='fas fa-play'></i>}
                onClick={() => window.location.assign('/play')}
              />
            </div>
          </div>
          <div className='right'>
            <div className='squad-formation-container'>
              {activeSquad ? (
                <>
                  <Pitch />
                  <PitchTop showAnswer={false} />
                  <Formation
                    isGame={true}
                    showAnswer={false}
                    players={activeSquad.formation.map((player, i) => {
                      return {
                        gameType: itemTypes[i],
                        alternateTeamImageURL: player.nationality.flagURL.split('/2/').join('/6/'),
                        imageURL: player.photoURL.split('/5/').join('/6/'),
                        x: player.positionCoords.x,
                        y: player.positionCoords.y,
                        nationalityName: player.nationality.name,
                        name: player.shortName,
                        fullName: player.name,
                        fifaRating: player.fifaRating,
                        age: player.age,
                      };
                    })}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
