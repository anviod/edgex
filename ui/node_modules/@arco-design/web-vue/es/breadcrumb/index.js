import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Breadcrumb from "./breadcrumb.js";
import BreadcrumbItem from "./breadcrumb-item.js";
export { default as BreadcrumbItem } from "./breadcrumb-item.js";
const Breadcrumb = Object.assign(_Breadcrumb, {
  Item: BreadcrumbItem,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Breadcrumb.name, _Breadcrumb);
    app.component(componentPrefix + BreadcrumbItem.name, BreadcrumbItem);
  }
});
export { Breadcrumb as default };
