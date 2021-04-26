import './styles.css';
import { siteTitle } from '../../lib/config';
import React, { useState } from 'react';
import { ShareBox, Modal } from '..';

export default function ShareButton() {
  const [shareBoxOpen, setShareBoxOpen] = useState(false);
  return (
    <>
      <button
        className={`share-button-component ${navigator.share ? 'navigator-share-enabled' : ''}`}
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: `${siteTitle} Game`,
              text: `Play this game on ${siteTitle}!`,
              url: window.location.href,
            });
          } else {
            setShareBoxOpen(true);
          }
        }}
      >
        <i className='fas fa-share-alt'></i>
      </button>
      {shareBoxOpen ? (
        <Modal className='share-button-component-modal' closeModal={() => setShareBoxOpen(false)}>
          <ShareBox />
        </Modal>
      ) : null}
    </>
  );
}
