"use strict";
var globalConfig = require("../_utils/global-config.js");
var inputTag = require("./input-tag.js");
const InputTag = Object.assign(inputTag, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + inputTag.name, inputTag);
  }
});
module.exports = InputTag;
