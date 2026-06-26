"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
function hasPropOrSlot(props, slots, propName) {
  return vue.computed(() => Boolean(props[propName] || slots[propName]));
}
exports.hasPropOrSlot = hasPropOrSlot;
