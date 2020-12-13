import './styles.css';
import { ResponsiveContainer, PrimaryButton, SecondaryButton } from '../';

const NavBar = function (props) {
  const { pages, active, setPage } = props;
  const homePage = pages.filter((e) => e.isHomepage)[0];

  const mainButtonColor = 'var(--primary)';

  return (
    <div className='navbar-container'>
      <ResponsiveContainer>
        <div className='navbar'>
          <div className='left'>
            <PrimaryButton
              icon={homePage.icon}
              text={'SquadGuessr'}
              className={`logo ${active === homePage.code ? 'active' : ''}`}
              onClick={() => setPage(homePage.code)}
              color={mainButtonColor}
            ></PrimaryButton>
            {pages
              .filter((e) => e.type && e.type === 'info')
              .map((e, i) => (
                <SecondaryButton
                  key={i}
                  icon={e.icon}
                  text={e.name}
                  className={`${active === e.code ? 'active' : ''} light with-margin`}
                  color={mainButtonColor}
                  onClick={() => setPage(e.code)}
                ></SecondaryButton>
              ))}
          </div>
          <div className='right'>
            {pages
              .filter((e) => !e.isHomepage && !(e.type && e.type === 'info'))
              .map((e, i) => (
                <PrimaryButton
                  key={i}
                  icon={e.icon}
                  text={e.name}
                  className={active === e.code ? 'active' : ''}
                  color={mainButtonColor}
                  onClick={() => setPage(e.code)}
                ></PrimaryButton>
              ))}
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};
export default NavBar;
