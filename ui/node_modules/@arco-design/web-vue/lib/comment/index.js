"use strict";
var globalConfig = require("../_utils/global-config.js");
var comment = require("./comment.js");
const Comment = Object.assign(comment, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + comment.name, comment);
  }
});
module.exports = Comment;
