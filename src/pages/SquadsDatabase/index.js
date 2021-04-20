import './styles.css';
import React, { useEffect, useState } from 'react';
import { APIBaseURL } from '../../lib/config';
import { halfStar, emptyStar, fullStar } from '../../lib/starIcons';
import { Loading, PlayButton, Pitch, PitchTop, Formation, Modal, TeamSheetTable, TeamInformationTable } from '../../components';
import commaNumber from 'comma-number';
import Dropdown from './dropdown';

const leaguesWithDuplicates = ['Top 25 Teams', 'Top 40 Teams'];

const createGroups = (data, groupBy) => {
  if (groupBy === 'league') {
    // data is already grouped by league
    return data;
  }
  const ret = {};

  const addToRet = (k, v) => {
    if (!ret[k]) {
      ret[k] = [];
    }
    ret[k].push(v);
  };

  const ratingsInterval = 5;
  const transferBudgetInterval = 25000000;
  const divisor = 1000000;
  const divisorLetter = 'M';
  Object.keys(data).forEach((e) => {
    if (leaguesWithDuplicates.indexOf(e) > -1) {
      return;
    }
    data[e].forEach((item) => {
      if (groupBy === 'transfer-budget') {
        const startInterval = Math.floor(item.fifaMiscData.transferBudgetDollars / transferBudgetInterval) * transferBudgetInterval;
        const endInterval = startInterval + transferBudgetInterval;
        addToRet(
          `$${commaNumber(startInterval / divisor)}${startInterval > 0 ? divisorLetter : ''} to $${commaNumber(
            endInterval / divisor
          )}${divisorLetter}`,
          item
        );
      } else if (groupBy === 'rating') {
        const rating = Object.values(item.fifaMiscData.ratings).reduce((a, b) => a + b, 0) / Object.keys(item.fifaMiscData.ratings).length;
        const startInterval = Math.floor(rating / ratingsInterval) * ratingsInterval;
        const endInterval = startInterval + ratingsInterval;
        addToRet(`${commaNumber(startInterval)} to ${commaNumber(endInterval)} Average Rated`, item);
      }
    });
  });
  return ret;
};

export default function SquadsDatabase() {
  const [data, setData] = useState({});
  const [activeSquad, setActiveSquad] = useState({});
  const [viewType, setViewType] = useState('grid');
  const [groupBy, setGroupBy] = useState('league');
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    setTimeout(() => {
      (async () => {
        const fetchedData = await (await fetch(`${APIBaseURL}/teams/all/by-league/`)).json();
        setData(fetchedData);
      })();
    }, 100);
  }, []);

  const createTeamButton = (team, teamIdx) => {
    return (
      <PlayButton
        className='team-button'
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
              Transfer Budget: ${commaNumber(team.fifaMiscData.transferBudgetDollars)} <br />
              {team.fifaMiscData.rival ? `Rival: ${team.fifaMiscData.rival.name}` : null} <br />
              Rating:{' '}
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
    );
  };

  const searching = searchQuery.trim().length > 0;
  const groupedData = createGroups(data, groupBy);
  return (
    <>
      <div className='squadsdatabase-page fullheight-section page panel'>
        <h1 className='title'>Squads Database</h1>
        <p className='description'>Our database of hundreds of professional first-team squads.</p>
        <div className='list-detail-bar'>
          <div className='left'>
            <div className='input-container'>
              <i className='fas fa-search'></i>
              <input
                type='text'
                placeholder='Search for a league, team name, player, etc.'
                spellCheck={false}
                onInput={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className='right'>
            <div className='select'>
              <p>Group By</p>
              <select onChange={(e) => setGroupBy(e.target.value)}>
                <option value='league'>League</option>
                <option value='transfer-budget'>Transfer Budget</option>
                <option value='rating'>FIFA Rating</option>
              </select>
            </div>
            <div className={`view displayed`}>
              <button onClick={() => setViewType('grid')} className={`grid ${viewType === 'grid' ? 'active' : ''}`}>
                <i className='fas fa-th'></i>
              </button>
              <button onClick={() => setViewType('list')} className={`list ${viewType === 'list' ? 'active' : ''}`}>
                <i className='fas fa-list'></i>
              </button>
            </div>
          </div>
        </div>
        <main className={`main-container ${viewType === 'list' ? 'list-view' : 'grid-view'}`}>
          {Object.keys(groupedData).length > 0 ? (
            <>
              {searching ? (
                <>
                  {(() => {
                    const query = searchQuery.trim().toLowerCase();
                    const matchesQuery = (plaintext) => {
                      plaintext = plaintext.trim().toLowerCase();
                      return plaintext.indexOf(query) > -1;
                    };

                    const ret = [];
                    Object.keys(data).forEach((league) => {
                      if (leaguesWithDuplicates.indexOf(league) > -1) {
                        return;
                      }
                      data[league].forEach((item) => {
                        let isMatch = false;
                        if (matchesQuery(item.name) || matchesQuery(league)) {
                          isMatch = true;
                        }
                        item.formation.forEach((player) => {
                          if (matchesQuery(player.name)) {
                            isMatch = true;
                          }
                        });
                        if (isMatch) {
                          ret.push(item);
                        }
                      });
                    });
                    return ret;
                  })().map((team, teamIdx) => createTeamButton(team, teamIdx))}
                </>
              ) : (
                <>
                  <div className='teams-select'>
                    <div className='teams-select-inner'>
                      {(groupBy === 'transfer-budget'
                        ? Object.keys(groupedData)
                            .slice()
                            .sort((a, b) => {
                              const firstNum = (x) => parseInt(x.split(' ')[0].replace('$', '').replace('M', ''));
                              return firstNum(a) - firstNum(b);
                            })
                            .reverse()
                        : Object.keys(groupedData)
                      ).map((e, i) => {
                        return (
                          <Dropdown
                            key={i}
                            snippetTeams={groupedData[e].slice(0, 4)}
                            header={{ name: e, description: `${groupedData[e].length} Squad${groupedData[e].length !== 1 ? 's' : ''}` }}
                          >
                            {groupedData[e].map((team, teamIdx) => createTeamButton(team, teamIdx))}
                          </Dropdown>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
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
          <p>Please switch to a larger screen or rotate your device.</p>
          <p>Apologies for the inconvenience.</p>
        </div>

        {Object.keys(activeSquad).length > 0 ? (
          <Modal closeModal={() => setActiveSquad({})} className='squad-formation-modal'>
            <h1 className='no-margin-top'>
              <i className='fas fa-sitemap mr'></i>Formation
            </h1>
            <div className='squad-formation-container'>
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
                    alternateTeamImageURL: player.nationality.flagURL.split('/2/').join('/6/'),
                    imageURL: player.photoURL.split('/5/').join('/6/'),
                    x: player.positionCoords.x,
                    y: player.positionCoords.y,
                    nationalityName: player.nationality.name,
                    name: player.shortName,
                    fullName: player.name,
                  };
                })}
              />
            </div>
            <h1>
              <i className='fas fa-info-circle mr'></i>Team Information
            </h1>
            <div style={{ width: 'auto' }}>
              <TeamInformationTable squad={activeSquad} />
            </div>
            <h1>
              <i className='fas fa-th-list mr'></i>Team Sheet
            </h1>
            <div style={{ width: 'auto' }}>
              <TeamSheetTable players={activeSquad.formation} includeRatingPotential={false} />
            </div>
          </Modal>
        ) : null}
      </div>
    </>
  );
}
