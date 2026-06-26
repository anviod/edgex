import _IconStarFill from "./icon-star-fill.js";
const IconStarFill = Object.assign(_IconStarFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconStarFill.name, _IconStarFill);
  }
});
export { IconStarFill as default };
