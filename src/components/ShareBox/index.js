import './styles.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import React, { useState } from 'react';

export default function ShareBox() {
  const [copiedShareURL, setCopiedShareURL] = useState(false);

  const getShareURL = () => {
    return window.location.href;
  };

  return (
    <div className='share-box-component'>
      <h1 className='details-title'>
        <i className='fas fa-share-alt mr'></i>Share Game
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
          <button style={{ '--bg': '#00aced' }}>
            <i className='fab fa-twitter'></i>
            <p>
              <span>Twitter</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
          <button style={{ '--bg': 'var(--lighterdark-1)' }}>
            <i className='fas fa-envelope'></i>
            <p>
              <span>Email</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
          <button style={{ '--bg': '#3b5998' }}>
            <i className='fab fa-facebook-f'></i>
            <p>
              <span>Facebook</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
          <button style={{ '--bg': '#25D366' }}>
            <i className='fab fa-whatsapp'></i>
            <p>
              <span>WhatsApp</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
          <button style={{ '--bg': '#FF4500' }}>
            <i className='fab fa-reddit-alien'></i>
            <p>
              <span>Reddit</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
          <button style={{ '--bg': '#49a9e9' }}>
            <i className='fab fa-telegram-plane'></i>
            <p>
              <span>Telegram</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
          <button style={{ '--bg': '#45668e' }}>
            <i className='fab fa-vk'></i>
            <p>
              <span>VK</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
          <button style={{ '--bg': '#00c80f' }}>
            <i className='fab fa-weixin'></i>
            <p>
              <span>WeChat</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
          <button style={{ '--bg': '#2c4762' }}>
            <i className='fab fa-tumblr'></i>
            <p>
              <span>Tumblr</span>
              <i className='fas fa-share'></i>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
