/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { APIBaseURL } from '../../lib/config';
import leagueInfo from '../../lib/leagueInfo';
import Game from './game';
import { LeagueButton } from '../../components/';
import './index-styles.css';
import { fromBase64, toBase64 } from '../../lib/utils';

const reversed = (arr) => {
  return arr.slice().reverse();
};

const urlLeagueParam = 'league';

export default function ByNationalityPage(props) {
  const [league, setLeague] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('best-to-worst');

  const updateLeagueFromURLParam = (leaguesArr) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(urlLeagueParam)) {
      const param = urlParams.get(urlLeagueParam);
      try {
        const decodedParam = fromBase64(param);
        if (leaguesArr.indexOf(decodedParam) > -1 && league !== decodedParam) {
          setLeague(decodedParam);
        }
      } catch (err) {}
    } else if (league !== '') {
      setLeague('');
    }
  };

  if (leagues) {
    updateLeagueFromURLParam(leagues);
  }

  useEffect(() => {
    (async () => {
      const data = await (await fetch(`${APIBaseURL}/teams/all/by-league/onlynamesandlogos`)).json();
      updateLeagueFromURLParam(Object.keys(data));
      setLeagueTeams(data);
      setLeagues(Object.keys(data));
    })();
  }, []);

  const setLeagueAndParam = (leagueName) => {
    const leagueNameCode = toBase64(leagueName);
    const url = new URL(window.location.href);
    url.searchParams.delete('game');
    url.searchParams.set(urlLeagueParam, leagueNameCode);
    const urlStr = url.toString();
    window.open(urlStr, '_self');
  };

  const allowHorizontalList = window.innerWidth > 775; // 775px width is minimum for horizontal list

  return leagues.length > 0 ? (
    league ? (
      <Game
        setAuthModal={props.setAuthModal}
        setProfileModal={props.setProfileModal}
        league={league}
        setPage={props.setPage}
        reloadUser={props.reloadUser}
        user={props.user}
        loggedIn={props.loggedIn}
      />
    ) : (
      <div className='bynationalitypage-selectleague fullheight-section'>
        <div className='inner'>
          <div className='meta'>
            <h1 className='title'>Play</h1>
            <p className='description'>Choose a league to guess teams from.</p>
          </div>
          <div className='detail'>
            <div className='left'>
              <h1>
                <i className='fas fa-futbol mr'></i>Leagues
              </h1>
            </div>
            <div className='right'>
              <div className='sort'>
                <p>Sort By</p>
                <select onChange={(e) => setSortBy(e.target.value)}>
                  <option value='best-to-worst'>Best To Worst</option>
                  <option value='worst-to-best'>Worst To Best</option>
                </select>
              </div>
              <div className={`view ${allowHorizontalList ? 'displayed' : ''}`}>
                <button onClick={() => setViewType('grid')} className={`grid ${viewType === 'grid' ? 'active' : ''}`}>
                  <i className='fas fa-th'></i>
                </button>
                <button onClick={() => setViewType('list')} className={`list ${viewType === 'list' ? 'active' : ''}`}>
                  <i className='fas fa-list'></i>
                </button>
              </div>
            </div>
          </div>
          <div className={`leagues ${viewType === 'list' ? 'list-view' : ''}`}>
            {(sortBy === 'worst-to-best' ? reversed(leagues) : leagues).map((e, i) => {
              const isHorizontal = allowHorizontalList && viewType === 'list';
              let images = leagueTeams[e].slice(0, 6).map((e) => e.logoURL);
              if (i % 2 === 0) {
                images = reversed(images);
              }
              return (
                <LeagueButton
                  onClick={() => setLeagueAndParam(e)}
                  key={i}
                  name={e}
                  images={images}
                  description={leagueInfo.descriptions[e] ? leagueInfo.descriptions[e] : <>Guess from this league.</>}
                  location={leagueInfo.locations[e] ? leagueInfo.locations[e] : 'Worldwide'}
                  teamsCount={leagueTeams[e].length}
                  horizontal={isHorizontal}
                />
              );
            })}
          </div>
        </div>
      </div>
    )
  ) : (
    <div className='fullheight-section'></div>
  );
}
