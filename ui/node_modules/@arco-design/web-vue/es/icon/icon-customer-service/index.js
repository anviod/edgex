import _IconCustomerService from "./icon-customer-service.js";
const IconCustomerService = Object.assign(_IconCustomerService, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCustomerService.name, _IconCustomerService);
  }
});
export { IconCustomerService as default };
