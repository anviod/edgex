"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var image = require("./image.js");
var preview = require("./preview.js");
var previewGroup = require("./preview-group.js");
var previewAction = require("./preview-action.js");
const Image = Object.assign(image, {
  Preview: preview,
  PreviewGroup: previewGroup,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + image.name, image);
    app.component(componentPrefix + preview.name, preview);
    app.component(
      componentPrefix + previewGroup.name,
      previewGroup
    );
    app.component(
      componentPrefix + previewAction.name,
      previewAction
    );
  }
});
exports.ImagePreview = preview;
exports.ImagePreviewGroup = previewGroup;
exports.ImagePreviewAction = previewAction;
exports["default"] = Image;
