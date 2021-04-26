/* eslint-disable no-restricted-globals */
import assert from 'assert';
import React, { useEffect, useState } from 'react';
import { matchPath } from 'react-router';
import { BrowserRouter as Switch, Route, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FullHeightLoading, LeagueButton, ResponsiveContainer } from '../../components/';
import { APIBaseURL, siteTitle } from '../../lib/config';
import { decodeGameCode } from '../../lib/gameCode';
import gameTypes from '../../lib/gameTypes';
import leagueInfo from '../../lib/leagueInfo';
import getNewGamePath from '../../lib/getNewGamePath';
import Game from './game';
import './index-styles.css';

const reversed = (arr) => {
  return arr.slice().reverse();
};

function PlayPage(props) {
  const [currentGameCode, setCurrentGameCode] = useState('');
  const [league, setLeague] = useState('');
  const [correctTeamName, setCorrectTeamName] = useState('');
  const [gameMode, setGameMode] = useState([]);
  const [formationTypes, setFormationTypes] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [leagueTeams, setLeagueTeams] = useState({});
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('best-to-worst');

  useEffect(() => {
    (async () => {
      const data = await (await fetch(`${APIBaseURL}/teams/all/by-league/onlynamesandlogos`)).json();
      setLeagueTeams(data);
      setLeagues(Object.keys(data));
    })();
  }, []);

  const allowHorizontalList = window.innerWidth > 775; // 775px width is minimum for horizontal list

  const history = useHistory();
  const openNewGame = (passedGameMode = gameMode, passedLeague = league, hardRefresh = false) => {
    history.push(getNewGamePath(leagues, leagueTeams, passedGameMode, passedLeague));
    if (hardRefresh) {
      window.location.reload();
    } else {
      refreshGameWithCode();
    }
  };

  const refreshGameWithCode = () => {
    const match = matchPath(window.location.pathname, {
      path: '/play/:gameCode',
      exact: true,
    });
    if (match) {
      try {
        const { gameCode } = match.params;

        const decodedGameCode = decodeGameCode(gameCode);
        assert(decodedGameCode.leagueNumber < leagues.length);

        const leagueName = leagues[decodedGameCode.leagueNumber];
        assert(decodedGameCode.game < leagueTeams[leagueName].length);

        const teamName = leagueTeams[leagueName][decodedGameCode.game].name;

        setLeague(leagueName);
        setCorrectTeamName(teamName);
        setGameMode(decodedGameCode.gameMode);
        setFormationTypes(decodedGameCode.formation.map((e) => gameTypes[e]));
        setCurrentGameCode(gameCode);
      } catch (err) {
        window.location.assign('/play');
      }
    }
  };
  if (leagues.length > 0 && !currentGameCode) {
    refreshGameWithCode();
  }

  return leagues.length > 0 ? (
    <Switch>
      {currentGameCode ? (
        <>
          <Helmet>
            <title>
              Game - Play {league} - {siteTitle}
            </title>
          </Helmet>
          <Game
            key={correctTeamName}
            correctTeamName={correctTeamName}
            formationTypes={formationTypes}
            league={league}
            openNewGame={openNewGame}
            setAuthModal={props.setAuthModal}
            setProfileModal={props.setProfileModal}
            reloadUser={props.reloadUser}
            user={props.user}
            loggedIn={props.loggedIn}
          />
        </>
      ) : null}
      <Route exact path='/play'>
        <ResponsiveContainer>
          <div className='bynationalitypage-selectleague fullheight-section'>
            <div className='inner'>
              <div className='meta'>
                <h1 className='title'>Play</h1>
                <p className='description'>Choose a league to guess teams from.</p>
              </div>
              <div className='list-detail-bar'>
                <div className='left'>
                  <h1>
                    <i className='fas fa-futbol mr'></i>Leagues
                  </h1>
                </div>
                <div className='right'>
                  <div className='select'>
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
                      onPlayLeague={(chosenGameMode, chosenLeague) => openNewGame(chosenGameMode, chosenLeague, true)}
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
        </ResponsiveContainer>
      </Route>
    </Switch>
  ) : (
    <ResponsiveContainer>
      <FullHeightLoading />
    </ResponsiveContainer>
  );
}

export default PlayPage;
