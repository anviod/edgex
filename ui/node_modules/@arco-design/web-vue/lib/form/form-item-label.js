"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var resizeObserverV2 = require("../_components/resize-observer-v2.js");
var context = require("./context.js");
var is = require("../_utils/is.js");
var index = require("../tooltip/index.js");
var index$1 = require("../icon/icon-question-circle/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "FormItemLabel",
  components: {
    ResizeObserver: resizeObserverV2,
    Tooltip: index,
    IconQuestionCircle: index$1
  },
  props: {
    required: {
      type: Boolean,
      default: false
    },
    showColon: {
      type: Boolean,
      default: false
    },
    component: {
      type: String,
      default: "label"
    },
    asteriskPosition: {
      type: String,
      default: "start"
    },
    tooltip: {
      type: String
    },
    attrs: Object
  },
  setup() {
    const prefixCls = globalConfig.getPrefixCls("form-item-label");
    const formCtx = vue.inject(context.formInjectionKey, void 0);
    const instance = vue.getCurrentInstance();
    const labelRef = vue.ref();
    const handleResize = () => {
      if (labelRef.value && is.isNumber(labelRef.value.offsetWidth)) {
        formCtx == null ? void 0 : formCtx.setLabelWidth(labelRef.value.offsetWidth, instance == null ? void 0 : instance.uid);
      }
    };
    vue.onMounted(() => {
      if (labelRef.value && is.isNumber(labelRef.value.offsetWidth)) {
        formCtx == null ? void 0 : formCtx.setLabelWidth(labelRef.value.offsetWidth, instance == null ? void 0 : instance.uid);
      }
    });
    vue.onBeforeUnmount(() => {
      formCtx == null ? void 0 : formCtx.removeLabelWidth(instance == null ? void 0 : instance.uid);
    });
    return {
      prefixCls,
      labelRef,
      handleResize
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_question_circle = vue.resolveComponent("icon-question-circle");
  const _component_Tooltip = vue.resolveComponent("Tooltip");
  const _component_ResizeObserver = vue.resolveComponent("ResizeObserver");
  return vue.openBlock(), vue.createBlock(_component_ResizeObserver, { onResize: _ctx.handleResize }, {
    default: vue.withCtx(() => [
      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.component), vue.mergeProps({
        ref: "labelRef",
        class: _ctx.prefixCls
      }, _ctx.attrs), {
        default: vue.withCtx(() => [
          _ctx.required && _ctx.asteriskPosition === "start" ? (vue.openBlock(), vue.createElementBlock("strong", {
            key: 0,
            class: vue.normalizeClass(`${_ctx.prefixCls}-required-symbol`)
          }, _cache[0] || (_cache[0] = [
            vue.createElementVNode("svg", {
              fill: "currentColor",
              viewBox: "0 0 1024 1024",
              width: "1em",
              height: "1em"
            }, [
              vue.createElementVNode("path", { d: "M583.338667 17.066667c18.773333 0 34.133333 15.36 34.133333 34.133333v349.013333l313.344-101.888a34.133333 34.133333 0 0 1 43.008 22.016l42.154667 129.706667a34.133333 34.133333 0 0 1-21.845334 43.178667l-315.733333 102.4 208.896 287.744a34.133333 34.133333 0 0 1-7.509333 47.786666l-110.421334 80.213334a34.133333 34.133333 0 0 1-47.786666-7.509334L505.685333 706.218667 288.426667 1005.226667a34.133333 34.133333 0 0 1-47.786667 7.509333l-110.421333-80.213333a34.133333 34.133333 0 0 1-7.509334-47.786667l214.186667-295.253333L29.013333 489.813333a34.133333 34.133333 0 0 1-22.016-43.008l42.154667-129.877333a34.133333 34.133333 0 0 1 43.008-22.016l320.512 104.106667L412.672 51.2c0-18.773333 15.36-34.133333 34.133333-34.133333h136.533334z" })
            ], -1)
          ]), 2)) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "default"),
          _ctx.tooltip ? (vue.openBlock(), vue.createBlock(_component_Tooltip, {
            key: 1,
            content: _ctx.tooltip
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_icon_question_circle, {
                class: vue.normalizeClass(`${_ctx.prefixCls}-tooltip`)
              }, null, 8, ["class"])
            ]),
            _: 1
          }, 8, ["content"])) : vue.createCommentVNode("v-if", true),
          _ctx.required && _ctx.asteriskPosition === "end" ? (vue.openBlock(), vue.createElementBlock("strong", {
            key: 2,
            class: vue.normalizeClass(`${_ctx.prefixCls}-required-symbol`)
          }, _cache[1] || (_cache[1] = [
            vue.createElementVNode("svg", {
              fill: "currentColor",
              viewBox: "0 0 1024 1024",
              width: "1em",
              height: "1em"
            }, [
              vue.createElementVNode("path", { d: "M583.338667 17.066667c18.773333 0 34.133333 15.36 34.133333 34.133333v349.013333l313.344-101.888a34.133333 34.133333 0 0 1 43.008 22.016l42.154667 129.706667a34.133333 34.133333 0 0 1-21.845334 43.178667l-315.733333 102.4 208.896 287.744a34.133333 34.133333 0 0 1-7.509333 47.786666l-110.421334 80.213334a34.133333 34.133333 0 0 1-47.786666-7.509334L505.685333 706.218667 288.426667 1005.226667a34.133333 34.133333 0 0 1-47.786667 7.509333l-110.421333-80.213333a34.133333 34.133333 0 0 1-7.509334-47.786667l214.186667-295.253333L29.013333 489.813333a34.133333 34.133333 0 0 1-22.016-43.008l42.154667-129.877333a34.133333 34.133333 0 0 1 43.008-22.016l320.512 104.106667L412.672 51.2c0-18.773333 15.36-34.133333 34.133333-34.133333h136.533334z" })
            ], -1)
          ]), 2)) : vue.createCommentVNode("v-if", true),
          vue.createTextVNode(" " + vue.toDisplayString(_ctx.showColon ? ":" : ""), 1)
        ]),
        _: 3
      }, 16, ["class"]))
    ]),
    _: 3
  }, 8, ["onResize"]);
}
var FormItemLabel = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = FormItemLabel;
