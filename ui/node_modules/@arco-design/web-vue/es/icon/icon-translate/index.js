import _IconTranslate from "./icon-translate.js";
const IconTranslate = Object.assign(_IconTranslate, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconTranslate.name, _IconTranslate);
  }
});
export { IconTranslate as default };
