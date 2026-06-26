"use strict";
var iconImage = require("./icon-image.js");
const IconImage = Object.assign(iconImage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconImage.name, iconImage);
  }
});
module.exports = IconImage;
