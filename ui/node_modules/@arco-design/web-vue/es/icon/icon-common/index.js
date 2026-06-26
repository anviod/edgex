import _IconCommon from "./icon-common.js";
const IconCommon = Object.assign(_IconCommon, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCommon.name, _IconCommon);
  }
});
export { IconCommon as default };
