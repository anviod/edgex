import _IconPenFill from "./icon-pen-fill.js";
const IconPenFill = Object.assign(_IconPenFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPenFill.name, _IconPenFill);
  }
});
export { IconPenFill as default };
