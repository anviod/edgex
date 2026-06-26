"use strict";
var iconSubscribeAdd = require("./icon-subscribe-add.js");
const IconSubscribeAdd = Object.assign(iconSubscribeAdd, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSubscribeAdd.name, iconSubscribeAdd);
  }
});
module.exports = IconSubscribeAdd;
