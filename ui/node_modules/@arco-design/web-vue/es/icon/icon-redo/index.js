import _IconRedo from "./icon-redo.js";
const IconRedo = Object.assign(_IconRedo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRedo.name, _IconRedo);
  }
});
export { IconRedo as default };
