"use strict";
var vue = require("vue");
var ResizeObserver = require("resize-observer-polyfill");
var style = require("../_utils/style.js");
var useMenuContext = require("./hooks/use-menu-context.js");
var subMenu = require("./sub-menu.js");
var vueUtils = require("../_utils/vue-utils.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var ResizeObserver__default = /* @__PURE__ */ _interopDefaultLegacy(ResizeObserver);
const OVERFLOW_THRESHOLD = 10;
function getNodeWidth(el) {
  return el && +el.getBoundingClientRect().width.toFixed(2);
}
function translatePxToNumber(str) {
  const result = Number(str.replace("px", ""));
  return Number.isNaN(result) ? 0 : result;
}
var OverflowWrap = vue.defineComponent({
  name: "MenuOverflowWrap",
  setup(_, {
    slots
  }) {
    const menuContext = useMenuContext();
    const overflowPrefixCls = `${menuContext.prefixCls}-overflow`;
    const overflowSubMenuClass = `${overflowPrefixCls}-sub-menu`;
    const overflowMenuItemClass = `${overflowPrefixCls}-hidden-menu-item`;
    const overflowSubMenuMirrorClass = `${overflowPrefixCls}-sub-menu-mirror`;
    const refWrapper = vue.ref();
    const lastVisibleIndex = vue.ref(null);
    const refResizeObserver = vue.ref();
    function computeLastVisibleIndex() {
      const wrapperElement = refWrapper.value;
      const wrapperWidth = getNodeWidth(wrapperElement);
      const childNodeList = [].slice.call(wrapperElement.children);
      let menuItemIndex = 0;
      let currentRightWidth = 0;
      let overflowSubMenuWidth = 0;
      for (let i = 0; i < childNodeList.length; i++) {
        const node = childNodeList[i];
        const classNames = node.className.split(" ");
        const isOverflowSubMenu = classNames.indexOf(overflowSubMenuClass) > -1;
        const isOverflowSubMenuMirror = classNames.indexOf(overflowSubMenuMirrorClass) > -1;
        if (isOverflowSubMenu) {
          continue;
        }
        const nodeWidth = getNodeWidth(node) + translatePxToNumber(style.getStyle(node, "marginLeft")) + translatePxToNumber(style.getStyle(node, "marginRight"));
        if (isOverflowSubMenuMirror) {
          overflowSubMenuWidth = nodeWidth;
          continue;
        }
        currentRightWidth += nodeWidth;
        if (currentRightWidth + overflowSubMenuWidth + OVERFLOW_THRESHOLD > wrapperWidth) {
          lastVisibleIndex.value = menuItemIndex - 1;
          return;
        }
        menuItemIndex++;
      }
      lastVisibleIndex.value = null;
    }
    vue.onMounted(() => {
      computeLastVisibleIndex();
      refResizeObserver.value = new ResizeObserver__default["default"]((entries) => {
        entries.forEach(computeLastVisibleIndex);
      });
      if (refWrapper.value) {
        refResizeObserver.value.observe(refWrapper.value);
      }
    });
    vue.onUnmounted(() => {
      refResizeObserver.value && refResizeObserver.value.disconnect();
    });
    return () => {
      const renderSubMenu = (children, options) => {
        const {
          isMirror = false,
          props = {}
        } = options || {};
        return vue.createVNode(subMenu, vue.mergeProps({
          "key": `__arco-menu-overflow-sub-menu${isMirror ? "-mirror" : ""}`,
          "class": isMirror ? overflowSubMenuMirrorClass : overflowSubMenuClass
        }, props), {
          title: () => vue.createVNode("span", null, [vue.createTextVNode("...")]),
          default: () => children
        });
      };
      const renderChildren = () => {
        var _a;
        const originChildren = ((_a = slots.default) == null ? void 0 : _a.call(slots)) || [];
        const children = vueUtils.unFragment(originChildren);
        let overflowSubMenu = null;
        const overflowSubMenuMirror = renderSubMenu(null, {
          isMirror: true
        });
        const menuItems = children.map((child, index) => {
          const item = vue.cloneVNode(child, lastVisibleIndex.value !== null && index > lastVisibleIndex.value ? {
            class: overflowMenuItemClass
          } : {
            class: ""
          });
          if (lastVisibleIndex.value !== null && index === lastVisibleIndex.value + 1) {
            const overflowMenuItems = children.slice(index).map((child2) => vue.cloneVNode(child2));
            overflowSubMenu = renderSubMenu(overflowMenuItems);
          }
          return item;
        });
        return [overflowSubMenuMirror, ...menuItems, overflowSubMenu];
      };
      return vue.createVNode("div", {
        "class": `${overflowPrefixCls}-wrap`,
        "ref": refWrapper
      }, [renderChildren()]);
    };
  }
});
module.exports = OverflowWrap;
