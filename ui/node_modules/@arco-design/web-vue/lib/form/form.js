"use strict";
var vue = require("vue");
var scrollIntoView = require("scroll-into-view-if-needed");
var context = require("./context.js");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var useSize = require("../_hooks/use-size.js");
var utils = require("./utils.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var scrollIntoView__default = /* @__PURE__ */ _interopDefaultLegacy(scrollIntoView);
const _sfc_main = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("form");
    const formRef = vue.ref();
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
    } = vue.toRefs(props);
    const { mergedSize } = useSize.useSize(size);
    const autoLabelWidth = vue.computed(
      () => props.layout === "horizontal" && props.autoLabelWidth
    );
    const fields = [];
    const touchedFields = [];
    const labelWidth = vue.reactive({});
    const maxLabelWidth = vue.computed(
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
        `#${utils.getFormElementId(props.id, field)}`
      );
      if (fieldNode) {
        scrollIntoView__default["default"](fieldNode, {
          behavior: "smooth",
          block: "nearest",
          scrollMode: "if-needed",
          ...options
        });
      }
    };
    const scrollToFirstError = (field) => {
      const options = !is.isBoolean(props.scrollToFirstError) ? props.scrollToFirstError : void 0;
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
        if (is.isFunction(callback)) {
          callback(hasError ? errors : void 0);
        }
        return hasError ? errors : void 0;
      });
    };
    const validateField = (field, callback) => {
      const list = [];
      for (const ctx of fields) {
        if (is.isArray(field) && field.includes(ctx.field) || field === ctx.field) {
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
        if (is.isFunction(callback)) {
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
    vue.provide(
      context.formInjectionKey,
      vue.reactive({
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
    const cls = vue.computed(() => [
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
  return vue.openBlock(), vue.createElementBlock("form", {
    id: _ctx.id,
    ref: "formRef",
    class: vue.normalizeClass(_ctx.cls),
    onSubmit: _cache[0] || (_cache[0] = vue.withModifiers((...args) => _ctx.handleSubmit && _ctx.handleSubmit(...args), ["prevent"]))
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 42, _hoisted_1);
}
var _Form = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Form;
