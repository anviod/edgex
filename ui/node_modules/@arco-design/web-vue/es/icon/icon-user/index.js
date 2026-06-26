import _IconUser from "./icon-user.js";
const IconUser = Object.assign(_IconUser, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUser.name, _IconUser);
  }
});
export { IconUser as default };
