"use strict";
var globalConfig = require("../_utils/global-config.js");
var watermark = require("./watermark.js");
const Watermark = Object.assign(watermark, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + watermark.name, watermark);
  }
});
module.exports = Watermark;
