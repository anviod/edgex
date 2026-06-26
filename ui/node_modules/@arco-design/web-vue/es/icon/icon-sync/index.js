import _IconSync from "./icon-sync.js";
const IconSync = Object.assign(_IconSync, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSync.name, _IconSync);
  }
});
export { IconSync as default };
