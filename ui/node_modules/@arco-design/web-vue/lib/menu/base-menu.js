"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-menu-fold/index.js");
var index$1 = require("../icon/icon-menu-unfold/index.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var useLevel = require("./hooks/use-level.js");
var context = require("./context.js");
var usePickSlots = require("../_hooks/use-pick-slots.js");
var omit = require("../_utils/omit.js");
var useMenuDataCollector = require("./hooks/use-menu-data-collector.js");
var useMenuOpenState = require("./hooks/use-menu-open-state.js");
var useResponsive = require("../_hooks/use-responsive.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "BaseMenu",
  components: {
    IconMenuFold: index,
    IconMenuUnfold: index$1
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
    } = vue.toRefs(props);
    const { subMenuKeys, menuData } = useMenuDataCollector["default"]({
      type: isRoot.value ? "menu" : "popupMenu"
    });
    const [selectedKeys, setSelectedKeys] = useMergeState(
      defaultSelectedKeys.value,
      vue.reactive({
        value: propSelectedKeys
      })
    );
    const { openKeys, setOpenKeys, open } = useMenuOpenState(
      vue.reactive({
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
      vue.reactive({
        value: propCollapsed
      })
    );
    const computedCollapsed = vue.computed(
      () => siderCollapsed.value || collapsed.value || mode.value === "popButton"
    );
    const computedHasCollapseButton = vue.computed(
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
    useResponsive.useResponsive(breakpoint, (checked) => {
      changeCollapsed(!checked, "responsive");
    });
    const computedPrefixCls = vue.computed(
      () => (prefixCls == null ? void 0 : prefixCls.value) || globalConfig.getPrefixCls("menu")
    );
    const classNames = vue.computed(() => [
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
    const computedStyle = vue.computed(() => {
      const pxCollapsedWidth = is.isNumber(collapsedWidth.value) ? `${collapsedWidth.value}px` : void 0;
      const objectStyle = is.isObject(style.value) ? style.value : void 0;
      const width = computedCollapsed.value ? pxCollapsedWidth : objectStyle == null ? void 0 : objectStyle.width;
      return [
        objectStyle ? omit.omit(objectStyle, ["width"]) : style.value,
        { width }
      ];
    });
    const expandIconDown = usePickSlots(slots, "expand-icon-down");
    const expandIconRight = usePickSlots(slots, "expand-icon-right");
    const menuContext = vue.reactive({
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
    vue.provide(context.MenuInjectionKey, menuContext);
    useLevel.provideLevel(1);
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
  const _component_IconMenuUnfold = vue.resolveComponent("IconMenuUnfold");
  const _component_IconMenuFold = vue.resolveComponent("IconMenuFold");
  return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({ class: _ctx.classNames }, _ctx.$attrs, { style: _ctx.computedStyle }), [
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.computedPrefixCls}-inner`)
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 2),
    _ctx.computedHasCollapseButton ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.computedPrefixCls}-collapse-button`),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onCollapseBtnClick && _ctx.onCollapseBtnClick(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "collapse-icon", { collapsed: _ctx.computedCollapsed }, () => [
        _ctx.computedCollapsed ? (vue.openBlock(), vue.createBlock(_component_IconMenuUnfold, { key: 0 })) : (vue.openBlock(), vue.createBlock(_component_IconMenuFold, { key: 1 }))
      ])
    ], 2)) : vue.createCommentVNode("v-if", true)
  ], 16);
}
var BaseMenu = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = BaseMenu;
