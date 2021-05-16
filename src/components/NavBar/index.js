import { Component, createRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Loading, PrimaryButton, ResponsiveContainer, SecondaryButton, FloatingMenu } from '../';
import { siteTitle } from '../../lib/config';
import './styles.css';

const remToPx = (rem) => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
const navWidthRem = 17.5;
const navWidthPx = remToPx(navWidthRem);
const outsideSidebar = (e) => {
  return e.clientX < window.innerWidth - navWidthPx;
};
const infoButtonsBeforeDropdownCount = 0;

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolling: false,
      mobile: false,
      menuOpen: false,
      menuBtnBeenClicked: false,
      menuDragging: false,
      menuDragStart: -1,
      menuStartPosition: 0,
      menuPosition: 0,
      moreDropdownOpen: undefined,
    };

    this.updateScrolling = this.updateScrolling.bind(this);
    this.mouseClick = this.mouseClick.bind(this);
    this.checkMobile = this.checkMobile.bind(this);

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);

    this.moreButtonRef = createRef();
  }
  mouseDown(e) {
    if (e.changedTouches) e = e.changedTouches[0];
    if (outsideSidebar(e)) {
      this.setState({ menuDragging: true, menuDragStart: e.clientX, menuStartPosition: this.state.menuPosition });
    }
  }
  mouseMove(e) {
    if (e.changedTouches) e = e.changedTouches[0];
    if (this.state.menuDragging) {
      this.setState({ menuPosition: this.state.menuStartPosition + e.clientX - this.state.menuDragStart });
    }
  }
  mouseUp() {
    this.setState({ menuDragging: false });
    if (this.state.menuPosition > navWidthPx * 0.25) {
      this.setState({ menuPosition: 0, menuOpen: false });
    } else {
      this.setState({ menuPosition: 0 });
    }
  }
  mouseClick(e) {
    if (outsideSidebar(e)) {
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
    const newState = window.innerWidth < 1150;
    if (this.state.mobile !== newState) {
      this.setState({ mobile: newState });
    }
  }
  componentDidMount() {
    this.updateScrolling();
    this.checkMobile();

    window.addEventListener('scroll', this.updateScrolling);
    window.addEventListener('resize', this.checkMobile);
    document.addEventListener('click', this.mouseClick);

    document.addEventListener('mousedown', this.mouseDown);
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);

    document.addEventListener('touchstart', this.mouseDown);
    document.addEventListener('touchmove', this.mouseMove);
    document.addEventListener('touchend', this.mouseUp);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.updateScrolling);
    window.removeEventListener('resize', this.checkMobile);
    document.removeEventListener('click', this.mouseClick);
    document.removeEventListener('click', this.mouseClick);
  }
  render() {
    const { pages, user } = this.props;
    const homePage = pages.filter((e) => e.isHomepage)[0];
    const mainButtonColor = 'var(--primary)';
    const closeMenu = () => this.setState({ menuOpen: false });

    const userIcon = (
      <i
        className='fas fa-user-circle'
        style={{
          display: 'inline-block',
          transform: 'scale(1.15)',
          marginRight: '.25rem',
        }}
      ></i>
    );
    const userLoadingSpinner = (
      <Loading
        style={{
          '--border-color': 'var(--primary)',
          height: '1.15rem',
          width: '1.15rem',
          borderWidth: '.15rem',
          display: 'block',
          float: 'left',
        }}
      />
    );
    const logoButton = (
      <NavLink onClick={() => closeMenu()} to='/' exact={homePage.useExactURLMatching} activeClassName='active'>
        <PrimaryButton isNotButton icon={homePage.icon} text={siteTitle} color='transparent' className='logo'></PrimaryButton>
      </NavLink>
    );
    const infoPages = pages.filter((e) => e.type && e.type === 'info');
    const getInfoButton = (e) => (
      <NavLink onClick={() => closeMenu()} key={e.name} exact={e.useExactURLMatching} to={`/${e.code}`} activeClassName='active'>
        <SecondaryButton isNotButton text={e.name} className='light with-margin infobutton' color={mainButtonColor}></SecondaryButton>
      </NavLink>
    );
    const infoButtonsMobile = infoPages.map((e) => getInfoButton(e));
    // all secondary buttons for mobile; add the 'More' dropdown on non-mobile
    const infoButtons = (
      <>
        {infoPages.slice(0, infoButtonsBeforeDropdownCount).map((e) => getInfoButton(e))}
        <div ref={this.moreButtonRef}>
          <SecondaryButton
            isNotButton
            text={
              <>
                More{' '}
                <i
                  style={{
                    transition: 'transform .2s',
                    transform: `scale(.8) ${this.state.moreDropdownOpen ? 'rotate(180deg)' : ''}`,
                    display: 'inline-block',
                  }}
                  className='fas fa-chevron-down'
                ></i>
              </>
            }
            className='light with-margin infobutton'
            color={mainButtonColor}
            onClick={() => this.setState({ moreDropdownOpen: !this.state.moreDropdownOpen })}
          ></SecondaryButton>
        </div>
        <FloatingMenu
          open={this.state.moreDropdownOpen}
          setOpen={(open) => this.setState({ moreDropdownOpen: open })}
          openButtonRef={this.moreButtonRef}
          links={infoPages.slice(infoButtonsBeforeDropdownCount).map((e) => {
            return { ...e, href: `/${e.code}` };
          })}
        ></FloatingMenu>
      </>
    );

    const mainButtons = pages
      .filter((e) => !e.isHomepage && !(e.type && e.type === 'info'))
      .map((e, i) => (
        <NavLink onClick={() => closeMenu()} key={e.name} exact={e.useExactURLMatching} to={`/${e.code}`} activeClassName='active'>
          <PrimaryButton
            lightIcon
            isNotButton
            icon={e.icon}
            text={e.name}
            className={`${this.state.mobile ? 'fixed-icon-width' : ''}`}
            color={mainButtonColor}
          ></PrimaryButton>
        </NavLink>
      ));
    const authArea = (
      <div className='auth-area'>
        <div className='auth-buttons'>
          {Object.keys(user).length === 0 ? (
            <>
              <button className='signin' onClick={() => this.props.setAuthModal(true, true)}>
                Sign In
              </button>
              <span className='separator'>/</span>
              <button className='signup' onClick={() => this.props.setAuthModal(true, false)}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button className='user-info' style={user.currentlyLoading ? { opacity: 1 } : {}} onClick={() => this.props.setProfileModal(true)}>
                {user.currentlyLoading ? (
                  <>{userLoadingSpinner}</>
                ) : (
                  <>
                    {userIcon} <span className='username'>({user.rating ? user.rating : '0'})</span>
                  </>
                )}
              </button>
              <span className='separator'>/</span>
              <button
                className='signout'
                onClick={() => {
                  localStorage.removeItem('authtoken');
                  window.location.reload();
                }}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    );

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
                {this.state.menuOpen ? <style>{`body{overflow:hidden;}`}</style> : null}
                <div
                  style={
                    this.state.menuOpen
                      ? {
                          transform: `translateX(${Math.max(0, this.state.menuPosition)}px)`,
                        }
                      : {}
                  }
                  className={`navbar-sidebar ${this.state.menuOpen && this.state.menuDragging ? 'dragging' : ''} ${
                    this.state.menuOpen ? 'open' : 'closed'
                  }`}
                >
                  {authArea}
                  <div className='spacer'></div>
                  {mainButtons}
                  <div className='spacer'></div>
                  {infoButtonsMobile}
                </div>
              </>
            ) : (
              <div className='navbar'>
                <div className='left'>
                  {logoButton}
                  {infoButtons}
                </div>
                <div className='right'>
                  {mainButtons}
                  {authArea}
                </div>
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
