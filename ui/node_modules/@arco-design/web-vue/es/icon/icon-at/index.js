import _IconAt from "./icon-at.js";
const IconAt = Object.assign(_IconAt, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconAt.name, _IconAt);
  }
});
export { IconAt as default };
