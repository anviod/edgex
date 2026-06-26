"use strict";
var iconUnorderedList = require("./icon-unordered-list.js");
const IconUnorderedList = Object.assign(iconUnorderedList, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUnorderedList.name, iconUnorderedList);
  }
});
module.exports = IconUnorderedList;
