import './styles.css';
import React from 'react';

export default function PrimaryButton(props) {
  const { icon, text, isNotButton, className, color, style, ...otherProps } = props;
  const inner = (
    <>
      {icon ? (
        <>
          <span className='icon'>{icon}</span>
        </>
      ) : null}
      <span className='text'>{text}</span>
    </>
  );
  if (isNotButton) {
    return (
      <div {...otherProps} className={`primarybutton ${className}`} style={{ '--button-theme-color': color ? color : 'var(--primary)', ...style }}>
        {inner}
      </div>
    );
  } else {
    return (
      <button {...otherProps} className={`primarybutton ${className}`} style={{ '--button-theme-color': color ? color : 'var(--primary)', ...style }}>
        {inner}
      </button>
    );
  }
}
