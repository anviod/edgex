import _IconSave from "./icon-save.js";
const IconSave = Object.assign(_IconSave, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSave.name, _IconSave);
  }
});
export { IconSave as default };
