import { defineComponent, openBlock, createElementBlock, Fragment, renderList, normalizeClass, normalizeStyle } from "vue";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "ColGroup",
  props: {
    dataColumns: {
      type: Array,
      required: true
    },
    operations: {
      type: Array,
      required: true
    },
    columnWidth: {
      type: Object
    }
  },
  setup() {
    const fixedWidth = (width, minWidth) => {
      if (width) {
        const min = Math.max(width, minWidth || 0);
        return {
          width: `${width}px`,
          minWidth: `${min}px`,
          maxWidth: `${width}px`
        };
      }
      if (minWidth) {
        return { minWidth: `${minWidth}px` };
      }
      return void 0;
    };
    return {
      fixedWidth
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("colgroup", null, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.operations, (item) => {
      return openBlock(), createElementBlock("col", {
        key: `arco-col-${item.name}`,
        class: normalizeClass(`arco-table-${item.name}-col`),
        style: normalizeStyle(_ctx.fixedWidth(item.width))
      }, null, 6);
    }), 128)),
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.dataColumns, (item) => {
      return openBlock(), createElementBlock("col", {
        key: `arco-col-${item.dataIndex}`,
        style: normalizeStyle(
          _ctx.fixedWidth(
            _ctx.columnWidth && item.dataIndex && _ctx.columnWidth[item.dataIndex] || item.width,
            item.minWidth
          )
        )
      }, null, 4);
    }), 128))
  ]);
}
var ColGroup = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { ColGroup as default };
