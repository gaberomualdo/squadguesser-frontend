import './styles.css';
import React from 'react';
import PageHeader from '../PageHeader';

export default function ContentfulPage(props) {
  const { className, title, description, ...otherProps } = props;
  return (
    <div className='contentful-page-outer'>
      <div className='page panel contentful-page-inner'>
        <PageHeader title={title} description={description} />
        <div className={`content ${className}`} {...otherProps}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
