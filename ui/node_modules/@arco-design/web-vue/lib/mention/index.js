"use strict";
var globalConfig = require("../_utils/global-config.js");
var mention = require("./mention.js");
const Mention = Object.assign(mention, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + mention.name, mention);
  }
});
module.exports = Mention;
