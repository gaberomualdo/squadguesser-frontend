import React, { useState } from 'react';
import { Modal } from '..';
import { siteTitle } from '../../lib/config';
import './styles.css';
import { Helmet } from 'react-helmet';

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
    Easy: { color: 'var(--primary)', description: 'Guess by nationalities.', gameMode: [true, false, false, false, false, false, false, false] },
    Medium: {
      color: 'var(--info)',
      description: 'Guess by nationalities, initials, and overall rating.',
      gameMode: [true, true, false, true, false, false, false, false],
    },
    Hard: {
      color: 'var(--danger)',
      description: 'Guess by initials, ratings, and age.',
      gameMode: [false, true, true, true, true, false, false, false],
    },
  };
  const difficultyNames = Object.keys(difficulties);
  const [checked, setChecked] = useState(difficultyNames[0]);
  return (
    <>
      <Helmet>
        <title>
          Play {props.leagueName} - {siteTitle}
        </title>
      </Helmet>
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
        <button
          className='play-button'
          onClick={() => {
            props.onPlayLeague(difficulties[checked].gameMode);
          }}
        >
          <div className='icon'>
            <i className='fas fa-play'></i>
          </div>
          <div className='text'>
            <h1>Play Now &rarr;</h1>
            <p>{difficulties[checked].description}</p>
          </div>
        </button>
      </Modal>
    </>
  );
}
