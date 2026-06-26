"use strict";
var globalConfig = require("../_utils/global-config.js");
var textarea = require("./textarea.js");
const Textarea = Object.assign(textarea, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + textarea.name, textarea);
  }
});
module.exports = Textarea;
