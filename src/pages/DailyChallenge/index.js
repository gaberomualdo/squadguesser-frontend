/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { FullHeightLoading } from '../../components/';
import { APIBaseURL } from '../../lib/config';
import Game from '../Play/game';
import gameTypes from '../../lib/gameTypes';

export default function DailyChallenge(props) {
  const [loaded, setLoaded] = useState(false);
  const [correctTeamName, setCorrectTeamName] = useState('');
  const [correctTeamFormationTypes, setCorrectTeamFormationTypes] = useState([]);
  const leagueName = 'Daily Challenge';

  useEffect(() => {
    (async () => {
      const correctTeam = await (await fetch(`${APIBaseURL}/dailychallenge/team`)).json();
      const correctTeamFormationTypes = (await (await fetch(`${APIBaseURL}/dailychallenge/formationtypes`)).json()).map((e) => gameTypes[e]);
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
