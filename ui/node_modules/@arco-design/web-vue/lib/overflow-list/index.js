"use strict";
var globalConfig = require("../_utils/global-config.js");
var overflowList = require("./overflow-list.js");
const OverflowList = Object.assign(overflowList, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + overflowList.name, overflowList);
  }
});
module.exports = OverflowList;
