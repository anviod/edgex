import _IconDice from "./icon-dice.js";
const IconDice = Object.assign(_IconDice, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconDice.name, _IconDice);
  }
});
export { IconDice as default };
