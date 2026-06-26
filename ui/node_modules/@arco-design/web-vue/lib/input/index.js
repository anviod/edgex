"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var input = require("./input.js");
var inputSearch = require("./input-search.js");
var inputPassword = require("./input-password.js");
var inputGroup = require("./input-group.js");
const Input = Object.assign(input, {
  Search: inputSearch,
  Password: inputPassword,
  Group: inputGroup,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + input.name, input);
    app.component(componentPrefix + inputGroup.name, inputGroup);
    app.component(componentPrefix + inputSearch.name, inputSearch);
    app.component(componentPrefix + inputPassword.name, inputPassword);
  }
});
exports.InputSearch = inputSearch;
exports.InputPassword = inputPassword;
exports.InputGroup = inputGroup;
exports["default"] = Input;
