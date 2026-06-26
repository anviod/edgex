"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var is = require("../../_utils/is.js");
var context = require("../context.js");
function getKeys(data, condition) {
  const keys = [];
  const loop = (list) => {
    list.forEach((item) => {
      if (condition(item)) {
        keys.push(item.key);
      }
      if (item.children) {
        loop(item.children);
      }
    });
  };
  loop(data);
  return keys;
}
function useMenuDataCollectorContext(isRoot = false) {
  const menuContext = isRoot ? void 0 : vue.inject(context.DataCollectorInjectionKey);
  return menuContext;
}
function useMenuDataCollector(props) {
  const { key, type } = props;
  const data = vue.ref([]);
  const menuContext = useMenuDataCollectorContext(type === "menu");
  const provideContext = {
    collectSubMenu(key2, children, isReport = false) {
      const item = {
        key: key2,
        children
      };
      if (isReport) {
        const oldOne = data.value.find((i) => i.key === key2);
        if (oldOne) {
          oldOne.children = children;
        } else {
          data.value.push(item);
        }
      } else {
        data.value = [...data.value, item];
      }
      if (isReport) {
        if (type === "popupMenu") {
          menuContext == null ? void 0 : menuContext.reportMenuData(data.value);
        } else if (type === "subMenu" && !is.isUndefined(key2)) {
          menuContext == null ? void 0 : menuContext.collectSubMenu(key2, data.value, true);
        }
      }
    },
    removeSubMenu(key2) {
      data.value = data.value.filter((item) => item.key !== key2);
    },
    collectMenuItem(key2) {
      data.value.push({ key: key2 });
    },
    removeMenuItem(key2) {
      data.value = data.value.filter((item) => item.key !== key2);
    },
    reportMenuData(reportData) {
      data.value = reportData;
      if (type === "subMenu" && !is.isUndefined(key)) {
        menuContext == null ? void 0 : menuContext.collectSubMenu(key, data.value, true);
      }
    }
  };
  vue.provide(context.DataCollectorInjectionKey, provideContext);
  if (type === "subMenu" && !is.isUndefined(key)) {
    vue.onMounted(() => {
      menuContext == null ? void 0 : menuContext.collectSubMenu(key, data.value);
    });
    vue.onUnmounted(() => {
      menuContext == null ? void 0 : menuContext.removeSubMenu(key);
    });
  } else if (type === "popupMenu") {
    vue.onMounted(() => {
      menuContext == null ? void 0 : menuContext.reportMenuData(data.value);
    });
  }
  return {
    menuData: data,
    subMenuKeys: vue.computed(() => getKeys(data.value, (item) => !!item.children)),
    menuItemKeys: vue.computed(() => getKeys(data.value, (item) => !item.children))
  };
}
exports["default"] = useMenuDataCollector;
exports.useMenuDataCollectorContext = useMenuDataCollectorContext;
