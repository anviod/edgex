"use strict";
var vue = require("vue");
var index = require("../trigger/index.js");
var baseMenu = require("./base-menu.js");
var useMenu = require("./hooks/use-menu.js");
var useLevel = require("./hooks/use-level.js");
var omit = require("../_utils/omit.js");
var globalConfig = require("../_utils/global-config.js");
var indent = require("./indent.js");
var useMenuContext = require("./hooks/use-menu-context.js");
var renderFunction = require("../_components/render-function.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "SubMenuPop",
  components: {
    Menu: baseMenu,
    Trigger: index,
    MenuIndent: indent,
    RenderFunction: renderFunction
  },
  inheritAttrs: false,
  props: {
    title: {
      type: String
    },
    selectable: {
      type: Boolean
    },
    isChildrenSelected: {
      type: Boolean
    },
    popupMaxHeight: {
      type: [Boolean, Number],
      default: void 0
    }
  },
  setup(props) {
    const { key } = useMenu();
    const { level } = useLevel["default"]();
    const { selectable, isChildrenSelected, popupMaxHeight } = vue.toRefs(props);
    const menuContext = useMenuContext();
    const { onSubMenuClick, onMenuItemClick } = menuContext;
    const menuPrefixCls = vue.computed(() => menuContext.prefixCls);
    const mode = vue.computed(() => menuContext.mode);
    const selectedKeys = vue.computed(() => menuContext.selectedKeys || []);
    const prefixCls = vue.computed(() => `${menuPrefixCls.value}-pop`);
    const isSelected = vue.computed(
      () => selectable.value && selectedKeys.value.includes(key.value) || isChildrenSelected.value
    );
    const classNames = vue.computed(() => [
      `${prefixCls.value}`,
      `${prefixCls.value}-header`,
      {
        [`${menuPrefixCls.value}-selected`]: isSelected.value
      }
    ]);
    const needPopOnBottom = vue.computed(
      () => mode.value === "horizontal" && !menuContext.inTrigger
    );
    const popVisible = vue.ref(false);
    const setPopVisible = (val) => {
      popVisible.value = val;
    };
    const triggerPrefixCls = globalConfig.getPrefixCls("trigger");
    const triggerClassNames = vue.computed(() => {
      var _a;
      return [
        `${prefixCls.value}-trigger`,
        {
          [`${prefixCls.value}-trigger-dark`]: menuContext.theme === "dark"
        },
        (_a = menuContext.triggerProps) == null ? void 0 : _a.class
      ];
    });
    const triggerProps = vue.computed(
      () => omit.omit(menuContext.triggerProps || {}, ["class"])
    );
    return {
      menuPrefixCls,
      mode,
      level,
      classNames,
      isSelected,
      selectedKeys,
      needPopOnBottom,
      popVisible,
      triggerPrefixCls,
      triggerClassNames,
      triggerProps,
      menuContext,
      popupMenuStyles: vue.computed(() => {
        var _a;
        const maxHeight = (_a = popupMaxHeight.value) != null ? _a : menuContext.popupMaxHeight;
        if (is.isNumber(maxHeight))
          return { maxHeight: `${maxHeight}px` };
        return maxHeight ? {} : { maxHeight: "unset" };
      }),
      onClick: () => {
        onSubMenuClick && onSubMenuClick(key.value, level.value);
        selectable.value && onMenuItemClick && onMenuItemClick(key.value);
      },
      onMenuItemClick: (key2) => {
        onMenuItemClick && onMenuItemClick(key2);
        setPopVisible(false);
      },
      onVisibleChange: (visible) => {
        setPopVisible(visible);
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_MenuIndent = vue.resolveComponent("MenuIndent");
  const _component_RenderFunction = vue.resolveComponent("RenderFunction");
  const _component_Menu = vue.resolveComponent("Menu");
  const _component_Trigger = vue.resolveComponent("Trigger");
  return vue.openBlock(), vue.createBlock(_component_Trigger, vue.mergeProps({
    trigger: "hover",
    class: _ctx.triggerClassNames,
    position: _ctx.needPopOnBottom ? "bl" : "rt",
    "show-arrow": "",
    "animation-class": "fade-in",
    "mouse-enter-delay": 50,
    "mouse-leave-delay": 50,
    "popup-offset": 4,
    "auto-fit-popup-min-width": true,
    duration: 100
  }, _ctx.triggerProps, {
    "unmount-on-close": false,
    "popup-visible": _ctx.popVisible,
    onPopupVisibleChange: _ctx.onVisibleChange
  }), {
    content: vue.withCtx(() => [
      vue.createVNode(_component_Menu, {
        "in-trigger": "",
        "prefix-cls": `${_ctx.triggerPrefixCls}-menu`,
        "selected-keys": _ctx.selectedKeys,
        theme: _ctx.menuContext.theme,
        "trigger-props": _ctx.menuContext.triggerProps,
        style: vue.normalizeStyle(_ctx.popupMenuStyles),
        onMenuItemClick: _ctx.onMenuItemClick
      }, vue.createSlots({
        default: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "default")
        ]),
        _: 2
      }, [
        _ctx.menuContext.expandIconDown ? {
          name: "expand-icon-down",
          fn: vue.withCtx(() => [
            vue.createVNode(_component_RenderFunction, {
              "render-func": _ctx.menuContext.expandIconDown
            }, null, 8, ["render-func"])
          ]),
          key: "0"
        } : void 0,
        _ctx.menuContext.expandIconRight ? {
          name: "expand-icon-right",
          fn: vue.withCtx(() => [
            vue.createVNode(_component_RenderFunction, {
              "render-func": _ctx.menuContext.expandIconRight
            }, null, 8, ["render-func"])
          ]),
          key: "1"
        } : void 0
      ]), 1032, ["prefix-cls", "selected-keys", "theme", "trigger-props", "style", "onMenuItemClick"])
    ]),
    default: vue.withCtx(() => [
      vue.createElementVNode("div", vue.mergeProps({
        class: [
          _ctx.classNames,
          {
            [`${_ctx.menuPrefixCls}-has-icon`]: _ctx.$slots.icon
          }
        ],
        "aria-haspopup": "true"
      }, _ctx.$attrs, {
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
      }), [
        vue.createCommentVNode(" header "),
        vue.createVNode(_component_MenuIndent, { level: _ctx.level }, null, 8, ["level"]),
        _ctx.$slots.icon ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
          vue.createElementVNode("span", {
            class: vue.normalizeClass(`${_ctx.menuPrefixCls}-icon`)
          }, [
            vue.renderSlot(_ctx.$slots, "icon")
          ], 2),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(`${_ctx.menuPrefixCls}-title`)
          }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
            ])
          ], 2)
        ], 64)) : vue.renderSlot(_ctx.$slots, "title", { key: 1 }, () => [
          vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
        ]),
        vue.createCommentVNode(" suffix "),
        vue.createElementVNode("span", {
          class: vue.normalizeClass(`${_ctx.menuPrefixCls}-icon-suffix`)
        }, [
          _ctx.needPopOnBottom ? vue.renderSlot(_ctx.$slots, "expand-icon-down", { key: 0 }) : vue.renderSlot(_ctx.$slots, "expand-icon-right", { key: 1 })
        ], 2),
        _ctx.isSelected && _ctx.mode === "horizontal" ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: vue.normalizeClass(`${_ctx.menuPrefixCls}-selected-label`)
        }, null, 2)) : vue.createCommentVNode("v-if", true)
      ], 16)
    ]),
    _: 3
  }, 16, ["class", "position", "popup-visible", "onPopupVisibleChange"]);
}
var SubMenuPop = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = SubMenuPop;
