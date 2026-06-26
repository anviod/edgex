import _IconCodeSquare from "./icon-code-square.js";
const IconCodeSquare = Object.assign(_IconCodeSquare, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCodeSquare.name, _IconCodeSquare);
  }
});
export { IconCodeSquare as default };
