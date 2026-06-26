"use strict";
var iconRecordStop = require("./icon-record-stop.js");
const IconRecordStop = Object.assign(iconRecordStop, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRecordStop.name, iconRecordStop);
  }
});
module.exports = IconRecordStop;
