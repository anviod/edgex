import _IconBookmark from "./icon-bookmark.js";
const IconBookmark = Object.assign(_IconBookmark, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBookmark.name, _IconBookmark);
  }
});
export { IconBookmark as default };
