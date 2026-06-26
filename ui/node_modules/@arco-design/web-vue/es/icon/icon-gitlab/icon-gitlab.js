import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode } from "vue";
import { getPrefixCls } from "../../_utils/global-config.js";
import { isNumber } from "../../_utils/is.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "IconGitlab",
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
    const cls = computed(() => [prefixCls, `${prefixCls}-gitlab`, { [`${prefixCls}-spin`]: props.spin }]);
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
      d: "M45.53 26.154 39.694 6.289v-.005c-.407-1.227-1.377-1.955-2.587-1.955-1.254 0-2.277.723-2.663 1.885L30.62 17.625H17.4l-3.825-11.41c-.386-1.163-1.41-1.886-2.663-1.886-1.237 0-2.276.792-2.592 1.96l-5.83 19.865a2.047 2.047 0 0 0 .724 2.18l19.741 14.807c.14.193.332.338.557.418l.461.343.455-.343c.263-.091.483-.252.638-.477L44.8 28.33a2.03 2.03 0 0 0 .728-2.175ZM36.84 6.932c.053-.096.155-.102.187-.102.06 0 .134.016.182.161l3.183 10.704H33.24l3.6-10.763Zm-26.11.054c.047-.14.122-.156.181-.156.145 0 .156.006.183.091L14.699 17.7H7.633l3.096-10.714ZM5.076 26.502l1.511-5.213 10.843 14.475-12.354-9.262Zm3.96-6.236h6.54l4.865 15.23-11.406-15.23Zm15.01 17.877-5.743-17.877h11.48l-5.737 17.877Zm8.459-17.877h6.402L27.642 35.31l4.864-15.043Zm-2.18 15.745L41.43 21.187l1.58 5.315-12.685 9.509Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1);
}
var _IconGitlab = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _IconGitlab as default };
