import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Layout from "./layout.js";
import LayoutHeader from "./header.js";
export { default as LayoutHeader } from "./header.js";
import LayoutContent from "./content.js";
export { default as LayoutContent } from "./content.js";
import LayoutFooter from "./footer.js";
export { default as LayoutFooter } from "./footer.js";
import LayoutSider from "./sider.js";
export { default as LayoutSider } from "./sider.js";
const Layout = Object.assign(_Layout, {
  Header: LayoutHeader,
  Content: LayoutContent,
  Footer: LayoutFooter,
  Sider: LayoutSider,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Layout.name, _Layout);
    app.component(componentPrefix + LayoutHeader.name, LayoutHeader);
    app.component(componentPrefix + LayoutContent.name, LayoutContent);
    app.component(componentPrefix + LayoutFooter.name, LayoutFooter);
    app.component(componentPrefix + LayoutSider.name, LayoutSider);
  }
});
export { Layout as default };
