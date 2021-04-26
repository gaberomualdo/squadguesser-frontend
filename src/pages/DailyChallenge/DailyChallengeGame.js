import gameTypes from '../../lib/gameTypes';
import Game from '../Play/game';
import React, { useEffect, useState } from 'react';
import { FullHeightLoading } from '../../components';
import { APIBaseURL } from '../../lib/config';

export default function DailyChallengeGame(props) {
  const [loaded, setLoaded] = useState(false);
  const [correctTeamName, setCorrectTeamName] = useState('');
  const [correctTeamFormationTypes, setCorrectTeamFormationTypes] = useState([]);
  const leagueName = 'Daily Challenge';

  useEffect(() => {
    (async () => {
      if (loaded) {
        return;
      }
      const correctTeam = await (await fetch(`${APIBaseURL}/dailychallenge/${props.date}/team`)).json();
      const correctTeamFormationTypes = (await (await fetch(`${APIBaseURL}/dailychallenge/${props.date}/formationtypes`)).json()).map(
        (e) => gameTypes[e]
      );
      setCorrectTeamName(correctTeam.name);
      setCorrectTeamFormationTypes(correctTeamFormationTypes);
      setLoaded(true);
    })();
  }, []);

  return loaded ? (
    <Game
      correctTeamName={correctTeamName}
      formationTypes={correctTeamFormationTypes}
      league={leagueName}
      dailyChallenge={true}
      dailyChallengeDate={props.dateObj}
      reloadUser={props.reloadUser}
      user={props.user}
      loggedIn={props.loggedIn}
      setAuthModal={props.setAuthModal}
      setProfileModal={props.setProfileModal}
    />
  ) : (
    <FullHeightLoading />
  );
}
