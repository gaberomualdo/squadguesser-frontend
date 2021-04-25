import { encodeGameCode } from './gameCode';
const getNewGamePath = (leagues, leagueTeams, passedGameMode, passedLeague) => {
  const leagueNumber = leagues.indexOf(passedLeague);
  const correctTeamNumber = Math.floor(Math.random() * leagueTeams[passedLeague].length);
  const possibleFormationTypes = [];
  passedGameMode.forEach((e, i) => {
    if (e) possibleFormationTypes.push(i);
  });
  const formationTypesArr = [];
  for (let i = 0; i < 11; i++) {
    formationTypesArr.push(possibleFormationTypes[Math.floor(Math.random() * possibleFormationTypes.length)]);
  }
  const gameCode = encodeGameCode(leagueNumber, passedGameMode, correctTeamNumber, formationTypesArr);
  return `/play/${gameCode}`;
};
export default getNewGamePath;
