/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import { APIBaseURL } from '../../lib/config';
import Game from './game';
import { PlayButton } from '../../components/';
import './index-styles.css';

const urlLeagueParam = 'league';

export default function ByNationalityPage(props) {
  const [league, setLeague] = useState('');
  const [leagues, setLeagues] = useState([]);

  const updateLeagueFromURLParam = (leaguesArr) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(urlLeagueParam)) {
      const param = urlParams.get(urlLeagueParam);
      try {
        const decodedParam = atob(param);
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
    const leagueNameCode = btoa(leagueName).replace(/=/g, '');
    const url = new URL(window.location.href);
    url.searchParams.delete('game');
    url.searchParams.set(urlLeagueParam, leagueNameCode);
    const urlStr = url.toString();
    window.open(urlStr, '_self');
  };

  return leagues.length > 0 ? (
    league ? (
      <Game league={league} />
    ) : (
      <div className='bynationalitypage-selectleague fullheight-section'>
        <div className='inner'>
          <h1 className='title'>Choose a League:</h1>
          {leagues.map((e, i) => {
            return <PlayButton onClick={() => setLeagueAndParam(e)} key={i} name={e} description={<>play this league &rarr;</>} />;
          })}
        </div>
      </div>
    )
  ) : (
    <></>
  );
}
