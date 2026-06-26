import { defineComponent, toRefs, inject, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createBlock, resolveDynamicComponent, withDirectives, mergeProps, withCtx, createElementVNode, vShow } from "vue";
import { configProviderInjectionKey } from "../config-provider/context.js";
import { getPrefixCls } from "../_utils/global-config.js";
import Empty from "../empty/index.js";
import Spin from "../spin/index.js";
import Scrollbar from "../scrollbar/index.js";
import { useComponentRef } from "../_hooks/use-component-ref.js";
import { useScrollbar } from "../_hooks/use-scrollbar.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "SelectDropdown",
  components: {
    ScrollbarComponent: Scrollbar,
    Empty,
    Spin
  },
  props: {
    loading: Boolean,
    empty: Boolean,
    virtualList: Boolean,
    bottomOffset: {
      type: Number,
      default: 0
    },
    scrollbar: {
      type: [Boolean, Object],
      default: true
    },
    onScroll: {
      type: [Function, Array]
    },
    onReachBottom: {
      type: [Function, Array]
    },
    showHeaderOnEmpty: {
      type: Boolean,
      default: false
    },
    showFooterOnEmpty: {
      type: Boolean,
      default: false
    }
  },
  emits: ["scroll", "reachBottom"],
  setup(props, { emit, slots }) {
    var _a, _b, _c;
    const { scrollbar } = toRefs(props);
    const prefixCls = getPrefixCls("select-dropdown");
    const configCtx = inject(configProviderInjectionKey, void 0);
    const SelectEmpty = (_c = (_b = configCtx == null ? void 0 : (_a = configCtx.slots).empty) == null ? void 0 : _b.call(_a, { component: "select" })) == null ? void 0 : _c[0];
    const { componentRef: wrapperComRef, elementRef: wrapperRef } = useComponentRef("containerRef");
    const { displayScrollbar, scrollbarProps } = useScrollbar(scrollbar);
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      const bottom = scrollHeight - (scrollTop + offsetHeight);
      if (bottom <= props.bottomOffset) {
        emit("reachBottom", e);
      }
      emit("scroll", e);
    };
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-has-header`]: Boolean(slots.header),
        [`${prefixCls}-has-footer`]: Boolean(slots.footer)
      }
    ]);
    return {
      prefixCls,
      SelectEmpty,
      cls,
      wrapperRef,
      wrapperComRef,
      handleScroll,
      displayScrollbar,
      scrollbarProps
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_spin = resolveComponent("spin");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    _ctx.$slots.header && (!_ctx.empty || _ctx.showHeaderOnEmpty) ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-header`)
    }, [
      renderSlot(_ctx.$slots, "header")
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.loading ? (openBlock(), createBlock(_component_spin, {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-loading`)
    }, null, 8, ["class"])) : _ctx.empty ? (openBlock(), createElementBlock("div", {
      key: 2,
      class: normalizeClass(`${_ctx.prefixCls}-empty`)
    }, [
      renderSlot(_ctx.$slots, "empty", {}, () => [
        (openBlock(), createBlock(resolveDynamicComponent(_ctx.SelectEmpty ? _ctx.SelectEmpty : "Empty")))
      ])
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.virtualList && !_ctx.loading && !_ctx.empty ? renderSlot(_ctx.$slots, "virtual-list", { key: 3 }) : createCommentVNode("v-if", true),
    !_ctx.virtualList ? withDirectives((openBlock(), createBlock(resolveDynamicComponent(_ctx.displayScrollbar ? "ScrollbarComponent" : "div"), mergeProps({
      key: 4,
      ref: "wrapperComRef",
      class: `${_ctx.prefixCls}-list-wrapper`
    }, _ctx.scrollbarProps, { onScroll: _ctx.handleScroll }), {
      default: withCtx(() => [
        createElementVNode("ul", {
          class: normalizeClass(`${_ctx.prefixCls}-list`)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2)
      ]),
      _: 3
    }, 16, ["class", "onScroll"])), [
      [vShow, !_ctx.loading && !_ctx.empty]
    ]) : createCommentVNode("v-if", true),
    _ctx.$slots.footer && (!_ctx.empty || _ctx.showFooterOnEmpty) ? (openBlock(), createElementBlock("div", {
      key: 5,
      class: normalizeClass(`${_ctx.prefixCls}-footer`)
    }, [
      renderSlot(_ctx.$slots, "footer")
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var SelectDropdown = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SelectDropdown as default };
