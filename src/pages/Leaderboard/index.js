import './styles.css';
import React, { useEffect, useState } from 'react';
import { APIBaseURL } from '../../lib/config';
import { processDate, processRankNumber } from '../../lib/utils';
import { ProfileModal, Loading } from '../../components/';

export default function Leaderboard(props) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [profileUser, setProfileUser] = useState({});
  useEffect(() => {
    setTimeout(() => {
      (async () => {
        const fetchedData = await (await fetch(`${APIBaseURL}/api/profiles/top/100/`)).json();
        setData(fetchedData);
        setLoaded(true);
      })();
    }, 100);
  }, []);
  return (
    <>
      <div className='leaderboard-page page panel'>
        <h1 className='title'>SquadGuessr Leaderboard</h1>
        <p className='description'>check out the top players, ranked by rating</p>
        <table className='leaderboard styled-table'>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Rating</th>
              <th>Games Played</th>
              <th>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e, i) => (
              <tr
                className='row'
                key={i}
                onClick={() => {
                  setProfileModal(true);
                  (async () => {
                    const fetchedData = await (await fetch(`${APIBaseURL}/api/profiles/user/${e.user._id}/`)).json();
                    setProfileUser({ ...fetchedData, leaderboardPosition: i + 1 });
                  })();
                }}
              >
                <td className='number'>
                  {i < 3 ? (
                    <svg className={`trophy_${i + 1}`} xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                      <path d='M24 3c-.372 4.105-2.808 8.091-6.873 9.438.297-.552.596-1.145.882-1.783 2.915-1.521 4.037-4.25 4.464-6.251h-2.688c.059-.45.103-.922.139-1.405h4.076zm-24 0c.372 4.105 2.808 8.091 6.873 9.438-.297-.552-.596-1.145-.882-1.783-2.915-1.521-4.037-4.25-4.464-6.251h2.688c-.058-.449-.102-.922-.138-1.404h-4.077zm19-2c0 9.803-5.094 13.053-5.592 17h-2.805c-.498-3.947-5.603-7.197-5.603-17h14zm-7.305 13.053c-1.886-3.26-2.635-7.432-2.646-11.053h-1.699c.205 4.648 1.99 8.333 4.345 11.053zm1.743 4.947h-2.866c-.202 1.187-.63 2.619-2.571 2.619v1.381h8v-1.381c-1.999 0-2.371-1.432-2.563-2.619z' />
                    </svg>
                  ) : null}
                  {processRankNumber(i + 1)}
                </td>
                <td className='username'>
                  @{e.user.username} {props.user.user && props.user.user._id === e.user._id ? '(you)' : ''}
                </td>
                <td className='rating'>{e.rating}</td>
                <td className='gamesplayed'>{e.gamesPlayedCount}</td>
                <td className='date'>{processDate(new Date(e.user.date))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loaded ? null : (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Loading style={{ display: 'inline-block' }} />
          </div>
        )}
      </div>
      {profileModal ? (
        <ProfileModal
          profileIsSignedIn={false}
          setProfileModal={(v) => {
            setProfileModal(v);
            if (v === false) {
              setProfileUser({});
            }
          }}
          profile={profileUser}
          {...(props.loggedIn && profileUser.user
            ? props.user.user && props.user.user._id === profileUser.user._id
              ? { profileIsSignedIn: true }
              : ''
            : {})}
        />
      ) : null}
    </>
  );
}
