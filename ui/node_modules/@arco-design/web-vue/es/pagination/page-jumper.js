import { defineComponent, ref, watch, computed, nextTick, resolveComponent, openBlock, createElementBlock, normalizeClass, renderSlot, createTextVNode, toDisplayString, createCommentVNode, createVNode, Fragment, createElementVNode } from "vue";
import { useI18n } from "../locale/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import InputNumber from "../input-number/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "PageJumper",
  components: {
    InputNumber
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
    const prefixCls = getPrefixCls("pagination-jumper");
    const { t } = useI18n();
    const inputValue = ref(props.simple ? props.current : void 0);
    const handleFormatter = (value) => {
      const parseIntVal = parseInt(value.toString(), 10);
      return Number.isNaN(parseIntVal) ? void 0 : String(parseIntVal);
    };
    const handleChange = (value) => {
      emit("change", inputValue.value);
      nextTick(() => {
        if (!props.simple) {
          inputValue.value = void 0;
        }
      });
    };
    watch(
      () => props.current,
      (value) => {
        if (props.simple && value !== inputValue.value) {
          inputValue.value = value;
        }
      }
    );
    const cls = computed(() => [
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
  const _component_input_number = resolveComponent("input-number");
  return openBlock(), createElementBlock("span", {
    class: normalizeClass(_ctx.cls)
  }, [
    !_ctx.simple ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass([`${_ctx.prefixCls}-prepend`, `${_ctx.prefixCls}-text-goto`])
    }, [
      renderSlot(_ctx.$slots, "jumper-prepend", {}, () => [
        createTextVNode(toDisplayString(_ctx.t("pagination.goto")), 1)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    createVNode(_component_input_number, {
      modelValue: _ctx.inputValue,
      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.inputValue = $event),
      class: normalizeClass(`${_ctx.prefixCls}-input`),
      min: 1,
      max: _ctx.pages,
      size: _ctx.size,
      disabled: _ctx.disabled,
      "hide-button": "",
      formatter: _ctx.handleFormatter,
      onChange: _ctx.handleChange
    }, null, 8, ["modelValue", "class", "max", "size", "disabled", "formatter", "onChange"]),
    _ctx.$slots["jumper-append"] ? (openBlock(), createElementBlock("span", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-append`)
    }, [
      renderSlot(_ctx.$slots, "jumper-append")
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.simple ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
      createElementVNode("span", {
        class: normalizeClass(`${_ctx.prefixCls}-separator`)
      }, "/", 2),
      createElementVNode("span", {
        class: normalizeClass(`${_ctx.prefixCls}-total-page`)
      }, toDisplayString(_ctx.pages), 3)
    ], 64)) : createCommentVNode("v-if", true)
  ], 2);
}
var PageJumper = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { PageJumper as default };
