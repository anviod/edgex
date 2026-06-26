import _IconQqZone from "./icon-qq-zone.js";
const IconQqZone = Object.assign(_IconQqZone, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconQqZone.name, _IconQqZone);
  }
});
export { IconQqZone as default };
