import _IconH2 from "./icon-h2.js";
const IconH2 = Object.assign(_IconH2, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconH2.name, _IconH2);
  }
});
export { IconH2 as default };
