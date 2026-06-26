import _IconShareExternal from "./icon-share-external.js";
const IconShareExternal = Object.assign(_IconShareExternal, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconShareExternal.name, _IconShareExternal);
  }
});
export { IconShareExternal as default };
