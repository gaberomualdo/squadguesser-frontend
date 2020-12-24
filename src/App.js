/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar, ResponsiveContainer, Footer } from './components/';
import { Home, About, ByNationality, DailyChallenge } from './pages/';
import { Component } from 'react';

const SITE_TITLE = 'SquadGuessr';

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
    description: <>Guess teams from the Premier League, La Liga, Bundesliga, and more &rarr;</>,
    type: 'game',
  },
  {
    icon: '📆',
    code: 'dailychallenge',
    name: 'Daily Challenge',
    description: <>Test your skills with today's challenge &rarr;</>,
    type: 'game',
  },
  {
    icon: '📚',
    code: 'leaderboard',
    name: 'Leaderboard',
    type: 'other',
  },
];
const urlPageParam = 'page';

class App extends Component {
  constructor(props) {
    super(props);
    this.parsePageURLParam = this.parsePageURLParam.bind(this);
    this.updatePageTitle = this.updatePageTitle.bind(this);
    this.updateOnURLChange = this.updateOnURLChange.bind(this);

    const homePage = pages.filter((e) => e.isHomepage)[0];
    let initialPage = homePage.code;
    this.parsePageURLParam((param) => {
      initialPage = param;
      this.updatePageTitle(param);
    });

    this.state = {
      activePage: initialPage,
      currentURL:
        window.location.href /* the 'currentURL' and 'url' state and prop is used to require refresh of the component if the page URL changes */,
    };
  }
  parsePageURLParam(callback) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has(urlPageParam)) {
      const param = urlParams.get(urlPageParam).toLowerCase();
      if (pages.map((e) => e.code).indexOf(param) > -1) {
        callback(param);
      }
    }
  }
  updatePageTitle(p) {
    const curPage = pages.filter((e) => e.code === p)[0];
    if (curPage.isHomepage) {
      document.title = SITE_TITLE;
    } else {
      document.title = `${curPage.name} ${curPage.icon ? /* curPage.icon */ '' : ''} • ${SITE_TITLE}`;
    }
  }
  updateOnURLChange() {
    this.parsePageURLParam((param) => {
      this.updatePageTitle(param);
      this.setState({ activePage: param, currentURL: window.location.href });
    });
  }
  componentDidMount() {
    window.addEventListener('popstate', this.updateOnURLChange);
  }
  componentWillUnmount() {
    window.removeEventListener('popstate', this.updateOnURLChange);
  }
  render() {
    const setPage = (p) => {
      window.scrollTo(0, 0);
      this.updatePageTitle(p);

      const url = new URL(window.location.href);
      url.searchParams.set(urlPageParam, p);
      ['game', 'league'].forEach((e) => url.searchParams.delete(e));
      const urlStr = url.toString();
      history.pushState({}, 'Navigate to New Page', urlStr);
      this.setState({ activePage: p, currentURL: window.location.href });
    };

    return (
      <div className='App'>
        <NavBar pages={pages} setPage={setPage} active={this.state.activePage} />
        <ResponsiveContainer>
          {this.state.activePage === 'home' ? <Home setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}{' '}
          {this.state.activePage === 'about' ? <About setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}
          {this.state.activePage === 'play' ? <ByNationality setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}
          {this.state.activePage === 'dailychallenge' ? <DailyChallenge setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}
        </ResponsiveContainer>
        <Footer />
      </div>
    );
  }
}

export default App;
