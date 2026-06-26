"use strict";
var globalConfig = require("../_utils/global-config.js");
var pagination = require("./pagination.js");
const Pagination = Object.assign(pagination, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + pagination.name, pagination);
  }
});
module.exports = Pagination;
