"use strict";
var vue = require("vue");
var scrollIntoView = require("scroll-into-view-if-needed");
var index = require("../tooltip/index.js");
var useMenu = require("./hooks/use-menu.js");
var useLevel = require("./hooks/use-level.js");
var omit = require("../_utils/omit.js");
var indent = require("./indent.js");
var useMenuContext = require("./hooks/use-menu-context.js");
var useMenuDataCollector = require("./hooks/use-menu-data-collector.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var scrollIntoView__default = /* @__PURE__ */ _interopDefaultLegacy(scrollIntoView);
var MenuItem = vue.defineComponent({
  name: "MenuItem",
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["click"],
  setup(props, {
    emit
  }) {
    const {
      key
    } = useMenu();
    const {
      level
    } = useLevel["default"]();
    const menuContext = useMenuContext();
    const refItemElement = vue.ref();
    const isSelected = vue.computed(() => (menuContext.selectedKeys || []).indexOf(key.value) > -1);
    const menuDataCollector = useMenuDataCollector.useMenuDataCollectorContext();
    vue.onMounted(() => {
      menuDataCollector == null ? void 0 : menuDataCollector.collectMenuItem(key.value);
    });
    vue.onUnmounted(() => {
      menuDataCollector == null ? void 0 : menuDataCollector.removeMenuItem(key.value);
    });
    function scrollTo() {
      if (menuContext.autoScrollIntoView && refItemElement.value && isSelected.value) {
        scrollIntoView__default["default"](refItemElement.value, {
          behavior: "smooth",
          block: "nearest",
          scrollMode: "if-needed",
          boundary: document.documentElement,
          ...menuContext.scrollConfig || {}
        });
      }
    }
    let timer;
    vue.onMounted(() => {
      timer = setTimeout(() => {
        scrollTo();
      }, 500);
    });
    vue.onUnmounted(() => {
      clearTimeout(timer);
    });
    vue.watch([isSelected], () => {
      scrollTo();
    });
    return {
      menuContext,
      level,
      isSelected,
      refItemElement,
      onClick(e) {
        if (props.disabled)
          return;
        menuContext.onMenuItemClick && menuContext.onMenuItemClick(key.value);
        emit("click", e);
      }
    };
  },
  render() {
    var _a, _b;
    const {
      level,
      menuContext,
      disabled,
      isSelected,
      onClick
    } = this;
    const {
      prefixCls,
      collapsed,
      inTrigger,
      mode,
      tooltipProps
    } = menuContext;
    const needTooltip = collapsed && !inTrigger && level === 1;
    const needTextIndent = mode === "vertical" && level > 1;
    const children = ((_b = (_a = this.$slots).default) == null ? void 0 : _b.call(_a)) || [];
    const showIndent = needTextIndent && !inTrigger && !collapsed;
    const iconElement = this.$slots.icon && this.$slots.icon();
    const content = [showIndent && vue.createVNode(indent, {
      "level": level
    }, null), iconElement && vue.createVNode("span", {
      "class": `${prefixCls}-icon`
    }, [iconElement]), showIndent || iconElement ? vue.createVNode("span", {
      "class": [`${prefixCls}-item-inner`, {
        [`${prefixCls}-title`]: iconElement
      }]
    }, [children]) : children].filter(Boolean);
    const itemElement = vue.createVNode("div", vue.mergeProps({
      "ref": "refItemElement",
      "class": [`${prefixCls}-item`, {
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-selected`]: isSelected,
        [`${prefixCls}-has-icon`]: iconElement
      }]
    }, this.$attrs, {
      "onClick": onClick
    }), [content, isSelected && mode === "horizontal" && vue.createVNode("div", {
      "class": `${prefixCls}-selected-label`
    }, null)]);
    if (needTooltip) {
      const tooltipClassNames = [`${prefixCls}-item-tooltip`, tooltipProps == null ? void 0 : tooltipProps.class];
      return vue.createVNode(index, vue.mergeProps({
        "trigger": "hover",
        "position": "right",
        "class": tooltipClassNames
      }, omit.omit(tooltipProps || {}, ["class"])), {
        default: () => itemElement,
        content: () => children
      });
    }
    return itemElement;
  }
});
module.exports = MenuItem;
