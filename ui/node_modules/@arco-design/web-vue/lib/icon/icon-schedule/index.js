"use strict";
var iconSchedule = require("./icon-schedule.js");
const IconSchedule = Object.assign(iconSchedule, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconSchedule.name, iconSchedule);
  }
});
module.exports = IconSchedule;
