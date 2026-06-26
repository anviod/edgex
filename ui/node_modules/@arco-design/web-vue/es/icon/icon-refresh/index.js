import _IconRefresh from "./icon-refresh.js";
const IconRefresh = Object.assign(_IconRefresh, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRefresh.name, _IconRefresh);
  }
});
export { IconRefresh as default };
