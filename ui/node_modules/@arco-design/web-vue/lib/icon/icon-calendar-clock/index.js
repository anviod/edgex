"use strict";
var iconCalendarClock = require("./icon-calendar-clock.js");
const IconCalendarClock = Object.assign(iconCalendarClock, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCalendarClock.name, iconCalendarClock);
  }
});
module.exports = IconCalendarClock;
