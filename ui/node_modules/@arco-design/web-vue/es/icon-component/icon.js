import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { isNumber } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Icon",
  props: {
    type: String,
    size: [Number, String],
    rotate: Number,
    spin: Boolean
  },
  setup(props) {
    const prefixCls = getPrefixCls("icon");
    const innerStyle = computed(() => {
      const styles = {};
      if (props.size) {
        styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.rotate) {
        styles.transform = `rotate(${props.rotate}deg)`;
      }
      return styles;
    });
    const cls = computed(() => [
      prefixCls,
      {
        [`${prefixCls}-loading`]: props.spin
      },
      props.type
    ]);
    return {
      cls,
      innerStyle
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.innerStyle),
    fill: "currentColor"
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6);
}
var _Icon = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Icon as default };
