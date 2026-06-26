"use strict";
var globalConfig = require("../_utils/global-config.js");
var tree = require("./tree.js");
const Tree = Object.assign(tree, {
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + tree.name, tree);
  }
});
module.exports = Tree;
