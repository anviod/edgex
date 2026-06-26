import _IconStop from "./icon-stop.js";
const IconStop = Object.assign(_IconStop, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconStop.name, _IconStop);
  }
});
export { IconStop as default };
