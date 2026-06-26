"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-left/index.js");
var index$1 = require("../icon/icon-right/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "ImagePreviewArrow",
  components: {
    IconLeft: index,
    IconRight: index$1
  },
  props: {
    onPrev: {
      type: Function
    },
    onNext: {
      type: Function
    }
  },
  setup() {
    const prefixCls = globalConfig.getPrefixCls("image-preview-arrow");
    return {
      prefixCls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_left = vue.resolveComponent("icon-left");
  const _component_icon_right = vue.resolveComponent("icon-right");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    vue.createElementVNode("div", {
      class: vue.normalizeClass([
        `${_ctx.prefixCls}-left`,
        {
          [`${_ctx.prefixCls}-disabled`]: !_ctx.onPrev
        }
      ]),
      onClick: _cache[0] || (_cache[0] = (e) => {
        e.preventDefault();
        _ctx.onPrev && _ctx.onPrev();
      })
    }, [
      vue.createVNode(_component_icon_left)
    ], 2),
    vue.createElementVNode("div", {
      class: vue.normalizeClass([
        `${_ctx.prefixCls}-right`,
        {
          [`${_ctx.prefixCls}-disabled`]: !_ctx.onNext
        }
      ]),
      onClick: _cache[1] || (_cache[1] = (e) => {
        e.preventDefault();
        _ctx.onNext && _ctx.onNext();
      })
    }, [
      vue.createVNode(_component_icon_right)
    ], 2)
  ], 2);
}
var PreviewArrow = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = PreviewArrow;
