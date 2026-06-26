import _IconHistory from "./icon-history.js";
const IconHistory = Object.assign(_IconHistory, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconHistory.name, _IconHistory);
  }
});
export { IconHistory as default };
