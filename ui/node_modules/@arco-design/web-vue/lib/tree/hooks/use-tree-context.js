"use strict";
var vue = require("vue");
var context = require("../context.js");
function useTreeContext() {
  const treeContext = vue.inject(context.TreeInjectionKey);
  return treeContext || {};
}
module.exports = useTreeContext;
