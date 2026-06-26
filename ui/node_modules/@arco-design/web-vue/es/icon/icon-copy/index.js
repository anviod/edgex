import _IconCopy from "./icon-copy.js";
const IconCopy = Object.assign(_IconCopy, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCopy.name, _IconCopy);
  }
});
export { IconCopy as default };
