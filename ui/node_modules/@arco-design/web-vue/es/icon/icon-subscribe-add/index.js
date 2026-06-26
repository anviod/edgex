import _IconSubscribeAdd from "./icon-subscribe-add.js";
const IconSubscribeAdd = Object.assign(_IconSubscribeAdd, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconSubscribeAdd.name, _IconSubscribeAdd);
  }
});
export { IconSubscribeAdd as default };
