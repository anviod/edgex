import _IconGift from "./icon-gift.js";
const IconGift = Object.assign(_IconGift, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconGift.name, _IconGift);
  }
});
export { IconGift as default };
