import _IconLayout from "./icon-layout.js";
const IconLayout = Object.assign(_IconLayout, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLayout.name, _IconLayout);
  }
});
export { IconLayout as default };
