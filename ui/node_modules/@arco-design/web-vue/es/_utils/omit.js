const omit = (object, path) => {
  const result = { ...object };
  for (const item of path) {
    if (item in result) {
      delete result[item];
    }
  }
  return result;
};
export { omit };
