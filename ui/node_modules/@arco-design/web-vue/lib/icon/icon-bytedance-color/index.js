"use strict";
var iconBytedanceColor = require("./icon-bytedance-color.js");
const IconBytedanceColor = Object.assign(iconBytedanceColor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBytedanceColor.name, iconBytedanceColor);
  }
});
module.exports = IconBytedanceColor;
