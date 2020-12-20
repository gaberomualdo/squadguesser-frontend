/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar, ResponsiveContainer } from './components/';
import { Home, About, ByNationality, DailyChallenge } from './pages/';
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
      code: 'database',
      name: 'Squads Database',
      type: 'info',
    },
    {
      icon: '⚽',
      code: 'play',
      name: 'Play SquadGuessr',
      type: 'game',
    },
    {
      icon: '📆',
      code: 'dailychallenge',
      name: 'Daily Challenge',
      type: 'game',
    },
    {
      icon: '📚',
      code: 'leaderboard',
      name: 'Leaderboard',
      type: 'other',
    },
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
  const [currentURL, setCurrentURL] = useState(window.location.href);

  const setPage = (p) => {
    updatePageTitle(p);

    const url = new URL(window.location.href);
    url.searchParams.set(urlPageParam, p);
    ['game', 'league'].forEach((e) => url.searchParams.delete(e));
    const urlStr = url.toString();
    history.pushState({}, 'Navigate to New Page', urlStr);

    setActivePage(p);
    setCurrentURL(window.location.href);
  };

  window.addEventListener('popstate', (event) => {
    parsePageURLParam((param) => {
      updatePageTitle(param);
      setActivePage(param);
      setCurrentURL(window.location.href);
    });
  });

  return (
    <div className='App'>
      <NavBar pages={pages} setPage={setPage} active={activePage} />
      <ResponsiveContainer>
        {/* the 'url' prop is used to require refresh of the component if the page URL changes */}
        {activePage === 'home' ? <Home setPage={setPage} url={currentURL} pages={pages} /> : null}
        {activePage === 'about' ? <About setPage={setPage} url={currentURL} pages={pages} /> : null}
        {activePage === 'play' ? <ByNationality setPage={setPage} url={currentURL} pages={pages} /> : null}
        {activePage === 'dailychallenge' ? <DailyChallenge setPage={setPage} url={currentURL} pages={pages} /> : null}
      </ResponsiveContainer>
    </div>
  );
}

export default App;
