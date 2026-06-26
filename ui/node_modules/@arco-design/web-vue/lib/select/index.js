"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var select = require("./select.js");
var option = require("./option.js");
var optgroup = require("./optgroup.js");
const Select = Object.assign(select, {
  Option: option,
  OptGroup: optgroup,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + select.name, select);
    app.component(componentPrefix + option.name, option);
    app.component(componentPrefix + optgroup.name, optgroup);
  }
});
exports.Option = option;
exports.Optgroup = optgroup;
exports["default"] = Select;
