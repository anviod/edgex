import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Tag from "./tag.js";
const Tag = Object.assign(_Tag, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Tag.name, _Tag);
  }
});
export { Tag as default };
