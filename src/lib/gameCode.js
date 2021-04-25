/*
This program encodes and decodes gamepins. Contrary to some applications,
gamepins on this site actually encode the game settings and game information,
and nothing is stored or fetched from the backend.
*/

import assert from 'assert';

// currently only uppercase chars are used
// include more chars here to logorithmically decrease overall pin size
// const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
// use a shuffled alphabet simply to make it less obvious for a user to decode codes alphanumerically (and basically cheat at the game, albeit in a very clever manner)
const characters = 'KCTOWQVLIGPBEMYSFHANXZJDUR'.split('');

function logBase(base, number) {
  return Math.log(number) / Math.log(base);
}
const padArrayWithZeros = (arr, length) => {
  if (length && length > arr.length) {
    return new Array(length - arr.length).fill(0).concat(arr);
  }
  return arr;
};
const toBase = (number, toBase, length) => {
  let digitMultiplier = toBase ** Math.floor(logBase(toBase, number));
  let result = [];
  while (digitMultiplier >= 1) {
    const newDigit = Math.floor(number / digitMultiplier);
    result.push(newDigit);
    number -= newDigit * digitMultiplier;
    digitMultiplier /= toBase;
  }
  if (length) {
    result = padArrayWithZeros(result, length);
  }
  return result;
};
const fromBase = (digitsArr, fromBase) => {
  let result = 0;
  digitsArr.forEach((digit, i) => {
    let digitMultiplier = fromBase ** (digitsArr.length - 1 - i);
    result += digitMultiplier * digit;
  });
  return result;
};

const toChars = (number, length) => {
  const base = characters.length;
  let result = toBase(number, base)
    .map((e) => characters[e])
    .join('');
  if (length && result.length < length) {
    result = characters[0].repeat(length - result.length) + result;
  }
  return result;
};
const fromChars = (str) => {
  const base = characters.length;
  return fromBase(
    str.split('').map((e) => characters.indexOf(e)),
    base
  );
};

const boolArrToBinaryArr = (boolArr) => boolArr.map((e) => +e); // this unary operator thing is an absolute genius move
const binaryArrToBoolArr = (binaryArr) => binaryArr.map((e) => [false, true][e]);

// Example values:
// console.log(toBase(6789324, 26)); // --> [14, 22, 7, 9, 22]
// console.log(fromBase([14, 22, 7, 9, 22], 26)); // --> 6789324
// console.log(toChars(6789324)); // --> 'OWHJW'
// console.log(fromChars('OWHJW')); // --> 6789324

const LEAGUE_AND_GAMEMODE_LENGTH = 3;
const GAME_LENGTH = 2;
const GAMEMODE_SIZE = 8;
const FORMATION_SIZE = 11;
const GAMEMODE_NUMBER_CEILING = 2 ** GAMEMODE_SIZE;

// NOTE:
//    (let CLENGTH be characters.length)
//  - the max of the league value is floor(CLENGTH^LEAGUE_GAMEMODE_LENGTH / 2^GAMEMODE_SIZE), which is 68 at the moment (I think)
//  - the max of the game value is CLENGTH^GAME_LENGTH, which is 676 at the moment
//  - elements in the formation list must be integers in the range [0, GAMEMODE_SIZE - 1]

const encodeGameCode = (leagueNumber, gameMode, game, formation) => {
  assert(gameMode.length === GAMEMODE_SIZE);
  assert(formation.length === FORMATION_SIZE);

  const gameModeNumber = fromBase(boolArrToBinaryArr(gameMode), 2);

  const gameModeEnabledCount = gameMode.filter((e) => e === true).length;
  const gameModeEnabledIndices = gameMode.reduce((acc, e, i) => (e ? acc.concat([i]) : acc), []);

  const numbers = [
    leagueNumber * GAMEMODE_NUMBER_CEILING + gameModeNumber,
    game,
    fromBase(
      formation.map((e) => gameModeEnabledIndices.indexOf(e)),
      gameModeEnabledCount
    ),
  ];
  return toChars(numbers[0], LEAGUE_AND_GAMEMODE_LENGTH) + toChars(numbers[1], GAME_LENGTH) + toChars(numbers[2]);
};
const decodeGameCode = (data) => {
  const leagueAndGameModeNumber = fromChars(data.substring(0, LEAGUE_AND_GAMEMODE_LENGTH));
  const leagueNumber = Math.floor(leagueAndGameModeNumber / GAMEMODE_NUMBER_CEILING);
  const gameModeNumber = leagueAndGameModeNumber % GAMEMODE_NUMBER_CEILING;
  const gameMode = binaryArrToBoolArr(toBase(gameModeNumber, 2, GAMEMODE_SIZE));

  const gameModeEnabledCount = gameMode.filter((e) => e === true).length;
  const gameModeEnabledIndices = gameMode.reduce((acc, e, i) => (e ? acc.concat([i]) : acc), []);

  const game = fromChars(data.substring(LEAGUE_AND_GAMEMODE_LENGTH, LEAGUE_AND_GAMEMODE_LENGTH + GAME_LENGTH));
  const formation = padArrayWithZeros(
    toBase(fromChars(data.substring(LEAGUE_AND_GAMEMODE_LENGTH + GAME_LENGTH)), gameModeEnabledCount),
    FORMATION_SIZE
  ).map((e) => gameModeEnabledIndices[e]);

  assert(gameMode.length === GAMEMODE_SIZE);
  assert(formation.length === FORMATION_SIZE);

  return {
    leagueNumber,
    gameMode,
    game,
    formation,
  };
};

const testEncodeAndDecode = () => {
  let failures = 0;
  const count = 69420;
  for (let i = 0; i < count; i++) {
    const gameMode = binaryArrToBoolArr([
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2),
    ]);
    if (gameMode.filter((e) => e === true).length === 0) {
      gameMode[0] = true;
    }
    const enabledGameModeIndices = [];
    gameMode.forEach((e, i) => {
      if (e) enabledGameModeIndices.push(i);
    });

    const data = {
      leagueNumber: Math.floor(Math.random() * 42),
      gameMode,
      game: Math.floor(Math.random() * 676),
      formation: (() => {
        const ret = [];
        for (let i = 0; i < 11; i++) {
          ret.push(enabledGameModeIndices[Math.floor(Math.random() * enabledGameModeIndices.length)]);
        }
        return ret;
      })(),
    };
    const encoded = encodeGameCode(data.leagueNumber, data.gameMode, data.game, data.formation);
    const decoded = decodeGameCode(encoded);
    if (JSON.stringify(decoded) !== JSON.stringify(data)) {
      console.log('Failure: ' + encoded);
      failures++;
    } else {
      console.log('Success: ' + encoded);
    }
  }
  console.log(`Failures Count: ${failures}`);
  console.log(`Total Count: ${count}`);
};
// testEncodeAndDecode();

export { encodeGameCode, decodeGameCode };
