import _IconMinus from "./icon-minus.js";
const IconMinus = Object.assign(_IconMinus, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMinus.name, _IconMinus);
  }
});
export { IconMinus as default };
