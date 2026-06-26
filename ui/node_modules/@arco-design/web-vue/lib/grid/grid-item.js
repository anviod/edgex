"use strict";
var vue = require("vue");
var useIndex = require("../_hooks/use-index.js");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var useResponsiveState = require("./hook/use-responsive-state.js");
var index = require("./utils/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "GridItem",
  props: {
    span: {
      type: [Number, Object],
      default: 1
    },
    offset: {
      type: [Number, Object],
      default: 0
    },
    suffix: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("grid-item");
    const domRef = vue.ref();
    const { computedIndex } = useIndex.useIndex({
      itemRef: domRef,
      selector: `.${prefixCls}`
    });
    const gridContext = vue.inject(context.GridContextInjectionKey, {
      overflow: false,
      displayIndexList: [],
      cols: 24,
      colGap: 0
    });
    const gridDataCollector = vue.inject(context.GridDataCollectorInjectionKey);
    const visible = vue.computed(
      () => {
        var _a;
        return (_a = gridContext == null ? void 0 : gridContext.displayIndexList) == null ? void 0 : _a.includes(computedIndex.value);
      }
    );
    const { span: propSpan, offset: propOffset } = vue.toRefs(props);
    const rSpan = useResponsiveState.useResponsiveState(propSpan, 1);
    const rOffset = useResponsiveState.useResponsiveState(propOffset, 0);
    const itemData = vue.computed(
      () => index.resolveItemData(gridContext.cols, {
        ...props,
        span: rSpan.value,
        offset: rOffset.value
      })
    );
    const classNames = vue.computed(() => [prefixCls]);
    const offsetStyle = vue.computed(() => {
      const { offset, span } = itemData.value;
      const { colGap } = gridContext;
      if (offset > 0) {
        const oneSpan = `(100% - ${colGap * (span - 1)}px) / ${span}`;
        return {
          "margin-left": `calc((${oneSpan} * ${offset}) + ${colGap * offset}px)`
        };
      }
      return {};
    });
    const columnStart = vue.computed(() => {
      const { suffix, span } = itemData.value;
      const { cols } = gridContext;
      if (suffix) {
        return `${cols - span + 1}`;
      }
      return `span ${span}`;
    });
    const style = vue.computed(() => {
      const { span } = itemData.value;
      if (domRef.value) {
        return [
          {
            "grid-column": `${columnStart.value} / span ${span}`
          },
          offsetStyle.value,
          !visible.value || span === 0 ? { display: "none" } : {}
        ];
      }
      return [];
    });
    vue.watchEffect(() => {
      if (computedIndex.value !== -1) {
        gridDataCollector == null ? void 0 : gridDataCollector.collectItemData(computedIndex.value, itemData.value);
      }
    });
    vue.onUnmounted(() => {
      if (computedIndex.value !== -1) {
        gridDataCollector == null ? void 0 : gridDataCollector.removeItemData(computedIndex.value);
      }
    });
    return {
      classNames,
      style,
      domRef,
      overflow: vue.computed(() => gridContext.overflow)
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    ref: "domRef",
    class: vue.normalizeClass(_ctx.classNames),
    style: vue.normalizeStyle(_ctx.style)
  }, [
    vue.renderSlot(_ctx.$slots, "default", { overflow: _ctx.overflow })
  ], 6);
}
var GridItem = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = GridItem;
