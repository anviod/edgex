"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const getTextBeforeSelection = (element) => {
  const { value, selectionStart } = element;
  return value.slice(0, selectionStart);
};
const getLastMeasureIndex = (text, prefix) => {
  const _prefix = [].concat(prefix);
  return _prefix.reduce(
    (pre, value) => {
      const lastIndex = text.lastIndexOf(value);
      if (lastIndex > pre.location) {
        return {
          location: lastIndex,
          prefix: value
        };
      }
      return pre;
    },
    {
      location: -1,
      prefix: ""
    }
  );
};
const isValidSearch = (text, split) => {
  return !split || !text.includes(split);
};
exports.getLastMeasureIndex = getLastMeasureIndex;
exports.getTextBeforeSelection = getTextBeforeSelection;
exports.isValidSearch = isValidSearch;
