import _IconLiveBroadcast from "./icon-live-broadcast.js";
const IconLiveBroadcast = Object.assign(_IconLiveBroadcast, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLiveBroadcast.name, _IconLiveBroadcast);
  }
});
export { IconLiveBroadcast as default };
