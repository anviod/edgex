"use strict";
var globalConfig = require("../_utils/global-config.js");
var split = require("./split.js");
const Split = Object.assign(split, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + split.name, split);
  }
});
module.exports = Split;
