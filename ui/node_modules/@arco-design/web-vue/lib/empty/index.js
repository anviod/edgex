"use strict";
var globalConfig = require("../_utils/global-config.js");
var empty = require("./empty.js");
const Empty = Object.assign(empty, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + empty.name, empty);
  }
});
module.exports = Empty;
