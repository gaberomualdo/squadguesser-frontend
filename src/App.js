/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar, ResponsiveContainer } from './components/';
import { Home, About, ByNationality } from './pages/';
import { useState } from 'react';

const SITE_TITLE = 'SquadGuessr';

function App() {
  const pages = [
    {
      icon: '⚽',
      code: 'home',
      name: 'Home',
      isHomepage: true,
    },
    {
      code: 'about',
      name: 'About',
      type: 'info',
    },
    {
      icon: '📆',
      code: 'dailychallenge',
      name: 'Daily Challenge',
      type: 'game',
    },
    // {
    //   icon: '⏱️',
    //   code: 'live',
    //   name: 'Live Challenges',
    //   type: 'game',
    // },
    {
      icon: '🏁',
      code: 'nationality',
      name: 'By Nationality',
      type: 'game',
    },
    {
      icon: '📈',
      code: 'rating',
      name: 'By FIFA Rating',
      type: 'game',
    },
    {
      icon: '✍️',
      code: 'initials',
      name: 'By Initials',
      type: 'game',
    },
    // {
    //   icon: '👴',
    //   code: 'age',
    //   name: 'By Player Age',
    //   type: 'game',
    // },
  ];

  const updatePageTitle = (p) => {
    const curPage = pages.filter((e) => e.code === p)[0];
    if (curPage.isHomepage) {
      document.title = SITE_TITLE;
    } else {
      document.title = `${curPage.name} ${curPage.icon ? /* curPage.icon */ '' : ''} • ${SITE_TITLE}`;
    }
  };

  const homePage = pages.filter((e) => e.isHomepage)[0];
  let initialPage = homePage.code;

  const urlPageParam = 'page';

  const parsePageURLParam = (callback) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(urlPageParam)) {
      const param = urlParams.get(urlPageParam).toLowerCase();
      if (pages.map((e) => e.code).indexOf(param) > -1) {
        callback(param);
      }
    }
  };
  parsePageURLParam((param) => {
    initialPage = param;
    updatePageTitle(param);
  });

  const [activePage, setActivePage] = useState(initialPage);

  const setPage = (p) => {
    updatePageTitle(p);

    const url = new URL(window.location.href);
    url.searchParams.set(urlPageParam, p);
    const urlStr = url.toString();
    history.pushState({}, 'Navigate to New Page', urlStr);

    setActivePage(p);
  };

  window.addEventListener('popstate', (event) => {
    parsePageURLParam((param) => {
      updatePageTitle(param);
      setActivePage(param);
    });
  });

  return (
    <div className='App'>
      <NavBar pages={pages} setPage={setPage} active={activePage} />
      <ResponsiveContainer>
        {activePage === 'home' ? <Home setPage={setPage} pages={pages} /> : null}
        {activePage === 'about' ? <About setPage={setPage} pages={pages} /> : null}
        {activePage === 'nationality' ? <ByNationality setPage={setPage} pages={pages} /> : null}
      </ResponsiveContainer>
    </div>
  );
}

export default App;
