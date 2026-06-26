import _IconSwap from "./icon-swap.js";
const IconSwap = Object.assign(_IconSwap, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSwap.name, _IconSwap);
  }
});
export { IconSwap as default };
