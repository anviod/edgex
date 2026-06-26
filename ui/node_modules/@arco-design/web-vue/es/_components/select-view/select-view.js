import { defineComponent, toRefs, ref, computed, watch, createVNode, Fragment } from "vue";
import { getPrefixCls } from "../../_utils/global-config.js";
import { isArray } from "../../_utils/is.js";
import FeedbackIcon from "../feedback-icon.js";
import InputLabel from "../input-label/input-label.js";
import InputTag from "../../input-tag/index.js";
import IconHover from "../icon-hover.js";
import IconDown from "../../icon/icon-down/index.js";
import IconLoading from "../../icon/icon-loading/index.js";
import IconClose from "../../icon/icon-close/index.js";
import IconSearch from "../../icon/icon-search/index.js";
import { useFormItem } from "../../_hooks/use-form-item.js";
import { useSize } from "../../_hooks/use-size.js";
var SelectView = defineComponent({
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
      default: (props) => isArray(props.modelValue)
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
    } = toRefs(props);
    const prefixCls = getPrefixCls("select-view");
    const {
      feedback,
      eventHandlers,
      mergedDisabled,
      mergedSize: _mergedSize,
      mergedError
    } = useFormItem({
      size,
      disabled,
      error
    });
    const {
      mergedSize
    } = useSize(_mergedSize);
    const {
      opened
    } = toRefs(props);
    const componentRef = ref();
    const inputRef = computed(
      () => {
        var _a;
        return (_a = componentRef.value) == null ? void 0 : _a.inputRef;
      }
    );
    const isEmptyValue = computed(() => props.modelValue.length === 0);
    const enabledInput = computed(() => props.allowSearch || props.allowCreate);
    const showClearBtn = computed(() => props.allowClear && !props.disabled && !isEmptyValue.value);
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
        return (_b = (_a = slots["loading-icon"]) == null ? void 0 : _a.call(slots)) != null ? _b : createVNode(IconLoading, null, null);
      }
      if (props.allowSearch && props.opened) {
        return (_d = (_c = slots["search-icon"]) == null ? void 0 : _c.call(slots)) != null ? _d : createVNode(IconSearch, null, null);
      }
      if (slots["arrow-icon"]) {
        return slots["arrow-icon"]();
      }
      return createVNode(IconDown, {
        "class": `${prefixCls}-arrow-icon`
      }, null);
    };
    const renderSuffix = () => createVNode(Fragment, null, [showClearBtn.value && createVNode(IconHover, {
      "class": `${prefixCls}-clear-btn`,
      "onClick": handleClear,
      "onMousedown": (ev) => ev.stopPropagation()
    }, {
      default: () => [createVNode(IconClose, null, null)]
    }), createVNode("span", {
      "class": `${prefixCls}-icon`
    }, [renderIcon()]), Boolean(feedback.value) && createVNode(FeedbackIcon, {
      "type": feedback.value
    }, null)]);
    watch(opened, (opened2) => {
      if (!opened2 && inputRef.value && inputRef.value.isSameNode(document.activeElement)) {
        inputRef.value.blur();
      }
    });
    const cls = computed(() => [`${prefixCls}-${props.multiple ? "multiple" : "single"}`, {
      [`${prefixCls}-opened`]: props.opened,
      [`${prefixCls}-borderless`]: !props.bordered
    }]);
    const render = () => {
      if (props.multiple) {
        return createVNode(InputTag, {
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
      return createVNode(InputLabel, {
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
export { SelectView as default };
