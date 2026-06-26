import _IconCode from "./icon-code.js";
const IconCode = Object.assign(_IconCode, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCode.name, _IconCode);
  }
});
export { IconCode as default };
