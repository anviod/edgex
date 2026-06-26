"use strict";
var globalConfig = require("../_utils/global-config.js");
var slider = require("./slider.js");
const Slider = Object.assign(slider, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + slider.name, slider);
  }
});
module.exports = Slider;
