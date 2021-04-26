import React, { useState, useEffect } from 'react';
import { Modal, Loading, PrimaryButton } from '../../components';
import './styles.css';
import { processDate } from '../../lib/utils';
import { PieChart, Pie, Cell, AreaChart, LineChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { APIBaseURL, siteTitle } from '../../lib/config';
import getStats from '../../lib/stats';
import axios from 'axios';
import commaNumber from 'comma-number';
import { Helmet } from 'react-helmet';

const formatNumber = (e) => (e === 0 ? 'None' : commaNumber(e));
export default function ProfileModal(props) {
  const { profile, setProfileModal, profileIsSignedIn, outerPageTitle } = props;
  const [leagues, setLeagues] = useState([]);
  useEffect(() => {
    (async () => {
      const data = await (await fetch(`${APIBaseURL}/leagues`)).json();
      setLeagues(data);
    })();
  }, []);
  let ratingHistory = profile.ratingHistory;
  if (ratingHistory) {
    if (ratingHistory.length === 0) {
      ratingHistory = [
        { rating: 1000, date: new Date() },
        { rating: 1000, date: new Date() },
      ];
    } else if (ratingHistory.length === 1) {
      ratingHistory.push({ rating: ratingHistory[0].rating, date: new Date() });
    }
  }

  const allTimeWinLoss =
    Object.keys(profile).length === 0
      ? [{ value: 0 }, { value: 0 }]
      : leagues
          .concat(['dailychallenge'])
          .map((e) => getStats(profile.gamesPlayed, e, 'win-loss'))
          .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
          .map((e) => {
            return {
              value: e,
            };
          });

  return (
    <>
      {profile && profile.user && profile.user.username ? (
        <Helmet>
          <title>
            @{profile.user.username}
            {outerPageTitle ? ` - ${outerPageTitle}` : ''} - {siteTitle}
          </title>
        </Helmet>
      ) : null}
      <Modal className='profile-modal-component' closeModal={() => setProfileModal(false)}>
        {Object.keys(profile).length === 0 ? (
          <div style={{ textAlign: 'center' }}>
            <Loading style={{ display: 'block', margin: '0 auto 1.5rem auto' }} />
            <p style={{ fontWeight: 600, opacity: 0.75, fontSize: '95%' }}>Loading Profile...</p>
          </div>
        ) : (
          <>
            <div className='meta'>
              <h1 className='username'>
                @{profile.user.username}
                {profileIsSignedIn ? <span> (you)</span> : <></>}
              </h1>
              <ul className='descriptions'>
                {/* <li>Rated {profile.rating}</li> */}
                <li>Played {commaNumber(profile.gamesPlayed.length)} Games</li>
                <li>Joined {processDate(new Date(profile.user.date))}</li>
                <li>Ranked #{commaNumber(profile.leaderboardPosition)} on the Leaderboard</li>
              </ul>
            </div>
            <div className='rating-over-time title-section'>
              <h1 className='title'>
                <i className='fas fa-chart-line mr'></i>Rating: {profile.rating}
              </h1>
              <ResponsiveContainer width='93%' height={250}>
                <AreaChart
                  className='chart'
                  data={ratingHistory.map((e) => {
                    return { Rating: e.rating, date: processDate(new Date(e.date), true) };
                  })}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' interval='preserveStartEnd' />
                  <YAxis domain={['dataMin - 50', 'dataMax']} interval='preserveStartEnd' />
                  <Tooltip separator=': ' wrapperClassName='charts-tooltip-wrapper' contentClassName='charts-tooltip-content' />
                  {/* <Legend /> */}
                  <Area type='monotone' dataKey='Rating' stroke='var(--primary)' fill='var(--primary)' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className='games-breakdown title-section'>
              <h1 className='title'>
                <i className='fas fa-chart-pie mr'></i>
                {allTimeWinLoss[0].value} Total Wins and {allTimeWinLoss[1].value} Total Losses
              </h1>
              <ResponsiveContainer width='100%' height={200}>
                <PieChart width={400} height={400}>
                  <Pie
                    data={allTimeWinLoss}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    <Cell fill='var(--primary)' />
                    <Cell fill='var(--danger)' />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='title-section'>
              <h1 className='title'>
                <i className='fas fa-gamepad mr'></i>Recent Games
              </h1>
              <table className='leaderboard styled-table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>League</th>
                    <th>Answer</th>
                    <th>Hints Used</th>
                    <th>Wrong Guesses</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.gamesPlayed.slice(0, 10).map((game, i) => (
                    <tr className='row' key={i}>
                      <td>{i + 1}</td>
                      <td>{game.league}</td>
                      <td>{game.correctAnswer}</td>
                      <td>{formatNumber(game.hintsUsed)}</td>
                      <td>{formatNumber(game.wrongGuesses)}</td>
                      <td className={game.won ? 'won' : 'lost'}>{game.won ? 'Won' : 'Lost'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='title-section'>
              <h1 className='title'>
                <i className='fas fa-calculator mr'></i>Stats
              </h1>
              <table className='leaderboard styled-table'>
                <thead>
                  <tr>
                    <th>League</th>
                    <th>Win/Loss</th>
                    <th>Current Streak</th>
                    <th>Best Streak</th>
                  </tr>
                </thead>
                <tbody>
                  {leagues.concat(['dailychallenge']).map((league, i) => (
                    <tr className='row' key={i}>
                      {[
                        league === 'dailychallenge' ? 'Daily Challenge' : league,
                        (() => {
                          const wl = getStats(profile.gamesPlayed, league, 'win-loss');
                          return (
                            <>
                              {commaNumber(wl[0])} / {commaNumber(wl[1])}
                            </>
                          );
                        })(),
                        <>{commaNumber(getStats(profile.gamesPlayed, league, 'streak'))} Games</>,
                        <>{commaNumber(getStats(profile.gamesPlayed, league, 'longest-streak'))} Games</>,
                      ].map((e, i) => (
                        <td key={i}>{e}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {profileIsSignedIn ? (
              <div className='title-section settings'>
                <h1 className='title'>Settings</h1>
                {/*const token = localStorage.getItem('authtoken');*/}
                <PrimaryButton
                  className='secondary delete-btn'
                  color='var(--danger)'
                  text='Delete Your Account'
                  onClick={() => {
                    setTimeout(() => {
                      let enteredUsername = '';
                      while (`@${profile.user.username}` !== enteredUsername) {
                        enteredUsername = prompt(`Want to delete your account? Type your username (@${profile.user.username}) to confirm.`);
                        if (enteredUsername === null) {
                          return;
                        }
                      }
                      // delete the account
                      const token = localStorage.getItem('authtoken');

                      axios({
                        method: 'delete',
                        baseURL: APIBaseURL,
                        url: `/api/users/me/`,
                        headers: {
                          'x-auth-token': token,
                        },
                      })
                        .catch((err) => {
                          try {
                            alert(err.response.data.errors[0].msg);
                          } catch (err) {
                            alert('Error: Internal or Server Error Occurred');
                          }
                        })
                        .then(() => {
                          alert('Your Account Has Been Deleted.');
                          window.location.reload();
                        });
                    }, 100);
                  }}
                />
              </div>
            ) : null}
          </>
        )}
      </Modal>
    </>
  );
}
