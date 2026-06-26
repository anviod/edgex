"use strict";
var globalConfig = require("../_utils/global-config.js");
var result = require("./result.js");
const Result = Object.assign(result, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + result.name, result);
  }
});
module.exports = Result;
