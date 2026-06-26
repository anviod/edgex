"use strict";
var iconStar = require("./icon-star.js");
const IconStar = Object.assign(iconStar, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconStar.name, iconStar);
  }
});
module.exports = IconStar;
