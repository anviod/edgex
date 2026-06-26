import { defineComponent, ref, toRefs, computed, reactive, provide, openBlock, createElementBlock, normalizeClass, withModifiers, renderSlot } from "vue";
import scrollIntoView from "scroll-into-view-if-needed";
import { formInjectionKey } from "./context.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { isFunction, isArray, isBoolean } from "../_utils/is.js";
import { useSize } from "../_hooks/use-size.js";
import { getFormElementId } from "./utils.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Form",
  props: {
    model: {
      type: Object,
      required: true
    },
    layout: {
      type: String,
      default: "horizontal"
    },
    size: {
      type: String
    },
    labelColProps: {
      type: Object,
      default: () => ({ span: 5, offset: 0 })
    },
    wrapperColProps: {
      type: Object,
      default: () => ({ span: 19, offset: 0 })
    },
    labelColStyle: Object,
    wrapperColStyle: Object,
    labelAlign: {
      type: String,
      default: "right"
    },
    disabled: {
      type: Boolean,
      default: void 0
    },
    rules: {
      type: Object
    },
    autoLabelWidth: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    },
    scrollToFirstError: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    submit: (data, ev) => true,
    submitSuccess: (values, ev) => true,
    submitFailed: (data, ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("form");
    const formRef = ref();
    const {
      id,
      model,
      layout,
      disabled,
      labelAlign,
      labelColProps,
      wrapperColProps,
      labelColStyle,
      wrapperColStyle,
      size,
      rules
    } = toRefs(props);
    const { mergedSize } = useSize(size);
    const autoLabelWidth = computed(
      () => props.layout === "horizontal" && props.autoLabelWidth
    );
    const fields = [];
    const touchedFields = [];
    const labelWidth = reactive({});
    const maxLabelWidth = computed(
      () => Math.max(...Object.values(labelWidth))
    );
    const addField = (formItemInfo) => {
      if (formItemInfo && formItemInfo.field) {
        fields.push(formItemInfo);
      }
    };
    const removeField = (formItemInfo) => {
      if (formItemInfo && formItemInfo.field) {
        fields.splice(fields.indexOf(formItemInfo), 1);
      }
    };
    const setFields = (data) => {
      fields.forEach((field) => {
        if (data[field.field]) {
          field.setField(data[field.field]);
        }
      });
    };
    const setLabelWidth = (width, uid) => {
      if (uid && labelWidth[uid] !== width) {
        labelWidth[uid] = width;
      }
    };
    const removeLabelWidth = (uid) => {
      if (uid) {
        delete labelWidth[uid];
      }
    };
    const resetFields = (field) => {
      const _fields = field ? [].concat(field) : [];
      fields.forEach((field2) => {
        if (_fields.length === 0 || _fields.includes(field2.field)) {
          field2.resetField();
        }
      });
    };
    const clearValidate = (field) => {
      const _fields = field ? [].concat(field) : [];
      fields.forEach((field2) => {
        if (_fields.length === 0 || _fields.includes(field2.field)) {
          field2.clearValidate();
        }
      });
    };
    const scrollToField = (field, options) => {
      const node = formRef.value || document.body;
      const fieldNode = node.querySelector(
        `#${getFormElementId(props.id, field)}`
      );
      if (fieldNode) {
        scrollIntoView(fieldNode, {
          behavior: "smooth",
          block: "nearest",
          scrollMode: "if-needed",
          ...options
        });
      }
    };
    const scrollToFirstError = (field) => {
      const options = !isBoolean(props.scrollToFirstError) ? props.scrollToFirstError : void 0;
      scrollToField(field, options);
    };
    const validate = (callback) => {
      const list = [];
      fields.forEach((field) => {
        list.push(field.validate());
      });
      return Promise.all(list).then((result) => {
        const errors = {};
        let hasError = false;
        result.forEach((item) => {
          if (item) {
            hasError = true;
            errors[item.field] = item;
          }
        });
        if (hasError && props.scrollToFirstError) {
          scrollToFirstError(Object.keys(errors)[0]);
        }
        if (isFunction(callback)) {
          callback(hasError ? errors : void 0);
        }
        return hasError ? errors : void 0;
      });
    };
    const validateField = (field, callback) => {
      const list = [];
      for (const ctx of fields) {
        if (isArray(field) && field.includes(ctx.field) || field === ctx.field) {
          list.push(ctx.validate());
        }
      }
      return Promise.all(list).then((result) => {
        const errors = {};
        let hasError = false;
        result.forEach((item) => {
          if (item) {
            hasError = true;
            errors[item.field] = item;
          }
        });
        if (hasError && props.scrollToFirstError) {
          scrollToFirstError(Object.keys(errors)[0]);
        }
        if (isFunction(callback)) {
          callback(hasError ? errors : void 0);
        }
        return hasError ? errors : void 0;
      });
    };
    const handleSubmit = (e) => {
      const list = [];
      fields.forEach((field) => {
        list.push(field.validate());
      });
      Promise.all(list).then((result) => {
        const errors = {};
        let hasError = false;
        result.forEach((item) => {
          if (item) {
            hasError = true;
            errors[item.field] = item;
          }
        });
        if (hasError) {
          props.scrollToFirstError && scrollToFirstError(Object.keys(errors)[0]);
          emit("submitFailed", { values: model.value, errors }, e);
        } else {
          emit("submitSuccess", model.value, e);
        }
        emit(
          "submit",
          { values: model.value, errors: hasError ? errors : void 0 },
          e
        );
      });
    };
    provide(
      formInjectionKey,
      reactive({
        id,
        layout,
        disabled,
        labelAlign,
        labelColProps,
        wrapperColProps,
        labelColStyle,
        wrapperColStyle,
        model,
        size: mergedSize,
        rules,
        fields,
        touchedFields,
        addField,
        removeField,
        validateField,
        setLabelWidth,
        removeLabelWidth,
        maxLabelWidth,
        autoLabelWidth
      })
    );
    const cls = computed(() => [
      prefixCls,
      `${prefixCls}-layout-${props.layout}`,
      `${prefixCls}-size-${mergedSize.value}`,
      {
        [`${prefixCls}-auto-label-width`]: props.autoLabelWidth
      }
    ]);
    return {
      cls,
      formRef,
      handleSubmit,
      innerValidate: validate,
      innerValidateField: validateField,
      innerResetFields: resetFields,
      innerClearValidate: clearValidate,
      innerSetFields: setFields,
      innerScrollToField: scrollToField
    };
  },
  methods: {
    validate(callback) {
      return this.innerValidate(callback);
    },
    validateField(field, callback) {
      return this.innerValidateField(field, callback);
    },
    resetFields(field) {
      return this.innerResetFields(field);
    },
    clearValidate(field) {
      return this.innerClearValidate(field);
    },
    setFields(data) {
      return this.innerSetFields(data);
    },
    scrollToField(field) {
      return this.innerScrollToField(field);
    }
  }
});
const _hoisted_1 = ["id"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("form", {
    id: _ctx.id,
    ref: "formRef",
    class: normalizeClass(_ctx.cls),
    onSubmit: _cache[0] || (_cache[0] = withModifiers((...args) => _ctx.handleSubmit && _ctx.handleSubmit(...args), ["prevent"]))
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 42, _hoisted_1);
}
var _Form = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Form as default };
