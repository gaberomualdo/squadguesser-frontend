/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { APIBaseURL } from '../../lib/config';
import Game from './game';
import { LeagueButton } from '../../components/';
import './index-styles.css';
import { fromBase64, toBase64 } from '../../lib/utils';

const urlLeagueParam = 'league';

const leagueDescriptions = {
  'All Teams': <>Up for a challenge? Guess from 200+ teams.</>,
  'Top 25 Teams': <>Guess from the greatest teams right now.</>,
  'Premier League': <>England's first division, the biggest league.</>,
  'La Liga': <>Spanish league home to Barcelona and Real Madrid.</>,
  Bundesliga: <>Germany's league, with Bayern Munchen and more.</>,
  'Serie A TIM': <>Italian league with famous players like Ronaldo.</>,
  'Ligue 1': <>French league with Neymar, Mbappe, and more.</>,
  Eredivisie: <>Dutch league home to Ajax, PSV, and more.</>,
  'Liga NOS': <>Portugal's league with Benfica and Porto.</>,
  'Süper Lig': <>Turkish league with Galatasaray and more.</>,
  Libertadores: <>South American league.</>,
  'Scottish Prem': <>Scottish league.</>,
  'EFL Championship': <>England's second division.</>,
};

export default function ByNationalityPage(props) {
  const [league, setLeague] = useState('');
  const [leagues, setLeagues] = useState([]);
  const [leagueTeams, setLeagueTeams] = useState([]);

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
          <div className='leagues'>
            {leagues.map((e, i) => {
              return (
                <LeagueButton
                  onClick={() => setLeagueAndParam(e)}
                  key={i}
                  name={e}
                  images={leagueTeams[e].slice(0, 9).map((e) => e.logoURL)}
                  description={leagueDescriptions[e] ? leagueDescriptions[e] : <>Guess from this league.</>}
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
