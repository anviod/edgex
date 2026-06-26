"use strict";
var iconBookmark = require("./icon-bookmark.js");
const IconBookmark = Object.assign(iconBookmark, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBookmark.name, iconBookmark);
  }
});
module.exports = IconBookmark;
