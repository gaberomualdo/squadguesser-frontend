import './styles.css';
import React from 'react';
import { PlayButton } from '..';
import { siteTitle } from '../../lib/config';

const goTo = (uri) => window.location.assign(uri);

export default function index() {
  return (
    <div className='site-link-buttons-component'>
      <PlayButton
        icon={<i className='fas fa-home'></i>}
        name={<>Return To Home</>}
        description='Lost? Go back to the homepage.'
        className='primary'
        onClick={() => goTo('/')}
      />
      <PlayButton
        icon={<i className='fas fa-play'></i>}
        name={<>Play {siteTitle}</>}
        description={`Play ${siteTitle} now.`}
        className='secondary'
        onClick={() => goTo('/play')}
      />
      <PlayButton
        icon={<i className='fas fa-calendar-alt'></i>}
        name={<>Daily Challenge</>}
        description="Play today's unique challenge."
        className='secondary'
        onClick={() => goTo('/daily')}
      />
    </div>
  );
}
