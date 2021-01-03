import './styles.css';
import { TertiaryButton, Loading, Modal } from '../../components';
import React, { useState } from 'react';
import { APIBaseURL } from '../../lib/config';
const axios = require('axios');

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '1234567890';

export default function AuthModal(props) {
  const [showSignIn, setShowSignIn] = useState(props.signIn);
  const [slide, setSlide] = useState(0);
  const [nextLoading, setNextLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const usernameLabel = `${showSignIn ? '' : 'Choose a '}Username:`;
  const passwordLabel = `${showSignIn ? '' : 'Choose a '}Password:`;

  const nextBtnDisabled = !(slide === 0 ? username.length > 0 : password.length > 0) || nextLoading;

  const nextBtnClick = () => {
    if (slide === 0) {
      let valid = true;
      let curError = '';

      let bounds = [4, 20];
      if (!(username.length >= bounds[0] && username.length <= bounds[1])) {
        valid = false;
        curError = `Username must be between ${bounds.join('-')} characters.`;
      } else if (alphabet.indexOf(username[0]) === -1) {
        valid = false;
        curError = 'Username must start with a letter.';
      } else {
        const invalidChars = [...new Set(username.split('').filter((e) => (alphabet + numbers + '_').indexOf(e) === -1))];
        if (invalidChars.length > 0) {
          valid = false;
          curError = `Username cannot include: ${invalidChars.map((e) => `'${e}'`).join(', ')}.`;
        }
      }
      setError(curError);
      if (valid) {
        setNextLoading(true);
        axios({
          method: 'post',
          baseURL: APIBaseURL,
          url: `/api/users/usernameavailable/`,
          data: {
            username,
          },
        })
          .then((res) => {
            const { available } = res.data;
            if ((showSignIn && !available) || (!showSignIn && available)) {
              setSlide(slide + 1);
            } else {
              setError(showSignIn ? 'User with username does not exist.' : 'Username not available.');
            }
          })
          .catch((err) => {
            try {
              setError(err.response.data.errors[0].msg);
            } catch (err) {
              setError('Internal or server error occurred.');
            }
          })
          .then(() => {
            setNextLoading(false);
          });
      }
    } else {
      let valid = true;
      let curError = '';

      let bounds = [8, 20];
      if (!(password.length >= bounds[0] && password.length <= bounds[1])) {
        valid = false;
        curError = `Password must be between ${bounds.join('-')} characters.`;
      }

      setError(curError);
      if (valid) {
        setNextLoading(true);
        axios({
          method: 'post',
          baseURL: APIBaseURL,
          url: `/api/${showSignIn ? 'auth' : 'users'}/`,
          data: {
            username,
            password,
          },
        })
          .then((res) => {
            const { token } = res.data;
            localStorage.setItem('authtoken', token);
            window.location.reload();
          })
          .catch((err) => {
            try {
              setError(err.response.data.errors[0].msg);
            } catch (err) {
              setError('Internal or Server Error Occurred');
            }
          })
          .then(() => {
            setNextLoading(false);
          });
      }
    }
  };

  const inputPressEnter = (e) => {
    if (e.key === 'Enter' && !nextBtnDisabled) {
      nextBtnClick();
    }
  };

  return (
    <Modal className='auth-modal-component' closeModal={() => props.setAuthModal(false)}>
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
            onKeyDown={inputPressEnter}
            {...(showSignIn ? { autoComplete: 'username' } : {})}
            onChange={(evt) => setUsername(evt.target.value.toLowerCase())}
          />
          <label htmlFor='username'>{usernameLabel}</label>
        </div>
        <div className='input-container password'>
          <input
            type='password'
            onChange={(evt) => setPassword(evt.target.value)}
            onKeyDown={inputPressEnter}
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
            onClick={nextBtnDisabled ? () => {} : nextBtnClick}
            disabled={nextBtnDisabled}
            style={{ position: 'relative' }}
            text={
              <>
                {nextLoading ? (
                  <div style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', position: 'absolute', fontSize: 0, overflow: 'hidden' }}>
                    <Loading
                      style={{
                        '--border-color': 'var(--light)',
                        height: '1.25rem',
                        width: '1.25rem',
                        borderWidth: '.15rem',
                        display: 'block',
                        float: 'left',
                      }}
                    />
                  </div>
                ) : null}
                <span style={nextLoading ? { opacity: '0' } : {}}>
                  {slide === 0 ? 'Next' : showSignIn ? 'Sign In' : 'Create Account'} &nbsp;&rarr;
                </span>
              </>
            }
          />
          {/* <p className='slide-counter'>{slide + 1} / 2</p> */}
        </div>
      </form>
    </Modal>
  );
}
