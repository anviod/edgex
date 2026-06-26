import _IconShareAlt from "./icon-share-alt.js";
const IconShareAlt = Object.assign(_IconShareAlt, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconShareAlt.name, _IconShareAlt);
  }
});
export { IconShareAlt as default };
