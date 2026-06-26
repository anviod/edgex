import _IconUserAdd from "./icon-user-add.js";
const IconUserAdd = Object.assign(_IconUserAdd, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUserAdd.name, _IconUserAdd);
  }
});
export { IconUserAdd as default };
