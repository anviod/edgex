"use strict";
var iconWoman = require("./icon-woman.js");
const IconWoman = Object.assign(iconWoman, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconWoman.name, iconWoman);
  }
});
module.exports = IconWoman;
