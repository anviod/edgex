import { defineComponent, openBlock, createElementBlock, Fragment, renderList, normalizeClass, createElementVNode, normalizeStyle } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { isNumber, isString } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "SkeletonLine",
  props: {
    rows: {
      type: Number,
      default: 1
    },
    widths: {
      type: Array,
      default: () => []
    },
    lineHeight: {
      type: Number,
      default: 20
    },
    lineSpacing: {
      type: Number,
      default: 15
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("skeleton-line");
    const lines = [];
    for (let i = 0; i < props.rows; i++) {
      const style = {};
      if (isNumber(props.widths[i])) {
        style.width = `${props.widths[i]}px`;
      } else if (isString(props.widths[i])) {
        style.width = String(props.widths[i]);
      }
      style.height = `${props.lineHeight}px`;
      if (i > 0) {
        style.marginTop = `${props.lineSpacing}px`;
      }
      lines.push(style);
    }
    return {
      prefixCls,
      lines
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.lines, (style, index) => {
    return openBlock(), createElementBlock("ul", {
      key: index,
      class: normalizeClass(_ctx.prefixCls)
    }, [
      createElementVNode("li", {
        class: normalizeClass(`${_ctx.prefixCls}-row`),
        style: normalizeStyle(style)
      }, null, 6)
    ], 2);
  }), 128);
}
var SkeletonLine = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SkeletonLine as default };
