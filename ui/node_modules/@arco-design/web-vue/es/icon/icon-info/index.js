import _IconInfo from "./icon-info.js";
const IconInfo = Object.assign(_IconInfo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconInfo.name, _IconInfo);
  }
});
export { IconInfo as default };
