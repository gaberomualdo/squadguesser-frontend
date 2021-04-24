import './styles.css';
import React from 'react';

export default function SecondaryButton(props) {
  const { className, color, style, text, isNotButton, ...otherProps } = props;
  const classNameProp = `secondarybutton ${className}`;
  const styleProp = { ...{ '--button-theme-color': color ? color : 'var(--primary)' }, ...style };
  if (isNotButton) {
    return (
      <div {...otherProps} className={classNameProp} style={styleProp}>
        <span>{text}</span>
      </div>
    );
  } else {
    return (
      <button {...otherProps} className={classNameProp} style={styleProp}>
        <span>{text}</span>
      </button>
    );
  }
}
