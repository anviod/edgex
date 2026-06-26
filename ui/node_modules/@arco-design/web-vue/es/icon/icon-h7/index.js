import _IconH7 from "./icon-h7.js";
const IconH7 = Object.assign(_IconH7, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconH7.name, _IconH7);
  }
});
export { IconH7 as default };
