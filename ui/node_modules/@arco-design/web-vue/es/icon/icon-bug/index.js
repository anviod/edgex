import _IconBug from "./icon-bug.js";
const IconBug = Object.assign(_IconBug, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBug.name, _IconBug);
  }
});
export { IconBug as default };
