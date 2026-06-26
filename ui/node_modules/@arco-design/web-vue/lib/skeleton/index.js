"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var skeleton = require("./skeleton.js");
var line = require("./line.js");
var shape = require("./shape.js");
const Skeleton = Object.assign(skeleton, {
  Line: line,
  Shape: shape,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + skeleton.name, skeleton);
    app.component(componentPrefix + line.name, line);
    app.component(componentPrefix + shape.name, shape);
  }
});
exports.SkeletonLine = line;
exports.SkeletonShape = shape;
exports["default"] = Skeleton;
