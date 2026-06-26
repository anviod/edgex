import { defineComponent, toRefs, toRef, ref, watch, computed, createVNode, mergeProps } from "vue";
import NP from "number-precision";
import IconStarFill from "../icon/icon-star-fill/index.js";
import IconFaceMehFill from "../icon/icon-face-meh-fill/index.js";
import IconFaceSmileFill from "../icon/icon-face-smile-fill/index.js";
import IconFaceFrownFill from "../icon/icon-face-frown-fill/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { useFormItem } from "../_hooks/use-form-item.js";
import { isUndefined, isNull, isString, isObject } from "../_utils/is.js";
var _Rate = defineComponent({
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
    } = toRefs(props);
    const prefixCls = getPrefixCls("rate");
    const {
      mergedDisabled: _mergedDisabled,
      eventHandlers
    } = useFormItem({
      disabled: toRef(props, "disabled")
    });
    const _value = ref(props.defaultValue);
    const animation = ref(false);
    watch(modelValue, (value) => {
      if (isUndefined(value) || isNull(value)) {
        _value.value = 0;
      }
    });
    const hoverIndex = ref(0);
    const computedValue = computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    const displayIndex = computed(() => {
      const fixedValue = props.allowHalf ? NP.times(NP.round(NP.divide(computedValue.value, 0.5), 0), 0.5) : Math.round(computedValue.value);
      return hoverIndex.value || fixedValue;
    });
    const mergedDisabled = computed(() => _mergedDisabled.value || props.readonly);
    const indexArray = computed(() => [...Array(props.grading ? 5 : props.count)]);
    const customColor = computed(() => {
      var _a;
      if (isString(props.color)) {
        return indexArray.value.map(() => props.color);
      }
      if (isObject(props.color)) {
        const sortedKeys = Object.keys(props.color).map((key) => Number(key)).sort((a, b) => b - a);
        let threshold = (_a = sortedKeys.pop()) != null ? _a : indexArray.value.length;
        return indexArray.value.map((_, index) => {
          var _a2;
          if (index + 1 > threshold) {
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
    const handleMouseEnter = (index, isHalf) => {
      const newHoverIndex = isHalf && props.allowHalf ? index + 0.5 : index + 1;
      if (newHoverIndex !== hoverIndex.value) {
        hoverIndex.value = newHoverIndex;
        emit("hoverChange", newHoverIndex);
      }
    };
    const handleClick = (index, isHalf) => {
      var _a, _b, _c, _d;
      const newValue = isHalf && props.allowHalf ? index + 0.5 : index + 1;
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
    const handleAnimationEnd = (index) => {
      if (animation.value && index + 1 >= computedValue.value - 1) {
        animation.value = false;
      }
    };
    const renderGradingCharacter = (index, displayIndex2) => {
      if (index > displayIndex2) {
        return createVNode(IconFaceMehFill, null, null);
      }
      if (displayIndex2 <= 2) {
        return createVNode(IconFaceFrownFill, null, null);
      }
      if (displayIndex2 <= 3) {
        return createVNode(IconFaceMehFill, null, null);
      }
      return createVNode(IconFaceSmileFill, null, null);
    };
    const getAriaProps = (index, isHalf = false) => {
      return {
        "role": "radio",
        "aria-checked": index + (isHalf ? 0.5 : 1) <= computedValue.value,
        "aria-setsize": indexArray.value.length,
        "aria-posinset": index + (isHalf ? 0.5 : 1)
      };
    };
    const renderElement = (index) => {
      if (props.grading) {
        return renderGradingCharacter(index, displayIndex.value);
      }
      if (slots.character) {
        return slots.character({
          index
        });
      }
      return createVNode(IconStarFill, null, null);
    };
    const renderCharacter = (index) => {
      const leftProps = mergedDisabled.value ? {} : {
        onMouseenter: () => handleMouseEnter(index, true),
        onClick: () => handleClick(index, true)
      };
      const rightProps = mergedDisabled.value ? {} : {
        onMouseenter: () => handleMouseEnter(index, false),
        onClick: () => handleClick(index, false)
      };
      const style = animation.value ? {
        animationDelay: `${50 * index}ms`
      } : void 0;
      const parseDisplayIndex = Math.ceil(displayIndex.value) - 1;
      const leftStyle = customColor.value && props.allowHalf && index + 0.5 === displayIndex.value ? {
        color: customColor.value[parseDisplayIndex]
      } : void 0;
      const rightStyle = customColor.value && index + 1 <= displayIndex.value ? {
        color: customColor.value[parseDisplayIndex]
      } : void 0;
      const cls2 = [`${prefixCls}-character`, {
        [`${prefixCls}-character-half`]: props.allowHalf && index + 0.5 === displayIndex.value,
        [`${prefixCls}-character-full`]: index + 1 <= displayIndex.value,
        [`${prefixCls}-character-scale`]: animation.value && index + 1 < computedValue.value
      }];
      return createVNode("div", mergeProps({
        "class": cls2,
        "style": style
      }, !props.allowHalf ? getAriaProps(index) : void 0, {
        "onAnimationend": () => handleAnimationEnd(index)
      }), [createVNode("div", mergeProps({
        "class": `${prefixCls}-character-left`,
        "style": leftStyle
      }, leftProps, props.allowHalf ? getAriaProps(index, true) : void 0), [renderElement(index)]), createVNode("div", mergeProps({
        "class": `${prefixCls}-character-right`,
        "style": rightStyle
      }, rightProps, props.allowHalf ? getAriaProps(index) : void 0), [renderElement(index)])]);
    };
    const cls = computed(() => [prefixCls, {
      [`${prefixCls}-readonly`]: props.readonly,
      [`${prefixCls}-disabled`]: _mergedDisabled.value
    }]);
    return () => createVNode("div", {
      "class": cls.value,
      "onMouseleave": resetHoverIndex
    }, [indexArray.value.map((_, index) => renderCharacter(index))]);
  }
});
export { _Rate as default };
