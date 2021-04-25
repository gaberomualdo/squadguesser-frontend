import './styles.css';
import React from 'react';

export default function PageHeader(props) {
  return (
    <div class='page-header-component'>
      <h1 className='title'>{props.title}</h1>
      <p className='description'>{props.description}</p>
    </div>
  );
}
