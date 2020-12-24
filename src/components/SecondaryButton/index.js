import './styles.css';
import React from 'react';

export default function SecondaryButton(props) {
  return (
    <a
      {...props}
      className={`secondarybutton ${props.className}`}
      style={{ '--button-theme-color': props.color ? props.color : 'var(--primary)' }}
      role='button'
    >
      <span>{props.text}</span>
    </a>
  );
}
