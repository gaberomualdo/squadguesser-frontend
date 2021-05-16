import './styles.css';
import React, { useState } from 'react';
import topRightBoxes from '../../assets/boxes-top-right.png';
import loaderLarge from '../../assets/loader-large.gif';
import { ResponsiveContainer, FixedAlert } from '..';

export default function EmailBox(props) {
  const [email, setEmail] = useState('');
  const ret = (
    <>
      <div
        className='homepage-box-section email-box left-first no-margin'
        style={{ backgroundColor: 'var(--darker)', marginBottom: props.noMargin ? '0' : '2rem' }}
      >
        <img className='homepage-top-right-boxes' src={topRightBoxes} alt='Boxes' />
        <div className='left'>
          <div className='inner' style={{ borderRadius: '6px', backgroundColor: 'var(--primary)' }}>
            <img src={loaderLarge} alt='Get emailed!' style={{ height: '100%', width: 'auto', margin: '0 auto', display: 'block' }} />
          </div>
        </div>
        <div className='right'>
          <h1 className='main-header'>Get games emailed straight to your inbox, every morning</h1>
          <p className='main-description'>We'll send you daily emails with links to games to enjoy. You may unsubscribe at any time.</p>
          <div className='box'>
            <form className='input-container'>
              <input type='text' onChange={(e) => setEmail(e.target.val)} value={email} placeholder='Your email address' spellCheck={false} />
              <button onClick={() => {}}>
                Get Emails <i className='fas fa-arrow-right'></i>
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* <FixedAlert type='danger' text='Lorem ipsum dolor' /> */}
    </>
  );
  if (props.withContainer) {
    return <ResponsiveContainer>{ret}</ResponsiveContainer>;
  } else {
    return ret;
  }
}
