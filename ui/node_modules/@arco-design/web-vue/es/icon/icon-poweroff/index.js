import _IconPoweroff from "./icon-poweroff.js";
const IconPoweroff = Object.assign(_IconPoweroff, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPoweroff.name, _IconPoweroff);
  }
});
export { IconPoweroff as default };
