import React from 'react';
import './styles.css';

export default function PlayBtn(props) {
  const { icon, name, description, isNotButton, className, ...otherProps } = props;
  const inner = (
    <>
      {icon ? (
        <div className='icon'>
          <span>{icon}</span>
        </div>
      ) : null}
      <div className='content'>
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
      <div className='arrow'>&rarr;</div>
    </>
  );
  if (isNotButton) {
    return (
      <div {...otherProps} className={`playbutton ${className}`}>
        {inner}
      </div>
    );
  } else {
    return (
      <button {...otherProps} className={`playbutton ${className}`}>
        {inner}
      </button>
    );
  }
}
