import _IconLayers from "./icon-layers.js";
const IconLayers = Object.assign(_IconLayers, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLayers.name, _IconLayers);
  }
});
export { IconLayers as default };
