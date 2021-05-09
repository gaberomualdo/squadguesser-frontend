const getNumberEnding = (number) => {
  const tensDig = number % 100;
  const onesDig = number % 10;
  if (tensDig === 11 || tensDig === 12) {
    return 'th';
  }
  if (onesDig === 1) {
    return 'st';
  } else if (onesDig === 2) {
    return 'nd';
  } else if (onesDig === 3) {
    return 'rd';
  } else {
    return 'th';
  }
};
export default getNumberEnding;
