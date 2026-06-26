import _IconApps from "./icon-apps.js";
const IconApps = Object.assign(_IconApps, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconApps.name, _IconApps);
  }
});
export { IconApps as default };
