"use strict";
var iconEdit = require("./icon-edit.js");
const IconEdit = Object.assign(iconEdit, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconEdit.name, iconEdit);
  }
});
module.exports = IconEdit;
