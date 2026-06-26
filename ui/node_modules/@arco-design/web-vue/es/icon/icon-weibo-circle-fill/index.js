import _IconWeiboCircleFill from "./icon-weibo-circle-fill.js";
const IconWeiboCircleFill = Object.assign(_IconWeiboCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconWeiboCircleFill.name, _IconWeiboCircleFill);
  }
});
export { IconWeiboCircleFill as default };
