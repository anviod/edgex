import { defineComponent, toRefs, ref, computed, provide, reactive, watch, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { radioGroupKey } from "./context.js";
import { isString, isNumber, isUndefined, isNull, isFunction } from "../_utils/is.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import _Radio from "./radio.js";
import { useSize } from "../_hooks/use-size.js";
var RadioGroup = defineComponent({
  name: "RadioGroup",
  props: {
    modelValue: {
      type: [String, Number, Boolean],
      default: void 0
    },
    defaultValue: {
      type: [String, Number, Boolean],
      default: ""
    },
    type: {
      type: String,
      default: "radio"
    },
    size: {
      type: String
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
    const prefixCls = getPrefixCls("radio-group");
    const {
      size,
      type,
      disabled,
      modelValue
    } = toRefs(props);
    const {
      mergedDisabled,
      mergedSize: _mergedSize,
      eventHandlers
    } = useFormItem({
      size,
      disabled
    });
    const {
      mergedSize
    } = useSize(_mergedSize);
    const _value = ref(props.defaultValue);
    const computedValue = computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
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
    provide(radioGroupKey, reactive({
      name: "ArcoRadioGroup",
      value: computedValue,
      size: mergedSize,
      type,
      disabled: mergedDisabled,
      slots,
      handleChange
    }));
    watch(computedValue, (cur) => {
      if (_value.value !== cur) {
        _value.value = cur;
      }
    });
    watch(modelValue, (val) => {
      if (isUndefined(val) || isNull(val)) {
        _value.value = "";
      }
    });
    const cls = computed(() => [`${prefixCls}${props.type === "button" ? "-button" : ""}`, `${prefixCls}-size-${mergedSize.value}`, `${prefixCls}-direction-${props.direction}`, {
      [`${prefixCls}-disabled`]: mergedDisabled.value
    }]);
    const renderOptions = () => {
      return options.value.map((option) => createVNode(_Radio, {
        "key": option.value,
        "value": option.value,
        "disabled": option.disabled,
        "modelValue": computedValue.value === option.value
      }, {
        default: () => [slots.label ? slots.label({
          data: option
        }) : isFunction(option.label) ? option.label() : option.label]
      }));
    };
    return () => {
      var _a;
      return createVNode("span", {
        "class": cls.value
      }, [options.value.length > 0 ? renderOptions() : (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
export { RadioGroup as default };
