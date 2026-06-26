"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var is = require("./is.js");
const KEYBOARD_KEY = {
  ENTER: "Enter",
  ESC: "Escape",
  BACKSPACE: "Backspace",
  TAB: "Tab",
  SPACE: " ",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight"
};
const stringifyCodeKey = (k) => {
  return JSON.stringify({
    key: k.key,
    ctrl: Boolean(k.ctrl),
    shift: Boolean(k.shift),
    alt: Boolean(k.alt),
    meta: Boolean(k.meta)
  });
};
const getKeyDownHandler = (codeKeyMap) => {
  const map = {};
  codeKeyMap.forEach((callback, codeKey) => {
    const _codeKey = is.isString(codeKey) ? { key: codeKey } : codeKey;
    map[stringifyCodeKey(_codeKey)] = callback;
  });
  return (event) => {
    const key = stringifyCodeKey({
      key: event.key,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey
    });
    const callback = map[key];
    if (callback) {
      event.stopPropagation();
      callback(event);
    }
  };
};
exports.KEYBOARD_KEY = KEYBOARD_KEY;
exports.getKeyDownHandler = getKeyDownHandler;
