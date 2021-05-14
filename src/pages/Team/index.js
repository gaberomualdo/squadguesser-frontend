import './styles.css';
import React from 'react';
import { ContentfulPage, LayeredRectangle } from '../../components';
import { siteTitle } from '../../lib/config';
import gabrielRomualdoImage from '../../assets/gabriel-romualdo.jpg';

export default function Team() {
  return (
    <ContentfulPage title='Our Team' description={`See and read about the team that created and maintains this site.`}>
      <p>
        At the moment, I am the sole developer working on this site. I founded this site as a side-project, but I'm interested in scaling to a larger
        team in the future. You can read more about me and my role on this project below:
      </p>
      <LayeredRectangle>
        <div className='team-page-profile'>
          <div className='image'>
            <img src={gabrielRomualdoImage} alt='' />
          </div>
          <div className='content'>
            <h1>Gabriel Romualdo</h1>
            <p>Founder & Developer</p>
            <ul>
              {[
                {
                  icon: <i className='fas fa-home'></i>,
                  title: 'Website',
                  url: 'https://xtrp.io/',
                },
                {
                  icon: <i className='fab fa-github'></i>,
                  title: 'GitHub',
                  url: 'https://github.com/xtrp',
                },
                {
                  icon: <i className='fab fa-linkedin-in'></i>,
                  title: 'LinkedIn',
                  url: 'https://www.linkedin.com/in/gabriel-romualdo-483b7b20a/',
                },
              ].map((e, i) => (
                <a className='styled-link' key={i} href={e.url} rel='noopener noreferrer'>
                  <span>{e.icon}</span>
                  <span>{e.title}</span>
                </a>
              ))}
            </ul>
            <p>
              Founder of {siteTitle}. He is a full-stack developer currently working at GeeksforGeeks, a project at Boston University, and the
              Spirited Network. He works on various side projects, open source work, and publishes technical articles as well. He's also a high school
              student.
            </p>
          </div>
        </div>
      </LayeredRectangle>
      <p>
        Interested in working on this project? Email <a href='mailto:gabriel@gabrielromualdo.com'>gabriel@gabrielromualdo.com</a>.
      </p>
    </ContentfulPage>
  );
}
