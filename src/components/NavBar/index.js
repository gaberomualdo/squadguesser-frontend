/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import './styles.css';
import { ResponsiveContainer } from '../';

const NavBar = function (props) {
  const { pages } = props;
  const homePage = pages.filter((e) => e.isHomepage)[0];

  let initialPage = homePage.code;

  const urlPageParam = 'page';

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has(urlPageParam)) {
    const param = urlParams.get(urlPageParam).toLowerCase();
    if (pages.map((e) => e.code).indexOf(param) > -1) {
      initialPage = param;
    }
  }

  const [active, setActive] = useState(initialPage);

  const setPage = (p) => {
    setActive(p);

    const url = new URL(window.location.href);
    url.searchParams.set(urlPageParam, p);
    const urlStr = url.toString();

    history.pushState({}, 'Navigate to New Page', urlStr);
  };

  return (
    <div className='navbar-container'>
      <ResponsiveContainer>
        <div className='navbar'>
          <div className='left'>
            <h1 className={`link logo ${active === homePage.code ? 'active' : ''}`} onClick={() => setPage(homePage.code)}>
              <span className='icon'>{homePage.icon}</span>
              &nbsp;&nbsp;
              <span className='text'>SquadGuessr</span>
            </h1>
          </div>
          <div className='right'>
            {pages
              .filter((e) => !e.isHomepage)
              .map((e) => (
                <button className={`link ${active === e.code ? 'active' : ''}`} onClick={() => setPage(e.code)}>
                  <span className='icon'>{e.icon}</span>
                  &nbsp;&nbsp;
                  <span className='text'>{e.name}</span>
                </button>
              ))}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};
export default NavBar;
