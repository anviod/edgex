import _IconH4 from "./icon-h4.js";
const IconH4 = Object.assign(_IconH4, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconH4.name, _IconH4);
  }
});
export { IconH4 as default };
