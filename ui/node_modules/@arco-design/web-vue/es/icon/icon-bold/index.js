import _IconBold from "./icon-bold.js";
const IconBold = Object.assign(_IconBold, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBold.name, _IconBold);
  }
});
export { IconBold as default };
