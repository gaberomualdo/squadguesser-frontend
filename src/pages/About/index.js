import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ContentfulPage, Formation, Pitch } from '../../components';
import { siteTitle } from '../../lib/config';

const placeholderURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAABCAQAAAAxtilpAAAADklEQVR42mNkGAWDCgAAAyIAAro4hNgAAAAASUVORK5CYII=';
const technologiesFormation = [
  {
    photoURL: placeholderURL,
    name: 'The Internet',
    x: 50,
    y: 3,
  },
  {
    photoURL: placeholderURL,
    name: 'Node.js',
    x: 89,
    y: 18,
  },
  {
    photoURL: placeholderURL,
    name: 'Express.js',
    x: 67,
    y: 14,
  },
  {
    photoURL: placeholderURL,
    name: 'MongoDB',
    x: 32,
    y: 14,
  },
  {
    photoURL: placeholderURL,
    name: 'React.js',
    x: 11,
    y: 19,
  },
  {
    photoURL: placeholderURL,
    name: 'HTML',
    x: 50,
    y: 32,
  },
  {
    photoURL: placeholderURL,
    name: 'CSS',
    x: 65,
    y: 50,
  },
  {
    photoURL: placeholderURL,
    name: 'JS',
    x: 35,
    y: 50,
  },
  {
    photoURL: placeholderURL,
    name: 'D3.js',
    x: 50,
    y: 74,
  },
  {
    photoURL: placeholderURL,
    name: 'React Router',
    x: 89,
    y: 81,
  },
  {
    photoURL: placeholderURL,
    name: 'Font Awesome',
    x: 11,
    y: 81,
  },
];

export default function About() {
  return (
    <ContentfulPage title='About' description={`Read about this site, how it was built, and how it works.`}>
      <ReactMarkdown>{`
${siteTitle} is a puzzle game where players try to guess a given squad based on limited information. We have over 200 squads, thousands of players, and hundreds of millions of possible games. Data is updated periodically and is generally up to date. ${siteTitle} was founded and developed by [Gabriel Romualdo](https://gabrielromualdo.com/).

## Other Relevant Pages
 
 - [Instructions](/instructions)
 - [Our Team](/team)
 - [Terms & Cookie Policy](/terms)

## Contact

If you're interested in contacting me, please email [gabriel@gabrielromualdo.com](mailto:gabriel@gabrielromualdo.com).

## Code and Technologies

This site is written in the MERN stack. Here's an overview of the technologies we use, in a 4-3-3 formation:
`}</ReactMarkdown>
      <div
        style={{
          height: '32.5rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '4px',
          overflow: 'hidden',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          maxWidth: '27.5rem',
        }}
      >
        <Pitch />
        <Formation
          showAnswer={true}
          players={technologiesFormation.map((player, i) => {
            return {
              imageURL: player.photoURL,
              x: player.x,
              y: player.y,
              name: player.name,
              fullName: player.name,
            };
          })}
        />
      </div>
      <ReactMarkdown>{`
## History

I got the inspiration for this game in the spring of 2020 when I saw a YouTube video with a challenge of trying to guess famous teams by their player's national teams.

I realized this was a really fun challenge, and it could be pretty easily automated to create games for hundreds of teams, not just the famous ones. This process would also allow the team data to be completely up to date with squad changes and player transfers. I also thought of a few ways to expand the game, including hints for example.

The biggest initial difficulty for me when I created this project was getting the data. I was able to sync the site data with EA Sports's squad data, under Fair Use.

I developed a preliminary version of the site which had no accounts or sign in, no stats, and only guessing teams by player nationalities back in December 2020. I created the site in React.js with the backend in Node.js, Express.js, and MojgoDB Atlas for the database.

By January I had created the sign in and sign up functionality, stats, and leaderboard.

In April I revisited the project and added a number of major updates. First, I added React Router to create some clearer routes for the project.

I spent some time developing a unique game pin and URL system for each game. This involved converting arrays of booleans and other numbers into binary and subsequently to base 26, to store as a list of uppercase letters.

Then, I worked to make the site much more responsive, and revamped the Daily Challenge page so that old challenges could be accessed, not just the current challenge.

Further additions included updates to the squads database, adding more detailed graphs of player statistics, and more.

This project is pretty notable to me in that it's one of my first large MERN stack sites. There are a number of possible additions and features I'd love to add to the site in the future, both from a technical perspective in terms of making the code more clean, and on a more user-centric perspective in terms of creating a more enjoyable user experience.

## Frequently Asked Questions

### Is this project open sourced?

Unfortunately, this project is not yet open sourced. If you'd like to learn more about the code, please email me.

### How often is the squad data updated?

I try to update the data every month, although I may update it more or less frequently than that depending on other circumstances.

### How do I delete my account?

Click on your profile picture on the top right, scroll the bottom, and click delete account. This will delete all data associated with your account, including stats, rating, leaderboard placement, and everything else. If you have any issues with this, please contact me.

### I've found a security vulnerability or bug. What do I do?

Please contact me through my email.

### Can I scrape this site or reverse engineer your API to get squad data?

No, you may not. Scraping this site or its API, or sending bot requests is currently against this site's terms.

### I'm interested in working on this site or learning more. What do I do?

Please contact me through my email and I'd be happy to connect. 

### Any other inquiries?

Contact me through my email.
      `}</ReactMarkdown>
    </ContentfulPage>
  );
}
