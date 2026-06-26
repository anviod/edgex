"use strict";
var iconThunderbolt = require("./icon-thunderbolt.js");
const IconThunderbolt = Object.assign(iconThunderbolt, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconThunderbolt.name, iconThunderbolt);
  }
});
module.exports = IconThunderbolt;
