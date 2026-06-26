import _IconDelete from "./icon-delete.js";
const IconDelete = Object.assign(_IconDelete, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDelete.name, _IconDelete);
  }
});
export { IconDelete as default };
