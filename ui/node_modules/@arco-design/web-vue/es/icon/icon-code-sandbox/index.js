import _IconCodeSandbox from "./icon-code-sandbox.js";
const IconCodeSandbox = Object.assign(_IconCodeSandbox, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCodeSandbox.name, _IconCodeSandbox);
  }
});
export { IconCodeSandbox as default };
