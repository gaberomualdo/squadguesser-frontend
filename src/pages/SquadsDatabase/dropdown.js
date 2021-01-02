import React, { Component } from 'react';

const plusIcon = (
  <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
    <path d='M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z' />
  </svg>
);

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      contentsHeightPixels: 0,
    };
    this.dropdownContents = React.createRef();
  }
  render() {
    return (
      <div className={`dropdown-container ${this.state.open ? 'open' : 'closed'}`}>
        <div
          className='dropdown-header'
          onClick={() => {
            this.setState({ open: !this.state.open, contentsHeightPixels: this.dropdownContents.current.scrollHeight });
          }}
        >
          <div className='dropdown-title'>
            <div className='left'>
              {this.props.snippetTeams.map((team, teamIdx) => (
                <img key={teamIdx} src={team.logoURL} alt={team.name} />
              ))}
            </div>
            <div className='right'>
              <p className='name'>{this.props.header.name}</p>
              <p className='description'>{this.props.header.description}</p>
            </div>
          </div>
          <div className='dropdown-icon'>{plusIcon}</div>
        </div>
        <div className='dropdown-contents' style={{ '--current-height': `${this.state.contentsHeightPixels}px` }} ref={this.dropdownContents}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
