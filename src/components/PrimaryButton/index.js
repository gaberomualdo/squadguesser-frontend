import './styles.css';
import React from 'react';

export default function PrimaryButton(props) {
  return (
    <button
      {...props}
      className={`primarybutton ${props.className}`}
      style={{ '--button-theme-color': props.color ? props.color : 'var(--primary)' }}
    >
      {props.icon ? (
        <>
          <span className='icon'>{props.icon}</span>
          &nbsp;&nbsp;
        </>
      ) : null}
      <span className='text'>{props.text}</span>
    </button>
  );
}
