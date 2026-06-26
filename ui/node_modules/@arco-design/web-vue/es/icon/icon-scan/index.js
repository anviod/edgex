import _IconScan from "./icon-scan.js";
const IconScan = Object.assign(_IconScan, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconScan.name, _IconScan);
  }
});
export { IconScan as default };
