"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var radio = require("./radio.js");
var radioGroup = require("./radio-group.js");
const Radio = Object.assign(radio, {
  Group: radioGroup,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + radio.name, radio);
    app.component(componentPrefix + radioGroup.name, radioGroup);
  }
});
exports.RadioGroup = radioGroup;
exports["default"] = Radio;
