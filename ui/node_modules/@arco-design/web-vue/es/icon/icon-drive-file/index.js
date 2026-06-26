import _IconDriveFile from "./icon-drive-file.js";
const IconDriveFile = Object.assign(_IconDriveFile, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDriveFile.name, _IconDriveFile);
  }
});
export { IconDriveFile as default };
