"use strict";
var iconNav = require("./icon-nav.js");
const IconNav = Object.assign(iconNav, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconNav.name, iconNav);
  }
});
module.exports = IconNav;
