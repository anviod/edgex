"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "IconFaceBookCircleFill",
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
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-faceBook-circle-fill`, { [`${prefixCls}-spin`]: props.spin }]);
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
      d: "M24 1C11.29 1 1 11.29 1 24s10.29 23 23 23 23-10.29 23-23S36.71 1 24 1Zm6.172 22.88H26.18v14.404h-5.931V23.88H17.22v-4.962h3.027V15.89c0-3.993 1.695-6.414 6.414-6.414h3.993v4.962h-2.421c-1.815 0-1.936.727-1.936 1.936v2.421h4.478l-.605 5.084h.001Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1);
}
var _IconFaceBookCircleFill = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _IconFaceBookCircleFill;
