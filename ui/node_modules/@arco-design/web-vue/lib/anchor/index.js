"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var anchor = require("./anchor.js");
var anchorLink = require("./anchor-link.js");
const Anchor = Object.assign(anchor, {
  Link: anchorLink,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + anchor.name, anchor);
    app.component(componentPrefix + anchorLink.name, anchorLink);
  }
});
exports.AnchorLink = anchorLink;
exports["default"] = Anchor;
