"use strict";
var vue = require("vue");
var is = require("../_utils/is.js");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var useResponsiveState = require("./hook/use-responsive-state.js");
var useResponsiveValue = require("./hook/use-responsive-value.js");
var pick = require("../_utils/pick.js");
var responsiveObserve = require("../_utils/responsive-observe.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function getAllowableFlexValue(flexValue) {
  if (is.isString(flexValue) && (["initial", "auto", "none"].includes(flexValue) || /^\d+$/.test(flexValue)) || is.isNumber(flexValue)) {
    return flexValue;
  }
  if (is.isString(flexValue) && /^\d+(px|em|rem|%)$/.test(flexValue)) {
    return `0 0 ${flexValue}`;
  }
  return void 0;
}
const _sfc_main = vue.defineComponent({
  name: "Col",
  props: {
    span: {
      type: Number,
      default: 24
    },
    offset: {
      type: Number
    },
    order: {
      type: Number
    },
    xs: {
      type: [Number, Object]
    },
    sm: {
      type: [Number, Object]
    },
    md: {
      type: [Number, Object]
    },
    lg: {
      type: [Number, Object]
    },
    xl: {
      type: [Number, Object]
    },
    xxl: {
      type: [Number, Object]
    },
    flex: {
      type: [Number, String]
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("col");
    const rowContext = vue.inject(context.RowContextInjectionKey, {});
    const flexValue = vue.computed(() => getAllowableFlexValue(props.flex));
    const mergeClassName = vue.computed(() => {
      const { div } = rowContext;
      const { span: span2, offset, order, xs, sm, md, lg, xl, xxl } = props;
      const result = {
        [`${prefixCls}`]: !div,
        [`${prefixCls}-order-${order}`]: order,
        [`${prefixCls}-${span2}`]: !div && !xs && !sm && !md && !lg && !xl && !xxl,
        [`${prefixCls}-offset-${offset}`]: offset && offset > 0
      };
      const screenList = { xs, sm, md, lg, xl, xxl };
      Object.keys(screenList).forEach((screen) => {
        const screenValue = screenList[screen];
        if (screenValue && is.isNumber(screenValue)) {
          result[`${prefixCls}-${screen}-${screenValue}`] = true;
        } else if (screenValue && is.isObject(screenValue)) {
          result[`${prefixCls}-${screen}-${screenValue.span}`] = screenValue.span;
          result[`${prefixCls}-${screen}-offset-${screenValue.offset}`] = screenValue.offset;
          result[`${prefixCls}-${screen}-order-${screenValue.order}`] = screenValue.order;
        }
      });
      return result;
    });
    const classNames = vue.computed(() => {
      return flexValue.value ? prefixCls : mergeClassName.value;
    });
    const paddingStyles = vue.computed(() => {
      const { gutter, div } = rowContext;
      const result = {};
      if (Array.isArray(gutter) && !div) {
        const paddingHorizontal = gutter[0] && gutter[0] / 2 || 0;
        const paddingVertical = gutter[1] && gutter[1] / 2 || 0;
        if (paddingHorizontal) {
          result.paddingLeft = `${paddingHorizontal}px`;
          result.paddingRight = `${paddingHorizontal}px`;
        }
        if (paddingVertical) {
          result.paddingTop = `${paddingVertical}px`;
          result.paddingBottom = `${paddingVertical}px`;
        }
      }
      return result;
    });
    const flexStyles = vue.computed(
      () => flexValue.value ? { flex: flexValue.value } : {}
    );
    const responsiveConfig = vue.computed(() => pick(props, responsiveObserve.responsiveArray));
    const propSpan = useResponsiveValue.useResponsiveValue(
      vue.computed(() => ({
        val: props.span,
        key: "span",
        ...responsiveConfig.value
      }))
    );
    const span = useResponsiveState.useResponsiveState(propSpan, 24, true);
    return {
      visible: vue.computed(() => !!span.value),
      classNames,
      styles: vue.computed(() => ({ ...paddingStyles.value, ...flexStyles.value }))
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.visible ? (vue.openBlock(), vue.createElementBlock("div", {
    key: 0,
    class: vue.normalizeClass(_ctx.classNames),
    style: vue.normalizeStyle(_ctx.styles)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 6)) : vue.createCommentVNode("v-if", true);
}
var Col = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Col;
