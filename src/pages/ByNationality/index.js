/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { APIBaseURL } from '../../lib/config';
import Game from './game';
import { PlayButton } from '../../components/';
import './index-styles.css';
import { fromBase64, toBase64 } from '../../lib/utils';

const urlLeagueParam = 'league';

const leagueDescriptions = {
  'All Teams': <>Up for a challenge? Guess from 200+ teams &rarr;</>,
  'Top 25 Teams': <>Guess from the greatest teams right now &rarr;</>,
  'Premier League': <>England's first division, the biggest league &rarr;</>,
  'La Liga': <>Spanish league home to Barcelona and Real Madrid &rarr;</>,
  Bundesliga: <>Germany's league, with Bayern Munchen and more &rarr;</>,
  'Serie A TIM': <>Italian league with famous players like Ronaldo &rarr;</>,
  'Ligue 1': <>French league with Neymar, Mbappe, and more &rarr;</>,
  Eredivisie: <>Dutch league home to Ajax, PSV, and more &rarr;</>,
  'Liga NOS': <>Portugal's league with Benfica and Porto &rarr;</>,
  'Süper Lig': <>Turkish league with Galatasaray and more &rarr;</>,
  Libertadores: <>South American league &rarr;</>,
  'Scottish Prem': <>Scottish league &rarr;</>,
  'EFL Championship': <>England's second division &rarr;</>,
};

export default function ByNationalityPage(props) {
  const [league, setLeague] = useState('');
  const [leagues, setLeagues] = useState([]);

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
      const data = await (await fetch(`${APIBaseURL}/leagues`)).json();
      updateLeagueFromURLParam(data);
      setLeagues(data);
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
          <h1 className='title'>Choose a League:</h1>
          {leagues.map((e, i) => {
            return (
              <PlayButton
                onClick={() => setLeagueAndParam(e)}
                key={i}
                name={e}
                description={leagueDescriptions[e] ? leagueDescriptions[e] : <>play this league &rarr;</>}
              />
            );
          })}
        </div>
      </div>
    )
  ) : (
    <div className='fullheight-section'></div>
  );
}
