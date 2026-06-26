import _IconTrophy from "./icon-trophy.js";
const IconTrophy = Object.assign(_IconTrophy, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconTrophy.name, _IconTrophy);
  }
});
export { IconTrophy as default };
