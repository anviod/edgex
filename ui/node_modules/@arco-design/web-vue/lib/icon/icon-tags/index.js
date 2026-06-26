"use strict";
var iconTags = require("./icon-tags.js");
const IconTags = Object.assign(iconTags, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconTags.name, iconTags);
  }
});
module.exports = IconTags;
