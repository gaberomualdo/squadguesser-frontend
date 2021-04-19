import './styles.css';
import React from 'react';
import { TertiaryButton } from '../';

export default function PrimaryButton(props) {
  return (
    <a {...props} className={`leaguebutton horizontal ${props.className}`} role='button'>
      <div className='image'>
        <div className='front logos'>
          {props.images.map((e) => (
            <img src={e} alt={`${props.name} Team Logo`} />
          ))}
        </div>
      </div>
      <div className='bottom'>
        <h1>{props.name}</h1>
        <p>{props.description}</p>
        <div className='badges'>
          <div className='badge'>
            <i class='fas fa-map-marker-alt mr'></i>
            {props.location}
          </div>
          <div className='badge'>
            <i class='fas fa-users mr'></i>
            {props.teamsCount} Squads
          </div>
        </div>
        <TertiaryButton style={{ marginTop: '1rem', boxShadow: 'none' }} text={<>Play This League &rarr;</>} />
      </div>
    </a>
  );
}
