import { defineComponent, toRefs, ref, computed, watch, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, createBlock, Fragment, renderSlot, createCommentVNode, createTextVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconLoading from "../icon/icon-loading/index.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import { useSize } from "../_hooks/use-size.js";
import { isUndefined, isNull, isFunction } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Switch",
  components: {
    IconLoading
  },
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: void 0
    },
    defaultChecked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "circle"
    },
    size: {
      type: String
    },
    checkedValue: {
      type: [String, Number, Boolean],
      default: true
    },
    uncheckedValue: {
      type: [String, Number, Boolean],
      default: false
    },
    checkedColor: {
      type: String
    },
    uncheckedColor: {
      type: String
    },
    beforeChange: {
      type: Function
    },
    checkedText: {
      type: String
    },
    uncheckedText: {
      type: String
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value, ev) => true,
    "focus": (ev) => true,
    "blur": (ev) => true
  },
  setup(props, { emit }) {
    const { disabled, size, modelValue } = toRefs(props);
    const prefixCls = getPrefixCls("switch");
    const { mergedSize: configSize } = useSize(size);
    const { mergedDisabled, mergedSize, eventHandlers } = useFormItem({
      disabled,
      size: configSize
    });
    const _checked = ref(
      props.defaultChecked ? props.checkedValue : props.uncheckedValue
    );
    const computedCheck = computed(
      () => {
        var _a;
        return ((_a = props.modelValue) != null ? _a : _checked.value) === props.checkedValue;
      }
    );
    const _loading = ref(false);
    const computedLoading = computed(() => _loading.value || props.loading);
    const handleChange = (checked, ev) => {
      var _a, _b;
      _checked.value = checked ? props.checkedValue : props.uncheckedValue;
      emit("update:modelValue", _checked.value);
      emit("change", _checked.value, ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a, ev);
    };
    const handleClick = async (ev) => {
      if (computedLoading.value || mergedDisabled.value) {
        return;
      }
      const checked = !computedCheck.value;
      const checkedValue = checked ? props.checkedValue : props.uncheckedValue;
      const shouldChange = props.beforeChange;
      if (isFunction(shouldChange)) {
        _loading.value = true;
        try {
          const result = await shouldChange(checkedValue);
          if (result != null ? result : true) {
            handleChange(checked, ev);
          }
        } finally {
          _loading.value = false;
        }
      } else {
        handleChange(checked, ev);
      }
    };
    const handleFocus = (ev) => {
      var _a, _b;
      emit("focus", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onFocus) == null ? void 0 : _b.call(_a, ev);
    };
    const handleBlur = (ev) => {
      var _a, _b;
      emit("blur", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a, ev);
    };
    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
        _checked.value = props.uncheckedValue;
      }
    });
    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-type-${props.type}`,
      {
        [`${prefixCls}-small`]: mergedSize.value === "small" || mergedSize.value === "mini",
        [`${prefixCls}-checked`]: computedCheck.value,
        [`${prefixCls}-disabled`]: mergedDisabled.value,
        [`${prefixCls}-loading`]: computedLoading.value,
        [`${prefixCls}-custom-color`]: props.type === "line" && (props.checkedColor || props.uncheckedColor)
      }
    ]);
    const buttonStyle = computed(() => {
      if (computedCheck.value && props.checkedColor) {
        return props.type === "line" ? { "--custom-color": props.checkedColor } : { backgroundColor: props.checkedColor };
      }
      if (!computedCheck.value && props.uncheckedColor) {
        return props.type === "line" ? { "--custom-color": props.uncheckedColor } : { backgroundColor: props.uncheckedColor };
      }
      return void 0;
    });
    return {
      prefixCls,
      cls,
      mergedDisabled,
      buttonStyle,
      computedCheck,
      computedLoading,
      handleClick,
      handleFocus,
      handleBlur
    };
  }
});
const _hoisted_1 = ["aria-checked", "disabled"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_loading = resolveComponent("icon-loading");
  return openBlock(), createElementBlock("button", {
    type: "button",
    role: "switch",
    "aria-checked": _ctx.computedCheck,
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.buttonStyle),
    disabled: _ctx.mergedDisabled,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args)),
    onFocus: _cache[1] || (_cache[1] = (...args) => _ctx.handleFocus && _ctx.handleFocus(...args)),
    onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.handleBlur && _ctx.handleBlur(...args))
  }, [
    createElementVNode("span", {
      class: normalizeClass(`${_ctx.prefixCls}-handle`)
    }, [
      createElementVNode("span", {
        class: normalizeClass(`${_ctx.prefixCls}-handle-icon`)
      }, [
        _ctx.computedLoading ? (openBlock(), createBlock(_component_icon_loading, { key: 0 })) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          _ctx.computedCheck ? renderSlot(_ctx.$slots, "checked-icon", { key: 0 }) : renderSlot(_ctx.$slots, "unchecked-icon", { key: 1 })
        ], 64))
      ], 2)
    ], 2),
    createCommentVNode("  prettier-ignore  "),
    _ctx.type !== "line" && _ctx.size !== "small" && (_ctx.$slots.checked || _ctx.checkedText || _ctx.$slots.unchecked || _ctx.uncheckedText) ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
      createElementVNode("span", {
        class: normalizeClass(`${_ctx.prefixCls}-text-holder`)
      }, [
        _ctx.computedCheck ? renderSlot(_ctx.$slots, "checked", { key: 0 }, () => [
          createTextVNode(toDisplayString(_ctx.checkedText), 1)
        ]) : renderSlot(_ctx.$slots, "unchecked", { key: 1 }, () => [
          createTextVNode(toDisplayString(_ctx.uncheckedText), 1)
        ])
      ], 2),
      createElementVNode("span", {
        class: normalizeClass(`${_ctx.prefixCls}-text`)
      }, [
        _ctx.computedCheck ? renderSlot(_ctx.$slots, "checked", { key: 0 }, () => [
          createTextVNode(toDisplayString(_ctx.checkedText), 1)
        ]) : renderSlot(_ctx.$slots, "unchecked", { key: 1 }, () => [
          createTextVNode(toDisplayString(_ctx.uncheckedText), 1)
        ])
      ], 2)
    ], 64)) : createCommentVNode("v-if", true)
  ], 46, _hoisted_1);
}
var _Switch = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Switch as default };
