"use strict";
var globalConfig = require("../_utils/global-config.js");
var transfer = require("./transfer.js");
const Transfer = Object.assign(transfer, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + transfer.name, transfer);
  }
});
module.exports = Transfer;
