import { defineComponent, inject, computed, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot, createCommentVNode } from "vue";
import { isNumber, isObject, isString } from "../_utils/is.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { RowContextInjectionKey } from "./context.js";
import { useResponsiveState } from "./hook/use-responsive-state.js";
import { useResponsiveValue } from "./hook/use-responsive-value.js";
import pick from "../_utils/pick.js";
import { responsiveArray } from "../_utils/responsive-observe.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
function getAllowableFlexValue(flexValue) {
  if (isString(flexValue) && (["initial", "auto", "none"].includes(flexValue) || /^\d+$/.test(flexValue)) || isNumber(flexValue)) {
    return flexValue;
  }
  if (isString(flexValue) && /^\d+(px|em|rem|%)$/.test(flexValue)) {
    return `0 0 ${flexValue}`;
  }
  return void 0;
}
const _sfc_main = defineComponent({
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
    const prefixCls = getPrefixCls("col");
    const rowContext = inject(RowContextInjectionKey, {});
    const flexValue = computed(() => getAllowableFlexValue(props.flex));
    const mergeClassName = computed(() => {
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
        if (screenValue && isNumber(screenValue)) {
          result[`${prefixCls}-${screen}-${screenValue}`] = true;
        } else if (screenValue && isObject(screenValue)) {
          result[`${prefixCls}-${screen}-${screenValue.span}`] = screenValue.span;
          result[`${prefixCls}-${screen}-offset-${screenValue.offset}`] = screenValue.offset;
          result[`${prefixCls}-${screen}-order-${screenValue.order}`] = screenValue.order;
        }
      });
      return result;
    });
    const classNames = computed(() => {
      return flexValue.value ? prefixCls : mergeClassName.value;
    });
    const paddingStyles = computed(() => {
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
    const flexStyles = computed(
      () => flexValue.value ? { flex: flexValue.value } : {}
    );
    const responsiveConfig = computed(() => pick(props, responsiveArray));
    const propSpan = useResponsiveValue(
      computed(() => ({
        val: props.span,
        key: "span",
        ...responsiveConfig.value
      }))
    );
    const span = useResponsiveState(propSpan, 24, true);
    return {
      visible: computed(() => !!span.value),
      classNames,
      styles: computed(() => ({ ...paddingStyles.value, ...flexStyles.value }))
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.visible ? (openBlock(), createElementBlock("div", {
    key: 0,
    class: normalizeClass(_ctx.classNames),
    style: normalizeStyle(_ctx.styles)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6)) : createCommentVNode("v-if", true);
}
var Col = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Col as default };
