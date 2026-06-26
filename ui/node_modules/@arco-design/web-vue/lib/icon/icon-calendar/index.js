"use strict";
var iconCalendar = require("./icon-calendar.js");
const IconCalendar = Object.assign(iconCalendar, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCalendar.name, iconCalendar);
  }
});
module.exports = IconCalendar;
