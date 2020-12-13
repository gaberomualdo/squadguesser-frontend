import './lib/main.css';
import './lib/layout.css';
import { NavBar } from './components/index.js';

function App() {
  const pages = [
    {
      icon: '⚽',
      code: 'home',
      name: 'Home',
      isHomepage: true,
    },
    {
      icon: '📆',
      code: 'dailychallenge',
      name: 'Daily Challenge',
      type: 'game',
    },
    {
      icon: '🏁',
      code: 'nationality',
      name: 'By Nationality',
      type: 'game',
    },
    {
      icon: '📈',
      code: 'rating',
      name: 'By FIFA Rating',
      type: 'game',
    },
    {
      icon: '✍️',
      code: 'initials',
      name: 'By Initials',
      type: 'game',
    },
    // {
    //   icon: '👴',
    //   code: 'age',
    //   name: 'By Player Age',
    //   type: 'game',
    // },
  ];

  return (
    <div className='App'>
      <NavBar pages={pages} />
    </div>
  );
}

export default App;
