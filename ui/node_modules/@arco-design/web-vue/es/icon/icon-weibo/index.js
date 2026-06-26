import _IconWeibo from "./icon-weibo.js";
const IconWeibo = Object.assign(_IconWeibo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconWeibo.name, _IconWeibo);
  }
});
export { IconWeibo as default };
