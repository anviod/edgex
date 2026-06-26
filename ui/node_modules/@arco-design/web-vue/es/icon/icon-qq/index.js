import _IconQq from "./icon-qq.js";
const IconQq = Object.assign(_IconQq, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconQq.name, _IconQq);
  }
});
export { IconQq as default };
