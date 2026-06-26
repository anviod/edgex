import _IconShareInternal from "./icon-share-internal.js";
const IconShareInternal = Object.assign(_IconShareInternal, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconShareInternal.name, _IconShareInternal);
  }
});
export { IconShareInternal as default };
