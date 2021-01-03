import React from 'react';
import { Modal } from '../../components';
import './styles.css';

const processDate = (d) => `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

export default function ProfileModal(props) {
  const { profile, setProfileModal, profileIsSignedIn } = props;
  return (
    <Modal className='profile-modal-component' closeModal={() => setProfileModal(false)}>
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
    </Modal>
  );
}
