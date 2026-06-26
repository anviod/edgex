"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "IconWeibo",
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
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-weibo`, { [`${prefixCls}-spin`]: props.spin }]);
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
      d: "M31.82 5.6c-1.445.635-1.776 2.144-.727 3.192.515.516.993.608 3.11.608 2.952 0 4.94.781 6.448 2.53 1.84 2.079 2.052 2.714 2.052 6.513 0 3.377 0 3.441.782 3.892 1.812 1.021 3.017-.24 3.44-3.616.544-4.397-2.078-9.531-6.025-11.877-2.595-1.509-7.029-2.116-9.08-1.242Zm-14.831 5.612c-3.376 1.205-6.633 3.524-10.13 7.268-8.288 8.804-7.746 17.186 1.39 21.648 9.494 4.636 22.282 3.1 29.247-3.533 5.216-4.94 4.581-11.16-1.353-13.267-1.058-.358-1.389-.634-1.232-.966.542-1.324.726-2.86.423-3.772-.939-2.86-4.343-3.523-9.403-1.812l-2.024.69.184-2.024c.212-2.383-.303-3.68-1.72-4.398-1.187-.588-3.45-.524-5.382.166Zm8.381 11.666c4.49 1.232 7.231 3.946 7.231 7.176 0 3.588-3.192 6.817-8.38 8.528-2.77.902-7.931 1.086-10.461.396-4.793-1.353-7.507-4.012-7.507-7.416 0-1.867.81-3.496 2.594-5.152 1.656-1.564 2.926-2.318 5.364-3.137 3.689-1.242 7.636-1.389 11.16-.395Zm-9.494 2.925c-3.045 1.417-4.674 3.588-4.674 6.302 0 2.475 1.086 4.159 3.469 5.428 1.84.994 5.216.902 7.268-.147 2.622-1.39 4.342-3.947 4.342-6.45-.028-2.05-1.84-4.489-3.984-5.363-1.72-.736-4.609-.616-6.421.23Zm2.199 5.667c.211.212.358.727.358 1.178 0 1.509-2.53 2.742-3.56 1.72-.57-.57-.423-1.987.24-2.65.662-.662 2.391-.818 2.962-.248Zm14.26-19.688c-1.39 1.39-.451 3.046 1.748 3.046 1.895 0 2.741.966 2.741 3.137 0 1.352.12 1.748.663 2.107 1.628 1.15 2.953-.12 2.953-2.806 0-3.285-2.355-5.76-5.695-5.999-1.509-.12-1.868-.027-2.41.515Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1);
}
var _IconWeibo = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _IconWeibo;
