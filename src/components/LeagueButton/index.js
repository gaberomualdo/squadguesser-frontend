import './styles.css';
import React from 'react';

export default function PrimaryButton(props) {
  return (
    <a {...props} className={`leaguebutton ${props.className}`} role='button'>
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
      </div>
    </a>
  );
}
