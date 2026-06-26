import _IconFindReplace from "./icon-find-replace.js";
const IconFindReplace = Object.assign(_IconFindReplace, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFindReplace.name, _IconFindReplace);
  }
});
export { IconFindReplace as default };
