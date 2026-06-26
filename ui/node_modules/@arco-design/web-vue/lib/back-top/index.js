"use strict";
var globalConfig = require("../_utils/global-config.js");
var backTop = require("./back-top.js");
const BackTop = Object.assign(backTop, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + backTop.name, backTop);
  }
});
module.exports = BackTop;
