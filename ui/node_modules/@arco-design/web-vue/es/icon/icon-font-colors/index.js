import _IconFontColors from "./icon-font-colors.js";
const IconFontColors = Object.assign(_IconFontColors, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFontColors.name, _IconFontColors);
  }
});
export { IconFontColors as default };
