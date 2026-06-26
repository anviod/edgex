import _IconQuote from "./icon-quote.js";
const IconQuote = Object.assign(_IconQuote, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconQuote.name, _IconQuote);
  }
});
export { IconQuote as default };
