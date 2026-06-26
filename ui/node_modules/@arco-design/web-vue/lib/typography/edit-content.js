"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../input/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "TypographyEditContent",
  components: {
    Input: index["default"]
  },
  props: {
    text: {
      type: String,
      required: true
    }
  },
  emits: ["change", "end", "update:text"],
  setup(_, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("typography");
    const classNames = [`${prefixCls}-edit-content`];
    const inputRef = vue.ref();
    function onChange(value) {
      emit("update:text", value);
      emit("change", value);
    }
    function onEnd() {
      emit("end");
    }
    vue.onMounted(() => {
      if (!inputRef.value || !inputRef.value.$el)
        return;
      const inputEl = inputRef.value.$el.querySelector("input");
      if (!inputEl)
        return;
      inputEl.focus && inputEl.focus();
      const { length } = inputEl.value;
      inputEl.setSelectionRange(length, length);
    });
    return {
      classNames,
      inputRef,
      onBlur: onEnd,
      onChange,
      onEnd
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Input = vue.resolveComponent("Input");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames)
  }, [
    vue.createVNode(_component_Input, {
      ref: "inputRef",
      "auto-size": "",
      "model-value": _ctx.text,
      onBlur: _ctx.onBlur,
      onInput: _ctx.onChange,
      onKeydown: vue.withKeys(_ctx.onEnd, ["enter"])
    }, null, 8, ["model-value", "onBlur", "onInput", "onKeydown"])
  ], 2);
}
var EditContent = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = EditContent;
