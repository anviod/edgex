"use strict";
var globalConfig = require("../_utils/global-config.js");
var tag = require("./tag.js");
const Tag = Object.assign(tag, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + tag.name, tag);
  }
});
module.exports = Tag;
