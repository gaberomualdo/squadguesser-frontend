import './styles.css';
import React from 'react';

export default function Home(props) {
  const englishSpelling = true;
  const pages = props.pages.filter((e) => !e.isHomepage && !(e.type && e.type === 'info'));
  return (
    <div className='fullheight-section homepage'>
      <div className='left textsection'>
        <div className='inner'>
          <div className='top'>
            <h1>Test Your {englishSpelling ? 'Football' : 'Soccer'} Knowledge!</h1>
            <p>Guess famous squads by player nationality, FIFA rating, and more.</p>
          </div>
          <div className='play'>
            {[0, 1].map((i) => (
              <button onClick={() => props.setPage(pages[i].code)} className={`playbtn ${i === 0 ? 'primary' : ''}`} key={i}>
                <div className='icon'>
                  <span>{pages[i].icon}</span>
                </div>
                <div className='content'>
                  <h1>{pages[i].name}</h1>
                  <p>{pages[i].description ? pages[i].description : <>play now &rarr;</>}</p>
                </div>
                <div className='arrow'>&rarr;</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='right'></div>
    </div>
  );
}
