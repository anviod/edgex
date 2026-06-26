"use strict";
var iconQuestionCircleFill = require("./icon-question-circle-fill.js");
const IconQuestionCircleFill = Object.assign(iconQuestionCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconQuestionCircleFill.name, iconQuestionCircleFill);
  }
});
module.exports = IconQuestionCircleFill;
