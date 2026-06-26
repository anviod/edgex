import _IconSubscribe from "./icon-subscribe.js";
const IconSubscribe = Object.assign(_IconSubscribe, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSubscribe.name, _IconSubscribe);
  }
});
export { IconSubscribe as default };
