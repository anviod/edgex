"use strict";
var vue = require("vue");
var context = require("../context.js");
function useMenuContext() {
  const menuContext = vue.inject(context.MenuInjectionKey);
  return menuContext || {};
}
module.exports = useMenuContext;
