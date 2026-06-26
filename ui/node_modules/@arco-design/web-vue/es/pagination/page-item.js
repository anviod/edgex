import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Pager",
  props: {
    pageNumber: {
      type: Number
    },
    current: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    style: {
      type: Object
    },
    activeStyle: {
      type: Object
    }
  },
  emits: ["click"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("pagination-item");
    const isActive = computed(() => props.current === props.pageNumber);
    const handleClick = (e) => {
      if (!props.disabled) {
        emit("click", props.pageNumber, e);
      }
    };
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-active`]: isActive.value
      }
    ]);
    const mergedStyle = computed(() => {
      return isActive.value ? props.activeStyle : props.style;
    });
    return {
      prefixCls,
      cls,
      mergedStyle,
      handleClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.mergedStyle),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    renderSlot(_ctx.$slots, "default", { page: _ctx.pageNumber }, () => [
      createTextVNode(toDisplayString(_ctx.pageNumber), 1)
    ])
  ], 6);
}
var Pager = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Pager as default };
