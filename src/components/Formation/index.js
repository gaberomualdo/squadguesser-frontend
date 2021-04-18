import './styles.css';
import React from 'react';

export default function Formation(props) {
  const { showAnswer, isGame } = props;
  return (
    <div className='formation formation-component'>
      {props.players.map((player, i) => {
        const { imageURL, x, y } = player;
        let gameType, alternateTeamImageURL;
        if (isGame) {
          ({ gameType, alternateTeamImageURL } = player);
        }
        let gameComponent = <></>;
        if (gameType === 'alternate-team') {
          gameComponent = <div className='image' style={{ '--image': `url(${alternateTeamImageURL})` }}></div>;
        } else if (gameType === 'initials') {
          gameComponent = (
            <h3>
              <strong>Player Initials</strong>
              <span>
                {player.fullName
                  .split(' ')
                  .map((e) => e[0].toUpperCase())
                  .join('')}
              </span>
            </h3>
          );
        } else if (gameType === 'age') {
          gameComponent = (
            <h3>
              <strong>Age</strong>
              <span>{player.age}</span>
            </h3>
          );
        } else if (gameType === 'rating-overall') {
          gameComponent = (
            <h3>
              <strong>FIFA Rating</strong>
              <span>{player.fifaRating.overall}</span>
            </h3>
          );
        } else if (gameType === 'rating-potential') {
          gameComponent = (
            <h3>
              <strong>FIFA Rating Potential</strong>
              <span>{player.fifaRating.potential}</span>
            </h3>
          );
        }
        return (
          <div
            className={`player ${showAnswer ? 'show-answer' : 'show-game'}`}
            key={`${player.name}---${i}`}
            style={{ left: `${x}%`, bottom: `${y}%` }}
          >
            <div className='game'>{gameComponent}</div>
            <div className='answer'>
              <img src={imageURL} alt={player.name} className='player' />
              <p className='name'>
                <span>{player.name}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
