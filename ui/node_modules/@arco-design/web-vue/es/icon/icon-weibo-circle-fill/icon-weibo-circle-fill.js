import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode } from "vue";
import { getPrefixCls } from "../../_utils/global-config.js";
import { isNumber } from "../../_utils/is.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "IconWeiboCircleFill",
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
    const cls = computed(() => [prefixCls, `${prefixCls}-weibo-circle-fill`, { [`${prefixCls}-spin`]: props.spin }]);
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
      d: "M24 47a23 23 0 1 1 23-23 22.988 22.988 0 0 1-23 23Zm1.276-26.994c-.544.063-2.259 1.171-1.297-1.108C25 15 20.235 15.293 17.874 16.16A23.776 23.776 0 0 0 7.649 27.283c-2.007 6.419 5.018 10.329 10.246 11.123 5.227.795 13.068-.502 16.622-4.85 2.635-3.179 3.137-7.507-1.84-8.761-1.651-.398-.69-1.088-.271-2.259a2.775 2.775 0 0 0-2.175-3.24 2.092 2.092 0 0 0-.335-.042 12.468 12.468 0 0 0-4.62.752Zm7.004-3.889a2.326 2.326 0 0 0-1.903.544c-.377.339-.418 1.338.962 1.652.458.021.913.084 1.36.188a1.836 1.836 0 0 1 1.233 2.07c-.21 1.924.878 2.237 1.652 1.714a1.647 1.647 0 0 0 .627-1.338 4.117 4.117 0 0 0-3.325-4.767c-.042-.008-.61-.063-.606-.063Zm7.423.084a8.408 8.408 0 0 0-6.838-4.6c-1.129-.126-3.512-.397-3.784 1.15a1.17 1.17 0 0 0 .857 1.4c.042 0 .084.022.126.022.523.02 1.048 0 1.568-.063a6.481 6.481 0 0 1 6.524 6.44c0 .3-.02.601-.063.9-.063.355-.105.71-.147 1.066A1.277 1.277 0 0 0 38.93 24a1.255 1.255 0 0 0 1.338-.648c.71-2.373.501-4.926-.585-7.151h.02ZM21.616 36.44c-5.457.69-10.245-1.673-10.684-5.27-.44-3.595 3.575-7.066 9.033-7.756 5.457-.69 10.245 1.672 10.705 5.269.46 3.596-3.617 7.088-9.075 7.757h.021Zm-1.484-10.266a5.181 5.181 0 0 0-5.353 4.913 4.662 4.662 0 0 0 4.935 4.391c.14-.004.28-.017.418-.042a5.503 5.503 0 0 0 5.185-5.143 4.472 4.472 0 0 0-4.746-4.182l-.44.063Zm1.003 4.244a.669.669 0 0 1-.773-.544v-.083a.76.76 0 0 1 .774-.711.642.642 0 0 1 .731.544.076.076 0 0 1 .021.062.807.807 0 0 1-.753.732Zm-2.78 2.781a1.65 1.65 0 0 1-1.861-1.422.266.266 0 0 1-.021-.125 1.844 1.844 0 0 1 1.882-1.736 1.562 1.562 0 0 1 1.819 1.297.46.46 0 0 1 .02.167 1.96 1.96 0 0 1-1.84 1.819Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1);
}
var _IconWeiboCircleFill = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _IconWeiboCircleFill as default };
