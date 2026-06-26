"use strict";
var iconBook = require("./icon-book.js");
const IconBook = Object.assign(iconBook, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconBook.name, iconBook);
  }
});
module.exports = IconBook;
