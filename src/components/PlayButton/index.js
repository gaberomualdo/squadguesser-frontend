import React from 'react';
import './styles.css';

export default function PlayBtn(props) {
  return (
    <a {...props} className={`playbutton ${props.className}`} role='button'>
      {props.icon ? (
        <div className='icon'>
          <span>{props.icon}</span>
        </div>
      ) : null}
      <div className='content'>
        <h1>{props.name}</h1>
        <p>{props.description}</p>
      </div>
      <div className='arrow'>&rarr;</div>
    </a>
  );
}
