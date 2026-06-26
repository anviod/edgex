"use strict";
var vue = require("vue");
var index$1 = require("../locale/index.js");
var globalConfig = require("../_utils/global-config.js");
var index = require("../input-number/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "PageJumper",
  components: {
    InputNumber: index
  },
  props: {
    current: {
      type: Number,
      required: true
    },
    simple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pages: {
      type: Number,
      required: true
    },
    size: {
      type: String
    },
    onChange: {
      type: Function
    }
  },
  emits: ["change"],
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("pagination-jumper");
    const { t } = index$1.useI18n();
    const inputValue = vue.ref(props.simple ? props.current : void 0);
    const handleFormatter = (value) => {
      const parseIntVal = parseInt(value.toString(), 10);
      return Number.isNaN(parseIntVal) ? void 0 : String(parseIntVal);
    };
    const handleChange = (value) => {
      emit("change", inputValue.value);
      vue.nextTick(() => {
        if (!props.simple) {
          inputValue.value = void 0;
        }
      });
    };
    vue.watch(
      () => props.current,
      (value) => {
        if (props.simple && value !== inputValue.value) {
          inputValue.value = value;
        }
      }
    );
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-simple`]: props.simple
      }
    ]);
    return {
      prefixCls,
      cls,
      t,
      inputValue,
      handleChange,
      handleFormatter
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_input_number = vue.resolveComponent("input-number");
  return vue.openBlock(), vue.createElementBlock("span", {
    class: vue.normalizeClass(_ctx.cls)
  }, [
    !_ctx.simple ? (vue.openBlock(), vue.createElementBlock("span", {
      key: 0,
      class: vue.normalizeClass([`${_ctx.prefixCls}-prepend`, `${_ctx.prefixCls}-text-goto`])
    }, [
      vue.renderSlot(_ctx.$slots, "jumper-prepend", {}, () => [
        vue.createTextVNode(vue.toDisplayString(_ctx.t("pagination.goto")), 1)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createVNode(_component_input_number, {
      modelValue: _ctx.inputValue,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.inputValue = $event),
      class: vue.normalizeClass(`${_ctx.prefixCls}-input`),
      min: 1,
      max: _ctx.pages,
      size: _ctx.size,
      disabled: _ctx.disabled,
      "hide-button": "",
      formatter: _ctx.handleFormatter,
      onChange: _ctx.handleChange
    }, null, 8, ["modelValue", "class", "max", "size", "disabled", "formatter", "onChange"]),
    _ctx.$slots["jumper-append"] ? (vue.openBlock(), vue.createElementBlock("span", {
      key: 1,
      class: vue.normalizeClass(`${_ctx.prefixCls}-append`)
    }, [
      vue.renderSlot(_ctx.$slots, "jumper-append")
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.simple ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
      vue.createElementVNode("span", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-separator`)
      }, "/", 2),
      vue.createElementVNode("span", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-total-page`)
      }, vue.toDisplayString(_ctx.pages), 3)
    ], 64)) : vue.createCommentVNode("v-if", true)
  ], 2);
}
var PageJumper = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = PageJumper;
