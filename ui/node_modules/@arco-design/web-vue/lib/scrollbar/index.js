"use strict";
var globalConfig = require("../_utils/global-config.js");
var scrollbar = require("./scrollbar.js");
const Scrollbar = Object.assign(scrollbar, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + scrollbar.name, scrollbar);
  }
});
module.exports = Scrollbar;
