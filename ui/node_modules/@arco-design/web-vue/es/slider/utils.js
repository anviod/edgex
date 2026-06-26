import NP from "number-precision";
const getOffsetPercent = (value, [min, max]) => {
  const percent = Math.max((value - min) / (max - min), 0);
  return `${NP.round(percent * 100, 2)}%`;
};
const getPositionStyle = (offset, direction) => {
  return direction === "vertical" ? { bottom: offset } : { left: offset };
};
export { getOffsetPercent, getPositionStyle };
