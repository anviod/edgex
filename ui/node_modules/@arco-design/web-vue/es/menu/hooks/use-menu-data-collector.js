import { ref, provide, onMounted, onUnmounted, computed, inject } from "vue";
import { isUndefined } from "../../_utils/is.js";
import { DataCollectorInjectionKey } from "../context.js";
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
  const menuContext = isRoot ? void 0 : inject(DataCollectorInjectionKey);
  return menuContext;
}
function useMenuDataCollector(props) {
  const { key, type } = props;
  const data = ref([]);
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
        } else if (type === "subMenu" && !isUndefined(key2)) {
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
      if (type === "subMenu" && !isUndefined(key)) {
        menuContext == null ? void 0 : menuContext.collectSubMenu(key, data.value, true);
      }
    }
  };
  provide(DataCollectorInjectionKey, provideContext);
  if (type === "subMenu" && !isUndefined(key)) {
    onMounted(() => {
      menuContext == null ? void 0 : menuContext.collectSubMenu(key, data.value);
    });
    onUnmounted(() => {
      menuContext == null ? void 0 : menuContext.removeSubMenu(key);
    });
  } else if (type === "popupMenu") {
    onMounted(() => {
      menuContext == null ? void 0 : menuContext.reportMenuData(data.value);
    });
  }
  return {
    menuData: data,
    subMenuKeys: computed(() => getKeys(data.value, (item) => !!item.children)),
    menuItemKeys: computed(() => getKeys(data.value, (item) => !item.children))
  };
}
export { useMenuDataCollector as default, useMenuDataCollectorContext };
