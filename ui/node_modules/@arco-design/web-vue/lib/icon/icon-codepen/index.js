"use strict";
var iconCodepen = require("./icon-codepen.js");
const IconCodepen = Object.assign(iconCodepen, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCodepen.name, iconCodepen);
  }
});
module.exports = IconCodepen;
