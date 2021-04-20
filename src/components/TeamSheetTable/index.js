import './styles.css';
import React from 'react';

export default function TeamSheetTable(props) {
  const { players, className, includeRatingPotential, ...otherProps } = props;
  return (
    <table {...otherProps} className={`team-sheet-table styled-table ${className}`} role='button'>
      <thead>
        <tr>
          <th>#</th>
          <th className='name'>Name</th>
          <th className='nationality'>Nation</th>
          <th>Position</th>
          <th>Rating</th>
          {includeRatingPotential ? <th>Rating (Pot)</th> : null}
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, i) => (
          <tr className='row' key={i}>
            <td>{player.kitNumber}</td>
            <td className='name'>
              <img src={player.photoURL} alt={player.name} /> <span>{player.name}</span>
            </td>
            <td className='nationality'>
              <img src={player.nationality.flagURL} alt={player.nationality.name} /> <span>{player.nationality.name}</span>
            </td>
            <td>{player.positionName}</td>
            <td>{player.fifaRating.overall}</td>
            {includeRatingPotential ? <td>{player.fifaRating.potential}</td> : null}
            <td>{player.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
