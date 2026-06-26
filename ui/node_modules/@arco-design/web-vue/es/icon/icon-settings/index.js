import _IconSettings from "./icon-settings.js";
const IconSettings = Object.assign(_IconSettings, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSettings.name, _IconSettings);
  }
});
export { IconSettings as default };
