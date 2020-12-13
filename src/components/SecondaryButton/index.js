import './styles.css';
import React from 'react';

export default function SecondaryButton(props) {
  return (
    <button
      {...props}
      className={`secondarybutton ${props.className}`}
      style={{ '--button-theme-color': props.color ? props.color : 'var(--primary)' }}
    >
      <span>{props.text}</span>
    </button>
  );
}
