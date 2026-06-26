"use strict";
var iconHeart = require("./icon-heart.js");
const IconHeart = Object.assign(iconHeart, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconHeart.name, iconHeart);
  }
});
module.exports = IconHeart;
