import _IconOrderedList from "./icon-ordered-list.js";
const IconOrderedList = Object.assign(_IconOrderedList, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconOrderedList.name, _IconOrderedList);
  }
});
export { IconOrderedList as default };
