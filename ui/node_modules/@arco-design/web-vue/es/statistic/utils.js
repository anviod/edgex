const units = [
  ["Y", 1e3 * 60 * 60 * 24 * 365],
  ["M", 1e3 * 60 * 60 * 24 * 30],
  ["D", 1e3 * 60 * 60 * 24],
  ["H", 1e3 * 60 * 60],
  ["m", 1e3 * 60],
  ["s", 1e3],
  ["S", 1]
];
function getDateString(millisecond, format) {
  let leftMillisecond = millisecond;
  return units.reduce((current, [name, unit]) => {
    if (current.indexOf(name) !== -1) {
      const value = Math.floor(leftMillisecond / unit);
      leftMillisecond -= value * unit;
      return current.replace(new RegExp(`${name}+`, "g"), (match) => {
        const len = match.length;
        return String(value).padStart(len, "0");
      });
    }
    return current;
  }, format);
}
export { getDateString };
