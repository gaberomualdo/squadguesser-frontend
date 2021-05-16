import React from 'react';
import { Loading } from '..';
import loaderSource from '../../assets/loader.gif';

export default function FullHeightLoading() {
  return (
    <div className='fullheight-section' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'var(--fullheight)' }}>
      {/* <div
        style={{ borderRadius: '6px', width: '100%', maxWidth: '250px', overflow: 'hidden', fontSize: '0', boxShadow: '0 3px 12px rgba(0,0,0,.1)' }}
      >
        <img src={loaderSource} alt='Loading' style={{ width: '100%', height: 'auto' }} />
        <h2
          style={{
            backgroundColor: 'var(--darkprimary)',
            padding: '.75rem .25rem',
            textAlign: 'center',
            fontSize: '1.15rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loading
            style={{
              borderLeftColor: '#fff',
              borderBottomColor: '#fff',
              marginRight: '.75rem',
              width: '1.75rem',
              height: '1.75rem',
              borderWidth: '3px',
            }}
          />
          <span style={{ marginRight: '.75rem' }}>Loading Game</span>
        </h2>
      </div> */}
      <Loading />
    </div>
  );
}
