import './styles.css';
import React from 'react';
import commaNumber from 'comma-number';
import { halfStar, fullStar, emptyStar } from '../../lib/starIcons';

export default function PitchTop(props) {
  return (
    <div className={`pitch-top-component ${props.showAnswer ? 'show-answer' : 'hide-answer'}`}>
      <div className='header'>
        <div className='box'>
          <h1>Guess That Team!</h1>
          <p className='instructions'>
            Each flag and its position represents a player<span className='no-display-mobile'> in a team</span>.
          </p>
          {props.showLeague ? <p style={{ marginTop: '.2rem' }}>Team league: {props.league}</p> : null}
        </div>
      </div>
      <div className='left'>
        <div className='logo-container'>
          {props.showTeamName ? (
            <div className='logo box'>
              {props.showTeamLogo ? <img src={props.teamLogoURL} alt='Team Logo' /> : null}
              <h1>{props.teamName}</h1>
            </div>
          ) : null}
          <div className='row'>
            <div className='stars'>
              {props.showStars
                ? Array(Math.floor(props.stars))
                    .fill(fullStar)
                    .concat(Array((props.stars % 1) / 0.5).fill(halfStar))
                    .concat(Array(5 - Math.ceil(props.stars)).fill(emptyStar))
                    .map((e, i) => <span key={i}>{e}</span>)
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className='right'>
        <div className='info box'>
          {props.showTransferBudget ? (
            <p className='budget'>
              Transfer Budget: <strong>${commaNumber(props.transferBudgetDollars)}</strong>
            </p>
          ) : null}
          {props.showRatings ? (
            <p className='rating'>
              Rating:&nbsp;
              <strong>
                {Object.keys(props.ratings)
                  .map((e) => {
                    return `${props.ratings[e]} ${e.slice(0, 3).toUpperCase()}`;
                  })
                  .join(' • ')}
              </strong>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
