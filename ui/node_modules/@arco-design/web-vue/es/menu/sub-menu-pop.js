import { defineComponent, toRefs, computed, ref, resolveComponent, openBlock, createBlock, mergeProps, withCtx, createVNode, normalizeStyle, createSlots, renderSlot, createElementVNode, createCommentVNode, createElementBlock, Fragment, normalizeClass, createTextVNode, toDisplayString } from "vue";
import Trigger from "../trigger/index.js";
import BaseMenu from "./base-menu.js";
import useMenu from "./hooks/use-menu.js";
import useLevel from "./hooks/use-level.js";
import { omit } from "../_utils/omit.js";
import { getPrefixCls } from "../_utils/global-config.js";
import MenuIndent from "./indent.js";
import useMenuContext from "./hooks/use-menu-context.js";
import RenderFunction from "../_components/render-function.js";
import { isNumber } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "SubMenuPop",
  components: {
    Menu: BaseMenu,
    Trigger,
    MenuIndent,
    RenderFunction
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
    const { level } = useLevel();
    const { selectable, isChildrenSelected, popupMaxHeight } = toRefs(props);
    const menuContext = useMenuContext();
    const { onSubMenuClick, onMenuItemClick } = menuContext;
    const menuPrefixCls = computed(() => menuContext.prefixCls);
    const mode = computed(() => menuContext.mode);
    const selectedKeys = computed(() => menuContext.selectedKeys || []);
    const prefixCls = computed(() => `${menuPrefixCls.value}-pop`);
    const isSelected = computed(
      () => selectable.value && selectedKeys.value.includes(key.value) || isChildrenSelected.value
    );
    const classNames = computed(() => [
      `${prefixCls.value}`,
      `${prefixCls.value}-header`,
      {
        [`${menuPrefixCls.value}-selected`]: isSelected.value
      }
    ]);
    const needPopOnBottom = computed(
      () => mode.value === "horizontal" && !menuContext.inTrigger
    );
    const popVisible = ref(false);
    const setPopVisible = (val) => {
      popVisible.value = val;
    };
    const triggerPrefixCls = getPrefixCls("trigger");
    const triggerClassNames = computed(() => {
      var _a;
      return [
        `${prefixCls.value}-trigger`,
        {
          [`${prefixCls.value}-trigger-dark`]: menuContext.theme === "dark"
        },
        (_a = menuContext.triggerProps) == null ? void 0 : _a.class
      ];
    });
    const triggerProps = computed(
      () => omit(menuContext.triggerProps || {}, ["class"])
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
      popupMenuStyles: computed(() => {
        var _a;
        const maxHeight = (_a = popupMaxHeight.value) != null ? _a : menuContext.popupMaxHeight;
        if (isNumber(maxHeight))
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
  const _component_MenuIndent = resolveComponent("MenuIndent");
  const _component_RenderFunction = resolveComponent("RenderFunction");
  const _component_Menu = resolveComponent("Menu");
  const _component_Trigger = resolveComponent("Trigger");
  return openBlock(), createBlock(_component_Trigger, mergeProps({
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
    content: withCtx(() => [
      createVNode(_component_Menu, {
        "in-trigger": "",
        "prefix-cls": `${_ctx.triggerPrefixCls}-menu`,
        "selected-keys": _ctx.selectedKeys,
        theme: _ctx.menuContext.theme,
        "trigger-props": _ctx.menuContext.triggerProps,
        style: normalizeStyle(_ctx.popupMenuStyles),
        onMenuItemClick: _ctx.onMenuItemClick
      }, createSlots({
        default: withCtx(() => [
          renderSlot(_ctx.$slots, "default")
        ]),
        _: 2
      }, [
        _ctx.menuContext.expandIconDown ? {
          name: "expand-icon-down",
          fn: withCtx(() => [
            createVNode(_component_RenderFunction, {
              "render-func": _ctx.menuContext.expandIconDown
            }, null, 8, ["render-func"])
          ]),
          key: "0"
        } : void 0,
        _ctx.menuContext.expandIconRight ? {
          name: "expand-icon-right",
          fn: withCtx(() => [
            createVNode(_component_RenderFunction, {
              "render-func": _ctx.menuContext.expandIconRight
            }, null, 8, ["render-func"])
          ]),
          key: "1"
        } : void 0
      ]), 1032, ["prefix-cls", "selected-keys", "theme", "trigger-props", "style", "onMenuItemClick"])
    ]),
    default: withCtx(() => [
      createElementVNode("div", mergeProps({
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
        createCommentVNode(" header "),
        createVNode(_component_MenuIndent, { level: _ctx.level }, null, 8, ["level"]),
        _ctx.$slots.icon ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createElementVNode("span", {
            class: normalizeClass(`${_ctx.menuPrefixCls}-icon`)
          }, [
            renderSlot(_ctx.$slots, "icon")
          ], 2),
          createElementVNode("span", {
            class: normalizeClass(`${_ctx.menuPrefixCls}-title`)
          }, [
            renderSlot(_ctx.$slots, "title", {}, () => [
              createTextVNode(toDisplayString(_ctx.title), 1)
            ])
          ], 2)
        ], 64)) : renderSlot(_ctx.$slots, "title", { key: 1 }, () => [
          createTextVNode(toDisplayString(_ctx.title), 1)
        ]),
        createCommentVNode(" suffix "),
        createElementVNode("span", {
          class: normalizeClass(`${_ctx.menuPrefixCls}-icon-suffix`)
        }, [
          _ctx.needPopOnBottom ? renderSlot(_ctx.$slots, "expand-icon-down", { key: 0 }) : renderSlot(_ctx.$slots, "expand-icon-right", { key: 1 })
        ], 2),
        _ctx.isSelected && _ctx.mode === "horizontal" ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(`${_ctx.menuPrefixCls}-selected-label`)
        }, null, 2)) : createCommentVNode("v-if", true)
      ], 16)
    ]),
    _: 3
  }, 16, ["class", "position", "popup-visible", "onPopupVisibleChange"]);
}
var SubMenuPop = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SubMenuPop as default };
