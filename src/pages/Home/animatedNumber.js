import React, { Component } from 'react';
import commaNumber from 'comma-number';

const frames = 30;
const animationTimeMS = 750;

export default class AnimatedNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentFrame: 0,
      updateNumberInterval: undefined,
    };
    this.updateNumberInterval = this.updateNumberInterval.bind(this);
  }
  updateNumberInterval() {
    if (this.state.currentFrame === frames) {
      clearInterval(this.state.updateNumberInterval);
    } else {
      this.setState({ currentFrame: this.state.currentFrame + 1 });
    }
  }
  componentDidMount() {
    this.setState({ updateNumberInterval: setInterval(this.updateNumberInterval, animationTimeMS / frames) });
  }
  render() {
    let divisorLetters = {
      1: '',
      1000000: 'M',
    };
    const getFinalNumber = (n) => {
      if (n > 1000) {
        return 1000 * Math.floor(n / 1000);
      } else if (n > 100) {
        return 100 * Math.floor(n / 100);
      }
      return n;
    };

    const increasePerFrame = (getFinalNumber(this.props.number) || 0) / frames; // default number is 0 if provided number prop is bad
    let currentNumber = increasePerFrame * this.state.currentFrame;
    let divisor = 1; // by default display the number without a shortened letter like K or M
    let usePlus = true; // add a '+' at the end
    if (currentNumber > 1000000) {
      divisor = 1000000;
    } else if (getFinalNumber(this.props.number) !== this.props.number) {
    } else {
      usePlus = false;
    }
    return (
      <>
        {commaNumber(Math.floor(currentNumber / divisor))}
        {divisorLetters[divisor]}
        {usePlus ? '+' : ''}
      </>
    );
  }
}
