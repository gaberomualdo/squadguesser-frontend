import './styles.css';
import { Modal } from '..';
import React, { useState } from 'react';

function CheckBox(props) {
  const { text, className, checked, ...otherProps } = props;
  return (
    <button className={`checkbox ${checked ? 'checked' : ''} ${className}`} {...otherProps}>
      <i className='fas fa-check'></i>
      <span>{text}</span>
    </button>
  );
}

export default function PlayModal(props) {
  const difficulties = {
    Easy: { color: 'var(--primary)', description: 'Guess by nationalities.' },
    Normal: { color: 'var(--info)', description: 'Guess by nationalities and initials.' },
    Hard: { color: 'var(--danger)', description: 'Guess by nationalities, initials, ratings, and age.' },
  };
  const difficultyNames = Object.keys(difficulties);
  const [checked, setChecked] = useState(difficultyNames[0]);
  return (
    <Modal className='play-modal-component' closeModal={() => props.closeModal()}>
      <div className='meta'>
        <h1>Play</h1>
        <p>League: {props.leagueName}.</p>
      </div>
      <div className='difficulty'>
        <h1>Difficulty:</h1>
        <div className='list'>
          {difficultyNames.map((e, i) => (
            <CheckBox
              key={i}
              style={{
                '--theme': difficulties[e].color,
              }}
              text={e}
              checked={checked === e}
              onClick={() => setChecked(e)}
            />
          ))}
        </div>
      </div>
      <button className='play-button'>
        <div className='icon'>
          <i className='fas fa-play'></i>
        </div>
        <div className='text'>
          <h1>Play</h1>
          <p>{difficulties[checked].description}</p>
        </div>
      </button>
    </Modal>
  );
}
