"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var button = require("./button.js");
var buttonGroup = require("./button-group.js");
const Button = Object.assign(button, {
  Group: buttonGroup,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + button.name, button);
    app.component(componentPrefix + buttonGroup.name, buttonGroup);
  }
});
exports.ButtonGroup = buttonGroup;
exports["default"] = Button;
