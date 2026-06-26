"use strict";
var iconCustomerService = require("./icon-customer-service.js");
const IconCustomerService = Object.assign(iconCustomerService, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconCustomerService.name, iconCustomerService);
  }
});
module.exports = IconCustomerService;
