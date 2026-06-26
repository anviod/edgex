"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const target = typeof window === "undefined" ? global : window;
const raf = target.requestAnimationFrame;
const caf = target.cancelAnimationFrame;
exports.caf = caf;
exports.raf = raf;
