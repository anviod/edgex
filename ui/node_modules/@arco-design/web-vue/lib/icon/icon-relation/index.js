"use strict";
var iconRelation = require("./icon-relation.js");
const IconRelation = Object.assign(iconRelation, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRelation.name, iconRelation);
  }
});
module.exports = IconRelation;
