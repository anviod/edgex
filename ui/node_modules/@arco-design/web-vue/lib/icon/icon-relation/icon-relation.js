"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "IconRelation",
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
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-relation`, { [`${prefixCls}-spin`]: props.spin }]);
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
    stroke: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    class: vue.normalizeClass(_ctx.cls),
    style: vue.normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    vue.createElementVNode("path", { d: "M19.714 14C15.204 15.784 12 20.302 12 25.593c0 1.142.15 2.247.429 3.298m16.285-14.712C32.998 16.073 36 20.471 36 25.593c0 1.07-.131 2.11-.378 3.102m-18.32 7.194a11.676 11.676 0 0 0 13.556-.112" }, null, -1),
    vue.createElementVNode("path", { d: "M24 19a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM36 40a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 40a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" }, null, -1)
  ]), 14, _hoisted_1);
}
var _IconRelation = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _IconRelation;
