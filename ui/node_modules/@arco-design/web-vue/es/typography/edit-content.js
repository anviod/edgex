import { defineComponent, ref, onMounted, resolveComponent, openBlock, createElementBlock, normalizeClass, createVNode, withKeys } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Input from "../input/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "TypographyEditContent",
  components: {
    Input
  },
  props: {
    text: {
      type: String,
      required: true
    }
  },
  emits: ["change", "end", "update:text"],
  setup(_, { emit }) {
    const prefixCls = getPrefixCls("typography");
    const classNames = [`${prefixCls}-edit-content`];
    const inputRef = ref();
    function onChange(value) {
      emit("update:text", value);
      emit("change", value);
    }
    function onEnd() {
      emit("end");
    }
    onMounted(() => {
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
  const _component_Input = resolveComponent("Input");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames)
  }, [
    createVNode(_component_Input, {
      ref: "inputRef",
      "auto-size": "",
      "model-value": _ctx.text,
      onBlur: _ctx.onBlur,
      onInput: _ctx.onChange,
      onKeydown: withKeys(_ctx.onEnd, ["enter"])
    }, null, 8, ["model-value", "onBlur", "onInput", "onKeydown"])
  ], 2);
}
var EditContent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { EditContent as default };
