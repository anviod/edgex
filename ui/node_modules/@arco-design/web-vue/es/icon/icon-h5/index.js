import _IconH5 from "./icon-h5.js";
const IconH5 = Object.assign(_IconH5, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconH5.name, _IconH5);
  }
});
export { IconH5 as default };
