const getDateStr = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

// type --> either: streak, longest-streak, win-loss
// league --> a valid league, dailychallenge, or any
export default function stats(games, league, type) {
  let validGames;
  if (league === 'any') {
    validGames = games;
  } else if (league === 'dailychallenge') {
    // if user plays the same daily challenge multiple times, only consider the first time the user played that day's challenge
    games.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    validGames = [];
    let prevDateStr = '';
    games.forEach((e) => {
      const dStr = getDateStr(new Date(e.date));
      if (e.type === 'dailychallenge' && dStr !== prevDateStr) {
        validGames.push(e);
        prevDateStr = dStr;
      }
    });
  } else {
    validGames = games.filter((e) => e.league === league);
  }

  if (type === 'streak') {
    // streak
    validGames.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    for (let i = 0; i < validGames.length; i++) {
      if (validGames[i].won) {
        streak++;
      } else {
        break;
      }
    }
    return streak.toString();
  } else if (type === 'longest-streak') {
    validGames.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let longestStreak = 0;
    let streak = 0;
    for (let i = 0; i < validGames.length; i++) {
      if (validGames[i].won) {
        streak++;
      } else {
        streak = 0;
      }
      if (streak > longestStreak) {
        longestStreak = streak;
      }
    }
    return longestStreak.toString();
  } else if (type === 'win-loss') {
    // win/loss
    const wonCount = validGames.filter((e) => e.won).length;
    return [wonCount, validGames.length - wonCount];
  }
}
