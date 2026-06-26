"use strict";
var iconQrcode = require("./icon-qrcode.js");
const IconQrcode = Object.assign(iconQrcode, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconQrcode.name, iconQrcode);
  }
});
module.exports = IconQrcode;
