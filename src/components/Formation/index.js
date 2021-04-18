import './styles.css';
import React from 'react';

export default function Formation(props) {
  const { showAnswer } = props;
  return (
    <div className='formation formation-component'>
      {props.players.map((player, i) => {
        return <></>;

        // at the moment this entire piece of code is completely screwed up so that needs to be fixed as soon as possible
        // const { isGame, playerURL, x, y } = player;
        // let gameType, alternateTeamImage,
        // if(isGame) {

        // }
        // let gameComponent = <></>;
        // if (gameType === 'alternate-team') {
        //   gameComponent = <img src={alternateTeamURL} alt='' className='flag' />;
        // } else if (gameType === 'initials') {
        //   gameComponent = (
        //     <span>
        //       {player.name
        //         .split(' ')
        //         .map((e) => e[0].toUpperCase())
        //         .join('')}
        //     </span>
        //   );
        // } else if (gameType === 'age') {
        //   gameComponent = <span>{player.age}</span>;
        // } else if (gameType === 'rating-overall') {
        //   gameComponent = <span>{player.fifaRating.overall}</span>;
        // } else if (gameType === 'rating-potential') {
        //   gameComponent = <span>{player.fifaRating.potential}</span>;
        // }
        // return (
        //   <div
        //     className={`player ${showAnswer ? 'show-player' : 'show-flag'}`}
        //     key={`${player.name}---${i}`}
        //     style={{ left: `${x}%`, bottom: `${y}%` }}
        //   >
        //     <div className='game'>{gameComponent}</div>
        //     <div className='answer'>
        //       <img src={playerURL} alt='' className='player' />
        //       <p className='name'>
        //         <span>{player.name}</span>
        //       </p>
        //     </div>
        //   </div>
        // );
      })}
    </div>
  );
}
