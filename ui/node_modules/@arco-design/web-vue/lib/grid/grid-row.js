"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var useResponsiveState = require("./hook/use-responsive-state.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
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
    const { gutter, align, justify, div, wrap } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("row");
    const classNames = vue.computed(() => {
      return {
        [`${prefixCls}`]: !div.value,
        [`${prefixCls}-nowrap`]: !wrap.value,
        [`${prefixCls}-align-${align.value}`]: align.value,
        [`${prefixCls}-justify-${justify.value}`]: justify.value
      };
    });
    const propGutterHorizontal = vue.computed(
      () => Array.isArray(gutter.value) ? gutter.value[0] : gutter.value
    );
    const propGutterVertical = vue.computed(
      () => Array.isArray(gutter.value) ? gutter.value[1] : 0
    );
    const gutterHorizontal = useResponsiveState.useResponsiveState(propGutterHorizontal, 0);
    const gutterVertical = useResponsiveState.useResponsiveState(propGutterVertical, 0);
    const styles = vue.computed(() => {
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
    const resultGutter = vue.computed(() => [
      gutterHorizontal.value,
      gutterVertical.value
    ]);
    vue.provide(
      context.RowContextInjectionKey,
      vue.reactive({
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
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames),
    style: vue.normalizeStyle(_ctx.styles)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 6);
}
var Row = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Row;
