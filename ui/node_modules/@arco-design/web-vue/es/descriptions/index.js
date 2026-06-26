import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Descriptions from "./descriptions.js";
import DescriptionsItem from "./descriptions-item.js";
export { default as DescriptionsItem } from "./descriptions-item.js";
const Descriptions = Object.assign(_Descriptions, {
  DescriptionsItem,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Descriptions.name, _Descriptions);
    app.component(componentPrefix + DescriptionsItem.name, DescriptionsItem);
  }
});
export { Descriptions as default };
