import _IconUnderline from "./icon-underline.js";
const IconUnderline = Object.assign(_IconUnderline, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUnderline.name, _IconUnderline);
  }
});
export { IconUnderline as default };
