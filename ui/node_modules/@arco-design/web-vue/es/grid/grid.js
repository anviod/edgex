import { defineComponent, toRefs, computed, reactive, watchEffect, provide, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { GridContextInjectionKey, GridDataCollectorInjectionKey } from "./context.js";
import { useResponsiveState } from "./hook/use-responsive-state.js";
import { setItemVisible } from "./utils/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
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
    } = toRefs(props);
    const cols = useResponsiveState(propCols, 24);
    const colGap = useResponsiveState(propColGap, 0);
    const rowGap = useResponsiveState(propRowGap, 0);
    const prefixCls = getPrefixCls("grid");
    const classNames = computed(() => [prefixCls]);
    const style = computed(() => [
      {
        "gap": `${rowGap.value}px ${colGap.value}px`,
        "grid-template-columns": `repeat(${cols.value}, minmax(0px, 1fr))`
      }
    ]);
    const itemDataMap = reactive(/* @__PURE__ */ new Map());
    const itemDataList = computed(() => {
      const list = [];
      for (const [index, itemData] of itemDataMap.entries()) {
        list[index] = itemData;
      }
      return list;
    });
    const gridContext = reactive({
      overflow: false,
      displayIndexList: [],
      cols: cols.value,
      colGap: colGap.value
    });
    watchEffect(() => {
      gridContext.cols = cols.value;
      gridContext.colGap = colGap.value;
    });
    watchEffect(() => {
      const displayInfo = setItemVisible({
        cols: cols.value,
        collapsed: collapsed.value,
        collapsedRows: collapsedRows.value,
        itemDataList: itemDataList.value
      });
      gridContext.overflow = displayInfo.overflow;
      gridContext.displayIndexList = displayInfo.displayIndexList;
    });
    provide(GridContextInjectionKey, gridContext);
    provide(GridDataCollectorInjectionKey, {
      collectItemData(index, itemData) {
        itemDataMap.set(index, itemData);
      },
      removeItemData(index) {
        itemDataMap.delete(index);
      }
    });
    return {
      classNames,
      style
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.classNames),
    style: normalizeStyle(_ctx.style)
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 6);
}
var _Grid = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Grid as default };
