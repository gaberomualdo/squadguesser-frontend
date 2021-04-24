/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar, ResponsiveContainer, ProfileModal, Footer, AuthModal, ScrollToTop } from './components/';
import { Home, Play, DailyChallenge, SquadsDatabase, Leaderboard } from './pages/';
import { Component } from 'react';
import { APIBaseURL } from './lib/config';
import { matchPath } from 'react-router';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const axios = require('axios');

const SITE_TITLE = 'SquadGuessr';

const pages = [
  {
    icon: <i className='fas fa-futbol'></i>,
    code: 'home',
    name: 'Home',
    isHomepage: true,
    useExactURLMatching: true,
  },
  {
    code: 'database',
    name: 'Squads Database',
    type: 'info',
    useExactURLMatching: false,
  },
  {
    icon: <i className='fas fa-futbol'></i>,
    code: 'play',
    name: 'Play SquadGuessr',
    description: <>Guess teams from the Premier League, La Liga, Serie A, and more.</>,
    type: 'game',
    useExactURLMatching: false,
  },
  {
    icon: <i className='fas fa-calendar-alt'></i>,
    code: 'daily',
    name: 'Daily Challenge',
    description: <>Test your skills with today's unique challenge.</>,
    type: 'game',
    useExactURLMatching: true,
  },
  {
    icon: <i className='fas fa-trophy'></i>,
    code: 'leaderboard',
    name: 'Leaderboard',
    type: 'other',
    useExactURLMatching: false,
  },
];

const isLoggedIn = (user) => {
  return Object.keys(user).length > 0 && !user.currentlyLoading;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.reloadUser = this.reloadUser.bind(this);

    const token = localStorage.getItem('authtoken');

    this.state = {
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
  render() {
    const setAuthModal = (open, signIn = true) => {
      this.setState({ showAuthModal: open, authModalSignIn: signIn });
    };
    const setProfileModal = (open) => {
      this.setState({ showProfileModal: open });
    };

    const loggedIn = isLoggedIn(this.state.user);

    return (
      <Router>
        <ScrollToTop />
        <div className='App'>
          <NavBar setAuthModal={setAuthModal} setProfileModal={setProfileModal} pages={pages} user={this.state.user} />
          <Switch>
            <Route exact path='/'>
              <Home user={this.state.user} pages={pages} setAuthModal={setAuthModal} />
            </Route>
            <Route path='/play'>
              <Play
                reloadUser={this.reloadUser}
                user={this.state.user}
                loggedIn={loggedIn}
                setAuthModal={setAuthModal}
                setProfileModal={setProfileModal}
              />
            </Route>
            <ResponsiveContainer>
              <Route exact path='/daily'>
                <DailyChallenge
                  reloadUser={this.reloadUser}
                  user={this.state.user}
                  loggedIn={loggedIn}
                  setAuthModal={setAuthModal}
                  setProfileModal={setProfileModal}
                />
              </Route>
              <Route path='/database'>
                <SquadsDatabase />
              </Route>
              <Route path='/leaderboard'>
                <Leaderboard user={this.state.user} loggedIn={loggedIn} />
              </Route>
              <Route path='*'>{/* 404 Page Here */}</Route>
            </ResponsiveContainer>
          </Switch>
          <Footer pages={pages} />
          {this.state.showAuthModal ? <AuthModal setAuthModal={setAuthModal} signIn={this.state.authModalSignIn} /> : null}
          {this.state.showProfileModal && loggedIn ? (
            <ProfileModal profileIsSignedIn={true} setProfileModal={setProfileModal} profile={this.state.user} />
          ) : null}
        </div>
      </Router>
    );
  }
}

export default App;
