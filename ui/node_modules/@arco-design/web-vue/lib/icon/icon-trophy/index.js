"use strict";
var iconTrophy = require("./icon-trophy.js");
const IconTrophy = Object.assign(iconTrophy, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconTrophy.name, iconTrophy);
  }
});
module.exports = IconTrophy;
