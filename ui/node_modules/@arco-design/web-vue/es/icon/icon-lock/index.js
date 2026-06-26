import _IconLock from "./icon-lock.js";
const IconLock = Object.assign(_IconLock, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLock.name, _IconLock);
  }
});
export { IconLock as default };
