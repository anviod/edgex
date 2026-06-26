"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var steps = require("./steps.js");
var step = require("./step.js");
const Steps = Object.assign(steps, {
  Step: step,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + steps.name, steps);
    app.component(componentPrefix + step.name, step);
  }
});
exports.Step = step;
exports["default"] = Steps;
