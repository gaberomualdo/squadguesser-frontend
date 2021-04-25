import './styles.css';
import React from 'react';

export default function LinedHeader(props) {
  const { backgroundColor, text, ...otherProps } = props;
  return (
    <h2 className='lined-header-component' {...otherProps}>
      <span style={{ backgroundColor: backgroundColor || 'var(--dark)' }}>{text}</span>
    </h2>
  );
}
