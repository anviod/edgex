"use strict";
var iconQuestionCircle = require("./icon-question-circle.js");
const IconQuestionCircle = Object.assign(iconQuestionCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconQuestionCircle.name, iconQuestionCircle);
  }
});
module.exports = IconQuestionCircle;
