"use strict";
var vue = require("vue");
var bValidate = require("b-validate");
var context = require("./context.js");
require("../grid/index.js");
var formItemLabel = require("./form-item-label.js");
var formItemMessage = require("./form-item-message.js");
var globalConfig = require("../_utils/global-config.js");
var getValueByPath = require("../_utils/get-value-by-path.js");
var utils = require("./utils.js");
var index = require("../locale/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
var gridRow = require("../grid/grid-row.js");
var gridCol = require("../grid/grid-col.js");
const _sfc_main = vue.defineComponent({
  name: "FormItem",
  components: {
    ArcoRow: gridRow,
    ArcoCol: gridCol,
    FormItemLabel: formItemLabel,
    FormItemMessage: formItemMessage
  },
  props: {
    field: {
      type: String,
      default: ""
    },
    label: String,
    tooltip: {
      type: String
    },
    showColon: {
      type: Boolean,
      default: false
    },
    noStyle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: void 0
    },
    help: String,
    extra: String,
    required: {
      type: Boolean,
      default: false
    },
    asteriskPosition: {
      type: String,
      default: "start"
    },
    rules: {
      type: [Object, Array]
    },
    validateStatus: {
      type: String
    },
    validateTrigger: {
      type: [String, Array],
      default: "change"
    },
    labelColProps: Object,
    wrapperColProps: Object,
    hideLabel: {
      type: Boolean,
      default: false
    },
    hideAsterisk: {
      type: Boolean,
      default: false
    },
    labelColStyle: Object,
    wrapperColStyle: Object,
    rowProps: Object,
    rowClass: [String, Array, Object],
    contentClass: [String, Array, Object],
    contentFlex: {
      type: Boolean,
      default: true
    },
    mergeProps: {
      type: [Boolean, Function],
      default: true
    },
    labelColFlex: {
      type: [Number, String]
    },
    feedback: {
      type: Boolean,
      default: false
    },
    labelComponent: {
      type: String,
      default: "label"
    },
    labelAttrs: Object
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("form-item");
    const { field } = vue.toRefs(props);
    const formCtx = vue.inject(context.formInjectionKey, {});
    const { autoLabelWidth, layout } = vue.toRefs(formCtx);
    const { i18nMessage } = index.useI18n();
    const mergedLabelCol = vue.computed(() => {
      var _a;
      const colProps = { ...(_a = props.labelColProps) != null ? _a : formCtx.labelColProps };
      if (props.labelColFlex) {
        colProps.flex = props.labelColFlex;
      } else if (formCtx.autoLabelWidth) {
        colProps.flex = `${formCtx.maxLabelWidth}px`;
      }
      return colProps;
    });
    const mergedWrapperCol = vue.computed(() => {
      var _a;
      const colProps = {
        ...(_a = props.wrapperColProps) != null ? _a : formCtx.wrapperColProps
      };
      if (field.value) {
        colProps.id = utils.getFormElementId(formCtx.id, field.value);
      }
      if (props.labelColFlex || formCtx.autoLabelWidth) {
        colProps.flex = "auto";
      }
      return colProps;
    });
    const mergedLabelStyle = vue.computed(
      () => {
        var _a;
        return (_a = props.labelColStyle) != null ? _a : formCtx.labelColStyle;
      }
    );
    const mergedWrapperStyle = vue.computed(
      () => {
        var _a;
        return (_a = props.wrapperColStyle) != null ? _a : formCtx.wrapperColStyle;
      }
    );
    const initialValue = getValueByPath.getValueByPath(formCtx.model, props.field);
    const validateStatus = vue.reactive({});
    const validateMessage = vue.reactive({});
    const finalStatus = vue.computed(() => utils.getFinalValidateStatus(validateStatus));
    const finalMessage = vue.computed(
      () => utils.getFinalValidateMessage(validateMessage)
    );
    const validateDisabled = vue.ref(false);
    const fieldValue = vue.computed(
      () => getValueByPath.getValueByPath(formCtx.model, props.field)
    );
    const computedDisabled = vue.computed(
      () => {
        var _a;
        return Boolean((_a = props.disabled) != null ? _a : formCtx == null ? void 0 : formCtx.disabled);
      }
    );
    const computedValidateStatus = vue.computed(
      () => {
        var _a;
        return (_a = props.validateStatus) != null ? _a : finalStatus.value;
      }
    );
    const isError = vue.computed(() => computedValidateStatus.value === "error");
    const mergedRules = vue.computed(() => {
      var _a, _b, _c;
      const baseRules = [].concat(
        (_c = (_b = props.rules) != null ? _b : (_a = formCtx == null ? void 0 : formCtx.rules) == null ? void 0 : _a[props.field]) != null ? _c : []
      );
      const hasRequiredRule = baseRules.some((item) => item.required);
      if (props.required && !hasRequiredRule) {
        return [{ required: true }].concat(baseRules);
      }
      return baseRules;
    });
    const isRequired = vue.computed(
      () => mergedRules.value.some((item) => item.required)
    );
    const formItemCtx = props.noStyle ? vue.inject(context.formItemInjectionKey, void 0) : void 0;
    const updateValidateState = (field2, { status, message }) => {
      validateStatus[field2] = status;
      validateMessage[field2] = message;
      if (props.noStyle) {
        formItemCtx == null ? void 0 : formItemCtx.updateValidateState(field2, { status, message });
      }
    };
    const computedFeedback = vue.computed(
      () => props.feedback && computedValidateStatus.value ? computedValidateStatus.value : void 0
    );
    const validateField = () => {
      var _a;
      if (validateDisabled.value) {
        return Promise.resolve();
      }
      const rules = mergedRules.value;
      if (!field.value || rules.length === 0) {
        if (finalStatus.value) {
          clearValidate();
        }
        return Promise.resolve();
      }
      const _field = field.value;
      const _value = fieldValue.value;
      updateValidateState(_field, {
        status: "",
        message: ""
      });
      const schema = new bValidate.Schema(
        {
          [_field]: rules.map(({ ...rule }) => {
            if (!rule.type && !rule.validator) {
              rule.type = "string";
            }
            return rule;
          })
        },
        {
          ignoreEmptyString: true,
          validateMessages: (_a = i18nMessage.value.form) == null ? void 0 : _a.validateMessages
        }
      );
      return new Promise((resolve) => {
        schema.validate({ [_field]: _value }, (err) => {
          var _a2;
          const isError2 = Boolean(err == null ? void 0 : err[_field]);
          updateValidateState(_field, {
            status: isError2 ? "error" : "",
            message: (_a2 = err == null ? void 0 : err[_field].message) != null ? _a2 : ""
          });
          const error = isError2 ? {
            label: props.label,
            field: field.value,
            value: err[_field].value,
            type: err[_field].type,
            isRequiredError: Boolean(err[_field].requiredError),
            message: err[_field].message
          } : void 0;
          resolve(error);
        });
      });
    };
    const validateTriggers = vue.computed(
      () => [].concat(props.validateTrigger)
    );
    const eventHandlers = vue.computed(
      () => validateTriggers.value.reduce((event, trigger) => {
        switch (trigger) {
          case "change":
            event.onChange = () => {
              validateField();
            };
            return event;
          case "input":
            event.onInput = () => {
              vue.nextTick(() => {
                validateField();
              });
            };
            return event;
          case "focus":
            event.onFocus = () => {
              validateField();
            };
            return event;
          case "blur":
            event.onBlur = () => {
              validateField();
            };
            return event;
          default:
            return event;
        }
      }, {})
    );
    vue.provide(
      context.formItemInjectionKey,
      vue.reactive({
        eventHandlers,
        size: formCtx && vue.toRef(formCtx, "size"),
        disabled: computedDisabled,
        error: isError,
        feedback: computedFeedback,
        updateValidateState
      })
    );
    const clearValidate = () => {
      if (field.value) {
        updateValidateState(field.value, {
          status: "",
          message: ""
        });
      }
    };
    const setField = (data) => {
      var _a, _b;
      if (field.value) {
        validateDisabled.value = true;
        if ("value" in data && (formCtx == null ? void 0 : formCtx.model) && field.value) {
          getValueByPath.setValueByPath(formCtx.model, field.value, data.value);
        }
        if (data.status || data.message) {
          updateValidateState(field.value, {
            status: (_a = data.status) != null ? _a : "",
            message: (_b = data.message) != null ? _b : ""
          });
        }
        vue.nextTick(() => {
          validateDisabled.value = false;
        });
      }
    };
    const resetField = () => {
      clearValidate();
      validateDisabled.value = true;
      if ((formCtx == null ? void 0 : formCtx.model) && field.value) {
        getValueByPath.setValueByPath(formCtx.model, field.value, initialValue);
      }
      vue.nextTick(() => {
        validateDisabled.value = false;
      });
    };
    const formItemInfo = vue.reactive({
      field,
      disabled: computedDisabled,
      error: isError,
      validate: validateField,
      clearValidate,
      resetField,
      setField
    });
    vue.onMounted(() => {
      var _a;
      if (formItemInfo.field) {
        (_a = formCtx.addField) == null ? void 0 : _a.call(formCtx, formItemInfo);
      }
    });
    vue.onBeforeUnmount(() => {
      var _a;
      if (formItemInfo.field) {
        (_a = formCtx.removeField) == null ? void 0 : _a.call(formCtx, formItemInfo);
      }
    });
    const cls = vue.computed(() => [
      prefixCls,
      `${prefixCls}-layout-${formCtx.layout}`,
      {
        [`${prefixCls}-error`]: isError.value,
        [`${prefixCls}-status-${computedValidateStatus.value}`]: Boolean(
          computedValidateStatus.value
        )
      },
      props.rowClass
    ]);
    const labelColCls = vue.computed(() => [
      `${prefixCls}-label-col`,
      {
        [`${prefixCls}-label-col-left`]: formCtx.labelAlign === "left",
        [`${prefixCls}-label-col-flex`]: formCtx.autoLabelWidth || props.labelColFlex
      }
    ]);
    const wrapperColCls = vue.computed(() => [
      `${prefixCls}-wrapper-col`,
      {
        [`${prefixCls}-wrapper-col-flex`]: !mergedWrapperCol.value
      }
    ]);
    return {
      prefixCls,
      cls,
      isRequired,
      isError,
      finalMessage,
      mergedLabelCol,
      mergedWrapperCol,
      labelColCls,
      autoLabelWidth,
      layout,
      mergedLabelStyle,
      wrapperColCls,
      mergedWrapperStyle
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  const _component_FormItemLabel = vue.resolveComponent("FormItemLabel");
  const _component_ArcoCol = vue.resolveComponent("ArcoCol");
  const _component_FormItemMessage = vue.resolveComponent("FormItemMessage");
  const _component_ArcoRow = vue.resolveComponent("ArcoRow");
  return _ctx.noStyle ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : (vue.openBlock(), vue.createBlock(_component_ArcoRow, vue.mergeProps({
    key: 1,
    class: [
      _ctx.cls,
      {
        [`${_ctx.prefixCls}-has-help`]: Boolean((_a = _ctx.$slots.help) != null ? _a : _ctx.help)
      }
    ],
    wrap: !(_ctx.labelColFlex || _ctx.autoLabelWidth),
    div: _ctx.layout !== "horizontal" || _ctx.hideLabel
  }, _ctx.rowProps), {
    default: vue.withCtx(() => [
      !_ctx.hideLabel ? (vue.openBlock(), vue.createBlock(_component_ArcoCol, vue.mergeProps({
        key: 0,
        class: _ctx.labelColCls,
        style: _ctx.mergedLabelStyle
      }, _ctx.mergedLabelCol), {
        default: vue.withCtx(() => [
          vue.createVNode(_component_FormItemLabel, {
            required: _ctx.hideAsterisk ? false : _ctx.isRequired,
            "show-colon": _ctx.showColon,
            "asterisk-position": _ctx.asteriskPosition,
            component: _ctx.labelComponent,
            attrs: _ctx.labelAttrs,
            tooltip: _ctx.tooltip
          }, {
            default: vue.withCtx(() => [
              _ctx.$slots.label || _ctx.label ? vue.renderSlot(_ctx.$slots, "label", { key: 0 }, () => [
                vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
              ]) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["required", "show-colon", "asterisk-position", "component", "attrs", "tooltip"])
        ]),
        _: 3
      }, 16, ["class", "style"])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_ArcoCol, vue.mergeProps({
        class: _ctx.wrapperColCls,
        style: _ctx.mergedWrapperStyle
      }, _ctx.mergedWrapperCol), {
        default: vue.withCtx(() => [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-content-wrapper`)
          }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass([
                `${_ctx.prefixCls}-content`,
                {
                  [`${_ctx.prefixCls}-content-flex`]: _ctx.contentFlex
                },
                _ctx.contentClass
              ])
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2)
          ], 2),
          _ctx.isError || _ctx.$slots.help || _ctx.help ? (vue.openBlock(), vue.createBlock(_component_FormItemMessage, {
            key: 0,
            error: _ctx.finalMessage,
            help: _ctx.help
          }, vue.createSlots({ _: 2 }, [
            _ctx.$slots.help ? {
              name: "help",
              fn: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "help")
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["error", "help"])) : vue.createCommentVNode("v-if", true),
          _ctx.$slots.extra || _ctx.extra ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(`${_ctx.prefixCls}-extra`)
          }, [
            vue.renderSlot(_ctx.$slots, "extra", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.extra), 1)
            ])
          ], 2)) : vue.createCommentVNode("v-if", true)
        ]),
        _: 3
      }, 16, ["class", "style"])
    ]),
    _: 3
  }, 16, ["class", "wrap", "div"]));
}
var FormItem = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = FormItem;
