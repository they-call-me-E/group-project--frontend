export const convertToDMS = (deg: any) => {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutes = Math.floor((absolute - degrees) * 60);
  const seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(4);
  const direction =
    deg >= 0 ? (deg === absolute ? "N" : "E") : deg === absolute ? "S" : "W";

  return `${degrees}° ${minutes}' ${seconds}'' ${direction}`;
};
