export const fRound = (n: number, precision: number = 2) => {
  const scale = 10 * precision;
  return Math.round(n * scale) / scale;
};
