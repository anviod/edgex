"use strict";
var vue = require("vue");
var context = require("../context.js");
function useDatePickerTransform() {
  const { datePickerT } = vue.inject(context.PickerInjectionKey) || {};
  return datePickerT || ((key, ...args) => key);
}
module.exports = useDatePickerTransform;
