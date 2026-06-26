import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _PageHeader from "./page-header.js";
const PageHeader = Object.assign(_PageHeader, {
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _PageHeader.name, _PageHeader);
  }
});
export { PageHeader as default };
