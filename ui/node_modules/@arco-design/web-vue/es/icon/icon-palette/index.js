import _IconPalette from "./icon-palette.js";
const IconPalette = Object.assign(_IconPalette, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPalette.name, _IconPalette);
  }
});
export { IconPalette as default };
