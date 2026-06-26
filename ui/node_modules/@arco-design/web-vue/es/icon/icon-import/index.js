import _IconImport from "./icon-import.js";
const IconImport = Object.assign(_IconImport, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconImport.name, _IconImport);
  }
});
export { IconImport as default };
