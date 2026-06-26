"use strict";
var globalConfig = require("../_utils/global-config.js");
var colorPicker = require("./color-picker.js");
const ColorPicker = Object.assign(colorPicker, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + colorPicker.name, colorPicker);
  }
});
module.exports = ColorPicker;
