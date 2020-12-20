const toBase64 = (x) => {
  return btoa(unescape(encodeURIComponent(x))).replace(/=/g, '');
};
const fromBase64 = (x) => {
  return decodeURIComponent(escape(atob(x)));
};

module.exports = { toBase64, fromBase64 };
