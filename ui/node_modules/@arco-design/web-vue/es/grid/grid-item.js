import { defineComponent, ref, inject, computed, toRefs, watchEffect, onUnmounted, openBlock, createElementBlock, normalizeClass, normalizeStyle, renderSlot } from "vue";
import { useIndex } from "../_hooks/use-index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { GridContextInjectionKey, GridDataCollectorInjectionKey } from "./context.js";
import { useResponsiveState } from "./hook/use-responsive-state.js";
import { resolveItemData } from "./utils/index.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
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
    const prefixCls = getPrefixCls("grid-item");
    const domRef = ref();
    const { computedIndex } = useIndex({
      itemRef: domRef,
      selector: `.${prefixCls}`
    });
    const gridContext = inject(GridContextInjectionKey, {
      overflow: false,
      displayIndexList: [],
      cols: 24,
      colGap: 0
    });
    const gridDataCollector = inject(GridDataCollectorInjectionKey);
    const visible = computed(
      () => {
        var _a;
        return (_a = gridContext == null ? void 0 : gridContext.displayIndexList) == null ? void 0 : _a.includes(computedIndex.value);
      }
    );
    const { span: propSpan, offset: propOffset } = toRefs(props);
    const rSpan = useResponsiveState(propSpan, 1);
    const rOffset = useResponsiveState(propOffset, 0);
    const itemData = computed(
      () => resolveItemData(gridContext.cols, {
        ...props,
        span: rSpan.value,
        offset: rOffset.value
      })
    );
    const classNames = computed(() => [prefixCls]);
    const offsetStyle = computed(() => {
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
    const columnStart = computed(() => {
      const { suffix, span } = itemData.value;
      const { cols } = gridContext;
      if (suffix) {
        return `${cols - span + 1}`;
      }
      return `span ${span}`;
    });
    const style = computed(() => {
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
    watchEffect(() => {
      if (computedIndex.value !== -1) {
        gridDataCollector == null ? void 0 : gridDataCollector.collectItemData(computedIndex.value, itemData.value);
      }
    });
    onUnmounted(() => {
      if (computedIndex.value !== -1) {
        gridDataCollector == null ? void 0 : gridDataCollector.removeItemData(computedIndex.value);
      }
    });
    return {
      classNames,
      style,
      domRef,
      overflow: computed(() => gridContext.overflow)
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    ref: "domRef",
    class: normalizeClass(_ctx.classNames),
    style: normalizeStyle(_ctx.style)
  }, [
    renderSlot(_ctx.$slots, "default", { overflow: _ctx.overflow })
  ], 6);
}
var GridItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { GridItem as default };
