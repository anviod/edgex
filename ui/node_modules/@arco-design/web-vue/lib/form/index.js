"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var form = require("./form.js");
var formItem = require("./form-item.js");
const Form = Object.assign(form, {
  Item: formItem,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + form.name, form);
    app.component(componentPrefix + formItem.name, formItem);
  }
});
exports.FormItem = formItem;
exports["default"] = Form;
