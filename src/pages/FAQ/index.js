import React from 'react';
import { PageHeader } from '../../components';
import { siteTitle } from '../../lib/config';

export default function FAQ() {
  return (
    <div className='text-page page panel'>
      <PageHeader
        title='Frequently Asked Questions'
        description={`Have questions? Here are some frequently asked questions and answers about ${siteTitle}.`}
      />
      <div className='content'></div>
    </div>
  );
}
