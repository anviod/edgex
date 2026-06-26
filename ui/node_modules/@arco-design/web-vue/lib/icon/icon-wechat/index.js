"use strict";
var iconWechat = require("./icon-wechat.js");
const IconWechat = Object.assign(iconWechat, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconWechat.name, iconWechat);
  }
});
module.exports = IconWechat;
