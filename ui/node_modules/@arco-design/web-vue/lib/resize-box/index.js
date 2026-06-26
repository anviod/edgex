"use strict";
var globalConfig = require("../_utils/global-config.js");
var resizeBox = require("./resize-box.js");
const ResizeBox = Object.assign(resizeBox, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + resizeBox.name, resizeBox);
  }
});
module.exports = ResizeBox;
