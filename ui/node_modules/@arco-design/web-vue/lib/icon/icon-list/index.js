"use strict";
var iconList = require("./icon-list.js");
const IconList = Object.assign(iconList, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconList.name, iconList);
  }
});
module.exports = IconList;
