"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var useResponsiveState = require("./hook/use-responsive-state.js");
var index = require("./utils/index.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Grid",
  props: {
    cols: {
      type: [Number, Object],
      default: 24
    },
    rowGap: {
      type: [Number, Object],
      default: 0
    },
    colGap: {
      type: [Number, Object],
      default: 0
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    collapsedRows: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
    const {
      cols: propCols,
      rowGap: propRowGap,
      colGap: propColGap,
      collapsedRows,
      collapsed
    } = vue.toRefs(props);
    const cols = useResponsiveState.useResponsiveState(propCols, 24);
    const colGap = useResponsiveState.useResponsiveState(propColGap, 0);
    const rowGap = useResponsiveState.useResponsiveState(propRowGap, 0);
    const prefixCls = globalConfig.getPrefixCls("grid");
    const classNames = vue.computed(() => [prefixCls]);
    const style = vue.computed(() => [
      {
        "gap": `${rowGap.value}px ${colGap.value}px`,
        "grid-template-columns": `repeat(${cols.value}, minmax(0px, 1fr))`
      }
    ]);
    const itemDataMap = vue.reactive(/* @__PURE__ */ new Map());
    const itemDataList = vue.computed(() => {
      const list = [];
      for (const [index2, itemData] of itemDataMap.entries()) {
        list[index2] = itemData;
      }
      return list;
    });
    const gridContext = vue.reactive({
      overflow: false,
      displayIndexList: [],
      cols: cols.value,
      colGap: colGap.value
    });
    vue.watchEffect(() => {
      gridContext.cols = cols.value;
      gridContext.colGap = colGap.value;
    });
    vue.watchEffect(() => {
      const displayInfo = index.setItemVisible({
        cols: cols.value,
        collapsed: collapsed.value,
        collapsedRows: collapsedRows.value,
        itemDataList: itemDataList.value
      });
      gridContext.overflow = displayInfo.overflow;
      gridContext.displayIndexList = displayInfo.displayIndexList;
    });
    vue.provide(context.GridContextInjectionKey, gridContext);
    vue.provide(context.GridDataCollectorInjectionKey, {
      collectItemData(index2, itemData) {
        itemDataMap.set(index2, itemData);
      },
      removeItemData(index2) {
        itemDataMap.delete(index2);
      }
    });
    return {
      classNames,
      style
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.classNames),
    style: vue.normalizeStyle(_ctx.style)
  }, [
    vue.renderSlot(_ctx.$slots, "default")
  ], 6);
}
var _Grid = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Grid;
