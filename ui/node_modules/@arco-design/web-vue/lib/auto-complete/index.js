"use strict";
var globalConfig = require("../_utils/global-config.js");
var autoComplete = require("./auto-complete.js");
const AutoComplete = Object.assign(autoComplete, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + autoComplete.name, autoComplete);
  }
});
module.exports = AutoComplete;
