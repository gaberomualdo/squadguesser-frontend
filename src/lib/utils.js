const toBase64 = (x) => {
  return btoa(unescape(encodeURIComponent(x))).replace(/=/g, '');
};
const fromBase64 = (x) => {
  return decodeURIComponent(escape(atob(x)));
};
const processDate = (d, hideCurrentYear = false) =>
  `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'][d.getMonth()]} ${d.getDate()}${
    hideCurrentYear && new Date().getFullYear() === d.getFullYear() ? '' : `, ${d.getFullYear()}`
  }`;
const processRankNumber = (n) => {
  if (Math.floor(n / 10) === 1) return `${n}th`;
  const end = n % 10;
  let ending = 'th';
  if (end === 1) ending = 'st';
  if (end === 2) ending = 'nd';
  if (end === 3) ending = 'rd';
  return `${n}${ending}`;
};

module.exports = { toBase64, fromBase64, processDate, processRankNumber };
