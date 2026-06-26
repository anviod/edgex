import _IconUndo from "./icon-undo.js";
const IconUndo = Object.assign(_IconUndo, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconUndo.name, _IconUndo);
  }
});
export { IconUndo as default };
