"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "IconWechat",
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
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-wechat`, { [`${prefixCls}-spin`]: props.spin }]);
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
      d: "M32.09 16.362a14.39 14.39 0 0 0-6.927 1.716 13.087 13.087 0 0 0-5.008 4.676 11.936 11.936 0 0 0-1.856 6.473c.01 1.137.185 2.273.517 3.36h-1.505a26.653 26.653 0 0 1-4.766-.593l-.925-.166-5.665 2.93 1.55-4.848C3.179 26.783 1.018 23.077 1 18.792a11.951 11.951 0 0 1 2.188-6.927 14.943 14.943 0 0 1 5.938-5.027 18.579 18.579 0 0 1 8.248-1.837A18.82 18.82 0 0 1 24.8 6.506a16.863 16.863 0 0 1 5.893 4.128 11.963 11.963 0 0 1 2.992 5.817 17.922 17.922 0 0 0-1.595-.09Zm-20.152-.414a2.167 2.167 0 0 0 1.505-.471c.405-.378.62-.908.593-1.46a1.881 1.881 0 0 0-.592-1.46 2.025 2.025 0 0 0-1.506-.535 2.778 2.778 0 0 0-1.67.535c-.454.323-.728.849-.728 1.401a1.708 1.708 0 0 0 .727 1.523 2.925 2.925 0 0 0 1.671.467ZM47 28.99a9.573 9.573 0 0 1-1.59 5.193c-1.128 1.6-2.52 3-4.129 4.128l1.258 4.129-4.51-2.413h-.243a20.758 20.758 0 0 1-4.6.76 15.538 15.538 0 0 1-7.03-1.59 13.089 13.089 0 0 1-5.008-4.313 10.501 10.501 0 0 1-1.838-5.939 10.29 10.29 0 0 1 1.838-5.92c1.266-1.847 3-3.334 5.008-4.313a15.579 15.579 0 0 1 7.03-1.59 14.919 14.919 0 0 1 6.761 1.59 13.286 13.286 0 0 1 5.09 4.312 10.004 10.004 0 0 1 1.94 5.966H47ZM23.407 11.955a2.77 2.77 0 0 0-1.747.534 1.65 1.65 0 0 0-.76 1.46c-.017.584.27 1.146.76 1.46.498.36 1.1.544 1.716.535a2.083 2.083 0 0 0 1.505-.472c.368-.404.561-.925.534-1.46a1.834 1.834 0 0 0-.534-1.532 1.887 1.887 0 0 0-1.532-.534h.063v.009h-.005Zm5.256 15.03a2.016 2.016 0 0 0 1.46-.498c.332-.288.525-.7.534-1.137a1.612 1.612 0 0 0-.534-1.136 2.062 2.062 0 0 0-1.46-.499 1.58 1.58 0 0 0-1.092.499c-.305.296-.49.71-.498 1.136.009.427.184.84.498 1.137.288.305.679.48 1.092.499Zm8.953 0a2.016 2.016 0 0 0 1.46-.498c.332-.288.525-.7.534-1.137a1.558 1.558 0 0 0-.593-1.136 2.12 2.12 0 0 0-1.401-.499 1.493 1.493 0 0 0-1.092.499c-.305.296-.49.71-.498 1.136.009.427.184.84.498 1.137.279.305.674.49 1.092.499Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1);
}
var _IconWechat = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _IconWechat;
