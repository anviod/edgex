"use strict";
var globalConfig = require("../_utils/global-config.js");
var link = require("./link.js");
const Link = Object.assign(link, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + link.name, link);
  }
});
module.exports = Link;
