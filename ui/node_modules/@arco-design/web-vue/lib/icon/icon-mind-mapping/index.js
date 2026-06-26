"use strict";
var iconMindMapping = require("./icon-mind-mapping.js");
const IconMindMapping = Object.assign(iconMindMapping, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMindMapping.name, iconMindMapping);
  }
});
module.exports = IconMindMapping;
