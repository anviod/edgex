import _IconMosaic from "./icon-mosaic.js";
const IconMosaic = Object.assign(_IconMosaic, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMosaic.name, _IconMosaic);
  }
});
export { IconMosaic as default };
