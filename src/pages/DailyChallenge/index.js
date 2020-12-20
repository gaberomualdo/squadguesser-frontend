/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { APIBaseURL } from '../../lib/config';
import Game from '../ByNationality/game';
import { toBase64 } from '../../lib/utils';

const leagueName = 'Daily Challenge';

export default function DailyChallenge(props) {
  const [loaded, setLoaded] = useState(false);
  const leagueNameCode = toBase64(leagueName);
  useEffect(() => {
    (async () => {
      const correctTeam = await (await fetch(`${APIBaseURL}/dailychallenge/team`)).json();
      const url = new URL(window.location.href);
      url.searchParams.set('game', toBase64(correctTeam.name));
      url.searchParams.set('league', leagueNameCode);
      const urlStr = url.toString();
      history.replaceState({}, 'Navigate to New Page', urlStr);
      setLoaded(true);
    })();
  }, []);

  return loaded ? <Game setPage={props.setPage} league={leagueName} dailyChallenge={true} /> : <div className='fullheight-section'></div>;
}
