"use strict";
var globalConfig = require("../_utils/global-config.js");
var upload = require("./upload.js");
const Upload = Object.assign(upload, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + upload.name, upload);
  }
});
module.exports = Upload;
