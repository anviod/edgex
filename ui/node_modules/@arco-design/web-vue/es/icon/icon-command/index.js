import _IconCommand from "./icon-command.js";
const IconCommand = Object.assign(_IconCommand, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCommand.name, _IconCommand);
  }
});
export { IconCommand as default };
