"use strict";
var globalConfig = require("../_utils/global-config.js");
var configProvider = require("./config-provider.js");
const ConfigProvider = Object.assign(configProvider, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + configProvider.name, configProvider);
  }
});
module.exports = ConfigProvider;
