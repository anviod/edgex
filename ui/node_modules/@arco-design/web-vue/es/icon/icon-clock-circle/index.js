import _IconClockCircle from "./icon-clock-circle.js";
const IconClockCircle = Object.assign(_IconClockCircle, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconClockCircle.name, _IconClockCircle);
  }
});
export { IconClockCircle as default };
