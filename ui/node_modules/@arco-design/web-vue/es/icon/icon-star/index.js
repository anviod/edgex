import _IconStar from "./icon-star.js";
const IconStar = Object.assign(_IconStar, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconStar.name, _IconStar);
  }
});
export { IconStar as default };
