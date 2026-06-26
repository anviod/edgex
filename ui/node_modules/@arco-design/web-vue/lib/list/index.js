"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var globalConfig = require("../_utils/global-config.js");
var list = require("./list.js");
var listItem = require("./list-item.js");
var listItemMeta = require("./list-item-meta.js");
const List = Object.assign(list, {
  Item: Object.assign(listItem, {
    Meta: listItemMeta
  }),
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + list.name, list);
    app.component(componentPrefix + listItem.name, listItem);
    app.component(componentPrefix + listItemMeta.name, listItemMeta);
  }
});
exports.ListItem = listItem;
exports.ListItemMeta = listItemMeta;
exports["default"] = List;
