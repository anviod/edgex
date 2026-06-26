const getLegalPage = (page, { min, max }) => {
  if (page < min) {
    return min;
  }
  if (page > max) {
    return max;
  }
  return page;
};
export { getLegalPage };
