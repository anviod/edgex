"use strict";
var globalConfig = require("../_utils/global-config.js");
var icon = require("./icon.js");
var addFromIconFontCn = require("./add-from-icon-font-cn.js");
const Icon = Object.assign(icon, {
  addFromIconFontCn: addFromIconFontCn.addFromIconFontCn,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + icon.name, icon);
  }
});
module.exports = Icon;
