import './styles.css';
import React from 'react';
import commaNumber from 'comma-number';

export default function TeamSheetTable(props) {
  const { squad, className, ...otherProps } = props;
  return (
    <table {...otherProps} className={`styled-table team-information-table ${className}`}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Transfer Budget</th>
          <th>FIFA Ratings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{squad.name}</td>
          <td>${commaNumber(squad.fifaMiscData.transferBudgetDollars)}</td>
          <td>
            {Object.keys(squad.fifaMiscData.ratings)
              .map((e) => {
                return `${squad.fifaMiscData.ratings[e]} ${e.slice(0, 3).toUpperCase()}`;
              })
              .join(' • ')}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
