"use strict";
var globalConfig = require("../_utils/global-config.js");
var pageHeader = require("./page-header.js");
const PageHeader = Object.assign(pageHeader, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + pageHeader.name, pageHeader);
  }
});
module.exports = PageHeader;
