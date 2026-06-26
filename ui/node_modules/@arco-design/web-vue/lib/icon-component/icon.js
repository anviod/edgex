"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Icon",
  props: {
    type: String,
    size: [Number, String],
    rotate: Number,
    spin: Boolean
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("icon");
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
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-loading`]: props.spin
      },
      props.type
    ]);
    return {
      cls,
      innerStyle
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("svg", {
    class: vue.normalizeClass(_ctx.cls),
    style: vue.normalizeStyle(_ctx.innerStyle),
    fill: "currentColor"
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 6);
}
var _Icon = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Icon;
