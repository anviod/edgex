import _IconFile from "./icon-file.js";
const IconFile = Object.assign(_IconFile, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFile.name, _IconFile);
  }
});
export { IconFile as default };
