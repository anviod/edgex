"use strict";
var globalConfig = require("../_utils/global-config.js");
var spin = require("./spin.js");
const Spin = Object.assign(spin, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + spin.name, spin);
  }
});
module.exports = Spin;
