import './styles.css';
import { Component } from 'react';
import { ResponsiveContainer, PrimaryButton, SecondaryButton } from '../';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { scrolling: false, mobile: false, menuOpen: false, menuBtnBeenClicked: false };

    this.updateScrolling = this.updateScrolling.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.checkMobile = this.checkMobile.bind(this);
  }
  mouseDown(e) {
    const navWidth = 15 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (e.clientX < window.innerWidth - navWidth) {
      this.setState({ menuOpen: false });
    }
  }
  updateScrolling() {
    const newState = window.pageYOffset > 0;
    if (this.state.scrolling !== newState) {
      this.setState({ scrolling: newState });
    }
  }
  checkMobile() {
    const newState = window.innerWidth < 975;
    if (this.state.mobile !== newState) {
      this.setState({ mobile: newState });
    }
  }
  componentDidMount() {
    this.updateScrolling();
    this.checkMobile();

    window.addEventListener('scroll', this.updateScrolling);
    window.addEventListener('resize', this.checkMobile);
    document.addEventListener('mousedown', this.mouseDown);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateScrolling);
    window.removeEventListener('resize', this.checkMobile);
    document.removeEventListener('mousedown', this.mouseDown);
  }
  render() {
    const { pages, active, setPage } = this.props;
    const homePage = pages.filter((e) => e.isHomepage)[0];

    const mainButtonColor = 'var(--primary)';

    const openPage = (p) => {
      this.setState({ menuOpen: false });
      setPage(p);
    };

    const logoButton = (
      <PrimaryButton
        icon={homePage.icon}
        text={'SquadGuessr'}
        className={`logo ${active === homePage.code ? 'active' : ''}`}
        onClick={() => openPage(homePage.code)}
        color={mainButtonColor}
      ></PrimaryButton>
    );
    const infoButtons = pages
      .filter((e) => e.type && e.type === 'info')
      .map((e, i) => (
        <SecondaryButton
          key={i}
          icon={e.icon}
          text={e.name}
          className={`${active === e.code ? 'active' : ''} light with-margin infobutton`}
          color={mainButtonColor}
          onClick={() => openPage(e.code)}
        ></SecondaryButton>
      ));
    const mainButtons = pages
      .filter((e) => !e.isHomepage && !(e.type && e.type === 'info'))
      .map((e, i) => (
        <PrimaryButton
          key={i}
          icon={e.icon}
          text={e.name}
          className={active === e.code ? 'active' : ''}
          color={mainButtonColor}
          onClick={() => openPage(e.code)}
        ></PrimaryButton>
      ));

    return (
      <>
        <div className={`navbar-container ${this.state.scrolling ? 'scrolling' : ''} ${this.state.mobile ? 'mobile' : ''}`}>
          <ResponsiveContainer>
            {this.state.mobile ? (
              <>
                <div className='navbar'>
                  {logoButton}
                  <button className='menu-button' onClick={() => this.setState({ menuOpen: !this.state.menuOpen, menuBtnBeenClicked: true })}>
                    {this.state.menuOpen ? (
                      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                        <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z' />
                      </svg>
                    ) : (
                      <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                        <path d='M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z' />
                      </svg>
                    )}
                  </button>
                </div>
                <div className={`navbar-sidebar ${this.state.menuOpen ? 'open' : 'closed'}`}>
                  {infoButtons}
                  <div className='spacer'></div>
                  {mainButtons}
                </div>
              </>
            ) : (
              <div className='navbar'>
                <div className='left'>
                  {logoButton}
                  {infoButtons}
                </div>
                <div className='right'>{mainButtons}</div>
              </div>
            )}
          </ResponsiveContainer>
        </div>
        <div
          className={`navbar-overlay ${this.state.menuBtnBeenClicked ? (this.state.mobile && this.state.menuOpen ? 'displayed' : 'hidden') : ''}`}
        ></div>
      </>
    );
  }
}
export default NavBar;
