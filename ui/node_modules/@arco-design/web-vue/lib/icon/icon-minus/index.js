"use strict";
var iconMinus = require("./icon-minus.js");
const IconMinus = Object.assign(iconMinus, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMinus.name, iconMinus);
  }
});
module.exports = IconMinus;
