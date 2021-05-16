import './styles.css';
import React, { useEffect, useState } from 'react';

export default function FixedAlert(props) {
  const [displayed, setDisplayed] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setDisplayed(false);
    }, props.disappearsMS || 1750);
  }, [props.disappearsMS]);
  return (
    <div
      style={displayed ? {} : { display: 'none' }}
      className={`fixed-alert-component ${props.type === 'danger' ? 'danger' : ''} ${props.type === 'success' ? 'success' : ''}`}
    >
      <span className='icon'>
        {props.type === 'danger' ? <i className='fas fa-exclamation-triangle'></i> : null}
        {props.type === 'success' ? <i className='fas fa-check-circle'></i> : null}
      </span>
      <span className='text'>{props.text}</span>
    </div>
  );
}
