import { defineComponent, ref, computed, onMounted, onUnmounted, watch, createVNode, mergeProps } from "vue";
import scrollIntoView from "scroll-into-view-if-needed";
import Tooltip from "../tooltip/index.js";
import useMenu from "./hooks/use-menu.js";
import useLevel from "./hooks/use-level.js";
import { omit } from "../_utils/omit.js";
import MenuIndent from "./indent.js";
import useMenuContext from "./hooks/use-menu-context.js";
import { useMenuDataCollectorContext } from "./hooks/use-menu-data-collector.js";
var MenuItem = defineComponent({
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
    } = useLevel();
    const menuContext = useMenuContext();
    const refItemElement = ref();
    const isSelected = computed(() => (menuContext.selectedKeys || []).indexOf(key.value) > -1);
    const menuDataCollector = useMenuDataCollectorContext();
    onMounted(() => {
      menuDataCollector == null ? void 0 : menuDataCollector.collectMenuItem(key.value);
    });
    onUnmounted(() => {
      menuDataCollector == null ? void 0 : menuDataCollector.removeMenuItem(key.value);
    });
    function scrollTo() {
      if (menuContext.autoScrollIntoView && refItemElement.value && isSelected.value) {
        scrollIntoView(refItemElement.value, {
          behavior: "smooth",
          block: "nearest",
          scrollMode: "if-needed",
          boundary: document.documentElement,
          ...menuContext.scrollConfig || {}
        });
      }
    }
    let timer;
    onMounted(() => {
      timer = setTimeout(() => {
        scrollTo();
      }, 500);
    });
    onUnmounted(() => {
      clearTimeout(timer);
    });
    watch([isSelected], () => {
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
    const content = [showIndent && createVNode(MenuIndent, {
      "level": level
    }, null), iconElement && createVNode("span", {
      "class": `${prefixCls}-icon`
    }, [iconElement]), showIndent || iconElement ? createVNode("span", {
      "class": [`${prefixCls}-item-inner`, {
        [`${prefixCls}-title`]: iconElement
      }]
    }, [children]) : children].filter(Boolean);
    const itemElement = createVNode("div", mergeProps({
      "ref": "refItemElement",
      "class": [`${prefixCls}-item`, {
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-selected`]: isSelected,
        [`${prefixCls}-has-icon`]: iconElement
      }]
    }, this.$attrs, {
      "onClick": onClick
    }), [content, isSelected && mode === "horizontal" && createVNode("div", {
      "class": `${prefixCls}-selected-label`
    }, null)]);
    if (needTooltip) {
      const tooltipClassNames = [`${prefixCls}-item-tooltip`, tooltipProps == null ? void 0 : tooltipProps.class];
      return createVNode(Tooltip, mergeProps({
        "trigger": "hover",
        "position": "right",
        "class": tooltipClassNames
      }, omit(tooltipProps || {}, ["class"])), {
        default: () => itemElement,
        content: () => children
      });
    }
    return itemElement;
  }
});
export { MenuItem as default };
