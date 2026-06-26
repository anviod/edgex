"use strict";
var iconFormula = require("./icon-formula.js");
const IconFormula = Object.assign(iconFormula, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconFormula.name, iconFormula);
  }
});
module.exports = IconFormula;
