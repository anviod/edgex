import _IconWifi from "./icon-wifi.js";
const IconWifi = Object.assign(_IconWifi, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconWifi.name, _IconWifi);
  }
});
export { IconWifi as default };
