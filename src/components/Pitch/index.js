import './styles.css';
import { siteTitle } from '../../lib/config';
import React from 'react';

export default function Pitch() {
  return (
    <div className='pitch-component'>
      {[...Array(21)].map((x, i) => (
        <div key={i} style={{ top: `${(100 / 21) * i}%`, height: `${100 / 21}%` }} className={`line ${i % 2 === 0 ? 'even' : 'odd'}`}></div>
      ))}
      <div className='midline'></div>
      <div className='center circle dot'></div>
      <div className='center circle'></div>
      <div className='box small gk top'></div>
      <div className='box small gk bottom'></div>
      <div className='box large gk top'></div>
      <div className='box large gk bottom'></div>
      <div className='circle dot gk top'></div>
      <div className='circle dot gk bottom'></div>
      <div className='overlay'></div>
      <p className='site-title'>
        <i className='far fa-futbol' style={{ position: 'relative' }}></i>&nbsp; {siteTitle}
      </p>
    </div>
  );
}
