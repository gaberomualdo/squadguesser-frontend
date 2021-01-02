/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar, ResponsiveContainer, Footer, AuthModal } from './components/';
import { Home, About, ByNationality, DailyChallenge, SquadsDatabase } from './pages/';
import { Component } from 'react';
import { APIBaseURL } from './lib/config';
const axios = require('axios');

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
    this.reloadUser = this.reloadUser.bind(this);

    const homePage = pages.filter((e) => e.isHomepage)[0];
    let initialPage = homePage.code;
    this.parsePageURLParam((param) => {
      initialPage = param;
      this.updatePageTitle(param);
    });

    const token = localStorage.getItem('authtoken');

    this.state = {
      activePage: initialPage,
      currentURL:
        window.location.href /* the 'currentURL' and 'url' state and prop is used to require refresh of the component if the page URL changes */,
      user: token ? { currentlyLoading: true } : {},
      showAuthModal: false,
      authModalSignIn: true,
    };
  }
  reloadUser() {
    const token = localStorage.getItem('authtoken');
    if (token && !(Object.keys(this.state.user).length > 0 && !this.state.user.currentlyLoading)) {
      axios({
        method: 'get',
        baseURL: APIBaseURL,
        url: `/api/profiles/me`,
        headers: {
          'x-auth-token': token,
        },
      })
        .then((res) => {
          this.setState({ user: res.data });
        })
        .catch((err) => {
          // give up and remove the token
          localStorage.removeItem('authtoken');
          this.setState({ user: {} });
        });
    }
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
    this.reloadUser();
  }
  componentWillUnmount() {
    window.removeEventListener('popstate', this.updateOnURLChange);
  }
  render() {
    const setAuthModal = (open, signIn = true) => {
      this.setState({ showAuthModal: open, authModalSignIn: signIn });
    };

    const setPage = (p, getNewURL = false) => {
      const url = new URL(window.location.href);
      url.searchParams.set(urlPageParam, p);
      ['game', 'league'].forEach((e) => url.searchParams.delete(e));
      const newURL = url.toString();

      if (getNewURL) {
        return newURL;
      }

      window.scrollTo(0, 0);
      this.updatePageTitle(p);

      history.pushState({}, 'Navigate to New Page', newURL);
      this.setState({ activePage: p, currentURL: window.location.href });
    };

    return (
      <div className='App'>
        <NavBar setAuthModal={setAuthModal} pages={pages} setPage={setPage} active={this.state.activePage} user={this.state.user} />
        <ResponsiveContainer>
          {this.state.activePage === 'home' ? (
            <Home user={this.state.user} setPage={setPage} url={this.state.currentURL} pages={pages} setAuthModal={setAuthModal} />
          ) : null}
          {this.state.activePage === 'about' ? <About setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}
          {this.state.activePage === 'play' ? <ByNationality setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}
          {this.state.activePage === 'dailychallenge' ? <DailyChallenge setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}
          {this.state.activePage === 'database' ? <SquadsDatabase setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}
        </ResponsiveContainer>
        <Footer />
        {this.state.showAuthModal ? <AuthModal setAuthModal={setAuthModal} signIn={this.state.authModalSignIn} /> : null}
      </div>
    );
  }
}

export default App;
