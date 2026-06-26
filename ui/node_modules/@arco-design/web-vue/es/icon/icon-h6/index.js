import _IconH6 from "./icon-h6.js";
const IconH6 = Object.assign(_IconH6, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconH6.name, _IconH6);
  }
});
export { IconH6 as default };
