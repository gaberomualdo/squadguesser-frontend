import './styles.css';
import { TertiaryButton } from '../../components';
import React, { useState } from 'react';

export default function AuthModal(props) {
  const [showSignIn, setShowSignIn] = useState(props.signIn);
  const [slide, setSlide] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const usernameLabel = `${showSignIn ? '' : 'Choose a '}Username:`;
  const passwordLabel = `${showSignIn ? '' : 'Choose a '}Password:`;

  const nextBtnDisabled = !(slide === 0 ? username.length > 0 : password.length > 0);

  return (
    <>
      <style>{`body{overflow:hidden;}`}</style>
      <div className='auth-modal-component'>
        <div className='inner'>
          <button className='close' aria-label='Close Authentication Modal' onClick={() => props.setAuthModal(false)}>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
              <path d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z' />
            </svg>
          </button>
          <h1>{showSignIn ? 'Sign In' : 'Sign Up'}</h1>
          <p>
            Or{' '}
            <button
              onClick={() => {
                setShowSignIn(!showSignIn);
                setSlide(0);
              }}
            >
              {showSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
          <form className='form' slide={slide}>
            <div className='input-container username'>
              <input
                type='text'
                placeholder={usernameLabel}
                name='username'
                spellCheck={false}
                pattern='^[a-zA-Z0-9_.-]*$'
                {...(showSignIn ? { autoComplete: 'username' } : {})}
                onChange={(evt) => setUsername(evt.target.value)}
              />
              <label htmlFor='username'>{usernameLabel}</label>
            </div>
            <div className='input-container password'>
              <input
                type='password'
                onChange={(evt) => setPassword(evt.target.value)}
                placeholder={passwordLabel}
                name='password'
                autoComplete={showSignIn ? 'current-password' : 'new-password'}
              />
              <label htmlFor='password'>{passwordLabel}</label>
            </div>
            {error.length > 0 ? <p className='error'>{error}</p> : null}
            <div className='slides-btn-container'>
              {slide > 0 ? (
                <TertiaryButton className='back-btn light' type='button' onClick={() => setSlide(slide - 1)} text={<>&larr;&nbsp; Back</>} />
              ) : null}
              <TertiaryButton
                className='next-btn'
                type={slide === 0 ? 'button' : 'submit'}
                onClick={
                  nextBtnDisabled
                    ? () => {}
                    : () => {
                        if (slide === 0) {
                          setSlide(slide + 1);
                        } else {
                          // sign in / create an account
                        }
                      }
                }
                disabled={nextBtnDisabled}
                text={<>{slide === 0 ? 'Next' : showSignIn ? 'Sign In' : 'Create Account'} &nbsp;&rarr;</>}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
