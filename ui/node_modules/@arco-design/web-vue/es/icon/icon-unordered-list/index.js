import _IconUnorderedList from "./icon-unordered-list.js";
const IconUnorderedList = Object.assign(_IconUnorderedList, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUnorderedList.name, _IconUnorderedList);
  }
});
export { IconUnorderedList as default };
