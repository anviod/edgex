"use strict";
var iconRecord = require("./icon-record.js");
const IconRecord = Object.assign(iconRecord, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconRecord.name, iconRecord);
  }
});
module.exports = IconRecord;
