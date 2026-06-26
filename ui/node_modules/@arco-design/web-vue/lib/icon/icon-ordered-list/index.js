"use strict";
var iconOrderedList = require("./icon-ordered-list.js");
const IconOrderedList = Object.assign(iconOrderedList, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconOrderedList.name, iconOrderedList);
  }
});
module.exports = IconOrderedList;
