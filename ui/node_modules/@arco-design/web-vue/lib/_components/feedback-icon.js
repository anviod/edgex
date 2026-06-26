"use strict";
var vue = require("vue");
var index = require("../icon/icon-loading/index.js");
var index$1 = require("../icon/icon-check-circle-fill/index.js");
var index$2 = require("../icon/icon-exclamation-circle-fill/index.js");
var index$3 = require("../icon/icon-close-circle-fill/index.js");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "FeedbackIcon",
  components: {
    IconLoading: index,
    IconCheckCircleFill: index$1,
    IconExclamationCircleFill: index$2,
    IconCloseCircleFill: index$3
  },
  props: {
    type: {
      type: String
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("feedback-icon");
    const cls = vue.computed(() => [
      prefixCls,
      `${prefixCls}-status-${props.type}`
    ]);
    return {
      cls
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_loading = vue.resolveComponent("icon-loading");
  const _component_icon_check_circle_fill = vue.resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = vue.resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = vue.resolveComponent("icon-close-circle-fill");
  return vue.openBlock(), vue.createElementBlock("span", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    _ctx.type === "validating" ? (vue.openBlock(), vue.createBlock(_component_icon_loading, { key: 0 })) : _ctx.type === "success" ? (vue.openBlock(), vue.createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (vue.openBlock(), vue.createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (vue.openBlock(), vue.createBlock(_component_icon_close_circle_fill, { key: 3 })) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var FeedbackIcon = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = FeedbackIcon;
