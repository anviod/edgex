import _IconArchive from "./icon-archive.js";
const IconArchive = Object.assign(_IconArchive, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconArchive.name, _IconArchive);
  }
});
export { IconArchive as default };
