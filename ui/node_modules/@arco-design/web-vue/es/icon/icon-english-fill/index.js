import _IconEnglishFill from "./icon-english-fill.js";
const IconEnglishFill = Object.assign(_IconEnglishFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconEnglishFill.name, _IconEnglishFill);
  }
});
export { IconEnglishFill as default };
