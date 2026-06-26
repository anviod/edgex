import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import _List from "./list.js";
import ListItem from "./list-item.js";
export { default as ListItem } from "./list-item.js";
import ListItemMeta from "./list-item-meta.js";
export { default as ListItemMeta } from "./list-item-meta.js";
const List = Object.assign(_List, {
  Item: Object.assign(ListItem, {
    Meta: ListItemMeta
  }),
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _List.name, _List);
    app.component(componentPrefix + ListItem.name, ListItem);
    app.component(componentPrefix + ListItemMeta.name, ListItemMeta);
  }
});
export { List as default };
