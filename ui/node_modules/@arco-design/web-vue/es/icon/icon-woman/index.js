import _IconWoman from "./icon-woman.js";
const IconWoman = Object.assign(_IconWoman, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconWoman.name, _IconWoman);
  }
});
export { IconWoman as default };
