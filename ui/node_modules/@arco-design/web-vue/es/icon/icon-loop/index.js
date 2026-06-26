import _IconLoop from "./icon-loop.js";
const IconLoop = Object.assign(_IconLoop, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLoop.name, _IconLoop);
  }
});
export { IconLoop as default };
