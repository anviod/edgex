import _IconSubscribed from "./icon-subscribed.js";
const IconSubscribed = Object.assign(_IconSubscribed, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSubscribed.name, _IconSubscribed);
  }
});
export { IconSubscribed as default };
