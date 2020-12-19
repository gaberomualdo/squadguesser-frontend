import './styles.css';
import React from 'react';

export default function TertiaryButton(props) {
  const { className, text, ...otherProps } = props;
  return (
    <button {...otherProps} className={`tertiarybutton ${className}`}>
      {text}
    </button>
  );
}
