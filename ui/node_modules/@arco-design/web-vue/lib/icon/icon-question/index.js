"use strict";
var iconQuestion = require("./icon-question.js");
const IconQuestion = Object.assign(iconQuestion, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconQuestion.name, iconQuestion);
  }
});
module.exports = IconQuestion;
