import _IconExport from "./icon-export.js";
const IconExport = Object.assign(_IconExport, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconExport.name, _IconExport);
  }
});
export { IconExport as default };
