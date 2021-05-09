import './styles.css';
import React from 'react';
import { ContentfulPage, LayeredRectangle } from '../../components';
import { siteTitle } from '../../lib/config';

function InstructionsList(props) {
  return props.list.map((e, i) => (
    <LayeredRectangle {...(props.color ? { color: props.color } : {})} key={i}>
      <div className='instruction'>
        <h2 className='number'>{i + 1}</h2>
        <div className='content'>
          <h1>{e.title}</h1>
          <p>{e.description}</p>
        </div>
      </div>
    </LayeredRectangle>
  ));
}

export default function Instructions() {
  return (
    <ContentfulPage title='Instructions' description={`Learn how to play ${siteTitle} for the first time.`}>
      <p>
        SquadGuesser is a puzzle game where players try to guess a given squad based on limited information. Here are a few basic game instructions to
        get you started:
      </p>
      <InstructionsList
        list={[
          {
            title: 'Choose a League',
            description:
              "Go to the page titled Play, and select the league you'd like to play. We offer 15+ leagues at the moment, each of which is updated periodically to make sure the info is up to date.",
          },
          {
            title: 'Select a Difficulty',
            description: "The game has three difficulties: easy, medium, and hard. If you're a beginner, we recommend playing easy mode.",
          },
          {
            title: 'Click Play',
            description: 'Click play to begin a random game in the league you selected with the difficulty you chose.',
          },
          {
            title: 'Make a Guess',
            description:
              "You'll see a formation of items, each of which represents a player in a specific team in the league you selected. Item's content varies from a flag indicating the player's national team, the player's age, and more. Guess which team you think is shown in the formation by clicking the options on the left.",
          },
          {
            title: 'Play The Next Game',
            description: "Once you're ready to move on to the next random game, click the button on the bottom left corner.",
          },
        ]}
        color='var(--lighterdark-2)'
      />

      <p>After you've played a couple of games, try out a few features we have, like hints and stats. Here's a list of these additional features:</p>
      <InstructionsList
        color='var(--lighterdark-2)'
        list={[
          {
            title: 'Not Sure About Your Answer? Use Hints!',
            description:
              "Hints are available to help you choose the right answer. Click one of the hints on the right if you're having trouble guessing the right team.",
          },
          {
            title: 'Guessed Correctly? View Game Details & More.',
            description:
              "Once you've guessed correctly, scroll down to view details about the team you just guessed. Feel free to share this particular game with you're friends if you enjoyed it! Each game has a unique link that you can easily copy and paste.",
          },
          {
            title: 'Sign Up Get Your Stats and Be On The Leaderboard!',
            description:
              "If you're enjoying the game and want to see your game stats, maintain your own rating for the game, and appear on the game leaderboard, consider signing up!",
          },
        ]}
      />
    </ContentfulPage>
  );
}
