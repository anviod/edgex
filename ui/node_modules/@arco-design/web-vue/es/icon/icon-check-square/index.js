import _IconCheckSquare from "./icon-check-square.js";
const IconCheckSquare = Object.assign(_IconCheckSquare, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCheckSquare.name, _IconCheckSquare);
  }
});
export { IconCheckSquare as default };
