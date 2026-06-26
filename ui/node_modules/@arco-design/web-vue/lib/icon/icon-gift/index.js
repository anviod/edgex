"use strict";
var iconGift = require("./icon-gift.js");
const IconGift = Object.assign(iconGift, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconGift.name, iconGift);
  }
});
module.exports = IconGift;
