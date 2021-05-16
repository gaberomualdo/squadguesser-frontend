import React, { Component, createRef } from 'react';
import { Link } from 'react-router-dom';
import { LeagueButton, PlayButton, ResponsiveContainer, EmailBox } from '../../components';
import { APIBaseURL, siteTitle, topTeamsLeagueName } from '../../lib/config';
import leagueInfo from '../../lib/leagueInfo';
import getNewGamePath from '../../lib/getNewGamePath';
import AnimatedNumber from './AnimatedNumber';
import ExampleGames from './ExampleGames';
import './styles.css';
import demoVideoSource from '../../assets/demovideo.mp4';
import topLeftBoxes from '../../assets/boxes-top-left.png';
import topRightBoxes from '../../assets/boxes-top-right.png';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.demoVideo = React.createRef();
    this.state = {
      playing: false,
      top25Teams: [],
      videoLoaded: false,
      stats: {},
      leagues: {},
    };
    this.leaguesSlideshow = createRef();
  }
  componentDidMount() {
    this.demoVideo.current.playbackRate = 1.75;

    if (this.state.top25Teams.length === 0) {
      (async () => {
        const data = await (await fetch(`${APIBaseURL}/teams/by-league/${topTeamsLeagueName}`)).json();
        this.setState({ top25Teams: data });
      })();
    }
    if (Object.keys(this.state.stats).length === 0) {
      (async () => {
        const data = await (await fetch(`${APIBaseURL}/stats`)).json();
        this.setState({ stats: data });
      })();
    }
    if (Object.keys(this.state.leagues).length === 0) {
      (async () => {
        const data = await (await fetch(`${APIBaseURL}/teams/all/by-league/onlynamesandlogos`)).json();
        this.setState({ leagues: data });
      })();
    }
  }
  render() {
    const pages = this.props.pages.filter((e) => !e.isHomepage && !(e.type && e.type === 'info'));
    return (
      <div className='homepage'>
        <div className='topsection'>
          <ResponsiveContainer>
            <div className='topsection-inner'>
              <div className='left textsection'>
                <div className='inner'>
                  <div className='top'>
                    <h1 className='main-header'>Test Your Knowledge Of The Beautiful Game</h1>
                    <p className='main-description'>
                      Play thousands of challenges to guess famous teams based on their formation, player nationalities, and more.
                    </p>
                  </div>
                  <div className='play'>
                    {[0, 1].map((i) => (
                      <Link to={`/${pages[i].code}`}>
                        <PlayButton
                          icon={pages[i].icon}
                          name={pages[i].name}
                          description={pages[i].description ? pages[i].description : <>play now.</>}
                          className={i === 0 ? 'primary' : ''}
                          key={i}
                        />
                      </Link>
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
                    <source src={demoVideoSource} type='video/mp4' />
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
                <Link className='video-cta' to='/play'>
                  <span className='left'>Play {siteTitle}</span>
                  <span className='right'>&rarr;</span>
                </Link>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
        <div
          className='homepage-box-section horizontal-list column stats'
          style={{ marginBottom: 0, paddingTop: '.5rem', paddingBottom: '.5rem', backgroundImage: 'none', backgroundColor: 'var(--darker)' }}
        >
          <ResponsiveContainer>
            <div className='inner'>
              <div className='row'>
                <div>
                  <h1>{<AnimatedNumber number={this.state.stats.leaguesCount} />}</h1>
                  <p>Leagues Available to Play</p>
                </div>
                <div>
                  <h1>{<AnimatedNumber number={this.state.stats.teamsCount} />}</h1>
                  <p>Squads to Guess From</p>
                </div>
                <div>
                  <h1>{<AnimatedNumber number={this.state.stats.playersCount} />}</h1>
                  <p>Players in Our Database</p>
                </div>
                <div>
                  <h1>{<AnimatedNumber number={this.state.stats.teamsCount * this.state.stats.gameTypesCount ** 11} />}</h1>
                  <p>Possible Games</p>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
        <div className='homepage-box-section leagues-list column less-padding no-margin'>
          <ResponsiveContainer>
            <div className='inner'>
              <h1>Choose A League To Start Playing</h1>
              <p style={{ opacity: 0.65, marginTop: '.75rem', fontSize: '1rem' }}>{siteTitle} has a vast array of leagues to choose from.</p>
              <div className='leagues-container'>
                <div className='leagues' ref={this.leaguesSlideshow}>
                  {Object.keys(this.state.leagues)
                    .slice(3)
                    .map((e, i) => {
                      let images = this.state.leagues[e].slice(0, 6).map((e) => e.logoURL);
                      return (
                        <LeagueButton
                          onPlayLeague={(chosenGameMode, chosenLeague) => {
                            const leagueNames = Object.keys(this.state.leagues);
                            window.location.assign(getNewGamePath(leagueNames, this.state.leagues, chosenGameMode, chosenLeague));
                          }}
                          key={i}
                          name={e}
                          images={images}
                          description={leagueInfo.descriptions[e] ? leagueInfo.descriptions[e] : <>Guess from this league.</>}
                          location={leagueInfo.locations[e] ? leagueInfo.locations[e] : 'Worldwide'}
                          teamsCount={this.state.leagues[e].length}
                          horizontal={false}
                          darkBackground={true}
                        />
                      );
                    })}
                </div>
                <button
                  className='left'
                  onClick={() => {
                    const { current } = this.leaguesSlideshow;
                    current.scrollTo(current.scrollLeft - 15 * 16, 0);
                  }}
                >
                  <i className='fas fa-chevron-left'></i>
                </button>
                <button
                  className='right'
                  onClick={() => {
                    const { current } = this.leaguesSlideshow;
                    current.scrollTo(current.scrollLeft + 15 * 16, 0);
                  }}
                >
                  <i className='fas fa-chevron-right'></i>
                </button>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
        {this.state.top25Teams ? <ExampleGames games={this.state.top25Teams} /> : null}
        <div className='homepage-box-section grid-list column guess-by less-padding no-margin'>
          <ResponsiveContainer>
            <div className='inner'>
              <h1>Guess By More Than Just Nationality</h1>
              <p>For each player, a random guess factor will be chosen from our list, depending on the selected difficulty.</p>
              <div className='grid'>
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M13.144 8.171c-.035-.066.342-.102.409-.102.074.009-.196.452-.409.102zm-2.152-3.072l.108-.031c.064.055-.072.095-.051.136.086.155.021.248.008.332-.014.085-.104.048-.149.093-.053.066.258.075.262.085.011.033-.375.089-.304.171.096.136.824-.195.708-.176.225-.113.029-.125-.097-.19-.043-.215-.079-.547-.213-.68l.088-.102c-.206-.299-.36.362-.36.362zm13.008 6.901c0 6.627-5.373 12-12 12-6.628 0-12-5.373-12-12s5.372-12 12-12c6.627 0 12 5.373 12 12zm-8.31-5.371c-.006-.146-.19-.284-.382-.031-.135.174-.111.439-.184.557-.104.175.567.339.567.174.025-.277.732-.063.87-.025.248.069.643-.226.211-.381-.355-.13-.542-.269-.574-.523 0 0 .188-.176.106-.166-.218.027-.614.786-.614.395zm6.296 5.371c0-1.035-.177-2.08-.357-2.632-.058-.174-.189-.312-.359-.378-.256-.1-1.337.597-1.5.254-.107-.229-.324.146-.572.008-.12-.066-.454-.515-.605-.46-.309.111.474.964.688 1.076.201-.152.852-.465.992-.038.268.804-.737 1.685-1.251 2.149-.768.694-.624-.449-1.147-.852-.275-.211-.272-.66-.55-.815-.124-.07-.693-.725-.688-.813l-.017.166c-.094.071-.294-.268-.315-.321 0 .295.48.765.639 1.001.271.405.416.995.748 1.326.178.178.858.914 1.035.898.193-.017.803-.458.911-.433.644.152-1.516 3.205-1.721 3.583-.169.317.138 1.101.113 1.476-.029.433-.37.573-.693.809-.346.253-.265.745-.556.925-.517.318-.889 1.353-1.623 1.348-.216-.001-1.14.36-1.261.007-.094-.256-.22-.45-.353-.703-.13-.248-.015-.505-.173-.724-.109-.152-.475-.497-.508-.677-.002-.155.117-.626.28-.708.229-.117.044-.458.016-.656-.048-.354-.267-.646-.53-.851-.389-.299-.188-.537-.097-.964 0-.204-.124-.472-.398-.392-.564.164-.393-.44-.804-.413-.296.021-.538.209-.813.292-.346.104-.7-.082-1.042-.125-1.407-.178-1.866-1.786-1.499-2.946.037-.19-.114-.542-.048-.689.158-.352.48-.747.762-1.014.158-.15.361-.112.547-.229.287-.181.291-.553.572-.781.4-.325.946-.318 1.468-.388.278-.037 1.336-.266 1.503-.06 0 .038.191.604-.019.572.433.023 1.05.749 1.461.579.211-.088.134-.736.567-.423.262.188 1.436.272 1.68.069.15-.124.234-.93.052-1.021.116.115-.611.124-.679.098-.12-.044-.232.114-.425.025.116.055-.646-.354-.218-.667-.179.131-.346-.037-.539.107-.133.108.062.18-.128.274-.302.153-.53-.525-.644-.602-.116-.076-1.014-.706-.77-.295l.789.785c-.039.025-.207-.286-.207-.059.053-.135.02.579-.104.347-.055-.089.09-.139.006-.268 0-.085-.228-.168-.272-.226-.125-.155-.457-.497-.637-.579-.05-.023-.764.087-.824.11-.07.098-.13.201-.179.311-.148.055-.287.126-.419.214l-.157.353c-.068.061-.765.291-.769.3.029-.075-.487-.171-.453-.321.038-.165.213-.68.168-.868-.048-.197 1.074.284 1.146-.235.029-.225.046-.487-.313-.525.068.008.695-.246.799-.36.146-.168.481-.442.724-.442.284 0 .223-.413.354-.615.131.053-.07.376.087.507-.01-.103.445.057.489.033.104-.054.684-.022.594-.294-.1-.277.051-.195.181-.253-.022.009.34-.619.402-.413-.043-.212-.421.074-.553.063-.305-.024-.176-.52-.061-.665.089-.115-.243-.256-.247-.036-.006.329-.312.627-.241 1.064.108.659-.735-.159-.809-.114-.28.17-.509-.214-.364-.444.148-.235.505-.224.652-.476.104-.178.225-.385.385-.52.535-.449.683-.09 1.216-.041.521.048.176.124.104.324-.069.19.286.258.409.099.07-.092.229-.323.298-.494.089-.222.901-.197.334-.536-.374-.223-2.004-.672-3.096-.672-.236 0-.401.263-.581.412-.356.295-1.268.874-1.775.698-.519-.179-1.63.66-1.808.666-.065.004.004-.634.358-.681-.153.023 1.247-.707 1.209-.859-.046-.18-2.799.822-2.676 1.023.059.092.299.092-.016.294-.18.109-.372.801-.541.801-.505.221-.537-.435-1.099.409l-.894.36c-1.328 1.411-2.247 3.198-2.58 5.183-.013.079.334.226.379.28.112.134.112.712.167.901.138.478.479.744.74 1.179.154.259.41.914.329 1.186.108-.178 1.07.815 1.246 1.022.414.487.733 1.077.061 1.559-.217.156.33 1.129.048 1.368l-.361.093c-.356.219-.195.756.021.982 1.818 1.901 4.38 3.087 7.22 3.087 5.517 0 9.989-4.472 9.989-9.989zm-11.507-6.357c.125-.055.293-.053.311-.22.015-.148.044-.046.08-.1.035-.053-.067-.138-.11-.146-.064-.014-.108.069-.149.104l-.072.019-.068.087.008.048-.087.106c-.085.084.002.139.087.102z' />
                  </svg>
                  <p>Player Nationality</p>
                </div>
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z' />
                  </svg>
                  <p>Player Initials</p>
                </div>
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M17 3v-2c0-.552.447-1 1-1s1 .448 1 1v2c0 .552-.447 1-1 1s-1-.448-1-1zm-12 1c.553 0 1-.448 1-1v-2c0-.552-.447-1-1-1-.553 0-1 .448-1 1v2c0 .552.447 1 1 1zm13 13v-3h-1v4h3v-1h-2zm-5 .5c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5-4.5 2.019-4.5 4.5zm11 0c0 3.59-2.91 6.5-6.5 6.5s-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5zm-14.237 3.5h-7.763v-13h19v1.763c.727.33 1.399.757 2 1.268v-9.031h-3v1c0 1.316-1.278 2.339-2.658 1.894-.831-.268-1.342-1.111-1.342-1.984v-.91h-9v1c0 1.316-1.278 2.339-2.658 1.894-.831-.268-1.342-1.111-1.342-1.984v-.91h-3v21h11.031c-.511-.601-.938-1.273-1.268-2z' />
                  </svg>
                  <p>Player Age</p>
                </div>
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z' />
                  </svg>
                  <p>Player FIFA OVR</p>
                </div>
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M7 11v13h2v-5h2v3h2v-7h2v9h2v-13h6l-11-11-11 11z' />
                  </svg>
                  <p>Player FIFA Potential</p>
                </div>
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.947v1.053h-1v-.998c-1.035-.018-2.106-.265-3-.727l.455-1.644c.956.371 2.229.765 3.225.54 1.149-.26 1.384-1.442.114-2.011-.931-.434-3.778-.805-3.778-3.243 0-1.363 1.039-2.583 2.984-2.85v-1.067h1v1.018c.724.019 1.536.145 2.442.42l-.362 1.647c-.768-.27-1.617-.515-2.443-.465-1.489.087-1.62 1.376-.581 1.916 1.712.805 3.944 1.402 3.944 3.547.002 1.718-1.343 2.632-3 2.864z' />
                  </svg>
                  <p>Team Transfer Budget</p>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
        <div style={{ backgroundColor: 'var(--darker)', paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
          <ResponsiveContainer>
            <div className='homepage-box-section left-first no-margin'>
              <img className='homepage-top-right-boxes' src={topRightBoxes} alt='Boxes' />
              <div className='left club-logos'>
                <div className='inner'>
                  {this.state.top25Teams.slice(0, 18).map((e, i) => (
                    <div className='image-container' key={i}>
                      <img src={e.logoURL} alt={`Club Logo`} />
                    </div>
                  ))}
                </div>
                <p className='and-more'>and many more...</p>
              </div>
              <div className='right'>
                <h1 className='main-header'>Guess from the world's biggest teams, and your favorite local clubs too</h1>
                <p className='main-description'>
                  Our database of over 200 squads includes the world's most famous teams and squads, as well as local clubs and lower divisions.
                </p>
                <Link to='/play'>
                  <PlayButton
                    className='secondary'
                    name={`Play ${siteTitle} Now`}
                    icon={<i className='fas fa-play' style={{ transform: 'translateY(3px)' }}></i>}
                    description={<>Test your knowledge of the beautiful game now.</>}
                  />
                </Link>
              </div>
            </div>
            <div className='homepage-box-section-separator'></div>
            <div className='homepage-box-section right-first no-margin' style={{ marginTop: '1rem' }}>
              <img className='homepage-top-left-boxes' src={topLeftBoxes} alt='Boxes' />
              <div className='right'>
                <h1 className='main-header'>Compete against your friends on the public leaderboard</h1>
                <p className='main-description'>
                  Players that have signed up with the highest ratings can appear on our public leaderboard of top players.
                </p>
                <Link to='/leaderboard'>
                  <PlayButton
                    className='secondary'
                    icon={<i className='fas fa-trophy' style={{ transform: 'translateY(3px)' }}></i>}
                    name='Check Out The Leaderboard'
                    description={<>See a list of the top {siteTitle} players.</>}
                  />
                </Link>
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

            <div className='homepage-box-section-separator'></div>
            {Object.keys(this.props.user).length === 0 ? (
              <div className='homepage-box-section no-margin column bottom'>
                <h1 className='main-header'>
                  Want to <span>compete</span> with other players, save your <span>progress</span>, see your <span>stats</span>, and more?
                </h1>
                <div className='row'>
                  <PlayButton
                    className='secondary'
                    name='Sign In'
                    icon={<i className='fas fa-sign-in-alt'></i>}
                    description={<>Already have an account? Sign In.</>}
                    onClick={() => this.props.setAuthModal(true, true)}
                  />
                  <PlayButton
                    className='secondary'
                    name='Sign Up'
                    icon={<i className='fas fa-user-plus'></i>}
                    description={<>Don't have an account yet? Sign Up.</>}
                    onClick={() => this.props.setAuthModal(true, false)}
                  />
                </div>
              </div>
            ) : null}
            <div className='homepage-box-section-separator'></div>
            <EmailBox noMargin={true} />
            <div className='homepage-box-section-separator'></div>
            <div className='homepage-box-section right-first no-margin database-section' style={{ marginTop: '1rem' }}>
              <img className='homepage-top-left-boxes' src={topLeftBoxes} alt='Boxes' />
              <div className='right'>
                <h1 className='main-header'>Check out our full database of squads, all for free</h1>
                <p className='main-description'>We have thousands of players and hundreds of squads in our database, updated daily.</p>
                <Link to='/database'>
                  <PlayButton
                    className='secondary'
                    icon={<i className='fas fa-database'></i>}
                    name='View The Squads Database'
                    description={<>See our database of thousands of players and squads.</>}
                  />
                </Link>
              </div>
              <div className='left'>
                <div className='inner'>
                  {this.state.top25Teams.slice(0, 18).map((e, i) => (
                    <div className='image-container' key={i}>
                      <img src={e.formation[6].photoURL} alt={e.formation[0].name} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='homepage-box-section-separator'></div>
            <div className='homepage-box-section no-margin column bottom'>
              <h1 className='main-header'>Want To Learn More About {siteTitle}?</h1>
              <div className='row'>
                <PlayButton
                  className='secondary'
                  name='Instructions'
                  icon={<i className='fas fa-question-circle'></i>}
                  description={<>A page to learn how to play {siteTitle}</>}
                  onClick={() => window.location.assign('/instructions')}
                />
                <PlayButton
                  className='secondary'
                  name='About'
                  icon={<i className='fas fa-info-circle'></i>}
                  description={<>Read about {siteTitle}.</>}
                  onClick={() => window.location.assign('/about')}
                />
                <PlayButton
                  className='secondary'
                  name='Our Team'
                  icon={<i className='fas fa-user'></i>}
                  description={<>Learn more about who is behind this site.</>}
                  onClick={() => window.location.assign('/team')}
                />
              </div>
            </div>
            <div className='homepage-box-section-separator'></div>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
