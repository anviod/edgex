import _IconPushpin from "./icon-pushpin.js";
const IconPushpin = Object.assign(_IconPushpin, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPushpin.name, _IconPushpin);
  }
});
export { IconPushpin as default };
