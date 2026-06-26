import { defineComponent, openBlock, createElementBlock, normalizeClass, Fragment, renderList, normalizeStyle, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { getPositionStyle, getOffsetPercent } from "./utils.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "SliderMarks",
  props: {
    data: {
      type: Array,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    direction: {
      type: String,
      default: "horizontal"
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("slider");
    const getStyle = (value) => getPositionStyle(
      getOffsetPercent(value, [props.min, props.max]),
      props.direction
    );
    return {
      prefixCls,
      getStyle
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(`${_ctx.prefixCls}-marks`)
  }, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.data, (item, index) => {
      return openBlock(), createElementBlock("div", {
        key: index,
        "aria-hidden": "true",
        class: normalizeClass(`${_ctx.prefixCls}-mark`),
        style: normalizeStyle(_ctx.getStyle(item.key))
      }, toDisplayString(item.content), 7);
    }), 128))
  ], 2);
}
var SliderMarks = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { SliderMarks as default };
