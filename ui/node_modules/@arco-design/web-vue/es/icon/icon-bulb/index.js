import _IconBulb from "./icon-bulb.js";
const IconBulb = Object.assign(_IconBulb, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBulb.name, _IconBulb);
  }
});
export { IconBulb as default };
