import { defineComponent, ref, computed, inject, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { dropdownInjectionKey } from "./context.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Doption",
  props: {
    value: {
      type: [String, Number, Object]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    active: Boolean,
    uninjectContext: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("dropdown-option");
    const liRef = ref();
    const computedValue = computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = props.value) != null ? _b : (_a = liRef.value) == null ? void 0 : _a.textContent) != null ? _c : void 0;
      }
    );
    const dropdownCtx = !props.uninjectContext ? inject(dropdownInjectionKey, void 0) : void 0;
    const handleClick = (ev) => {
      if (!props.disabled) {
        emit("click", ev);
        dropdownCtx == null ? void 0 : dropdownCtx.onOptionClick(computedValue.value, ev);
      }
    };
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-disabled`]: props.disabled,
        [`${prefixCls}-active`]: props.active
      }
    ]);
    return {
      prefixCls,
      cls,
      liRef,
      handleClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    ref: "liRef",
    class: normalizeClass([_ctx.cls, { [`${_ctx.prefixCls}-has-suffix`]: Boolean(_ctx.$slots.suffix) }]),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    _ctx.$slots.icon ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-icon`)
    }, [
      renderSlot(_ctx.$slots, "icon")
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("span", {
      class: normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2),
    _ctx.$slots.suffix ? (openBlock(), createElementBlock("span", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-suffix`)
    }, [
      renderSlot(_ctx.$slots, "suffix")
    ], 2)) : createCommentVNode("v-if", true)
  ], 2);
}
var Doption = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Doption as default };
