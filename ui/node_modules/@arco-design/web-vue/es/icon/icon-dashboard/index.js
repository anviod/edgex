import _IconDashboard from "./icon-dashboard.js";
const IconDashboard = Object.assign(_IconDashboard, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDashboard.name, _IconDashboard);
  }
});
export { IconDashboard as default };
