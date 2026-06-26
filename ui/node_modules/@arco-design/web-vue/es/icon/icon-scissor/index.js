import _IconScissor from "./icon-scissor.js";
const IconScissor = Object.assign(_IconScissor, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconScissor.name, _IconScissor);
  }
});
export { IconScissor as default };
