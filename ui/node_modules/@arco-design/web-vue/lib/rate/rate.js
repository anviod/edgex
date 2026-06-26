"use strict";
var vue = require("vue");
var NP = require("number-precision");
var index = require("../icon/icon-star-fill/index.js");
var index$1 = require("../icon/icon-face-meh-fill/index.js");
var index$3 = require("../icon/icon-face-smile-fill/index.js");
var index$2 = require("../icon/icon-face-frown-fill/index.js");
var globalConfig = require("../_utils/global-config.js");
var useFormItem = require("../_hooks/use-form-item.js");
var is = require("../_utils/is.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var NP__default = /* @__PURE__ */ _interopDefaultLegacy(NP);
var _Rate = vue.defineComponent({
  name: "Rate",
  props: {
    count: {
      type: Number,
      default: 5
    },
    modelValue: {
      type: Number,
      default: void 0
    },
    defaultValue: {
      type: Number,
      default: 0
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    grading: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: [String, Object]
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value) => true,
    "hoverChange": (value) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      modelValue
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("rate");
    const {
      mergedDisabled: _mergedDisabled,
      eventHandlers
    } = useFormItem.useFormItem({
      disabled: vue.toRef(props, "disabled")
    });
    const _value = vue.ref(props.defaultValue);
    const animation = vue.ref(false);
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _value.value = 0;
      }
    });
    const hoverIndex = vue.ref(0);
    const computedValue = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    const displayIndex = vue.computed(() => {
      const fixedValue = props.allowHalf ? NP__default["default"].times(NP__default["default"].round(NP__default["default"].divide(computedValue.value, 0.5), 0), 0.5) : Math.round(computedValue.value);
      return hoverIndex.value || fixedValue;
    });
    const mergedDisabled = vue.computed(() => _mergedDisabled.value || props.readonly);
    const indexArray = vue.computed(() => [...Array(props.grading ? 5 : props.count)]);
    const customColor = vue.computed(() => {
      var _a;
      if (is.isString(props.color)) {
        return indexArray.value.map(() => props.color);
      }
      if (is.isObject(props.color)) {
        const sortedKeys = Object.keys(props.color).map((key) => Number(key)).sort((a, b) => b - a);
        let threshold = (_a = sortedKeys.pop()) != null ? _a : indexArray.value.length;
        return indexArray.value.map((_, index2) => {
          var _a2;
          if (index2 + 1 > threshold) {
            threshold = (_a2 = sortedKeys.pop()) != null ? _a2 : threshold;
          }
          return props.color[String(threshold)];
        });
      }
      return void 0;
    });
    const resetHoverIndex = () => {
      if (hoverIndex.value) {
        hoverIndex.value = 0;
        emit("hoverChange", 0);
      }
    };
    const handleMouseEnter = (index2, isHalf) => {
      const newHoverIndex = isHalf && props.allowHalf ? index2 + 0.5 : index2 + 1;
      if (newHoverIndex !== hoverIndex.value) {
        hoverIndex.value = newHoverIndex;
        emit("hoverChange", newHoverIndex);
      }
    };
    const handleClick = (index2, isHalf) => {
      var _a, _b, _c, _d;
      const newValue = isHalf && props.allowHalf ? index2 + 0.5 : index2 + 1;
      animation.value = true;
      if (newValue !== computedValue.value) {
        _value.value = newValue;
        emit("update:modelValue", newValue);
        emit("change", newValue);
        (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
      } else if (props.allowClear) {
        _value.value = 0;
        emit("update:modelValue", 0);
        emit("change", 0);
        (_d = (_c = eventHandlers.value) == null ? void 0 : _c.onChange) == null ? void 0 : _d.call(_c);
      }
    };
    const handleAnimationEnd = (index2) => {
      if (animation.value && index2 + 1 >= computedValue.value - 1) {
        animation.value = false;
      }
    };
    const renderGradingCharacter = (index2, displayIndex2) => {
      if (index2 > displayIndex2) {
        return vue.createVNode(index$1, null, null);
      }
      if (displayIndex2 <= 2) {
        return vue.createVNode(index$2, null, null);
      }
      if (displayIndex2 <= 3) {
        return vue.createVNode(index$1, null, null);
      }
      return vue.createVNode(index$3, null, null);
    };
    const getAriaProps = (index2, isHalf = false) => {
      return {
        "role": "radio",
        "aria-checked": index2 + (isHalf ? 0.5 : 1) <= computedValue.value,
        "aria-setsize": indexArray.value.length,
        "aria-posinset": index2 + (isHalf ? 0.5 : 1)
      };
    };
    const renderElement = (index$12) => {
      if (props.grading) {
        return renderGradingCharacter(index$12, displayIndex.value);
      }
      if (slots.character) {
        return slots.character({
          index: index$12
        });
      }
      return vue.createVNode(index, null, null);
    };
    const renderCharacter = (index2) => {
      const leftProps = mergedDisabled.value ? {} : {
        onMouseenter: () => handleMouseEnter(index2, true),
        onClick: () => handleClick(index2, true)
      };
      const rightProps = mergedDisabled.value ? {} : {
        onMouseenter: () => handleMouseEnter(index2, false),
        onClick: () => handleClick(index2, false)
      };
      const style = animation.value ? {
        animationDelay: `${50 * index2}ms`
      } : void 0;
      const parseDisplayIndex = Math.ceil(displayIndex.value) - 1;
      const leftStyle = customColor.value && props.allowHalf && index2 + 0.5 === displayIndex.value ? {
        color: customColor.value[parseDisplayIndex]
      } : void 0;
      const rightStyle = customColor.value && index2 + 1 <= displayIndex.value ? {
        color: customColor.value[parseDisplayIndex]
      } : void 0;
      const cls2 = [`${prefixCls}-character`, {
        [`${prefixCls}-character-half`]: props.allowHalf && index2 + 0.5 === displayIndex.value,
        [`${prefixCls}-character-full`]: index2 + 1 <= displayIndex.value,
        [`${prefixCls}-character-scale`]: animation.value && index2 + 1 < computedValue.value
      }];
      return vue.createVNode("div", vue.mergeProps({
        "class": cls2,
        "style": style
      }, !props.allowHalf ? getAriaProps(index2) : void 0, {
        "onAnimationend": () => handleAnimationEnd(index2)
      }), [vue.createVNode("div", vue.mergeProps({
        "class": `${prefixCls}-character-left`,
        "style": leftStyle
      }, leftProps, props.allowHalf ? getAriaProps(index2, true) : void 0), [renderElement(index2)]), vue.createVNode("div", vue.mergeProps({
        "class": `${prefixCls}-character-right`,
        "style": rightStyle
      }, rightProps, props.allowHalf ? getAriaProps(index2) : void 0), [renderElement(index2)])]);
    };
    const cls = vue.computed(() => [prefixCls, {
      [`${prefixCls}-readonly`]: props.readonly,
      [`${prefixCls}-disabled`]: _mergedDisabled.value
    }]);
    return () => vue.createVNode("div", {
      "class": cls.value,
      "onMouseleave": resetHoverIndex
    }, [indexArray.value.map((_, index2) => renderCharacter(index2))]);
  }
});
module.exports = _Rate;
