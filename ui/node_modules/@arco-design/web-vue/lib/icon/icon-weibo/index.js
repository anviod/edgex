"use strict";
var iconWeibo = require("./icon-weibo.js");
const IconWeibo = Object.assign(iconWeibo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconWeibo.name, iconWeibo);
  }
});
module.exports = IconWeibo;
