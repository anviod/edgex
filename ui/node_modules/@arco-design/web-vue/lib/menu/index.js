"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var menu = require("./menu.js");
var item = require("./item.js");
var itemGroup = require("./item-group.js");
var subMenu = require("./sub-menu.js");
const Menu = Object.assign(menu, {
  Item: item,
  ItemGroup: itemGroup,
  SubMenu: subMenu,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + menu.name, menu);
    app.component(componentPrefix + item.name, item);
    app.component(componentPrefix + itemGroup.name, itemGroup);
    app.component(componentPrefix + subMenu.name, subMenu);
  }
});
exports.MenuItem = item;
exports.MenuItemGroup = itemGroup;
exports.SubMenu = subMenu;
exports["default"] = Menu;
