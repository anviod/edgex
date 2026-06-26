"use strict";
var globalConfig = require("../_utils/global-config.js");
var progress = require("./progress.js");
const Progress = Object.assign(progress, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + progress.name, progress);
  }
});
module.exports = Progress;
