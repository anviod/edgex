"use strict";
var iconWeiboCircleFill = require("./icon-weibo-circle-fill.js");
const IconWeiboCircleFill = Object.assign(iconWeiboCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconWeiboCircleFill.name, iconWeiboCircleFill);
  }
});
module.exports = IconWeiboCircleFill;
