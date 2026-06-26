"use strict";
var vue = require("vue");
var index$1 = require("../icon/icon-right/index.js");
var index = require("../icon/icon-left/index.js");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var context = require("./context.js");
var index$2 = require("../resize-box/index.js");
var useResponsive = require("../_hooks/use-responsive.js");
const generateId = (() => {
  let i = 0;
  return (prefix = "") => {
    i += 1;
    return `${prefix}${i}`;
  };
})();
var _sfc_main = vue.defineComponent({
  name: "LayoutSider",
  components: {
    IconLeft: index,
    IconRight: index$1,
    ResizeBox: index$2
  },
  props: {
    theme: {
      type: String,
      default: "light"
    },
    collapsed: {
      type: Boolean,
      default: void 0
    },
    defaultCollapsed: {
      type: Boolean
    },
    collapsible: {
      type: Boolean
    },
    width: {
      type: Number,
      default: 200
    },
    collapsedWidth: {
      type: Number,
      default: 48
    },
    reverseArrow: {
      type: Boolean
    },
    breakpoint: {
      type: String
    },
    resizeDirections: {
      type: Array,
      default: void 0
    },
    hideTrigger: {
      type: Boolean
    }
  },
  emits: [
    "collapse",
    "update:collapsed",
    "breakpoint"
  ],
  setup(props, {
    emit
  }) {
    const {
      theme,
      collapsed,
      defaultCollapsed,
      collapsible,
      hideTrigger,
      breakpoint,
      collapsedWidth,
      resizeDirections
    } = vue.toRefs(props);
    const [localCollapsed, setLocalCollapsed] = useMergeState(defaultCollapsed.value, vue.reactive({
      value: collapsed
    }));
    const componentTag = vue.computed(() => resizeDirections.value ? "ResizeBox" : "div");
    const showTrigger = vue.computed(() => collapsible.value && !hideTrigger.value);
    const prefixCls = globalConfig.getPrefixCls("layout-sider");
    const classNames = vue.computed(() => [prefixCls, {
      [`${prefixCls}-light`]: theme.value === "light",
      [`${prefixCls}-has-trigger`]: showTrigger.value,
      [`${prefixCls}-collapsed`]: collapsed.value
    }]);
    const siderWidth = vue.computed(() => {
      const {
        width,
        collapsedWidth: collapsedWidth2
      } = props;
      const rawWidth = localCollapsed.value ? collapsedWidth2 : width;
      return is.isNumber(rawWidth) ? `${rawWidth}px` : String(rawWidth);
    });
    const triggerClassNames = vue.computed(() => [`${prefixCls}-trigger`, {
      [`${prefixCls}-trigger-light`]: theme.value === "light"
    }]);
    const toggleTrigger = () => {
      const newCollapsed = !localCollapsed.value;
      setLocalCollapsed(newCollapsed);
      emit("update:collapsed", newCollapsed);
      emit("collapse", newCollapsed, "clickTrigger");
    };
    useResponsive.useResponsive(breakpoint, (checked) => {
      const newCollapsed = !checked;
      if (newCollapsed !== localCollapsed.value) {
        setLocalCollapsed(newCollapsed);
        emit("update:collapsed", newCollapsed);
        emit("collapse", newCollapsed, "responsive");
        emit("breakpoint", newCollapsed);
      }
    });
    const uniqueId = generateId("__arco_layout_sider");
    const siderHook = vue.inject(context.LayoutSiderInjectionKey, void 0);
    vue.onMounted(() => {
      var _a;
      (_a = siderHook == null ? void 0 : siderHook.onSiderMount) == null ? void 0 : _a.call(siderHook, uniqueId);
    });
    vue.onUnmounted(() => {
      var _a;
      (_a = siderHook == null ? void 0 : siderHook.onSiderUnMount) == null ? void 0 : _a.call(siderHook, uniqueId);
    });
    vue.provide(context.SiderInjectionKey, vue.reactive({
      theme,
      collapsed: localCollapsed,
      collapsedWidth
    }));
    return {
      componentTag,
      prefixCls,
      classNames,
      triggerClassNames,
      localCollapsed,
      siderWidth,
      showTrigger,
      toggleTrigger
    };
  }
});
module.exports = _sfc_main;
