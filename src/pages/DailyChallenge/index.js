/* eslint-disable no-restricted-globals */
import React, { useEffect } from 'react';
import { APIBaseURL } from '../../lib/config';
import Game from '../ByNationality/game';

const leagueName = 'Daily Challenge';

export default function DailyChallenge() {
  const leagueNameCode = btoa(leagueName);
  useEffect(() => {
    (async () => {
      const correctTeam = await (await fetch(`${APIBaseURL}/dailychallenge/team`)).json();
      const url = new URL(window.location.href);
      url.searchParams.set('game', btoa(correctTeam.name));
      url.searchParams.set('league', leagueNameCode);
      const urlStr = url.toString();
      history.replaceState({}, 'Navigate to New Page', urlStr);
    })();
  }, []);

  return (
    <div>
      <Game league={leagueName} noNewGame={true} />
    </div>
  );
}
