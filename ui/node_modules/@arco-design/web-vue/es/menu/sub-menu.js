import { defineComponent, toRefs, computed, toRef, createVNode, mergeProps } from "vue";
import SubMenuInline from "./sub-menu-inline.js";
import SubMenuPop from "./sub-menu-pop.js";
import useMenu from "./hooks/use-menu.js";
import useLevel from "./hooks/use-level.js";
import IconDown from "../icon/icon-down/index.js";
import IconRight from "../icon/icon-right/index.js";
import useMenuContext from "./hooks/use-menu-context.js";
import useMenuDataCollector from "./hooks/use-menu-data-collector.js";
var SubMenu = defineComponent({
  name: "SubMenu",
  props: {
    title: {
      type: String
    },
    selectable: {
      type: Boolean
    },
    popup: {
      type: [Boolean, Function],
      default: false
    },
    popupMaxHeight: {
      type: [Boolean, Number],
      default: void 0
    }
  },
  setup(props, {
    attrs
  }) {
    const {
      key
    } = useMenu();
    const {
      level
    } = useLevel();
    const {
      popup
    } = toRefs(props);
    const menuContext = useMenuContext();
    const computedPopup = computed(() => {
      const {
        mode,
        collapsed,
        inTrigger
      } = menuContext;
      const forcePopup = !!(typeof popup.value === "function" ? popup.value(level.value) : popup.value);
      return forcePopup || collapsed || inTrigger || mode !== "vertical";
    });
    const {
      subMenuKeys,
      menuItemKeys
    } = useMenuDataCollector({
      key: key.value,
      type: "subMenu"
    });
    const isChildrenSelected = computed(() => {
      const selectedKeys = menuContext.selectedKeys || [];
      const checkSelected = (menuKeys) => {
        for (let i = 0; i < selectedKeys.length; i++) {
          const selectedKey = selectedKeys[i];
          if (menuKeys.includes(selectedKey)) {
            return true;
          }
        }
        return false;
      };
      return checkSelected(subMenuKeys.value) || checkSelected(menuItemKeys.value);
    });
    return {
      subMenuKeys,
      menuItemKeys,
      isChildrenSelected,
      props,
      attrs,
      computedKey: key,
      computedPopup,
      expandIconDown: toRef(menuContext, "expandIconDown"),
      expandIconRight: toRef(menuContext, "expandIconRight")
    };
  },
  render() {
    const {
      props,
      attrs,
      computedKey,
      computedPopup,
      expandIconDown,
      expandIconRight,
      isChildrenSelected
    } = this;
    const _slots = {
      ...this.$slots,
      "expand-icon-down": this.$slots["expand-icon-down"] || expandIconDown || (() => [createVNode(IconDown, null, null)]),
      "expand-icon-right": this.$slots["expand-icon-right"] || expandIconRight || (() => [createVNode(IconRight, null, null)])
    };
    return computedPopup ? createVNode(SubMenuPop, mergeProps({
      "key": computedKey,
      "title": props.title,
      "selectable": props.selectable,
      "isChildrenSelected": isChildrenSelected,
      "popupMaxHeight": props.popupMaxHeight
    }, attrs), _slots) : createVNode(SubMenuInline, mergeProps({
      "key": computedKey,
      "title": props.title,
      "isChildrenSelected": isChildrenSelected
    }, attrs), _slots);
  }
});
export { SubMenu as default };
