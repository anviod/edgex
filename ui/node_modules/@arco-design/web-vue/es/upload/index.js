import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Upload from "./upload.js";
const Upload = Object.assign(_Upload, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Upload.name, _Upload);
  }
});
export { Upload as default };
