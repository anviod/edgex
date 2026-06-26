import _IconLanguage from "./icon-language.js";
const IconLanguage = Object.assign(_IconLanguage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLanguage.name, _IconLanguage);
  }
});
export { IconLanguage as default };
