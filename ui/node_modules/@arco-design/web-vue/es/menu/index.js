import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _Menu from "./menu.js";
import MenuItem from "./item.js";
export { default as MenuItem } from "./item.js";
import MenuItemGroup from "./item-group.js";
export { default as MenuItemGroup } from "./item-group.js";
import SubMenu from "./sub-menu.js";
export { default as SubMenu } from "./sub-menu.js";
const Menu = Object.assign(_Menu, {
  Item: MenuItem,
  ItemGroup: MenuItemGroup,
  SubMenu,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Menu.name, _Menu);
    app.component(componentPrefix + MenuItem.name, MenuItem);
    app.component(componentPrefix + MenuItemGroup.name, MenuItemGroup);
    app.component(componentPrefix + SubMenu.name, SubMenu);
  }
});
export { Menu as default };
