"use strict";
var iconInteraction = require("./icon-interaction.js");
const IconInteraction = Object.assign(iconInteraction, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconInteraction.name, iconInteraction);
  }
});
module.exports = IconInteraction;
