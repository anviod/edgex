"use strict";
var globalConfig = require("../_utils/global-config.js");
var popconfirm = require("./popconfirm.js");
const Popconfirm = Object.assign(popconfirm, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + popconfirm.name, popconfirm);
  }
});
module.exports = Popconfirm;
