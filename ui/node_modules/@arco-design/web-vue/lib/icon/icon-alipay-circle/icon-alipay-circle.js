"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "IconAlipayCircle",
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
    const prefixCls = globalConfig.getPrefixCls("icon");
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-alipay-circle`, { [`${prefixCls}-spin`]: props.spin }]);
    const innerStyle = vue.computed(() => {
      const styles = {};
      if (props.size) {
        styles.fontSize = is.isNumber(props.size) ? `${props.size}px` : props.size;
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
  return vue.openBlock(), vue.createElementBlock("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    class: vue.normalizeClass(_ctx.cls),
    style: vue.normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    vue.createElementVNode("path", {
      d: "M10.8 27.025c-.566.456-1.174 1.122-1.35 1.968-.24 1.156-.05 2.604 1.065 3.739 1.352 1.376 3.405 1.753 4.292 1.818 2.41.174 4.978-1.02 6.913-2.384.759-.535 2.058-1.61 3.3-3.268-2.783-1.437-6.257-3.026-9.97-2.87-1.898.079-3.256.472-4.25.997Zm35.29 6.354A23.872 23.872 0 0 0 48 24C48 10.767 37.234 0 24 0S0 10.767 0 24c0 13.234 10.766 24 24 24 7.987 0 15.07-3.925 19.436-9.943a2688.801 2688.801 0 0 0-15.11-7.467c-1.999 2.277-4.953 4.56-8.29 5.554-2.097.623-3.986.86-5.963.457-1.956-.4-3.397-1.317-4.237-2.235-.428-.469-.92-1.064-1.275-1.773.033.09.056.143.056.143s-.204-.353-.361-.914a4.03 4.03 0 0 1-.157-.85 4.383 4.383 0 0 1-.009-.612 4.409 4.409 0 0 1 .078-1.128c.197-.948.601-2.054 1.649-3.08 2.3-2.251 5.38-2.372 6.976-2.363 2.363.014 6.47 1.048 9.928 2.27.958-2.04 1.573-4.221 1.97-5.676H14.31v-1.555h7.384V15.72h-8.938v-1.555h8.938v-3.108c0-.427.084-.778.777-.778h3.498v3.886h9.717v1.555H25.97v3.11h7.773s-.78 4.35-3.221 8.64c5.416 1.934 13.037 4.914 15.568 5.91Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1);
}
var _IconAlipayCircle = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _IconAlipayCircle;
