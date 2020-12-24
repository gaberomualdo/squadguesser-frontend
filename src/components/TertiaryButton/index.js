import './styles.css';
import React from 'react';

export default function TertiaryButton(props) {
  const { className, text, ...otherProps } = props;
  return (
    <a {...otherProps} className={`tertiarybutton ${className}`} role='button'>
      {text}
    </a>
  );
}
