"use strict";
var globalConfig = require("../_utils/global-config.js");
var calendar = require("./calendar.js");
const Calendar = Object.assign(calendar, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + calendar.name, calendar);
  }
});
module.exports = Calendar;
