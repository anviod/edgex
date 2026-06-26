"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var is = require("../_utils/is.js");
var useFormItem = require("../_hooks/use-form-item.js");
var radio = require("./radio.js");
var useSize = require("../_hooks/use-size.js");
var RadioGroup = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("radio-group");
    const {
      size,
      type,
      disabled,
      modelValue
    } = vue.toRefs(props);
    const {
      mergedDisabled,
      mergedSize: _mergedSize,
      eventHandlers
    } = useFormItem.useFormItem({
      size,
      disabled
    });
    const {
      mergedSize
    } = useSize.useSize(_mergedSize);
    const _value = vue.ref(props.defaultValue);
    const computedValue = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
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
    vue.provide(context.radioGroupKey, vue.reactive({
      name: "ArcoRadioGroup",
      value: computedValue,
      size: mergedSize,
      type,
      disabled: mergedDisabled,
      slots,
      handleChange
    }));
    vue.watch(computedValue, (cur) => {
      if (_value.value !== cur) {
        _value.value = cur;
      }
    });
    vue.watch(modelValue, (val) => {
      if (is.isUndefined(val) || is.isNull(val)) {
        _value.value = "";
      }
    });
    const cls = vue.computed(() => [`${prefixCls}${props.type === "button" ? "-button" : ""}`, `${prefixCls}-size-${mergedSize.value}`, `${prefixCls}-direction-${props.direction}`, {
      [`${prefixCls}-disabled`]: mergedDisabled.value
    }]);
    const renderOptions = () => {
      return options.value.map((option) => vue.createVNode(radio, {
        "key": option.value,
        "value": option.value,
        "disabled": option.disabled,
        "modelValue": computedValue.value === option.value
      }, {
        default: () => [slots.label ? slots.label({
          data: option
        }) : is.isFunction(option.label) ? option.label() : option.label]
      }));
    };
    return () => {
      var _a;
      return vue.createVNode("span", {
        "class": cls.value
      }, [options.value.length > 0 ? renderOptions() : (_a = slots.default) == null ? void 0 : _a.call(slots)]);
    };
  }
});
module.exports = RadioGroup;
