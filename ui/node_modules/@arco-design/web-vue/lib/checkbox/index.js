"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var checkbox = require("./checkbox.js");
var checkboxGroup = require("./checkbox-group.js");
const Checkbox = Object.assign(checkbox, {
  Group: checkboxGroup,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + checkbox.name, checkbox);
    app.component(componentPrefix + checkboxGroup.name, checkboxGroup);
  }
});
exports.CheckboxGroup = checkboxGroup;
exports["default"] = Checkbox;
