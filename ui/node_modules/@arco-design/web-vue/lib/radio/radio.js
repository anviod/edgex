"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var iconHover = require("../_components/icon-hover.js");
var context = require("./context.js");
var is = require("../_utils/is.js");
var useFormItem = require("../_hooks/use-form-item.js");
var _Radio = vue.defineComponent({
  name: "Radio",
  components: {
    IconHover: iconHover
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
    value: {
      type: [String, Number, Boolean],
      default: true
    },
    type: {
      type: String,
      default: "radio"
    },
    disabled: {
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
    const prefixCls = globalConfig.getPrefixCls("radio");
    const {
      modelValue
    } = vue.toRefs(props);
    const radioGroupCtx = !props.uninjectGroupContext ? vue.inject(context.radioGroupKey, void 0) : void 0;
    const {
      mergedDisabled: _mergedDisabled,
      eventHandlers
    } = useFormItem.useFormItem({
      disabled: vue.toRef(props, "disabled")
    });
    const inputRef = vue.ref(null);
    const _checked = vue.ref(props.defaultChecked);
    const isGroup = vue.computed(() => (radioGroupCtx == null ? void 0 : radioGroupCtx.name) === "ArcoRadioGroup");
    const mergedType = vue.computed(() => {
      var _a;
      return (_a = radioGroupCtx == null ? void 0 : radioGroupCtx.type) != null ? _a : props.type;
    });
    const mergedDisabled = vue.computed(() => (radioGroupCtx == null ? void 0 : radioGroupCtx.disabled) || _mergedDisabled.value);
    const computedChecked = vue.computed(() => {
      var _a, _b;
      if (isGroup.value) {
        return (radioGroupCtx == null ? void 0 : radioGroupCtx.value) === ((_a = props.value) != null ? _a : true);
      }
      if (!is.isUndefined(props.modelValue)) {
        return props.modelValue === ((_b = props.value) != null ? _b : true);
      }
      return _checked.value;
    });
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _checked.value = false;
      }
    });
    vue.watch(computedChecked, (curValue, preValue) => {
      if (curValue !== preValue) {
        _checked.value = curValue;
        if (inputRef.value) {
          inputRef.value.checked = curValue;
        }
      }
    });
    const handleFocus = (ev) => {
      var _a, _b;
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onFocus) == null ? void 0 : _b.call(_a, ev);
    };
    const handleBlur = (ev) => {
      var _a, _b;
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a, ev);
    };
    const handleClick = (ev) => {
      ev.stopPropagation();
    };
    const handleChange = (e) => {
      var _a, _b, _c, _d, _e;
      _checked.value = true;
      if (isGroup.value) {
        radioGroupCtx == null ? void 0 : radioGroupCtx.handleChange((_a = props.value) != null ? _a : true, e);
      } else {
        emit("update:modelValue", (_b = props.value) != null ? _b : true);
        emit("change", (_c = props.value) != null ? _c : true, e);
        (_e = (_d = eventHandlers.value) == null ? void 0 : _d.onChange) == null ? void 0 : _e.call(_d, e);
      }
      vue.nextTick(() => {
        if (inputRef.value && inputRef.value.checked !== computedChecked.value) {
          inputRef.value.checked = computedChecked.value;
        }
      });
    };
    const cls = vue.computed(() => [`${mergedType.value === "button" ? `${prefixCls}-button` : prefixCls}`, {
      [`${prefixCls}-checked`]: computedChecked.value,
      [`${prefixCls}-disabled`]: mergedDisabled.value
    }]);
    const defaultRadio = () => vue.createVNode(vue.Fragment, null, [vue.createVNode(vue.resolveComponent("icon-hover"), {
      "class": `${prefixCls}-icon-hover`,
      "disabled": mergedDisabled.value || computedChecked.value
    }, {
      default: () => [vue.createVNode("span", {
        "class": `${prefixCls}-icon`
      }, null)]
    }), slots.default && vue.createVNode("span", {
      "class": `${prefixCls}-label`
    }, [slots.default()])]);
    return () => {
      var _a, _b, _c, _d;
      return vue.createVNode("label", {
        "class": cls.value
      }, [vue.createVNode("input", {
        "ref": inputRef,
        "type": "radio",
        "checked": computedChecked.value,
        "value": props.value,
        "class": `${prefixCls}-target`,
        "disabled": mergedDisabled.value,
        "onClick": handleClick,
        "onChange": handleChange,
        "onFocus": handleFocus,
        "onBlur": handleBlur
      }, null), mergedType.value === "radio" ? (_d = (_c = (_b = slots.radio) != null ? _b : (_a = radioGroupCtx == null ? void 0 : radioGroupCtx.slots) == null ? void 0 : _a.radio) == null ? void 0 : _c({
        checked: computedChecked.value,
        disabled: mergedDisabled.value
      })) != null ? _d : defaultRadio() : vue.createVNode("span", {
        "class": `${prefixCls}-button-content`
      }, [slots.default && slots.default()])]);
    };
  }
});
module.exports = _Radio;
