import _IconComputer from "./icon-computer.js";
const IconComputer = Object.assign(_IconComputer, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconComputer.name, _IconComputer);
  }
});
export { IconComputer as default };
