import React from 'react';
import { Loading } from '../';

export default function FullHeightLoading() {
  return (
    <div className='fullheight-section' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'var(--fullheight)' }}>
      <Loading />
    </div>
  );
}
