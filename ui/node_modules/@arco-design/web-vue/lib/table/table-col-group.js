"use strict";
var vue = require("vue");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
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
  return vue.openBlock(), vue.createElementBlock("colgroup", null, [
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.operations, (item) => {
      return vue.openBlock(), vue.createElementBlock("col", {
        key: `arco-col-${item.name}`,
        class: vue.normalizeClass(`arco-table-${item.name}-col`),
        style: vue.normalizeStyle(_ctx.fixedWidth(item.width))
      }, null, 6);
    }), 128)),
    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.dataColumns, (item) => {
      return vue.openBlock(), vue.createElementBlock("col", {
        key: `arco-col-${item.dataIndex}`,
        style: vue.normalizeStyle(
          _ctx.fixedWidth(
            _ctx.columnWidth && item.dataIndex && _ctx.columnWidth[item.dataIndex] || item.width,
            item.minWidth
          )
        )
      }, null, 4);
    }), 128))
  ]);
}
var ColGroup = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = ColGroup;
