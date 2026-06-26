"use strict";
var iconQuote = require("./icon-quote.js");
const IconQuote = Object.assign(iconQuote, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconQuote.name, iconQuote);
  }
});
module.exports = IconQuote;
