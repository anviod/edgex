import _IconWechatpay from "./icon-wechatpay.js";
const IconWechatpay = Object.assign(_IconWechatpay, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconWechatpay.name, _IconWechatpay);
  }
});
export { IconWechatpay as default };
