import './styles.css';
import React, { Component } from 'react';
import { PlayButton } from '../../components';
import { APIBaseURL } from '../../lib/config';
import { toBase64 } from '../../lib/utils';

const topTeamsLeagueName = 'Top 25 Teams';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.demoVideo = React.createRef();
    this.state = {
      playing: false,
      top25Teams: [],
      videoLoaded: false,
    };
  }
  componentDidMount() {
    this.demoVideo.current.playbackRate = 1.75;

    if (this.state.top25Teams.length === 0) {
      (async () => {
        const data = await (await fetch(`${APIBaseURL}/teams/by-league/onlylogos/${topTeamsLeagueName}`)).json();
        this.setState({ top25Teams: data });
      })();
    }
  }
  render() {
    const englishSpelling = true;
    const pages = this.props.pages.filter((e) => !e.isHomepage && !(e.type && e.type === 'info'));
    return (
      <div className='homepage'>
        <div className='topsection'>
          <div className='left textsection'>
            <div className='inner'>
              <div className='top'>
                <h1 className='main-header'>Test Your {englishSpelling ? 'Football' : 'Soccer'} Knowledge!</h1>
                <p className='main-description'>
                  Play hundreds of challenges to guess famous teams based on their formation, player nationalities, and more.
                </p>
              </div>
              <div className='play'>
                {[0, 1].map((i) => (
                  <PlayButton
                    icon={pages[i].icon}
                    name={pages[i].name}
                    description={pages[i].description ? pages[i].description : <>play now &rarr;</>}
                    onClick={() => this.props.setPage(pages[i].code)}
                    className={i === 0 ? 'primary' : ''}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className='right videosection'>
            <div className='video-container'>
              <img
                width='100%'
                height='auto'
                src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAA3CAQAAADgDgG0AAAALElEQVR42u3NMQEAAAwCoNm/9EroBwXIjUUgEAgEAoFAIBAIBAKBQCAQCKoeXHkAOB/5ko8AAAAASUVORK5CYII='
                alt='Demo Video Loading Placeholder'
                style={this.state.videoLoaded ? { display: 'none' } : {}}
              />
              <video
                ref={this.demoVideo}
                width='100%'
                height='auto'
                autoPlay={true}
                loop={true}
                onCanPlay={() => {
                  if (!this.state.videoLoaded) {
                    this.setState({ videoLoaded: true });
                  }
                }}
                onPlay={() => {
                  this.setState({ playing: true });
                }}
                onPause={() => {
                  this.setState({ playing: false });
                }}
                style={this.state.videoLoaded ? {} : { display: 'none' }}
                muted
              >
                <source src='/demovideo.mp4' type='video/mp4' />
                Your browser does not support the video tag.
              </video>
              <button
                className='play-pause'
                onClick={() => {
                  if (this.state.playing) {
                    this.demoVideo.current.pause();
                  } else {
                    this.demoVideo.current.play();
                  }
                }}
              >
                {this.state.playing ? (
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z' />
                  </svg>
                ) : (
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M3 22v-20l18 10-18 10z' />
                  </svg>
                )}
              </button>
            </div>
            <button className='video-cta' onClick={() => this.props.setPage('play')}>
              <span className='left'>Play SquadGuessr</span>
              <span className='right'>&rarr;</span>
            </button>
          </div>
        </div>
        <div className='box-section left-first'>
          <div className='left club-logos'>
            <div className='inner'>
              {this.state.top25Teams.slice(0, 18).map((e, i) => (
                <div className='image-container' key={i}>
                  <img src={e} alt={`Club Logo`} />
                </div>
              ))}
            </div>
            <p className='and-more'>and many more...</p>
          </div>
          <div className='right'>
            <h1 className='main-header'>Try guessing from the world's most famous teams!</h1>
            <PlayButton
              className='secondary'
              name={`Play The ${topTeamsLeagueName}`}
              icon='⚽'
              description={<>Guess from the greatest teams right now &rarr;</>}
              onClick={() => {
                const leagueNameCode = toBase64(topTeamsLeagueName);
                const url = new URL(window.location.href);
                url.searchParams.delete('game');
                url.searchParams.set('league', leagueNameCode);
                url.searchParams.set('page', 'play');
                const urlStr = url.toString();
                window.open(urlStr, '_self');
              }}
            />
          </div>
        </div>
        <div className='box-section right-first'>
          <div className='right'>
            <h1 className='main-header'>Compete against your friends on the public leaderboard</h1>
            <PlayButton
              onClick={() => this.props.setPage('leaderboard')}
              className='secondary'
              icon='🏆'
              name='Check Out the Leaderboard'
              description={<>See it now &rarr;</>}
            />
          </div>
          <div className='left leaderboard'>
            <div className='inner'>
              {Array(5)
                .fill(<></>)
                .map((e, i) => (
                  <div className='row' key={i}>
                    <div className='number'>{i + 1}</div>
                    <div className='text'></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {Object.keys(this.props.user).length === 0 ? (
          <div className='box-section column auth'>
            <h1 className='main-header'>Want to get stats, save your progress, compete with other players, and more?</h1>
            <div className='row'>
              <PlayButton
                className='secondary'
                name='Sign In'
                description={<>Already have an account? Sign In &rarr;</>}
                onClick={() => this.props.setAuthModal(true, true)}
              />
              <PlayButton
                className='secondary'
                name='Sign Up'
                description={<>Don't have an account yet? Sign Up &rarr;</>}
                onClick={() => this.props.setAuthModal(true, false)}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
