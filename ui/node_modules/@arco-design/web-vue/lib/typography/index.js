"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var typography = require("./typography.js");
var paragraph = require("./paragraph.js");
var title = require("./title.js");
var text = require("./text.js");
const Typography = Object.assign(typography, {
  Paragraph: paragraph,
  Title: title,
  Text: text,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + typography.name, typography);
    app.component(
      componentPrefix + paragraph.name,
      paragraph
    );
    app.component(componentPrefix + title.name, title);
    app.component(componentPrefix + text.name, text);
  }
});
exports.TypographyParagraph = paragraph;
exports.TypographyTitle = title;
exports.TypographyText = text;
exports["default"] = Typography;
