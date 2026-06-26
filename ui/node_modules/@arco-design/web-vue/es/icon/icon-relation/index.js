import _IconRelation from "./icon-relation.js";
const IconRelation = Object.assign(_IconRelation, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconRelation.name, _IconRelation);
  }
});
export { IconRelation as default };
