import _IconPlus from "./icon-plus.js";
const IconPlus = Object.assign(_IconPlus, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconPlus.name, _IconPlus);
  }
});
export { IconPlus as default };
