import _IconObliqueLine from "./icon-oblique-line.js";
const IconObliqueLine = Object.assign(_IconObliqueLine, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconObliqueLine.name, _IconObliqueLine);
  }
});
export { IconObliqueLine as default };
