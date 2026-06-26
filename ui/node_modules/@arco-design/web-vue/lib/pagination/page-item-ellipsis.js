"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-more/index.js");
var utils = require("./utils.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "EllipsisPager",
  components: {
    IconMore: index
  },
  props: {
    current: {
      type: Number,
      required: true
    },
    step: {
      type: Number,
      default: 5
    },
    pages: {
      type: Number,
      required: true
    }
  },
  emits: ["click"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("pagination-item");
    const nextPage = vue.computed(
      () => utils.getLegalPage(props.current + props.step, {
        min: 1,
        max: props.pages
      })
    );
    const handleClick = (e) => {
      emit("click", nextPage.value);
    };
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-ellipsis`]);
    return {
      prefixCls,
      cls,
      handleClick
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_more = vue.resolveComponent("icon-more");
  return vue.openBlock(), vue.createElementBlock("li", {
    class: vue.normalizeClass(_ctx.cls),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    vue.renderSlot(_ctx.$slots, "default", {}, () => [
      vue.createVNode(_component_icon_more)
    ])
  ], 2);
}
var EllipsisPager = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = EllipsisPager;
