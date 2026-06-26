"use strict";
var globalConfig = require("../_utils/global-config.js");
var space = require("./space.js");
const Space = Object.assign(space, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + space.name, space);
  }
});
module.exports = Space;
