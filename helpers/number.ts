export const generateRandomBetween = (
  min: number,
  max: number,
  previousNumbers: number[],
  exclude?: number
): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const random = getRandomNumber(min, max);
  if (random === exclude || previousNumbers.includes(random)) {
    return generateRandomBetween(min, max, previousNumbers, exclude);
  } else {
    return random;
  }
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
