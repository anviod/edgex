"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var layout = require("./layout.js");
var header = require("./header.js");
var content = require("./content.js");
var footer = require("./footer.js");
var sider = require("./sider.js");
const Layout = Object.assign(layout, {
  Header: header,
  Content: content,
  Footer: footer,
  Sider: sider,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + layout.name, layout);
    app.component(componentPrefix + header.name, header);
    app.component(componentPrefix + content.name, content);
    app.component(componentPrefix + footer.name, footer);
    app.component(componentPrefix + sider.name, sider);
  }
});
exports.LayoutHeader = header;
exports.LayoutContent = content;
exports.LayoutFooter = footer;
exports.LayoutSider = sider;
exports["default"] = Layout;
