import React, { useEffect, useState } from 'react';
import { Loading, ProfileModal } from '../../components/';
import { APIBaseURL } from '../../lib/config';
import { processDate, processRankNumber } from '../../lib/utils';
import './styles.css';

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
        <h1 className='title'>Leaderboard</h1>
        <p className='description'>The top players, ranked by rating.</p>
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
                  {i < 3 ? <i className={`fas fa-trophy trophy_${i + 1}`}></i> : null}
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
          outerPageTitle='Leaderboard'
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
