import _IconUnlock from "./icon-unlock.js";
const IconUnlock = Object.assign(_IconUnlock, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUnlock.name, _IconUnlock);
  }
});
export { IconUnlock as default };
