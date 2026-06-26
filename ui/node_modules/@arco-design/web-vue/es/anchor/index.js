import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Anchor from "./anchor.js";
import AnchorLink from "./anchor-link.js";
export { default as AnchorLink } from "./anchor-link.js";
const Anchor = Object.assign(_Anchor, {
  Link: AnchorLink,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Anchor.name, _Anchor);
    app.component(componentPrefix + AnchorLink.name, AnchorLink);
  }
});
export { Anchor as default };
