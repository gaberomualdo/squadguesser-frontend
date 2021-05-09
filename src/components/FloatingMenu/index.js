import './styles.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class FloatingMenu extends Component {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
    this.onMouseDown = this.onMouseDown.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
  }
  onMouseDown(e) {
    let elm = e.target;
    let clickedOutsideMenu = true;
    while (elm.parentElement) {
      if (elm === this.menuRef.current || elm === this.props.openButtonRef.current) clickedOutsideMenu = false;
      elm = elm.parentElement;
    }
    if (clickedOutsideMenu) {
      this.props.setOpen(false);
    }
  }
  render() {
    if (!this.props.openButtonRef.current) {
      return <></>;
    }
    const openButtonPosition = this.props.openButtonRef.current.getBoundingClientRect();
    return (
      <div
        ref={this.menuRef}
        className={`floating-menu-component ${this.props.open ? 'open' : 'closed'} ${this.props.noAnimation ? 'no-animation' : ''}`}
        style={{
          top: `${openButtonPosition.bottom + 10}px`,
          left: `${(openButtonPosition.left + openButtonPosition.right) / 2}px`,
        }}
      >
        {this.props.links.map((e, i) => (
          <Link key={i} className='link' to={e.href} onClick={() => this.props.setOpen(false)}>
            <div className='icon'>{e.icon}</div>
            <div className='content'>
              <h1>{e.name}</h1>
              <p>{e.description}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}
