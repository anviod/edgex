import { defineComponent, computed, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconMore from "../icon/icon-more/index.js";
import { getLegalPage } from "./utils.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "EllipsisPager",
  components: {
    IconMore
  },
  props: {
    current: {
      type: Number,
      required: true
    },
    step: {
      type: Number,
      default: 5
    },
    pages: {
      type: Number,
      required: true
    }
  },
  emits: ["click"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("pagination-item");
    const nextPage = computed(
      () => getLegalPage(props.current + props.step, {
        min: 1,
        max: props.pages
      })
    );
    const handleClick = (e) => {
      emit("click", nextPage.value);
    };
    const cls = computed(() => [prefixCls, `${prefixCls}-ellipsis`]);
    return {
      prefixCls,
      cls,
      handleClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_more = resolveComponent("icon-more");
  return openBlock(), createElementBlock("li", {
    class: normalizeClass(_ctx.cls),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      createVNode(_component_icon_more)
    ])
  ], 2);
}
var EllipsisPager = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { EllipsisPager as default };
