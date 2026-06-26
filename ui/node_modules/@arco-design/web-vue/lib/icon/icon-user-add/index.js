"use strict";
var iconUserAdd = require("./icon-user-add.js");
const IconUserAdd = Object.assign(iconUserAdd, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUserAdd.name, iconUserAdd);
  }
});
module.exports = IconUserAdd;
