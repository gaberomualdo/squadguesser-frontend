import { ResponsiveContainer } from '../';
import React from 'react';
import './styles.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className='footer'>
      <ResponsiveContainer>
        <div className='left'>
          <p>&copy; Gabriel Romualdo 2020{currentYear > 2020 ? `-${currentYear}` : ''}</p>
          <p className='light'>Some images and data used from EA Sports and FIFAIndex.com under Fair Use for non-commercial purposes.</p>
          <p className='light'>Built using React and the MERN Stack. Code available on request.</p>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
