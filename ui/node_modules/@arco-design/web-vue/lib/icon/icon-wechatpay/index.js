"use strict";
var iconWechatpay = require("./icon-wechatpay.js");
const IconWechatpay = Object.assign(iconWechatpay, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + iconWechatpay.name, iconWechatpay);
  }
});
module.exports = IconWechatpay;
