"use strict";
var iconUndo = require("./icon-undo.js");
const IconUndo = Object.assign(iconUndo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconUndo.name, iconUndo);
  }
});
module.exports = IconUndo;
