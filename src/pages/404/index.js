import React from 'react';
import { PageHeader, PlayButton } from '../../components';
import { siteTitle } from '../../lib/config';
import './styles.css';

const goTo = (uri) => window.location.assign(uri);

export default function Error404() {
  return (
    <div className='error-404-page page panel' style={{ marginBottom: '2rem' }}>
      <PageHeader title='Page Not Found' description={<>This page does not exist. Try another URL or return to home.</>} />
      <div className='buttons'>
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
    </div>
  );
}
