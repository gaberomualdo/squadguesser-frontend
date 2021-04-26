/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar, ResponsiveContainer, ProfileModal, Footer, AuthModal, ScrollToTop, CookiesBanner } from './components/';
import { Home, Play, DailyChallenge, SquadsDatabase, Leaderboard, About, FAQ, Instructions } from './pages/';
import { Component } from 'react';
import { APIBaseURL, siteTitle, siteDescription } from './lib/config';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const axios = require('axios');

const pages = [
  {
    icon: <i className='fas fa-futbol'></i>,
    code: 'home',
    name: 'Home',
    isHomepage: true,
    useExactURLMatching: true,
  },
  {
    code: 'about',
    name: 'About',
    type: 'info',
    useExactURLMatching: true,
  },
  {
    code: 'faq',
    name: 'FAQ',
    type: 'info',
    useExactURLMatching: true,
  },
  {
    code: 'instructions',
    name: 'Instructions',
    type: 'info',
    useExactURLMatching: true,
  },
  {
    icon: <i className='fas fa-futbol'></i>,
    code: 'play',
    name: 'Play',
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
    useExactURLMatching: false,
  },
  {
    icon: <i className='fas fa-trophy'></i>,
    code: 'leaderboard',
    name: 'Leaderboard',
    type: 'other',
    useExactURLMatching: true,
  },
  {
    icon: <i className='fas fa-database'></i>,
    code: 'database',
    name: 'Database',
    type: 'other',
    useExactURLMatching: true,
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

    this.reloadUser();

    return (
      <Router>
        <ScrollToTop />
        <div className='App'>
          <CookiesBanner />
          <NavBar setAuthModal={setAuthModal} setProfileModal={setProfileModal} pages={pages} user={this.state.user} />
          <Switch>
            <Route exact path='/'>
              <>
                <Helmet>
                  <title>
                    {siteTitle} - {siteDescription}
                  </title>
                </Helmet>
                <Home user={this.state.user} pages={pages} setAuthModal={setAuthModal} />
              </>
            </Route>
            <Route exact path='/about'>
              <ResponsiveContainer>
                <Helmet>
                  <title>About - {siteTitle}</title>
                </Helmet>
                <About />
              </ResponsiveContainer>
            </Route>
            <Route exact path='/faq'>
              <ResponsiveContainer>
                <Helmet>
                  <title>FAQ - {siteTitle}</title>
                </Helmet>
                <FAQ />
              </ResponsiveContainer>
            </Route>
            <Route exact path='/instructions'>
              <ResponsiveContainer>
                <Helmet>
                  <title>Game Instructions - {siteTitle}</title>
                </Helmet>
                <Instructions />
              </ResponsiveContainer>
            </Route>
            <Route path='/play'>
              <>
                <Helmet>
                  <title>Play - {siteTitle}</title>
                </Helmet>
                <Play
                  reloadUser={this.reloadUser}
                  user={this.state.user}
                  loggedIn={loggedIn}
                  setAuthModal={setAuthModal}
                  setProfileModal={setProfileModal}
                />
              </>
            </Route>
            <ResponsiveContainer>
              <Route path='/daily'>
                <>
                  <Helmet>
                    <title>Daily Challenge - {siteTitle}</title>
                  </Helmet>
                  <DailyChallenge
                    reloadUser={this.reloadUser}
                    user={this.state.user}
                    loggedIn={loggedIn}
                    setAuthModal={setAuthModal}
                    setProfileModal={setProfileModal}
                  />
                </>
              </Route>
              <Route exact path='/database'>
                <>
                  <Helmet>
                    <title>Squads Database - {siteTitle}</title>
                  </Helmet>
                  <SquadsDatabase />
                </>
              </Route>
              <Route exact path='/leaderboard'>
                <>
                  <Helmet>
                    <title>Leaderboard - {siteTitle}</title>
                  </Helmet>
                  <Leaderboard user={this.state.user} loggedIn={loggedIn} />
                </>
              </Route>
              {/* <Route path='*'>
                <Redirect to='/' />
              </Route> */}
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
