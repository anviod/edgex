"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var raf = require("./raf.js");
function throttleByRaf(cb) {
  let timer = 0;
  const throttle = (...args) => {
    if (timer) {
      raf.caf(timer);
    }
    timer = raf.raf(() => {
      cb(...args);
      timer = 0;
    });
  };
  throttle.cancel = () => {
    raf.caf(timer);
    timer = 0;
  };
  return throttle;
}
exports.throttleByRaf = throttleByRaf;
