import './styles.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import React, { useState } from 'react';
import { siteTitle } from '../../lib/config';
import getShareURL from '../../lib/getShareURL';

function SmallShareButton(props) {
  return (
    <a target='_blank' rel='noopener noreferrer' href={getShareURL(props.name, props.shareURLOptions)} style={{ '--bg': props.bg }}>
      <i className={`${props.notBrandIcon ? 'fas' : 'fab'} fa-${props.iconName}`}></i>
      <p>
        <span>{props.name}</span>
        <i className='fas fa-share'></i>
      </p>
    </a>
  );
}

export default function ShareBox(props) {
  const [copiedShareURL, setCopiedShareURL] = useState(false);

  const getShareTextPrefix = () => {
    return `${props.shareTextPrefix || `Check out this game from ${siteTitle}`}`;
  };
  const getShareText = () => {
    return `${getShareTextPrefix()}: ${getShareURL()}.`;
  };

  const getShareURL = () => {
    return window.location.href;
  };

  const shareURLOptions = {
    text: getShareText(),
    title: getShareTextPrefix(),
    url: getShareURL(),
  };

  return (
    <div className='share-box-component'>
      <h1 className='details-title'>
        <i className='fas fa-share-alt mr'></i>Share This Game
      </h1>
      <div className='section'>
        <div className='input-container'>
          <input
            type='text'
            onClick={(e) => {
              e.target.setSelectionRange(0, e.target.value.length);
            }}
            value={getShareURL()}
            onInput={(e) => e.preventDefault()}
          />
          <CopyToClipboard
            text={getShareURL()}
            onCopy={() => {
              setCopiedShareURL(true);
              setTimeout(() => {
                setCopiedShareURL(false);
              }, 750);
            }}
          >
            <button className={`copy ${copiedShareURL ? 'copied' : ''}`}>
              {copiedShareURL ? (
                <>
                  <i className='fas fa-thumbs-up'></i> <span>Copied!</span>
                </>
              ) : (
                <>
                  <i className='fas fa-copy'></i> <span>Copy URL</span>
                </>
              )}
            </button>
          </CopyToClipboard>
        </div>
        <div className='grid'>
          <SmallShareButton name='twitter' bg='#00aced' iconName='twitter' shareURLOptions={shareURLOptions} />
          <SmallShareButton name='email' bg='var(--lighterdark-1)' iconName='envelope' notBrandIcon shareURLOptions={shareURLOptions} />
          <SmallShareButton name='facebook' bg='#3b5998' iconName='facebook-f' shareURLOptions={shareURLOptions} />
          <SmallShareButton name='whatsapp' bg='#25D366' iconName='whatsapp' shareURLOptions={shareURLOptions} />
          <SmallShareButton name='reddit' bg='#FF4500' iconName='reddit-alien' shareURLOptions={shareURLOptions} />
          <SmallShareButton name='telegram' bg='#49a9e9' iconName='telegram-plane' shareURLOptions={shareURLOptions} />
        </div>
      </div>
    </div>
  );
}
