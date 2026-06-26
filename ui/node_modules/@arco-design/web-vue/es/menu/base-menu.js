import { defineComponent, toRefs, reactive, computed, provide, resolveComponent, openBlock, createElementBlock, mergeProps, createElementVNode, normalizeClass, renderSlot, createBlock, createCommentVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconMenuFold from "../icon/icon-menu-fold/index.js";
import IconMenuUnfold from "../icon/icon-menu-unfold/index.js";
import useMergeState from "../_hooks/use-merge-state.js";
import { provideLevel } from "./hooks/use-level.js";
import { MenuInjectionKey } from "./context.js";
import usePickSlots from "../_hooks/use-pick-slots.js";
import { omit } from "../_utils/omit.js";
import useMenuDataCollector from "./hooks/use-menu-data-collector.js";
import useMenuOpenState from "./hooks/use-menu-open-state.js";
import { useResponsive } from "../_hooks/use-responsive.js";
import { isNumber, isObject } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "BaseMenu",
  components: {
    IconMenuFold,
    IconMenuUnfold
  },
  inheritAttrs: false,
  props: {
    style: {
      type: Object
    },
    theme: {
      type: String,
      default: "light"
    },
    mode: {
      type: String,
      default: "vertical"
    },
    levelIndent: {
      type: Number
    },
    autoOpen: {
      type: Boolean
    },
    collapsed: {
      type: Boolean,
      default: void 0
    },
    defaultCollapsed: {
      type: Boolean
    },
    collapsedWidth: {
      type: Number
    },
    accordion: {
      type: Boolean
    },
    autoScrollIntoView: {
      type: Boolean
    },
    showCollapseButton: {
      type: Boolean
    },
    selectedKeys: {
      type: Array
    },
    defaultSelectedKeys: {
      type: Array,
      default: () => []
    },
    openKeys: {
      type: Array
    },
    defaultOpenKeys: {
      type: Array,
      default: () => []
    },
    scrollConfig: {
      type: Object
    },
    triggerProps: {
      type: Object
    },
    tooltipProps: {
      type: Object
    },
    autoOpenSelected: {
      type: Boolean
    },
    breakpoint: {
      type: String
    },
    popupMaxHeight: {
      type: [Boolean, Number],
      default: true
    },
    prefixCls: {
      type: String
    },
    inTrigger: {
      type: Boolean
    },
    siderCollapsed: {
      type: Boolean
    },
    isRoot: {
      type: Boolean
    }
  },
  emits: [
    "update:collapsed",
    "update:selectedKeys",
    "update:openKeys",
    "collapse",
    "menu-item-click",
    "sub-menu-click"
  ],
  setup(props, { emit, slots }) {
    const {
      style,
      mode,
      theme,
      levelIndent,
      accordion,
      showCollapseButton,
      scrollConfig,
      autoScrollIntoView,
      collapsedWidth,
      autoOpen,
      collapsed: propCollapsed,
      defaultCollapsed,
      selectedKeys: propSelectedKeys,
      defaultSelectedKeys,
      openKeys: propOpenKeys,
      defaultOpenKeys,
      triggerProps,
      tooltipProps,
      autoOpenSelected,
      breakpoint,
      popupMaxHeight,
      prefixCls,
      inTrigger,
      siderCollapsed,
      isRoot
    } = toRefs(props);
    const { subMenuKeys, menuData } = useMenuDataCollector({
      type: isRoot.value ? "menu" : "popupMenu"
    });
    const [selectedKeys, setSelectedKeys] = useMergeState(
      defaultSelectedKeys.value,
      reactive({
        value: propSelectedKeys
      })
    );
    const { openKeys, setOpenKeys, open } = useMenuOpenState(
      reactive({
        modelValue: propOpenKeys,
        defaultValue: defaultOpenKeys,
        autoOpen,
        autoOpenSelected,
        selectedKeys,
        subMenuKeys,
        menuData,
        accordion
      })
    );
    const [collapsed, setCollapsed] = useMergeState(
      defaultCollapsed.value,
      reactive({
        value: propCollapsed
      })
    );
    const computedCollapsed = computed(
      () => siderCollapsed.value || collapsed.value || mode.value === "popButton"
    );
    const computedHasCollapseButton = computed(
      () => ["horizontal", "popButton"].indexOf(mode.value) < 0 && !inTrigger.value && showCollapseButton.value
    );
    const changeCollapsed = (newVal, type) => {
      if (newVal === collapsed.value)
        return;
      setCollapsed(newVal);
      emit("update:collapsed", newVal);
      emit("collapse", newVal, type);
    };
    const onCollapseBtnClick = () => {
      changeCollapsed(!collapsed.value, "clickTrigger");
    };
    useResponsive(breakpoint, (checked) => {
      changeCollapsed(!checked, "responsive");
    });
    const computedPrefixCls = computed(
      () => (prefixCls == null ? void 0 : prefixCls.value) || getPrefixCls("menu")
    );
    const classNames = computed(() => [
      computedPrefixCls.value,
      `${computedPrefixCls.value}-${theme == null ? void 0 : theme.value}`,
      {
        [`${computedPrefixCls.value}-horizontal`]: mode.value === "horizontal",
        [`${computedPrefixCls.value}-vertical`]: mode.value !== "horizontal",
        [`${computedPrefixCls.value}-collapsed`]: computedCollapsed.value,
        [`${computedPrefixCls.value}-pop`]: mode.value === "pop" || computedCollapsed.value,
        [`${computedPrefixCls.value}-pop-button`]: mode.value === "popButton"
      }
    ]);
    const computedStyle = computed(() => {
      const pxCollapsedWidth = isNumber(collapsedWidth.value) ? `${collapsedWidth.value}px` : void 0;
      const objectStyle = isObject(style.value) ? style.value : void 0;
      const width = computedCollapsed.value ? pxCollapsedWidth : objectStyle == null ? void 0 : objectStyle.width;
      return [
        objectStyle ? omit(objectStyle, ["width"]) : style.value,
        { width }
      ];
    });
    const expandIconDown = usePickSlots(slots, "expand-icon-down");
    const expandIconRight = usePickSlots(slots, "expand-icon-right");
    const menuContext = reactive({
      theme,
      mode,
      levelIndent,
      autoScrollIntoView,
      selectedKeys,
      openKeys,
      prefixCls: computedPrefixCls,
      scrollConfig,
      inTrigger,
      collapsed: computedCollapsed,
      triggerProps,
      tooltipProps,
      popupMaxHeight,
      expandIconDown,
      expandIconRight,
      onMenuItemClick: (key) => {
        setSelectedKeys([key]);
        emit("update:selectedKeys", [key]);
        emit("menu-item-click", key);
      },
      onSubMenuClick: (key, level) => {
        const newOpenKeys = open(key, level);
        setOpenKeys(newOpenKeys);
        emit("update:openKeys", newOpenKeys);
        emit("sub-menu-click", key, newOpenKeys);
      }
    });
    provide(MenuInjectionKey, menuContext);
    provideLevel(1);
    return {
      computedPrefixCls,
      classNames,
      computedStyle,
      computedCollapsed,
      computedHasCollapseButton,
      onCollapseBtnClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconMenuUnfold = resolveComponent("IconMenuUnfold");
  const _component_IconMenuFold = resolveComponent("IconMenuFold");
  return openBlock(), createElementBlock("div", mergeProps({ class: _ctx.classNames }, _ctx.$attrs, { style: _ctx.computedStyle }), [
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.computedPrefixCls}-inner`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2),
    _ctx.computedHasCollapseButton ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.computedPrefixCls}-collapse-button`),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onCollapseBtnClick && _ctx.onCollapseBtnClick(...args))
    }, [
      renderSlot(_ctx.$slots, "collapse-icon", { collapsed: _ctx.computedCollapsed }, () => [
        _ctx.computedCollapsed ? (openBlock(), createBlock(_component_IconMenuUnfold, { key: 0 })) : (openBlock(), createBlock(_component_IconMenuFold, { key: 1 }))
      ])
    ], 2)) : createCommentVNode("v-if", true)
  ], 16);
}
var BaseMenu = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { BaseMenu as default };
