import _IconImageClose from "./icon-image-close.js";
const IconImageClose = Object.assign(_IconImageClose, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconImageClose.name, _IconImageClose);
  }
});
export { IconImageClose as default };
