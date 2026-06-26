"use strict";
var vue = require("vue");
var subMenuInline = require("./sub-menu-inline.js");
var subMenuPop = require("./sub-menu-pop.js");
var useMenu = require("./hooks/use-menu.js");
var useLevel = require("./hooks/use-level.js");
var index = require("../icon/icon-down/index.js");
var index$1 = require("../icon/icon-right/index.js");
var useMenuContext = require("./hooks/use-menu-context.js");
var useMenuDataCollector = require("./hooks/use-menu-data-collector.js");
var SubMenu = vue.defineComponent({
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
    } = useLevel["default"]();
    const {
      popup
    } = vue.toRefs(props);
    const menuContext = useMenuContext();
    const computedPopup = vue.computed(() => {
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
    } = useMenuDataCollector["default"]({
      key: key.value,
      type: "subMenu"
    });
    const isChildrenSelected = vue.computed(() => {
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
      expandIconDown: vue.toRef(menuContext, "expandIconDown"),
      expandIconRight: vue.toRef(menuContext, "expandIconRight")
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
      "expand-icon-down": this.$slots["expand-icon-down"] || expandIconDown || (() => [vue.createVNode(index, null, null)]),
      "expand-icon-right": this.$slots["expand-icon-right"] || expandIconRight || (() => [vue.createVNode(index$1, null, null)])
    };
    return computedPopup ? vue.createVNode(subMenuPop, vue.mergeProps({
      "key": computedKey,
      "title": props.title,
      "selectable": props.selectable,
      "isChildrenSelected": isChildrenSelected,
      "popupMaxHeight": props.popupMaxHeight
    }, attrs), _slots) : vue.createVNode(subMenuInline, vue.mergeProps({
      "key": computedKey,
      "title": props.title,
      "isChildrenSelected": isChildrenSelected
    }, attrs), _slots);
  }
});
module.exports = SubMenu;
