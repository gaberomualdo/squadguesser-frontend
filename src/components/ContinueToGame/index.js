import { ResponsiveContainer, PageHeader, PlayButton } from '../';
import './styles.css';
import React from 'react';

export default function ContinueToGame() {
  return (
    <ResponsiveContainer>
      <div className='page panel' style={{ marginBottom: '2rem' }}>
        <PageHeader title='Continue To Game' description={`Click the button below to continue to the game.`} />
        <PlayButton
          icon={<i class='fas fa-play-circle'></i>}
          name='Continue To Game'
          description='Click here to go to the game.'
          className='secondary'
          style={{ width: '100%', maxWidth: '500px', margin: '0 auto', marginTop: '1.5rem' }}
          onClick={() => window.location.reload()}
        />
      </div>
    </ResponsiveContainer>
  );
}
