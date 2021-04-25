const getNumberEnding = (number) => {
  const onesDig = number % 10;
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
