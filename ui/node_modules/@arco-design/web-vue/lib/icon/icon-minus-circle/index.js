"use strict";
var iconMinusCircle = require("./icon-minus-circle.js");
const IconMinusCircle = Object.assign(iconMinusCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconMinusCircle.name, iconMinusCircle);
  }
});
module.exports = IconMinusCircle;
