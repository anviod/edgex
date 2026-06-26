"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var dropdown = require("./dropdown.js");
var dropdownOption = require("./dropdown-option.js");
var dropdownGroup = require("./dropdown-group.js");
var dropdownSubmenu = require("./dropdown-submenu.js");
var dropdownButton = require("./dropdown-button.js");
const Dropdown = Object.assign(dropdown, {
  Option: dropdownOption,
  Group: dropdownGroup,
  Submenu: dropdownSubmenu,
  Button: dropdownButton,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + dropdown.name, dropdown);
    app.component(componentPrefix + dropdownOption.name, dropdownOption);
    app.component(componentPrefix + dropdownGroup.name, dropdownGroup);
    app.component(componentPrefix + dropdownSubmenu.name, dropdownSubmenu);
    app.component(componentPrefix + dropdownButton.name, dropdownButton);
  }
});
exports.Doption = dropdownOption;
exports.Dgroup = dropdownGroup;
exports.Dsubmenu = dropdownSubmenu;
exports.DropdownButton = dropdownButton;
exports["default"] = Dropdown;
