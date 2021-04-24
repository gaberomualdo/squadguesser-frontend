import { ResponsiveContainer } from '../';
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default function Footer({ pages }) {
  const currentYear = new Date().getFullYear();
  const homePage = pages.filter((e) => e.isHomepage)[0];
  return (
    <div className='footer'>
      <ResponsiveContainer>
        <div className='top'>
          <div className='left'>
            <Link to='/' className='logo'>
              <div className='icon'>{homePage.icon}</div>
              <p>SquadGuessr</p>
            </Link>
          </div>
          <div className='right'>
            {pages.map((e, i) => {
              if (!e.isHomepage) {
                return (
                  <Link key={i} to={`/${e.code}`} className='link'>
                    {e.name}
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
        <div className='center'>
          <p className='big'>
            Built by{' '}
            <a className='link' href='https://gabrielromualdo.com/' target='_blank'>
              Gabriel Romualdo
            </a>
            , an Arsenal fan.
          </p>
          <p>
            &copy; 2020{currentYear > 2020 ? `-${currentYear}` : ''} &nbsp;&bull;&nbsp; Some images and data used from EA Sports and FIFAIndex.com
            under Fair Use for non-commercial purposes.
          </p>
          <p>
            Built using React.js and the MERN Stack. &nbsp;&bull;&nbsp; Questions, suggestions, or problems? Email{' '}
            <a className='link' href='mailto:gabriel@gabrielromualdo.com'>
              gabriel@gabrielromualdo.com
            </a>
            .
          </p>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
