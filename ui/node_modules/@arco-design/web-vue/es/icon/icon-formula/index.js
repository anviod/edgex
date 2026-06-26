import _IconFormula from "./icon-formula.js";
const IconFormula = Object.assign(_IconFormula, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconFormula.name, _IconFormula);
  }
});
export { IconFormula as default };
