import _IconItalic from "./icon-italic.js";
const IconItalic = Object.assign(_IconItalic, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconItalic.name, _IconItalic);
  }
});
export { IconItalic as default };
