"use strict";
var iconLoop = require("./icon-loop.js");
const IconLoop = Object.assign(iconLoop, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconLoop.name, iconLoop);
  }
});
module.exports = IconLoop;
