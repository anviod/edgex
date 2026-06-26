import _IconArrowRise from "./icon-arrow-rise.js";
const IconArrowRise = Object.assign(_IconArrowRise, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconArrowRise.name, _IconArrowRise);
  }
});
export { IconArrowRise as default };
