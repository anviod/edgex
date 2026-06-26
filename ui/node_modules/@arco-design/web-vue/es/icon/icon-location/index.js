import _IconLocation from "./icon-location.js";
const IconLocation = Object.assign(_IconLocation, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLocation.name, _IconLocation);
  }
});
export { IconLocation as default };
