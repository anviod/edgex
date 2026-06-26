import _IconStorage from "./icon-storage.js";
const IconStorage = Object.assign(_IconStorage, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconStorage.name, _IconStorage);
  }
});
export { IconStorage as default };
