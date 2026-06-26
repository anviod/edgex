import _IconFolder from "./icon-folder.js";
const IconFolder = Object.assign(_IconFolder, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFolder.name, _IconFolder);
  }
});
export { IconFolder as default };
