import axios from 'axios';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { FullHeightLoading, PageHeader, SiteLinkButtons } from '../../components';
import { APIBaseURL } from '../../lib/config';

export default function EmailUnsubscribe() {
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const { token } = qs.parse(window.location.search.substring(1));
    if (!token) {
      setMessage({
        title: 'An Error Occurred',
        text: 'Missing unsubscribe token.',
      });
      return setLoaded(true);
    }
    axios({
      method: 'put',
      baseURL: APIBaseURL,
      url: `/api/email-list/unsubscribe/?token=${token}`,
    })
      .then((res) => {
        setMessage({ title: 'Successfully Unsubscribed', text: res.data.message });
      })
      .catch((err) => {
        try {
          setMessage({ title: 'An Error Occurred', text: err.response.data.message });
        } catch (err) {
          setMessage({ title: 'An Error Occurred', text: 'An internal or server error occurred.' });
        }
      })
      .then(() => {
        setLoaded(true);
      });
  }, []);

  return loaded ? (
    <div className='page panel' style={{ marginBottom: '1rem' }}>
      <PageHeader title={message.title} description={message.text} />
      <SiteLinkButtons />
    </div>
  ) : (
    <FullHeightLoading />
  );
}
