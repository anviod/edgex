"use strict";
var globalConfig = require("../_utils/global-config.js");
var affix = require("./affix.js");
const Affix = Object.assign(affix, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + affix.name, affix);
  }
});
module.exports = Affix;
