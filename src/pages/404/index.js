import React from 'react';
import { PageHeader, SiteLinkButtons } from '../../components';

export default function Error404() {
  return (
    <div className='error-404-page page panel' style={{ marginBottom: '2rem' }}>
      <PageHeader title='Page Not Found' description={<>This page does not exist. Try another URL or return to home.</>} />
      <SiteLinkButtons />
    </div>
  );
}
