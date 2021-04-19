/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar, ResponsiveContainer, ProfileModal, Footer, AuthModal } from './components/';
import { Home, Play, DailyChallenge, SquadsDatabase, Leaderboard } from './pages/';
import { Component } from 'react';
import { APIBaseURL } from './lib/config';
const axios = require('axios');

const SITE_TITLE = 'SquadGuessr';

const pages = [
  {
    icon: <i className='fas fa-futbol'></i>,
    code: 'home',
    name: 'Home',
    isHomepage: true,
  },
  {
    code: 'database',
    name: 'Squads Database',
    type: 'info',
  },
  {
    icon: <i className='fas fa-futbol'></i>,
    code: 'play',
    name: 'Play SquadGuessr',
    description: <>Guess teams from the Premier League, La Liga, Bundesliga, and more.</>,
    type: 'game',
  },
  {
    icon: <i className='fas fa-calendar-alt'></i>,
    code: 'dailychallenge',
    name: 'Daily Challenge',
    description: <>Test your skills with today's challenge.</>,
    type: 'game',
  },
  {
    icon: <i className='fas fa-trophy'></i>,
    code: 'leaderboard',
    name: 'Leaderboard',
    type: 'other',
  },
];
const urlPageParam = 'page';

const isLoggedIn = (user) => {
  return Object.keys(user).length > 0 && !user.currentlyLoading;
};

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
      showProfileModal: false,
      authModalSignIn: true,
    };
  }
  reloadUser(force = false) {
    const token = localStorage.getItem('authtoken');
    if (token && (force || !isLoggedIn(this.state.user))) {
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
    const setProfileModal = (open) => {
      this.setState({ showProfileModal: open });
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

    const loggedIn = isLoggedIn(this.state.user);

    return (
      <div className='App'>
        <NavBar
          setAuthModal={setAuthModal}
          setProfileModal={setProfileModal}
          pages={pages}
          setPage={setPage}
          active={this.state.activePage}
          user={this.state.user}
        />
        {this.state.activePage === 'home' ? (
          <Home user={this.state.user} setPage={setPage} url={this.state.currentURL} pages={pages} setAuthModal={setAuthModal} />
        ) : null}
        <ResponsiveContainer>
          {this.state.activePage === 'play' ? (
            <Play
              reloadUser={this.reloadUser}
              user={this.state.user}
              loggedIn={loggedIn}
              setPage={setPage}
              url={this.state.currentURL}
              pages={pages}
              setAuthModal={setAuthModal}
              setProfileModal={setProfileModal}
            />
          ) : null}
          {this.state.activePage === 'dailychallenge' ? (
            <DailyChallenge
              reloadUser={this.reloadUser}
              user={this.state.user}
              loggedIn={loggedIn}
              setPage={setPage}
              url={this.state.currentURL}
              pages={pages}
              setAuthModal={setAuthModal}
              setProfileModal={setProfileModal}
            />
          ) : null}
          {this.state.activePage === 'database' ? <SquadsDatabase setPage={setPage} url={this.state.currentURL} pages={pages} /> : null}
          {this.state.activePage === 'leaderboard' ? (
            <Leaderboard setPage={setPage} url={this.state.currentURL} pages={pages} user={this.state.user} loggedIn={loggedIn} />
          ) : null}
        </ResponsiveContainer>
        <Footer pages={pages} setPage={setPage} />
        {this.state.showAuthModal ? <AuthModal setAuthModal={setAuthModal} signIn={this.state.authModalSignIn} /> : null}
        {this.state.showProfileModal && loggedIn ? (
          <ProfileModal profileIsSignedIn={true} setProfileModal={setProfileModal} profile={this.state.user} />
        ) : null}
      </div>
    );
  }
}

export default App;
