import './styles.css';
import React, { useEffect, useState } from 'react';
import { APIBaseURL } from '../../lib/config';
import { halfStar, emptyStar, fullStar } from '../../lib/starIcons';
import { Loading, PlayButton, Pitch, PitchTop, Formation } from '../../components';
import commaNumber from 'comma-number';
import Dropdown from './dropdown';

export default function SquadsDatabase() {
  const [data, setData] = useState({});
  const [activeSquad, setActiveSquad] = useState({});
  useEffect(() => {
    setTimeout(() => {
      (async () => {
        const fetchedData = await (await fetch(`${APIBaseURL}/teams/all/by-league/`)).json();
        setData(fetchedData);
      })();
    }, 100);
  }, []);
  return (
    <>
      <div className='squadsdatabase-page fullheight-section page panel'>
        <h1 className='title'>Squads Database</h1>
        <p className='description'>our database of over 200 professional football first-team squads</p>
        <main className={`main-container ${Object.keys(activeSquad).length > 0 ? 'show-squad' : 'hide-squad'}`}>
          <div className='squad-content'>
            <div className='squad-content-inner'>
              {Object.keys(activeSquad).length > 0 ? (
                <>
                  <Pitch />
                  <PitchTop
                    showAnswer={true}
                    showLeague={true}
                    showTeamName={true}
                    showTeamLogo={true}
                    showStars={true}
                    showRatings={activeSquad.fifaMiscData ? true : false}
                    showTransferBudget={activeSquad.fifaMiscData ? true : false}
                    teamLogoURL={activeSquad.logoURL}
                    teamName={activeSquad.name}
                    stars={activeSquad.stars}
                    transferBudgetDollars={activeSquad.fifaMiscData ? activeSquad.fifaMiscData.transferBudgetDollars : 0}
                    ratings={activeSquad.fifaMiscData ? activeSquad.fifaMiscData.ratings : { defense: 0, attack: 0, midfield: 0 }}
                  />
                  <Formation
                    showAnswer={true}
                    players={activeSquad.formation.map((player, i) => {
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
                </>
              ) : null}
            </div>
          </div>
          {Object.keys(data).length > 0 ? (
            <>
              <div className='teams-select'>
                <div className='teams-select-inner'>
                  {Object.keys(data).map((e, i) => {
                    return (
                      <Dropdown key={i} snippetTeams={data[e].slice(0, 4)} header={{ name: e, description: `${data[e].length} teams` }}>
                        {data[e].map((team, teamIdx) => (
                          <PlayButton
                            className={`team-button ${Object.keys(activeSquad).length > 0 ? (activeSquad.name === team.name ? 'primary' : '') : ''}`}
                            name={team.name}
                            icon={<img src={team.logoURL} alt={team.name} />}
                            onClick={() => {
                              if (activeSquad.name === team.name) {
                                setActiveSquad({});
                              } else {
                                setActiveSquad(team);
                              }
                            }}
                            description={
                              <>
                                <span className='stars'>
                                  {Array(Math.floor(team.stars))
                                    .fill(fullStar)
                                    .concat(Array((team.stars % 1) / 0.5).fill(halfStar))
                                    .concat(Array(5 - Math.ceil(team.stars)).fill(emptyStar))
                                    .map((e, i) => (
                                      <span key={i}>{e}</span>
                                    ))}
                                </span>
                                <span className='extra-info'>
                                  Transfer Budget: ${commaNumber(team.fifaMiscData.transferBudgetDollars)} &bull;{' '}
                                  {team.fifaMiscData.rival ? `Rival: ${team.fifaMiscData.rival.name}` : null} &bull; Rating:{' '}
                                  {Object.keys(team.fifaMiscData.ratings)
                                    .map((e) => {
                                      return `${team.fifaMiscData.ratings[e]} ${e.slice(0, 3).toUpperCase()}`;
                                    })
                                    .join(', ')}
                                </span>
                              </>
                            }
                            key={teamIdx}
                          />
                        ))}
                      </Dropdown>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div style={{ margin: '0 auto', float: 'none' }}>
              <div style={{ display: 'block', textAlign: 'center' }}>
                <Loading />
              </div>
            </div>
          )}
        </main>
        <div className='mobile-banner'>
          <p>This page is not yet available on mobile.</p>
          <p>Please switch to a larger screen to use.</p>
          <p>Apologies for the inconvenience.</p>
        </div>
      </div>
    </>
  );
}
