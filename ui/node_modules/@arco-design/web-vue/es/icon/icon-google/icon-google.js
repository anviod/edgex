import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode } from "vue";
import { getPrefixCls } from "../../_utils/global-config.js";
import { isNumber } from "../../_utils/is.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "IconGoogle",
  props: {
    size: {
      type: [Number, String]
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    strokeLinecap: {
      type: String,
      default: "butt",
      validator: (value) => {
        return ["butt", "round", "square"].includes(value);
      }
    },
    strokeLinejoin: {
      type: String,
      default: "miter",
      validator: (value) => {
        return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
      }
    },
    rotate: Number,
    spin: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("icon");
    const cls = computed(() => [prefixCls, `${prefixCls}-google`, { [`${prefixCls}-spin`]: props.spin }]);
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
    const onClick = (ev) => {
      emit("click", ev);
    };
    return {
      cls,
      innerStyle,
      onClick
    };
  }
});
const _hoisted_1 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    createElementVNode("path", {
      d: "M23.997 21.054h19.42a19.46 19.46 0 0 1 .321 3.428c0 3.875-.812 7.335-2.437 10.38-1.625 3.044-3.942 5.424-6.951 7.138-3.01 1.714-6.46 2.572-10.353 2.572-2.803 0-5.473-.54-8.009-1.621-2.535-1.08-4.723-2.54-6.562-4.38-1.84-1.839-3.3-4.026-4.38-6.562A20.223 20.223 0 0 1 3.426 24c0-2.803.54-5.473 1.62-8.009 1.08-2.535 2.54-4.723 4.38-6.562 1.84-1.84 4.027-3.3 6.562-4.38a20.223 20.223 0 0 1 8.01-1.62c5.356 0 9.955 1.794 13.794 5.384l-5.598 5.384c-2.197-2.125-4.929-3.188-8.197-3.188-2.303 0-4.433.58-6.388 1.741a12.83 12.83 0 0 0-4.648 4.728c-1.142 1.99-1.714 4.165-1.714 6.522s.572 4.531 1.714 6.523a12.83 12.83 0 0 0 4.648 4.727c1.955 1.16 4.085 1.741 6.388 1.741 1.554 0 2.982-.214 4.286-.643 1.303-.428 2.375-.964 3.214-1.607a11.63 11.63 0 0 0 2.197-2.196c.625-.822 1.084-1.598 1.38-2.33a9.84 9.84 0 0 0 .602-2.09H23.997v-7.071Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1);
}
var _IconGoogle = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _IconGoogle as default };
