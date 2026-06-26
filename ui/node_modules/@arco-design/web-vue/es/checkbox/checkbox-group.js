import { defineComponent, toRefs, ref, computed, provide, reactive, watch, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { checkboxGroupKey } from "./context.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import _Checkbox from "./checkbox.js";
import { isArray, isString, isNumber, isFunction } from "../_utils/is.js";
var CheckboxGroup = defineComponent({
  name: "CheckboxGroup",
  props: {
    modelValue: {
      type: Array,
      default: void 0
    },
    defaultValue: {
      type: Array,
      default: () => []
    },
    max: {
      type: Number
    },
    options: {
      type: Array
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    disabled: {
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
      disabled
    } = toRefs(props);
    const prefixCls = getPrefixCls("checkbox-group");
    const {
      mergedDisabled,
      eventHandlers
    } = useFormItem({
      disabled
    });
    const _value = ref(props.defaultValue);
    const computedValue = computed(() => isArray(props.modelValue) ? props.modelValue : _value.value);
    const isMaxed = computed(() => props.max === void 0 ? false : computedValue.value.length >= props.max);
    const options = computed(() => {
      var _a;
      return ((_a = props.options) != null ? _a : []).map((option) => {
        if (isString(option) || isNumber(option)) {
          return {
            label: option,
            value: option
          };
        }
        return option;
      });
    });
    const handleChange = (value, e) => {
      var _a, _b;
      _value.value = value;
      emit("update:modelValue", value);
      emit("change", value, e);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a, e);
    };
    provide(checkboxGroupKey, reactive({
      name: "ArcoCheckboxGroup",
      computedValue,
      disabled: mergedDisabled,
      isMaxed,
      slots,
      handleChange
    }));
    const cls = computed(() => [prefixCls, `${prefixCls}-direction-${props.direction}`]);
    watch(() => props.modelValue, (curValue) => {
      if (isArray(curValue)) {
        _value.value = [...curValue];
      } else {
        _value.value = [];
      }
    });
    const renderOptions = () => {
      return options.value.map((option) => {
        const checked = computedValue.value.includes(option.value);
        return createVNode(_Checkbox, {
          "key": option.value,
          "value": option.value,
          "disabled": option.disabled || !checked && isMaxed.value,
          "indeterminate": option.indeterminate,
          "modelValue": checked
        }, {
          default: () => [slots.label ? slots.label({
            data: option
          }) : isFunction(option.label) ? option.label() : option.label]
        });
      });
    };
    return () => {
      var _a;
      return createVNode("span", {
        "class": cls.value
      }, [options.value.length > 0 ? renderOptions() : (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
export { CheckboxGroup as default };
