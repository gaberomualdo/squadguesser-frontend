import React, { useState } from 'react';
import { PlayModal, TertiaryButton } from '../';
import './styles.css';

export default function LeagueButton(props) {
  const [playModalOpen, setPlayModalOpen] = useState(false);
  const { className, horizontal, darkBackground, images, name, description, location, teamsCount, onPlayLeague, ...otherProps } = props;
  return (
    <div className='leaguebutton-outer'>
      <button
        {...otherProps}
        className={`leaguebutton ${darkBackground ? 'dark-bg' : ''} ${horizontal ? 'horizontal' : null} ${className}`}
        onClick={() => setPlayModalOpen(true)}
      >
        <div className='image'>
          <div className='front logos'>
            {images.map((e, i) => (
              <img key={i} src={e} alt={`${name} Team Logo`} />
            ))}
          </div>
        </div>
        <div className='bottom'>
          <h1>{name}</h1>
          <p>{description}</p>
          <div className='badges'>
            <div className='badge'>
              <i className='fas fa-map-marker-alt mr'></i>
              {location}
            </div>
            <div className='badge'>
              <i className='fas fa-users mr'></i>
              {teamsCount} Squads
            </div>
          </div>
          <TertiaryButton isNotButton style={{ marginTop: '1rem', boxShadow: 'none' }} text={<>Play This League &rarr;</>} />
        </div>
      </button>
      {playModalOpen ? (
        <PlayModal
          leagueName={name}
          closeModal={() => setPlayModalOpen(false)}
          onPlayLeague={(gameMode) => {
            setPlayModalOpen(false);
            onPlayLeague(gameMode, name);
          }}
        />
      ) : null}
    </div>
  );
}
