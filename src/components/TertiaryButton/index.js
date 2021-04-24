import './styles.css';
import React from 'react';

export default function TertiaryButton(props) {
  const { className, text, isNotButton, ...otherProps } = props;
  if (isNotButton) {
    return (
      <div {...otherProps} className={`tertiarybutton ${className}`}>
        {text}
      </div>
    );
  } else {
    return (
      <button {...otherProps} className={`tertiarybutton ${className}`}>
        {text}
      </button>
    );
  }
}
