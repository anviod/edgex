"use strict";
var globalConfig = require("../_utils/global-config.js");
var rate = require("./rate.js");
const Rate = Object.assign(rate, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + rate.name, rate);
  }
});
module.exports = Rate;
