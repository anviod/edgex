"use strict";
var vue = require("vue");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var feedbackIcon = require("../feedback-icon.js");
var inputLabel = require("../input-label/input-label.js");
var index = require("../../input-tag/index.js");
var iconHover = require("../icon-hover.js");
var index$4 = require("../../icon/icon-down/index.js");
var index$2 = require("../../icon/icon-loading/index.js");
var index$1 = require("../../icon/icon-close/index.js");
var index$3 = require("../../icon/icon-search/index.js");
var useFormItem = require("../../_hooks/use-form-item.js");
var useSize = require("../../_hooks/use-size.js");
var SelectView = vue.defineComponent({
  name: "SelectView",
  props: {
    modelValue: {
      type: Array,
      required: true
    },
    inputValue: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    opened: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    bordered: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    allowCreate: {
      type: Boolean,
      default: false
    },
    allowSearch: {
      type: Boolean,
      default: (props) => is.isArray(props.modelValue)
    },
    maxTagCount: {
      type: Number,
      default: 0
    },
    tagNowrap: {
      type: Boolean,
      default: false
    },
    retainInputValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["remove", "clear", "focus", "blur"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      size,
      disabled,
      error
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("select-view");
    const {
      feedback,
      eventHandlers,
      mergedDisabled,
      mergedSize: _mergedSize,
      mergedError
    } = useFormItem.useFormItem({
      size,
      disabled,
      error
    });
    const {
      mergedSize
    } = useSize.useSize(_mergedSize);
    const {
      opened
    } = vue.toRefs(props);
    const componentRef = vue.ref();
    const inputRef = vue.computed(
      () => {
        var _a;
        return (_a = componentRef.value) == null ? void 0 : _a.inputRef;
      }
    );
    const isEmptyValue = vue.computed(() => props.modelValue.length === 0);
    const enabledInput = vue.computed(() => props.allowSearch || props.allowCreate);
    const showClearBtn = vue.computed(() => props.allowClear && !props.disabled && !isEmptyValue.value);
    const handleFocus = (ev) => {
      var _a, _b;
      emit("focus", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onFocus) == null ? void 0 : _b.call(_a, ev);
    };
    const handleBlur = (ev) => {
      var _a, _b;
      emit("blur", ev);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a, ev);
    };
    const handleRemove = (tag) => {
      emit("remove", tag);
    };
    const handleClear = (ev) => {
      emit("clear", ev);
    };
    const renderIcon = () => {
      var _a, _b, _c, _d;
      if (props.loading) {
        return (_b = (_a = slots["loading-icon"]) == null ? void 0 : _a.call(slots)) != null ? _b : vue.createVNode(index$2, null, null);
      }
      if (props.allowSearch && props.opened) {
        return (_d = (_c = slots["search-icon"]) == null ? void 0 : _c.call(slots)) != null ? _d : vue.createVNode(index$3, null, null);
      }
      if (slots["arrow-icon"]) {
        return slots["arrow-icon"]();
      }
      return vue.createVNode(index$4, {
        "class": `${prefixCls}-arrow-icon`
      }, null);
    };
    const renderSuffix = () => vue.createVNode(vue.Fragment, null, [showClearBtn.value && vue.createVNode(iconHover, {
      "class": `${prefixCls}-clear-btn`,
      "onClick": handleClear,
      "onMousedown": (ev) => ev.stopPropagation()
    }, {
      default: () => [vue.createVNode(index$1, null, null)]
    }), vue.createVNode("span", {
      "class": `${prefixCls}-icon`
    }, [renderIcon()]), Boolean(feedback.value) && vue.createVNode(feedbackIcon, {
      "type": feedback.value
    }, null)]);
    vue.watch(opened, (opened2) => {
      if (!opened2 && inputRef.value && inputRef.value.isSameNode(document.activeElement)) {
        inputRef.value.blur();
      }
    });
    const cls = vue.computed(() => [`${prefixCls}-${props.multiple ? "multiple" : "single"}`, {
      [`${prefixCls}-opened`]: props.opened,
      [`${prefixCls}-borderless`]: !props.bordered
    }]);
    const render = () => {
      if (props.multiple) {
        return vue.createVNode(index, {
          "ref": componentRef,
          "baseCls": prefixCls,
          "class": cls.value,
          "modelValue": props.modelValue,
          "inputValue": props.inputValue,
          "focused": props.opened,
          "placeholder": props.placeholder,
          "disabled": mergedDisabled.value,
          "size": mergedSize.value,
          "error": mergedError.value,
          "maxTagCount": props.maxTagCount,
          "disabledInput": !props.allowSearch && !props.allowCreate,
          "tagNowrap": props.tagNowrap,
          "retainInputValue": true,
          "uninjectFormItemContext": true,
          "onRemove": handleRemove,
          "onFocus": handleFocus,
          "onBlur": handleBlur
        }, {
          prefix: slots.prefix,
          suffix: renderSuffix,
          tag: slots.label
        });
      }
      return vue.createVNode(inputLabel, {
        "ref": componentRef,
        "baseCls": prefixCls,
        "class": cls.value,
        "modelValue": props.modelValue[0],
        "inputValue": props.inputValue,
        "focused": props.opened,
        "placeholder": props.placeholder,
        "disabled": mergedDisabled.value,
        "size": mergedSize.value,
        "error": mergedError.value,
        "enabledInput": enabledInput.value,
        "uninjectFormItemContext": true,
        "onFocus": handleFocus,
        "onBlur": handleBlur
      }, {
        default: slots.label,
        prefix: slots.prefix,
        suffix: renderSuffix
      });
    };
    return {
      inputRef,
      handleFocus,
      handleBlur,
      render
    };
  },
  methods: {
    focus() {
      if (this.inputRef) {
        this.inputRef.focus();
      }
    },
    blur() {
      if (this.inputRef) {
        this.inputRef.blur();
      }
    }
  },
  render() {
    return this.render();
  }
});
module.exports = SelectView;
