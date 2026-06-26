"use strict";
var iconTag = require("./icon-tag.js");
const IconTag = Object.assign(iconTag, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconTag.name, iconTag);
  }
});
module.exports = IconTag;
