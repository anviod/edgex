import _IconFolderDelete from "./icon-folder-delete.js";
const IconFolderDelete = Object.assign(_IconFolderDelete, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFolderDelete.name, _IconFolderDelete);
  }
});
export { IconFolderDelete as default };
