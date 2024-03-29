/* eslint-disable no-restricted-globals */
import './lib/main.css';
import './lib/layout.css';
import { NavBar, ResponsiveContainer, ProfileModal, Footer, AuthModal, ScrollToTop, CookiesBanner, GoogleAnalytics, EmailBox } from './components/';
import { Home, Play, DailyChallenge, SquadsDatabase, Leaderboard, About, Team, Terms, Instructions, Error404, EmailUnsubscribe } from './pages/';
import { Component } from 'react';
import { APIBaseURL, siteTitle, siteDescription } from './lib/config';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReactGA from 'react-ga';
import { GA_TRACKING_ID } from './lib/config';
import axios from 'axios';

ReactGA.initialize(GA_TRACKING_ID);

const pages = [
  {
    icon: <i className='far fa-futbol'></i>,
    code: 'home',
    name: 'Home',
    isHomepage: true,
    useExactURLMatching: true,
  },
  {
    code: 'about',
    name: 'About',
    description: 'Read about this site, how it was built, and how it works.',
    icon: <i className='fas fa-info-circle'></i>,
    type: 'info',
    useExactURLMatching: true,
  },
  {
    code: 'team',
    name: 'Our Team',
    description: 'See and read about the team that created and maintains this site.',
    icon: <i className='fas fa-user'></i>,
    type: 'info',
    useExactURLMatching: true,
  },
  {
    code: 'instructions',
    name: 'Instructions',
    icon: <i className='fas fa-question-circle'></i>,
    type: 'info',
    description: `Learn how to play ${siteTitle} for the first time.`,
    useExactURLMatching: true,
  },
  {
    code: 'terms',
    name: 'Terms & Cookie Policy',
    icon: <i className='fas fa-shield-alt'></i>,
    description: `Read more about how this site works and our terms.`,
    type: 'info',
    useExactURLMatching: true,
  },
  {
    icon: <i className='far fa-futbol'></i>,
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

    const EmailBoxOuter = (props) => <div style={{ backgroundColor: 'var(--darker)', overflow: 'hidden' }}>{props.children}</div>;

    return (
      <Router>
        <GoogleAnalytics />
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
              <>
                <Helmet>
                  <title>About - {siteTitle}</title>
                </Helmet>
                <About />
                <EmailBoxOuter>
                  <EmailBox withContainer={true} />
                </EmailBoxOuter>
              </>
            </Route>
            <Route exact path='/team'>
              <>
                <Helmet>
                  <title>Team - {siteTitle}</title>
                </Helmet>
                <Team />
                <EmailBoxOuter>
                  <EmailBox withContainer={true} />
                </EmailBoxOuter>
              </>
            </Route>
            <Route exact path='/instructions'>
              <>
                <Helmet>
                  <title>Instructions - {siteTitle}</title>
                </Helmet>
                <Instructions />
                <EmailBoxOuter>
                  <EmailBox withContainer={true} />
                </EmailBoxOuter>
              </>
            </Route>
            <Route exact path='/terms'>
              <>
                <Helmet>
                  <title>Terms & Cookie Policy - {siteTitle}</title>
                </Helmet>
                <Terms />
                <EmailBoxOuter>
                  <EmailBox withContainer={true} />
                </EmailBoxOuter>
              </>
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
                <EmailBox withContainer={true} />
              </>
            </Route>
            <Route path='/daily'>
              <ResponsiveContainer>
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
                <EmailBox />
              </ResponsiveContainer>
            </Route>
            <Route exact path='/database'>
              <ResponsiveContainer>
                <Helmet>
                  <title>Squads Database - {siteTitle}</title>
                </Helmet>
                <SquadsDatabase />
                <EmailBox />
              </ResponsiveContainer>
            </Route>
            <Route exact path='/leaderboard'>
              <ResponsiveContainer>
                <Helmet>
                  <title>Leaderboard - {siteTitle}</title>
                </Helmet>
                <Leaderboard user={this.state.user} loggedIn={loggedIn} />
                <EmailBox />
              </ResponsiveContainer>
            </Route>
            <Route exact path='/email-unsubscribe'>
              <ResponsiveContainer>
                <Helmet>
                  <title>Unsubscribe From Emails - {siteTitle}</title>
                </Helmet>
                <EmailUnsubscribe />
                <EmailBox />
              </ResponsiveContainer>
            </Route>
            <Route>
              <ResponsiveContainer>
                <Error404 />
                <EmailBox />
              </ResponsiveContainer>
            </Route>
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
