import './styles.css';
import React, { useEffect, useState } from 'react';
import { APIBaseURL } from '../../lib/config';
import { halfStar, emptyStar, fullStar } from '../../lib/starIcons';
import { Loading, PlayButton, Pitch, Formation } from '../../components';
import commaNumber from 'comma-number';
import Dropdown from './dropdown';

export default function SquadsDatabase() {
  const [data, setData] = useState({});
  useEffect(() => {
    setTimeout(() => {
      (async () => {
        const fetchedData = await (await fetch(`${APIBaseURL}/teams/all/by-league/`)).json();
        setData(fetchedData);
      })();
    }, 100);
  }, []);
  return (
    <div className='squadsdatabase-page fullheight-section page panel'>
      <h1 className='title'>Squads Database</h1>
      <p className='description'>our database of over 200 professional football first-team squads</p>
      <main className='list-container'>
        {Object.keys(data).length > 0 ? (
          <>
            <div className='teams-select'>
              {Object.keys(data).map((e, i) => {
                return (
                  <Dropdown key={i} snippetTeams={data[e].slice(0, 4)} header={{ name: e, description: `${data[e].length} teams` }}>
                    {data[e].map((team, teamIdx) => (
                      <PlayButton
                        className='team-button'
                        name={team.name}
                        icon={<img src={team.logoURL} alt={team.name} />}
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
          </>
        ) : (
          <Loading />
        )}
        <div className='squad-content'></div>
      </main>
    </div>
  );
}
