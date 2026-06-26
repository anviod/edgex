import { defineComponent, toRefs, ref, inject, computed, watch, createVNode, nextTick } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import IconCheck from "./icon-check.js";
import { isArray, isUndefined, isNull } from "../_utils/is.js";
import { checkboxGroupKey } from "./context.js";
import { useFormItem } from "../_hooks/use-form-item.js";
var _Checkbox = defineComponent({
  name: "Checkbox",
  components: {
    IconCheck,
    IconHover
  },
  props: {
    modelValue: {
      type: [Boolean, Array],
      default: void 0
    },
    defaultChecked: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Boolean]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    uninjectGroupContext: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value, ev) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      disabled,
      modelValue
    } = toRefs(props);
    const prefixCls = getPrefixCls("checkbox");
    const checkboxRef = ref();
    const checkboxGroupCtx = !props.uninjectGroupContext ? inject(checkboxGroupKey, void 0) : void 0;
    const isGroup = (checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.name) === "ArcoCheckboxGroup";
    const {
      mergedDisabled: _mergedDisabled,
      eventHandlers
    } = useFormItem({
      disabled
    });
    const _checked = ref(props.defaultChecked);
    const computedValue = computed(() => {
      var _a;
      return isGroup ? checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.computedValue : (_a = props.modelValue) != null ? _a : _checked.value;
    });
    const computedChecked = computed(() => {
      var _a;
      return isArray(computedValue.value) ? computedValue.value.includes((_a = props.value) != null ? _a : true) : computedValue.value;
    });
    const mergedDisabled = computed(() => (checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.disabled) || (_mergedDisabled == null ? void 0 : _mergedDisabled.value) || !computedChecked.value && (checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.isMaxed));
    const handleClick = (ev) => {
      ev.stopPropagation();
    };
    const handleChange = (e) => {
      var _a, _b, _c, _d;
      const {
        checked
      } = e.target;
      let newValue = checked;
      if (isArray(computedValue.value)) {
        const set = new Set(computedValue.value);
        if (checked) {
          set.add((_a = props.value) != null ? _a : true);
        } else {
          set.delete((_b = props.value) != null ? _b : true);
        }
        newValue = Array.from(set);
      }
      _checked.value = checked;
      if (isGroup && isArray(newValue)) {
        checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.handleChange(newValue, e);
      } else {
        emit("update:modelValue", newValue);
        emit("change", newValue, e);
        (_d = (_c = eventHandlers.value) == null ? void 0 : _c.onChange) == null ? void 0 : _d.call(_c, e);
      }
      nextTick(() => {
        if (checkboxRef.value && checkboxRef.value.checked !== computedChecked.value) {
          checkboxRef.value.checked = computedChecked.value;
        }
      });
    };
    const cls = computed(() => [prefixCls, {
      [`${prefixCls}-checked`]: computedChecked.value,
      [`${prefixCls}-indeterminate`]: props.indeterminate,
      [`${prefixCls}-disabled`]: mergedDisabled.value
    }]);
    const handleFocus = (ev) => {
      var _a, _b;
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onFocus) == null ? void 0 : _b.call(_a, ev);
    };
    const handleBlur = (ev) => {
      var _a, _b;
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a, ev);
    };
    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
        _checked.value = false;
      }
    });
    watch(computedValue, (value) => {
      var _a;
      let checked;
      if (isArray(value)) {
        checked = value.includes((_a = props.value) != null ? _a : true);
      } else {
        checked = value;
      }
      if (_checked.value !== checked) {
        _checked.value = checked;
      }
      if (checkboxRef.value && checkboxRef.value.checked !== checked) {
        checkboxRef.value.checked = checked;
      }
    });
    return () => {
      var _a, _b, _c, _d;
      return createVNode("label", {
        "aria-disabled": mergedDisabled.value,
        "class": cls.value
      }, [createVNode("input", {
        "ref": checkboxRef,
        "type": "checkbox",
        "checked": computedChecked.value,
        "value": props.value,
        "class": `${prefixCls}-target`,
        "disabled": mergedDisabled.value,
        "onClick": handleClick,
        "onChange": handleChange,
        "onFocus": handleFocus,
        "onBlur": handleBlur
      }, null), (_d = (_c = (_b = slots.checkbox) != null ? _b : (_a = checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.slots) == null ? void 0 : _a.checkbox) == null ? void 0 : _c({
        checked: computedChecked.value,
        disabled: mergedDisabled.value
      })) != null ? _d : createVNode(IconHover, {
        "class": `${prefixCls}-icon-hover`,
        "disabled": mergedDisabled.value || computedChecked.value
      }, {
        default: () => [createVNode("div", {
          "class": `${prefixCls}-icon`
        }, [computedChecked.value && createVNode(IconCheck, {
          "class": `${prefixCls}-icon-check`
        }, null)])]
      }), slots.default && createVNode("span", {
        "class": `${prefixCls}-label`
      }, [slots.default()])]);
    };
  }
});
export { _Checkbox as default };
