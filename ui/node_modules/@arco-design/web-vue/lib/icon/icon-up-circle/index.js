"use strict";
var iconUpCircle = require("./icon-up-circle.js");
const IconUpCircle = Object.assign(iconUpCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUpCircle.name, iconUpCircle);
  }
});
module.exports = IconUpCircle;
