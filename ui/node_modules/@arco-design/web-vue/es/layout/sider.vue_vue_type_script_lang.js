import { defineComponent, toRefs, reactive, computed, inject, onMounted, onUnmounted, provide } from "vue";
import IconRight from "../icon/icon-right/index.js";
import IconLeft from "../icon/icon-left/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { isNumber } from "../_utils/is.js";
import useMergeState from "../_hooks/use-merge-state.js";
import { LayoutSiderInjectionKey, SiderInjectionKey } from "./context.js";
import ResizeBox from "../resize-box/index.js";
import { useResponsive } from "../_hooks/use-responsive.js";
const generateId = (() => {
  let i = 0;
  return (prefix = "") => {
    i += 1;
    return `${prefix}${i}`;
  };
})();
var _sfc_main = defineComponent({
  name: "LayoutSider",
  components: {
    IconLeft,
    IconRight,
    ResizeBox
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
    } = toRefs(props);
    const [localCollapsed, setLocalCollapsed] = useMergeState(defaultCollapsed.value, reactive({
      value: collapsed
    }));
    const componentTag = computed(() => resizeDirections.value ? "ResizeBox" : "div");
    const showTrigger = computed(() => collapsible.value && !hideTrigger.value);
    const prefixCls = getPrefixCls("layout-sider");
    const classNames = computed(() => [prefixCls, {
      [`${prefixCls}-light`]: theme.value === "light",
      [`${prefixCls}-has-trigger`]: showTrigger.value,
      [`${prefixCls}-collapsed`]: collapsed.value
    }]);
    const siderWidth = computed(() => {
      const {
        width,
        collapsedWidth: collapsedWidth2
      } = props;
      const rawWidth = localCollapsed.value ? collapsedWidth2 : width;
      return isNumber(rawWidth) ? `${rawWidth}px` : String(rawWidth);
    });
    const triggerClassNames = computed(() => [`${prefixCls}-trigger`, {
      [`${prefixCls}-trigger-light`]: theme.value === "light"
    }]);
    const toggleTrigger = () => {
      const newCollapsed = !localCollapsed.value;
      setLocalCollapsed(newCollapsed);
      emit("update:collapsed", newCollapsed);
      emit("collapse", newCollapsed, "clickTrigger");
    };
    useResponsive(breakpoint, (checked) => {
      const newCollapsed = !checked;
      if (newCollapsed !== localCollapsed.value) {
        setLocalCollapsed(newCollapsed);
        emit("update:collapsed", newCollapsed);
        emit("collapse", newCollapsed, "responsive");
        emit("breakpoint", newCollapsed);
      }
    });
    const uniqueId = generateId("__arco_layout_sider");
    const siderHook = inject(LayoutSiderInjectionKey, void 0);
    onMounted(() => {
      var _a;
      (_a = siderHook == null ? void 0 : siderHook.onSiderMount) == null ? void 0 : _a.call(siderHook, uniqueId);
    });
    onUnmounted(() => {
      var _a;
      (_a = siderHook == null ? void 0 : siderHook.onSiderUnMount) == null ? void 0 : _a.call(siderHook, uniqueId);
    });
    provide(SiderInjectionKey, reactive({
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
export { _sfc_main as default };
