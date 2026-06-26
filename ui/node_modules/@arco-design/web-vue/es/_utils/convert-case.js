const toKebabCase = (string) => {
  return string.replace(/\B([A-Z])/g, "-$1").toLowerCase();
};
export { toKebabCase };
