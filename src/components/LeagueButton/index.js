import './styles.css';
import React from 'react';
import { TertiaryButton } from '../';

export default function LeagueButton(props) {
  const { className, horizontal, darkBackground, images, name, description, location, teamsCount, ...otherProps } = props;
  return (
    <a {...otherProps} className={`leaguebutton ${darkBackground ? 'dark-bg' : ''} ${horizontal ? 'horizontal' : null} ${className}`} role='button'>
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
        <TertiaryButton style={{ marginTop: '1rem', boxShadow: 'none' }} text={<>Play This League &rarr;</>} />
      </div>
    </a>
  );
}
