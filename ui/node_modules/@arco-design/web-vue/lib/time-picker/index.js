"use strict";
var globalConfig = require("../_utils/global-config.js");
var timePicker = require("./time-picker.js");
const TimePicker = Object.assign(timePicker, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + timePicker.name, timePicker);
  }
});
module.exports = TimePicker;
