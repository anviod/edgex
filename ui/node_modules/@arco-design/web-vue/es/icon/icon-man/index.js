import _IconMan from "./icon-man.js";
const IconMan = Object.assign(_IconMan, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconMan.name, _IconMan);
  }
});
export { IconMan as default };
