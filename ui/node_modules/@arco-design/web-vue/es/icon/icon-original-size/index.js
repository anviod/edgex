import _IconOriginalSize from "./icon-original-size.js";
const IconOriginalSize = Object.assign(_IconOriginalSize, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconOriginalSize.name, _IconOriginalSize);
  }
});
export { IconOriginalSize as default };
