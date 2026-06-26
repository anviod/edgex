"use strict";
var vue = require("vue");
var index = require("../textarea/index.js");
var index$2 = require("../input/index.js");
var index$1 = require("../trigger/index.js");
var selectDropdown = require("../select/select-dropdown.js");
var option = require("../select/option.js");
var utils$2 = require("./utils.js");
var globalConfig = require("../_utils/global-config.js");
var utils$1 = require("../textarea/utils.js");
var resizeObserver = require("../_components/resize-observer.js");
var is = require("../_utils/is.js");
var useSelect = require("../select/hooks/use-select.js");
var utils = require("../select/utils.js");
var useFormItem = require("../_hooks/use-form-item.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var _Mention = vue.defineComponent({
  name: "Mention",
  inheritAttrs: false,
  props: {
    modelValue: String,
    defaultValue: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default: () => []
    },
    prefix: {
      type: [String, Array],
      default: "@"
    },
    split: {
      type: String,
      default: " "
    },
    type: {
      type: String,
      default: "input"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value) => true,
    "search": (value, prefix) => true,
    "select": (value) => true,
    "clear": (ev) => true,
    "focus": (ev) => true,
    "blur": (ev) => true
  },
  setup(props, {
    emit,
    attrs,
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("mention");
    let styleDeclaration;
    const {
      mergedDisabled,
      eventHandlers
    } = useFormItem.useFormItem({
      disabled: vue.toRef(props, "disabled")
    });
    const {
      data,
      modelValue
    } = vue.toRefs(props);
    const dropdownRef = vue.ref();
    const optionRefs = vue.ref({});
    const _value = vue.ref(props.defaultValue);
    const computedValue = vue.computed(() => {
      var _a;
      return (_a = props.modelValue) != null ? _a : _value.value;
    });
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _value.value = "";
      }
    });
    const computedValueKeys = vue.computed(() => computedValue.value ? [utils.getKeyFromValue(computedValue.value)] : []);
    const measureInfo = vue.ref({
      measuring: false,
      location: -1,
      prefix: "",
      text: ""
    });
    const resetMeasureInfo = () => {
      measureInfo.value = {
        measuring: false,
        location: -1,
        prefix: "",
        text: ""
      };
    };
    const inputRef = vue.ref();
    const measureText = vue.computed(() => measureInfo.value.text);
    const filterOption = vue.ref(true);
    const handleInput = (value, e) => {
      var _a, _b;
      const text = utils$2.getTextBeforeSelection(e.target);
      const lastMeasure = utils$2.getLastMeasureIndex(text, props.prefix);
      if (lastMeasure.location > -1) {
        const measureText2 = text.slice(lastMeasure.location + lastMeasure.prefix.length);
        if (utils$2.isValidSearch(measureText2, props.split)) {
          _popupVisible.value = true;
          measureInfo.value = {
            measuring: true,
            text: measureText2,
            ...lastMeasure
          };
          emit("search", measureText2, lastMeasure.prefix);
        } else if (measureInfo.value.location > -1) {
          resetMeasureInfo();
        }
      } else if (measureInfo.value.location > -1) {
        resetMeasureInfo();
      }
      _value.value = value;
      emit("update:modelValue", value);
      emit("change", value);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
    };
    const handleClear = (ev) => {
      var _a, _b;
      _value.value = "";
      emit("update:modelValue", "");
      emit("change", "");
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
      emit("clear", ev);
    };
    const _popupVisible = vue.ref(false);
    const computedPopupVisible = vue.computed(() => _popupVisible.value && measureInfo.value.measuring && validOptionInfos.value.length > 0);
    const handleResize = () => {
      mirrorStyle.value = utils$1.getSizeStyles(styleDeclaration);
    };
    const handlePopupVisibleChange = (popupVisible) => {
      _popupVisible.value = popupVisible;
    };
    const handleSelect = (key, e) => {
      var _a, _b, _c;
      const {
        value
      } = (_a = optionInfoMap.get(key)) != null ? _a : {};
      const measureStart = measureInfo.value.location;
      const measureEnd = measureInfo.value.location + measureInfo.value.text.length;
      let head = _value.value.slice(0, measureStart);
      let tail = _value.value.slice(measureEnd + 1);
      head += !head || head.endsWith(props.split) || head.endsWith("\n") ? "" : props.split;
      tail = (!tail || tail.startsWith(props.split) || tail.startsWith("\n") ? "" : props.split) + tail;
      const match = `${measureInfo.value.prefix}${value}`;
      const nextValue = `${head}${match}${tail}`;
      _value.value = nextValue;
      emit("select", value);
      emit("update:modelValue", nextValue);
      emit("change", nextValue);
      resetMeasureInfo();
      (_c = (_b = eventHandlers.value) == null ? void 0 : _b.onChange) == null ? void 0 : _c.call(_b);
    };
    const {
      validOptions,
      optionInfoMap,
      validOptionInfos,
      handleKeyDown
    } = useSelect.useSelect({
      options: data,
      inputValue: measureText,
      filterOption,
      popupVisible: computedPopupVisible,
      valueKeys: computedValueKeys,
      dropdownRef,
      optionRefs,
      onSelect: handleSelect,
      onPopupVisibleChange: handlePopupVisibleChange,
      enterToOpen: false
    });
    const mirrorStyle = vue.ref();
    vue.onMounted(() => {
      var _a;
      if (props.type === "textarea" && ((_a = inputRef.value) == null ? void 0 : _a.textareaRef)) {
        styleDeclaration = window.getComputedStyle(inputRef.value.textareaRef);
        mirrorStyle.value = utils$1.getSizeStyles(styleDeclaration);
      }
    });
    const getOptionContentFunc = (item) => {
      if (is.isFunction(slots.option) && item.value) {
        const optionInfo = optionInfoMap.get(item.key);
        const optionSlot = slots.option;
        return () => optionSlot({
          data: optionInfo
        });
      }
      return () => item.label;
    };
    const renderOption = (item) => {
      return vue.createVNode(option, {
        "ref": (ref) => {
          if (ref == null ? void 0 : ref.$el) {
            optionRefs.value[item.key] = ref.$el;
          }
        },
        "key": item.key,
        "value": item.value,
        "disabled": item.disabled,
        "internal": true
      }, {
        default: getOptionContentFunc(item)
      });
    };
    const renderDropdown = () => {
      let _slot;
      return vue.createVNode(selectDropdown, {
        "ref": dropdownRef
      }, _isSlot(_slot = validOptions.value.map((info) => renderOption(info))) ? _slot : {
        default: () => [_slot]
      });
    };
    const mirrorRef = vue.ref();
    vue.watch(computedPopupVisible, (visible) => {
      if (props.type === "textarea" && visible) {
        vue.nextTick(() => {
          var _a, _b;
          if (((_a = inputRef.value) == null ? void 0 : _a.textareaRef) && inputRef.value.textareaRef.scrollTop > 0) {
            (_b = mirrorRef.value) == null ? void 0 : _b.scrollTo(0, inputRef.value.textareaRef.scrollTop);
          }
        });
      }
    });
    const onFocus = (ev) => {
      emit("focus", ev);
    };
    const onBlur = (ev) => {
      emit("blur", ev);
    };
    const render = () => {
      var _a;
      if (props.type === "textarea") {
        return vue.createVNode("div", {
          "class": prefixCls
        }, [vue.createVNode(resizeObserver, {
          "onResize": handleResize
        }, {
          default: () => [vue.createVNode(index, vue.mergeProps(attrs, {
            "ref": inputRef,
            "allowClear": props.allowClear,
            "modelValue": computedValue.value,
            "disabled": mergedDisabled.value,
            "onInput": handleInput,
            "onClear": handleClear,
            "onFocus": onFocus,
            "onBlur": onBlur,
            "onKeydown": handleKeyDown
          }), null)]
        }), measureInfo.value.measuring && validOptionInfos.value.length > 0 && vue.createVNode("div", {
          "ref": mirrorRef,
          "style": mirrorStyle.value,
          "class": `${prefixCls}-measure`
        }, [(_a = computedValue.value) == null ? void 0 : _a.slice(0, measureInfo.value.location), vue.createVNode(index$1, {
          "trigger": "focus",
          "position": "bl",
          "popupOffset": 4,
          "preventFocus": true,
          "popupVisible": computedPopupVisible.value,
          "clickToClose": false,
          "onPopupVisibleChange": handlePopupVisibleChange
        }, {
          default: () => [vue.createVNode("span", null, [vue.createTextVNode("@")])],
          content: renderDropdown
        })])]);
      }
      return vue.createVNode(index$1, {
        "trigger": "focus",
        "position": "bl",
        "animationName": "slide-dynamic-origin",
        "popupOffset": 4,
        "preventFocus": true,
        "popupVisible": computedPopupVisible.value,
        "clickToClose": false,
        "autoFitPopupWidth": true,
        "autoFitTransformOrigin": true,
        "disabled": mergedDisabled.value,
        "onPopupVisibleChange": handlePopupVisibleChange
      }, {
        default: () => [vue.createVNode(index$2["default"], vue.mergeProps(attrs, {
          "ref": inputRef,
          "allowClear": props.allowClear,
          "modelValue": computedValue.value,
          "disabled": mergedDisabled.value,
          "onInput": handleInput,
          "onClear": handleClear,
          "onFocus": onFocus,
          "onBlur": onBlur,
          "onKeydown": handleKeyDown
        }), slots)],
        content: renderDropdown
      });
    };
    return {
      inputRef,
      render
    };
  },
  methods: {
    focus() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.focus();
    },
    blur() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.blur();
    }
  },
  render() {
    return this.render();
  }
});
module.exports = _Mention;
