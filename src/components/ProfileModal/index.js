import React from 'react';
import { Modal, Loading } from '../../components';
import './styles.css';
import { processDate } from '../../lib/utils';

export default function ProfileModal(props) {
  const { profile, setProfileModal, profileIsSignedIn } = props;
  return (
    <Modal className='profile-modal-component' closeModal={() => setProfileModal(false)}>
      {Object.keys(profile).length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <Loading style={{ display: 'block', margin: '0 auto 1.5rem auto' }} />
          <p style={{ fontWeight: 600, opacity: 0.75, fontSize: '95%' }}>Loading Profile...</p>
        </div>
      ) : (
        <div className='meta'>
          <h1 className='username'>
            @{profile.user.username}
            {profileIsSignedIn ? <span> (you)</span> : <></>}
          </h1>
          <ul className='descriptions'>
            <li>Rated {profile.rating}</li>
            <li>Played {profile.gamesPlayed.length} Games</li>
            <li>Joined {processDate(new Date(profile.user.date))}</li>
          </ul>
        </div>
      )}
    </Modal>
  );
}
