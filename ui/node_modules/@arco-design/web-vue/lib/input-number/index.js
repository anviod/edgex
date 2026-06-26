"use strict";
var globalConfig = require("../_utils/global-config.js");
var inputNumber = require("./input-number.js");
const InputNumber = Object.assign(inputNumber, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + inputNumber.name, inputNumber);
  }
});
module.exports = InputNumber;
