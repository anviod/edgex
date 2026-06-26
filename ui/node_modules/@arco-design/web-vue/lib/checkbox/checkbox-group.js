"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var useFormItem = require("../_hooks/use-form-item.js");
var checkbox = require("./checkbox.js");
var is = require("../_utils/is.js");
var CheckboxGroup = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("checkbox-group");
    const {
      mergedDisabled,
      eventHandlers
    } = useFormItem.useFormItem({
      disabled
    });
    const _value = vue.ref(props.defaultValue);
    const computedValue = vue.computed(() => is.isArray(props.modelValue) ? props.modelValue : _value.value);
    const isMaxed = vue.computed(() => props.max === void 0 ? false : computedValue.value.length >= props.max);
    const options = vue.computed(() => {
      var _a;
      return ((_a = props.options) != null ? _a : []).map((option) => {
        if (is.isString(option) || is.isNumber(option)) {
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
    vue.provide(context.checkboxGroupKey, vue.reactive({
      name: "ArcoCheckboxGroup",
      computedValue,
      disabled: mergedDisabled,
      isMaxed,
      slots,
      handleChange
    }));
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-direction-${props.direction}`]);
    vue.watch(() => props.modelValue, (curValue) => {
      if (is.isArray(curValue)) {
        _value.value = [...curValue];
      } else {
        _value.value = [];
      }
    });
    const renderOptions = () => {
      return options.value.map((option) => {
        const checked = computedValue.value.includes(option.value);
        return vue.createVNode(checkbox, {
          "key": option.value,
          "value": option.value,
          "disabled": option.disabled || !checked && isMaxed.value,
          "indeterminate": option.indeterminate,
          "modelValue": checked
        }, {
          default: () => [slots.label ? slots.label({
            data: option
          }) : is.isFunction(option.label) ? option.label() : option.label]
        });
      });
    };
    return () => {
      var _a;
      return vue.createVNode("span", {
        "class": cls.value
      }, [options.value.length > 0 ? renderOptions() : (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
module.exports = CheckboxGroup;
