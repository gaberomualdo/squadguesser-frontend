import React from 'react';
import { PageHeader } from '../../components';
import { siteTitle } from '../../lib/config';

export default function About() {
  return (
    <div className='text-page page panel'>
      <PageHeader title='Game Instructions' description={`Confused on how to play? This page explains how to play ${siteTitle} in detail.`} />
      <div className='content'></div>
    </div>
  );
}
