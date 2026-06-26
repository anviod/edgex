import { defineComponent, inject, ref, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createVNode, createCommentVNode, normalizeStyle, withCtx, createElementVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Empty from "../empty/index.js";
import { dropdownInjectionKey } from "./context.js";
import { isNumber } from "../_utils/is.js";
import Scrollbar from "../scrollbar/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "DropdownPanel",
  components: {
    Scrollbar,
    Empty
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    bottomOffset: {
      type: Number,
      default: 0
    },
    onScroll: {
      type: [Function, Array]
    },
    onReachBottom: {
      type: [Function, Array]
    }
  },
  emits: ["scroll", "reachBottom"],
  setup(props, { emit, slots }) {
    const prefixCls = getPrefixCls("dropdown");
    const dropdownCtx = inject(
      dropdownInjectionKey,
      {}
    );
    const wrapperRef = ref();
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      const bottom = scrollHeight - (scrollTop + offsetHeight);
      if (bottom <= props.bottomOffset) {
        emit("reachBottom", e);
      }
      emit("scroll", e);
    };
    const style = computed(() => {
      if (isNumber(dropdownCtx.popupMaxHeight)) {
        return {
          maxHeight: `${dropdownCtx.popupMaxHeight}px`
        };
      }
      if (!dropdownCtx.popupMaxHeight) {
        return {
          maxHeight: "none",
          overflowY: "hidden"
        };
      }
      return void 0;
    });
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-has-footer`]: Boolean(slots.footer)
      }
    ]);
    return {
      prefixCls,
      cls,
      style,
      wrapperRef,
      handleScroll
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_empty = resolveComponent("empty");
  const _component_Scrollbar = resolveComponent("Scrollbar");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls)
  }, [
    _ctx.isEmpty ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-empty`)
    }, [
      renderSlot(_ctx.$slots, "empty", {}, () => [
        createVNode(_component_empty)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    createVNode(_component_Scrollbar, {
      ref: "wrapperRef",
      class: normalizeClass(`${_ctx.prefixCls}-list-wrapper`),
      style: normalizeStyle(_ctx.style),
      onScroll: _ctx.handleScroll
    }, {
      default: withCtx(() => [
        createElementVNode("ul", {
          class: normalizeClass(`${_ctx.prefixCls}-list`)
        }, [
          renderSlot(_ctx.$slots, "default")
        ], 2)
      ]),
      _: 3
    }, 8, ["class", "style", "onScroll"]),
    _ctx.$slots.footer && !_ctx.isEmpty ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-footer`)
    }, [
      renderSlot(_ctx.$slots, "footer")
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var DropdownPanel = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { DropdownPanel as default };
