import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import Empty$1 from "./empty.js";
const Empty = Object.assign(Empty$1, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + Empty$1.name, Empty$1);
  }
});
export { Empty as default };
