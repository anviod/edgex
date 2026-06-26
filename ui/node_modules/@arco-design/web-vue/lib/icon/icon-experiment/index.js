"use strict";
var iconExperiment = require("./icon-experiment.js");
const IconExperiment = Object.assign(iconExperiment, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconExperiment.name, iconExperiment);
  }
});
module.exports = IconExperiment;
