/* eslint-disable no-restricted-globals */
import assert from 'assert';
import isLeapYear from 'leap-year';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { BrowserRouter as Switch, Link, Route } from 'react-router-dom';
import { LargeCalendar, LinedHeader, PageHeader, PlayButton } from '../../components/';
import getNumberEnding from '../../lib/getNumberEnding';
import DailyChallengeGame from './DailyChallengeGame';
import './styles.css';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const getObjFromDate = (d) => {
  return {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
};
const getDateFromObj = (obj) => new Date(`${months[obj.month - 1]} ${obj.day} ${obj.year}`);
const getDateAfter = (jsDate, afterDays) => {
  return new Date(jsDate.setDate(jsDate.getDate() + afterDays));
};
const generateDateTitleNotToday = (dateObj) => {
  return `${months[dateObj.month - 1]} ${dateObj.day}${getNumberEnding(dateObj.day)}${
    dateObj.year !== new Date().getFullYear() ? `, ${dateObj.year}` : ''
  }`;
};
const getRandomDescription = (dateTitle) => {
  const rand = Math.floor(Math.random() * 6);
  switch (rand) {
    case 0:
      return `Play ${dateTitle}'s challenge now.`;
    case 1:
      return `Let's see how you can do on ${dateTitle}'s daily challenge!`;
    case 2:
      return `Can you beat ${dateTitle}'s challenge?`;
    case 3:
      return `${dateTitle}'s challenge is a hard one! Let see how you do.`;
    case 4:
      return `Try playing ${dateTitle}'s challenge.`;
    case 5:
      return `Ready to take on ${dateTitle}'s challenge?`;
    default:
      return `Ready to take on ${dateTitle}'s challenge?`;
  }
};
const getBoundsError = (d, lower, upper) => {
  if (d.getTime() > upper.getTime()) {
    return ["We haven't made that challenge yet!", 'Check back when that date comes around to see that challenge.'];
  } else if (d.getTime() < lower.getTime()) {
    return ["We weren't around back then.", "Unfortunately, we didn't exist back then, so there's no daily challenge for that date."];
  }
  return '';
};
const getDateStr = (dateObj) => {
  const dd = String(dateObj.day).padStart(2, '0');
  const mm = String(dateObj.month).padStart(2, '0');
  const yyyy = dateObj.year;
  return `${mm}-${dd}-${yyyy}`;
};

function ChallengeButton(props) {
  const icons = {
    current: 'calendar-alt',
    previous: 'hand-point-left',
    lastyear: 'hand-point-left',
    next: 'hand-point-right',
  };
  return (
    <Link to={`/daily/${getDateStr(props.dateObj)}`}>
      <PlayButton
        isNotButton
        icon={<i className={`fas fa-${icons[props.icon]}`}></i>}
        name={`Play ${props.title}'s Challenge`}
        description={getRandomDescription(props.title)}
        className={props.isPrimary ? 'primary' : 'secondary'}
      />
    </Link>
  );
}

export default function DailyChallenge(props) {
  const todayObj = getObjFromDate(new Date());
  const [selectedDay, setSelectedDay] = useState(todayObj);

  const isToday = JSON.stringify(selectedDay) === JSON.stringify(todayObj);
  const buttonDates = isToday
    ? {
        previous: getObjFromDate(getDateAfter(getDateFromObj(selectedDay), -1)),
        current: selectedDay,
        lastyear:
          isLeapYear(selectedDay.year) && selectedDay.month === 2 && selectedDay.day === 29 // support for leap years
            ? {
                month: 2,
                day: 28,
                year: selectedDay.year - 1,
              }
            : {
                ...selectedDay,
                year: selectedDay.year - 1,
              },
      }
    : {
        previous: getObjFromDate(getDateAfter(getDateFromObj(selectedDay), -1)),
        current: selectedDay,
        next: getObjFromDate(getDateAfter(getDateFromObj(selectedDay), 1)),
      };
  const dateTitles = isToday
    ? {
        previous: 'Yesterday',
        current: 'Today',
        lastyear: generateDateTitleNotToday(buttonDates.lastyear),
      }
    : {
        previous: generateDateTitleNotToday(buttonDates.previous),
        current: generateDateTitleNotToday(buttonDates.current),
        next: generateDateTitleNotToday(buttonDates.next),
      };
  const lowerBound = 'January 1 2020';
  const boundsError = getBoundsError(getDateFromObj(selectedDay), new Date(lowerBound), new Date());

  return (
    <Switch>
      <Route
        exact
        path='/daily/:mm-:dd-:yyyy'
        component={(routeProps) => {
          const { mm, dd, yyyy } = routeProps.match.params;
          try {
            const dateObj = { day: parseInt(dd), month: parseInt(mm), year: parseInt(yyyy) };
            assert(`${mm}-${dd}-${yyyy}` === getDateStr(dateObj));
            assert(getBoundsError(getDateFromObj(dateObj), new Date(lowerBound), new Date()) === '');
          } catch (err) {
            return <Redirect to='/daily' />;
          }
          return (
            <DailyChallengeGame
              reloadUser={props.reloadUser}
              user={props.user}
              loggedIn={props.loggedIn}
              setAuthModal={props.setAuthModal}
              setProfileModal={props.setProfileModal}
              date={`${mm}-${dd}-${yyyy}`}
            />
          );
        }}
      />
      <Route exact path='/daily'>
        <div className='dailychallenge-page page panel'>
          <div className='details'>
            <PageHeader title='Daily Challenge' description='Play a unique game every day and build up your daily challenge streak.' />
            <div className='buttons'>
              {boundsError ? (
                <div className='out-of-bounds'>
                  <div className='icon'>
                    <i className='fas fa-calendar-times'></i>
                  </div>
                  <div className='content'>
                    <h1>{boundsError[0]}</h1>
                    <p>{boundsError[1]}</p>
                  </div>
                </div>
              ) : (
                <>
                  <ChallengeButton title={dateTitles.current} icon='current' dateObj={buttonDates.current} isPrimary />
                  <LinedHeader
                    text='Or'
                    backgroundColor='var(--darker)'
                    style={{ fontSize: '1.1rem', marginBottom: '1.5rem', marginTop: '1.65rem' }}
                  />
                  <ChallengeButton title={dateTitles.previous} icon='previous' dateObj={buttonDates.previous} />
                  {dateTitles.next ? <ChallengeButton title={dateTitles.next} icon='next' dateObj={buttonDates.next} /> : null}
                  {dateTitles.lastyear ? <ChallengeButton title={dateTitles.lastyear} icon='lastyear' dateObj={buttonDates.lastyear} /> : null}
                </>
              )}
            </div>
          </div>
          <div className='calendar'>
            <LargeCalendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
          </div>
        </div>
      </Route>
    </Switch>
  );
}
