export const shortenText = (text, maxVisible) => {
  if(text.length <= maxVisible) {
    return text;
  }

  return text.substr(0, maxVisible) + '...';
};

export const walkDurationInMinutes = (distance) => {
  if (!distance || distance === 0) {
    return 0;
  }
  return Math.ceil(20 * distance);
};
