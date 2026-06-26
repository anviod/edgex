"use strict";
var iconIdcard = require("./icon-idcard.js");
const IconIdcard = Object.assign(iconIdcard, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconIdcard.name, iconIdcard);
  }
});
module.exports = IconIdcard;
