import _IconList from "./icon-list.js";
const IconList = Object.assign(_IconList, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconList.name, _IconList);
  }
});
export { IconList as default };
