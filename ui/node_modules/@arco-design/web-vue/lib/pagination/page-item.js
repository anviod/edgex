"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Pager",
  props: {
    pageNumber: {
      type: Number
    },
    current: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    },
    style: {
      type: Object
    },
    activeStyle: {
      type: Object
    }
  },
  emits: ["click"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("pagination-item");
    const isActive = vue.computed(() => props.current === props.pageNumber);
    const handleClick = (e) => {
      if (!props.disabled) {
        emit("click", props.pageNumber, e);
      }
    };
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-active`]: isActive.value
      }
    ]);
    const mergedStyle = vue.computed(() => {
      return isActive.value ? props.activeStyle : props.style;
    });
    return {
      prefixCls,
      cls,
      mergedStyle,
      handleClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("li", {
    class: vue.normalizeClass(_ctx.cls),
    style: vue.normalizeStyle(_ctx.mergedStyle),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    vue.renderSlot(_ctx.$slots, "default", { page: _ctx.pageNumber }, () => [
      vue.createTextVNode(vue.toDisplayString(_ctx.pageNumber), 1)
    ])
  ], 6);
}
var Pager = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Pager;
