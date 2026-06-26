"use strict";
var iconCodeBlock = require("./icon-code-block.js");
const IconCodeBlock = Object.assign(iconCodeBlock, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCodeBlock.name, iconCodeBlock);
  }
});
module.exports = IconCodeBlock;
