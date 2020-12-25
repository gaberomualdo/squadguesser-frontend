import './styles.css';
import React from 'react';

export default function Formation(props) {
  return (
    <div className='formation formation-component'>
      {props.players.map((player, i) => {
        const { flagURL, playerURL } = player;
        const { showAnswer } = props;
        let { x, y } = player;
        return (
          <div className={`player ${showAnswer ? 'show-player' : 'show-flag'}`} key={i} style={{ left: `${x}%`, bottom: `${y}%` }}>
            <img src={flagURL} alt='' className='flag' />
            <img src={playerURL} alt='' className='player' />
            <p className='name'>
              <span>{showAnswer ? player.name : player.nationalityName}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}