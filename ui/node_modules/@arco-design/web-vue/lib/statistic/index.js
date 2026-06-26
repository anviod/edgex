"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var statistic = require("./statistic.js");
var countdown = require("./countdown.js");
const Statistic = Object.assign(statistic, {
  Countdown: countdown,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + statistic.name, statistic);
    app.component(componentPrefix + countdown.name, countdown);
  }
});
exports.Countdown = countdown;
exports["default"] = Statistic;
