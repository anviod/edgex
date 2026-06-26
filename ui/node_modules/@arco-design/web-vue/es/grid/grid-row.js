import { defineComponent, toRefs, computed, provide, reactive, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { RowContextInjectionKey } from "./context.js";
import { useResponsiveState } from "./hook/use-responsive-state.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Row",
  props: {
    gutter: {
      type: [Number, Object, Array],
      default: 0
    },
    justify: {
      type: String,
      default: "start"
    },
    align: {
      type: String,
      default: "start"
    },
    div: {
      type: Boolean
    },
    wrap: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const { gutter, align, justify, div, wrap } = toRefs(props);
    const prefixCls = getPrefixCls("row");
    const classNames = computed(() => {
      return {
        [`${prefixCls}`]: !div.value,
        [`${prefixCls}-nowrap`]: !wrap.value,
        [`${prefixCls}-align-${align.value}`]: align.value,
        [`${prefixCls}-justify-${justify.value}`]: justify.value
      };
    });
    const propGutterHorizontal = computed(
      () => Array.isArray(gutter.value) ? gutter.value[0] : gutter.value
    );
    const propGutterVertical = computed(
      () => Array.isArray(gutter.value) ? gutter.value[1] : 0
    );
    const gutterHorizontal = useResponsiveState(propGutterHorizontal, 0);
    const gutterVertical = useResponsiveState(propGutterVertical, 0);
    const styles = computed(() => {
      const result = {};
      if ((gutterHorizontal.value || gutterVertical.value) && !div.value) {
        const marginHorizontal = -gutterHorizontal.value / 2;
        const marginVertical = -gutterVertical.value / 2;
        if (marginHorizontal) {
          result.marginLeft = `${marginHorizontal}px`;
          result.marginRight = `${marginHorizontal}px`;
        }
        if (marginVertical) {
          result.marginTop = `${marginVertical}px`;
          result.marginBottom = `${marginVertical}px`;
        }
      }
      return result;
    });
    const resultGutter = computed(() => [
      gutterHorizontal.value,
      gutterVertical.value
    ]);
    provide(
      RowContextInjectionKey,
      reactive({
        gutter: resultGutter,
        div
      })
    );
    return {
      classNames,
      styles
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames),
    style: normalizeStyle(_ctx.styles)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6);
}
var Row = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Row as default };
