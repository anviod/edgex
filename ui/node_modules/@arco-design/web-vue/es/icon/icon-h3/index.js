import _IconH3 from "./icon-h3.js";
const IconH3 = Object.assign(_IconH3, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconH3.name, _IconH3);
  }
});
export { IconH3 as default };
