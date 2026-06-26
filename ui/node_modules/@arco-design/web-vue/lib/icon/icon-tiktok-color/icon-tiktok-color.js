"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "IconTiktokColor",
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
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-tiktok-color`, { [`${prefixCls}-spin`]: props.spin }]);
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
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg",
    class: vue.normalizeClass(_ctx.cls),
    style: vue.normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    vue.createStaticVNode('<path d="M928 310.4v148.8c-8 0-17.6 1.6-27.2 1.6-72 0-139.2-27.2-190.4-70.4v316.8c0 64-20.8 124.8-57.6 172.8-51.2 68.8-134.4 115.2-228.8 115.2-102.4 0-192-54.4-241.6-134.4 51.2 48 120 78.4 195.2 78.4 92.8 0 176-44.8 227.2-115.2 35.2-48 57.6-107.2 57.6-172.8V332.8c51.2 44.8 116.8 70.4 190.4 70.4 9.6 0 17.6 0 27.2-1.6v-96c14.4 3.2 27.2 4.8 41.6 4.8h6.4z" fill="#FF004F"></path><path d="M464 420.8v164.8c-11.2-3.2-24-4.8-35.2-4.8-70.4 0-128 59.2-128 131.2 0 16 3.2 30.4 8 44.8-32-24-54.4-62.4-54.4-105.6 0-72 57.6-131.2 128-131.2 12.8 0 24 1.6 35.2 4.8V419.2h9.6c12.8 0 25.6 0 36.8 1.6zM734.4 192c-28.8-25.6-49.6-60.8-60.8-97.6H712v22.4c3.2 25.6 11.2 51.2 22.4 75.2z" fill="#FF004F"></path><path d="M881.6 307.2v96c-8 1.6-17.6 1.6-27.2 1.6-72 0-139.2-27.2-190.4-70.4v316.8c0 64-20.8 124.8-57.6 172.8-52.8 70.4-134.4 115.2-227.2 115.2-75.2 0-144-30.4-195.2-78.4-27.2-44.8-43.2-96-43.2-152 0-155.2 123.2-281.6 276.8-286.4V528c-11.2-3.2-24-4.8-35.2-4.8-70.4 0-128 59.2-128 131.2 0 43.2 20.8 83.2 54.4 105.6 17.6 49.6 65.6 86.4 120 86.4 70.4 0 128-59.2 128-131.2V94.4h116.8c11.2 38.4 32 72 60.8 97.6 28.8 57.6 83.2 100.8 147.2 115.2z"></path><path d="M417.6 364.8v54.4C264 424 140.8 550.4 140.8 705.6c0 56 16 107.2 43.2 152-54.4-52.8-88-126.4-88-209.6 0-158.4 128-286.4 284.8-286.4 12.8 0 25.6 1.6 36.8 3.2z" fill="#00F7EF"></path><path d="M673.6 94.4H556.8V712c0 72-57.6 131.2-128 131.2-56 0-102.4-35.2-120-86.4 20.8 14.4 46.4 24 73.6 24 70.4 0 128-57.6 128-129.6V32h155.2v3.2c0 6.4 0 12.8 1.6 19.2 0 12.8 3.2 27.2 6.4 40zm208 153.6v57.6c-64-12.8-118.4-56-148.8-113.6 40 36.8 91.2 57.6 148.8 56z" fill="#00F7EF"></path>', 5)
  ]), 14, _hoisted_1);
}
var _IconTiktokColor = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _IconTiktokColor;
