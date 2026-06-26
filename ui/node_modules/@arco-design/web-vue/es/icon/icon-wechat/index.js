import _IconWechat from "./icon-wechat.js";
const IconWechat = Object.assign(_IconWechat, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconWechat.name, _IconWechat);
  }
});
export { IconWechat as default };
