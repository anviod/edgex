import _IconFolderAdd from "./icon-folder-add.js";
const IconFolderAdd = Object.assign(_IconFolderAdd, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFolderAdd.name, _IconFolderAdd);
  }
});
export { IconFolderAdd as default };
