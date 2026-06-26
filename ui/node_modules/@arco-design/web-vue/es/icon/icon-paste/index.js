import _IconPaste from "./icon-paste.js";
const IconPaste = Object.assign(_IconPaste, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPaste.name, _IconPaste);
  }
});
export { IconPaste as default };
