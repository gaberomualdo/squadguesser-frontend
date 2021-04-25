import './styles.css';
import React from 'react';

export default function NotAvailableOnMobileBanner() {
  return (
    <div className='mobile-banner'>
      <p>This page is not yet available on mobile.</p>
      <p>Please switch to a larger screen or rotate your device.</p>
      <p>Apologies for the inconvenience.</p>
    </div>
  );
}
