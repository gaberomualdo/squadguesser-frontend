import './styles.css';
import { siteTitle } from '../../lib/config';
import { PrimaryButton, ResponsiveContainer } from '../';
import React, { useState } from 'react';

export default function CookiesBanner() {
  const [shown, setShown] = useState(localStorage.getItem('acceptedcookies') ? false : true);

  return (
    <div className={`cookies-banner-component ${shown ? '' : 'hidden'}`}>
      <ResponsiveContainer>
        <div className='left'>
          <p>
            By continuing to use {siteTitle}, you accept that we use cookies to track site usage, track analytics, save user sessions, and check if
            you've accepted this notice before.
          </p>
        </div>
        <div className='right'>
          <button
            onClick={() => {
              localStorage.setItem('acceptedcookies', true);
              setShown(false);
            }}
            className='accept'
          >
            <i className='fas fa-check'></i>
            <span>Accept Cookies</span>
          </button>
          <button
            className='leave'
            onClick={() => {
              // eslint-disable-next-line no-restricted-globals
              if (confirm('Are you sure you want to leave this page?')) {
                window.location.assign('https://google.com/');
              }
            }}
          >
            <i className='fas fa-times'></i>
            <span>Leave Site</span>
          </button>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
