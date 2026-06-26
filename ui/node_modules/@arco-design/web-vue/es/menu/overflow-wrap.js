import { defineComponent, ref, onMounted, onUnmounted, createVNode, cloneVNode, mergeProps, createTextVNode } from "vue";
import ResizeObserver from "resize-observer-polyfill";
import { getStyle } from "../_utils/style.js";
import useMenuContext from "./hooks/use-menu-context.js";
import SubMenu from "./sub-menu.js";
import { unFragment } from "../_utils/vue-utils.js";
const OVERFLOW_THRESHOLD = 10;
function getNodeWidth(el) {
  return el && +el.getBoundingClientRect().width.toFixed(2);
}
function translatePxToNumber(str) {
  const result = Number(str.replace("px", ""));
  return Number.isNaN(result) ? 0 : result;
}
var OverflowWrap = defineComponent({
  name: "MenuOverflowWrap",
  setup(_, {
    slots
  }) {
    const menuContext = useMenuContext();
    const overflowPrefixCls = `${menuContext.prefixCls}-overflow`;
    const overflowSubMenuClass = `${overflowPrefixCls}-sub-menu`;
    const overflowMenuItemClass = `${overflowPrefixCls}-hidden-menu-item`;
    const overflowSubMenuMirrorClass = `${overflowPrefixCls}-sub-menu-mirror`;
    const refWrapper = ref();
    const lastVisibleIndex = ref(null);
    const refResizeObserver = ref();
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
        const nodeWidth = getNodeWidth(node) + translatePxToNumber(getStyle(node, "marginLeft")) + translatePxToNumber(getStyle(node, "marginRight"));
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
    onMounted(() => {
      computeLastVisibleIndex();
      refResizeObserver.value = new ResizeObserver((entries) => {
        entries.forEach(computeLastVisibleIndex);
      });
      if (refWrapper.value) {
        refResizeObserver.value.observe(refWrapper.value);
      }
    });
    onUnmounted(() => {
      refResizeObserver.value && refResizeObserver.value.disconnect();
    });
    return () => {
      const renderSubMenu = (children, options) => {
        const {
          isMirror = false,
          props = {}
        } = options || {};
        return createVNode(SubMenu, mergeProps({
          "key": `__arco-menu-overflow-sub-menu${isMirror ? "-mirror" : ""}`,
          "class": isMirror ? overflowSubMenuMirrorClass : overflowSubMenuClass
        }, props), {
          title: () => createVNode("span", null, [createTextVNode("...")]),
          default: () => children
        });
      };
      const renderChildren = () => {
        var _a;
        const originChildren = ((_a = slots.default) == null ? void 0 : _a.call(slots)) || [];
        const children = unFragment(originChildren);
        let overflowSubMenu = null;
        const overflowSubMenuMirror = renderSubMenu(null, {
          isMirror: true
        });
        const menuItems = children.map((child, index) => {
          const item = cloneVNode(child, lastVisibleIndex.value !== null && index > lastVisibleIndex.value ? {
            class: overflowMenuItemClass
          } : {
            class: ""
          });
          if (lastVisibleIndex.value !== null && index === lastVisibleIndex.value + 1) {
            const overflowMenuItems = children.slice(index).map((child2) => cloneVNode(child2));
            overflowSubMenu = renderSubMenu(overflowMenuItems);
          }
          return item;
        });
        return [overflowSubMenuMirror, ...menuItems, overflowSubMenu];
      };
      return createVNode("div", {
        "class": `${overflowPrefixCls}-wrap`,
        "ref": refWrapper
      }, [renderChildren()]);
    };
  }
});
export { OverflowWrap as default };
