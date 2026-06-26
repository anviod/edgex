import { defineComponent, openBlock, createBlock, Transition, withCtx, renderSlot } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "ExpandTransition",
  props: {
    expanded: Boolean
  },
  emits: ["end"],
  setup(props, { emit }) {
    return {
      onEnter(el) {
        const endHeight = `${el.scrollHeight}px`;
        el.style.height = props.expanded ? "0" : endHeight;
        el.offsetHeight;
        el.style.height = props.expanded ? endHeight : "0";
      },
      onAfterEnter(el) {
        el.style.height = props.expanded ? "" : "0";
        emit("end");
      },
      onBeforeLeave(el) {
        el.style.display = "none";
      }
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, {
    onEnter: _ctx.onEnter,
    onAfterEnter: _ctx.onAfterEnter,
    onBeforeLeave: _ctx.onBeforeLeave
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["onEnter", "onAfterEnter", "onBeforeLeave"]);
}
var ExpandTransition = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ExpandTransition as default };
