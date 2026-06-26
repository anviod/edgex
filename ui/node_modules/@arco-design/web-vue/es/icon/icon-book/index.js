import _IconBook from "./icon-book.js";
const IconBook = Object.assign(_IconBook, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconBook.name, _IconBook);
  }
});
export { IconBook as default };
