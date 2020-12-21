import './styles.css';
import React, { Component } from 'react';
import { PlayButton, ResponsiveContainer } from '../../components';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.demoVideo = React.createRef();
    this.state = {
      playing: true,
    };
  }
  componentDidMount() {
    this.demoVideo.current.playbackRate = 1.75;
  }
  render() {
    const englishSpelling = true;
    const pages = this.props.pages.filter((e) => !e.isHomepage && !(e.type && e.type === 'info'));
    return (
      <div className='homepage'>
        <ResponsiveContainer>
          <div className='topsection'>
            <div className='left textsection'>
              <div className='inner'>
                <div className='top'>
                  <h1>Test Your {englishSpelling ? 'Football' : 'Soccer'} Knowledge!</h1>
                  <p>Play hundreds of challenges to guess famous teams based on their formation, player nationalities, and more.</p>
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
                <video ref={this.demoVideo} width='100%' height='auto' autoPlay={true} loop={true} muted>
                  <source src='http://localhost:3000/demovideo.mov' type='video/mp4' />
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
                    this.setState({ playing: !this.state.playing });
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
        </ResponsiveContainer>
      </div>
    );
  }
}
