import _IconH1 from "./icon-h1.js";
const IconH1 = Object.assign(_IconH1, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconH1.name, _IconH1);
  }
});
export { IconH1 as default };
