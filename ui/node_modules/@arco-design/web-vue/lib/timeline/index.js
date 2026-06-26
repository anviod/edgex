"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var timeline = require("./timeline.js");
var item = require("./item.js");
const Timeline = Object.assign(timeline, {
  Item: item,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + timeline.name, timeline);
    app.component(componentPrefix + item.name, item);
  }
});
exports.TimelineItem = item;
exports["default"] = Timeline;
