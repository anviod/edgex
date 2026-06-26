"use strict";
var iconMinusCircleFill = require("./icon-minus-circle-fill.js");
const IconMinusCircleFill = Object.assign(iconMinusCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMinusCircleFill.name, iconMinusCircleFill);
  }
});
module.exports = IconMinusCircleFill;
