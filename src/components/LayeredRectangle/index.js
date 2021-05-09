import './styles.css';
import React from 'react';

export default function LayeredRectangle(props) {
  return (
    <div className={`layered-rectangle-outer ${props.color ? 'with-theme' : ''}`} style={props.color ? { '--theme': props.color } : {}}>
      <div className='layered-rectangle-inner'>{props.children}</div>
    </div>
  );
}
