/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar } from './components/index.js';
import { useState } from 'react';

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

  const [activePage, setActivePage] = useState(initialPage);

  const setPage = (p) => {
    setActivePage(p);

    const url = new URL(window.location.href);
    url.searchParams.set(urlPageParam, p);
    const urlStr = url.toString();

    history.pushState({}, 'Navigate to New Page', urlStr);
  };

  return (
    <div className='App'>
      <NavBar pages={pages} setPage={setPage} active={activePage} />
    </div>
  );
}

export default App;
