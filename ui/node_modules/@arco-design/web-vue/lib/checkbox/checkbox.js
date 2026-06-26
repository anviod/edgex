"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var iconHover = require("../_components/icon-hover.js");
var iconCheck = require("./icon-check.js");
var is = require("../_utils/is.js");
var context = require("./context.js");
var useFormItem = require("../_hooks/use-form-item.js");
var _Checkbox = vue.defineComponent({
  name: "Checkbox",
  components: {
    IconCheck: iconCheck,
    IconHover: iconHover
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("checkbox");
    const checkboxRef = vue.ref();
    const checkboxGroupCtx = !props.uninjectGroupContext ? vue.inject(context.checkboxGroupKey, void 0) : void 0;
    const isGroup = (checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.name) === "ArcoCheckboxGroup";
    const {
      mergedDisabled: _mergedDisabled,
      eventHandlers
    } = useFormItem.useFormItem({
      disabled
    });
    const _checked = vue.ref(props.defaultChecked);
    const computedValue = vue.computed(() => {
      var _a;
      return isGroup ? checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.computedValue : (_a = props.modelValue) != null ? _a : _checked.value;
    });
    const computedChecked = vue.computed(() => {
      var _a;
      return is.isArray(computedValue.value) ? computedValue.value.includes((_a = props.value) != null ? _a : true) : computedValue.value;
    });
    const mergedDisabled = vue.computed(() => (checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.disabled) || (_mergedDisabled == null ? void 0 : _mergedDisabled.value) || !computedChecked.value && (checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.isMaxed));
    const handleClick = (ev) => {
      ev.stopPropagation();
    };
    const handleChange = (e) => {
      var _a, _b, _c, _d;
      const {
        checked
      } = e.target;
      let newValue = checked;
      if (is.isArray(computedValue.value)) {
        const set = new Set(computedValue.value);
        if (checked) {
          set.add((_a = props.value) != null ? _a : true);
        } else {
          set.delete((_b = props.value) != null ? _b : true);
        }
        newValue = Array.from(set);
      }
      _checked.value = checked;
      if (isGroup && is.isArray(newValue)) {
        checkboxGroupCtx == null ? void 0 : checkboxGroupCtx.handleChange(newValue, e);
      } else {
        emit("update:modelValue", newValue);
        emit("change", newValue, e);
        (_d = (_c = eventHandlers.value) == null ? void 0 : _c.onChange) == null ? void 0 : _d.call(_c, e);
      }
      vue.nextTick(() => {
        if (checkboxRef.value && checkboxRef.value.checked !== computedChecked.value) {
          checkboxRef.value.checked = computedChecked.value;
        }
      });
    };
    const cls = vue.computed(() => [prefixCls, {
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
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _checked.value = false;
      }
    });
    vue.watch(computedValue, (value) => {
      var _a;
      let checked;
      if (is.isArray(value)) {
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
      return vue.createVNode("label", {
        "aria-disabled": mergedDisabled.value,
        "class": cls.value
      }, [vue.createVNode("input", {
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
      })) != null ? _d : vue.createVNode(iconHover, {
        "class": `${prefixCls}-icon-hover`,
        "disabled": mergedDisabled.value || computedChecked.value
      }, {
        default: () => [vue.createVNode("div", {
          "class": `${prefixCls}-icon`
        }, [computedChecked.value && vue.createVNode(iconCheck, {
          "class": `${prefixCls}-icon-check`
        }, null)])]
      }), slots.default && vue.createVNode("span", {
        "class": `${prefixCls}-label`
      }, [slots.default()])]);
    };
  }
});
module.exports = _Checkbox;
