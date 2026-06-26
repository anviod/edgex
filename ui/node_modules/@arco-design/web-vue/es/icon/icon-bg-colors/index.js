import _IconBgColors from "./icon-bg-colors.js";
const IconBgColors = Object.assign(_IconBgColors, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBgColors.name, _IconBgColors);
  }
});
export { IconBgColors as default };
