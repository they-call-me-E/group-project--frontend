export const convertToMph = (kmh: number): string => {
  const mph: number = kmh * 0.621371;
  return mph.toFixed(2);
};
