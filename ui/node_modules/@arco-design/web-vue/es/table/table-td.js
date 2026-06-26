import { defineComponent, computed, inject, ref, createVNode, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { getFixedCls, getStyle } from "./utils.js";
import { getValueByPath } from "../_utils/get-value-by-path.js";
import IconLoading from "../icon/icon-loading/index.js";
import { isObject, isFunction } from "../_utils/is.js";
import { tableInjectionKey } from "./context.js";
import AutoTooltip from "../_components/auto-tooltip/auto-tooltip.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var Td = defineComponent({
  name: "Td",
  props: {
    rowIndex: Number,
    record: {
      type: Object,
      default: () => ({})
    },
    column: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: "normal"
    },
    operations: {
      type: Array,
      default: () => []
    },
    dataColumns: {
      type: Array,
      default: () => []
    },
    colSpan: {
      type: Number,
      default: 1
    },
    rowSpan: {
      type: Number,
      default: 1
    },
    isFixedExpand: {
      type: Boolean,
      default: false
    },
    containerWidth: {
      type: Number
    },
    showExpandBtn: {
      type: Boolean,
      default: false
    },
    indentSize: {
      type: Number,
      default: 0
    },
    renderExpandBtn: {
      type: Function
    },
    summary: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = getPrefixCls("table");
    const tooltipProps = computed(() => {
      var _a;
      if (isObject((_a = props.column) == null ? void 0 : _a.tooltip)) {
        return props.column.tooltip;
      }
      return void 0;
    });
    const isSorted = computed(() => {
      var _a, _b;
      return ((_a = props.column) == null ? void 0 : _a.dataIndex) && ((_b = tableCtx.sorter) == null ? void 0 : _b.field) === props.column.dataIndex;
    });
    const resizing = computed(() => {
      var _a;
      return ((_a = props.column) == null ? void 0 : _a.dataIndex) && tableCtx.resizingColumn === props.column.dataIndex;
    });
    const getCustomClass = () => {
      var _a, _b, _c, _d, _e, _f;
      if (props.summary) {
        return isFunction((_a = props.column) == null ? void 0 : _a.summaryCellClass) ? props.column.summaryCellClass((_b = props.record) == null ? void 0 : _b.raw) : (_c = props.column) == null ? void 0 : _c.summaryCellClass;
      }
      return isFunction((_d = props.column) == null ? void 0 : _d.bodyCellClass) ? props.column.bodyCellClass((_e = props.record) == null ? void 0 : _e.raw) : (_f = props.column) == null ? void 0 : _f.bodyCellClass;
    };
    const cls = computed(() => {
      var _a;
      return [`${prefixCls}-td`, {
        [`${prefixCls}-col-sorted`]: isSorted.value,
        [`${prefixCls}-td-resizing`]: resizing.value
      }, ...getFixedCls(prefixCls, props.column), (_a = props.column) == null ? void 0 : _a.cellClass, getCustomClass()];
    });
    const getCustomStyle = () => {
      var _a, _b, _c, _d, _e, _f;
      if (props.summary) {
        return isFunction((_a = props.column) == null ? void 0 : _a.summaryCellStyle) ? props.column.summaryCellStyle((_b = props.record) == null ? void 0 : _b.raw) : (_c = props.column) == null ? void 0 : _c.summaryCellStyle;
      }
      return isFunction((_d = props.column) == null ? void 0 : _d.bodyCellStyle) ? props.column.bodyCellStyle((_e = props.record) == null ? void 0 : _e.raw) : (_f = props.column) == null ? void 0 : _f.bodyCellStyle;
    };
    const style = computed(() => {
      var _a;
      const style2 = getStyle(props.column, {
        dataColumns: props.dataColumns,
        operations: props.operations
      });
      const customStyle = getCustomStyle();
      return {
        ...style2,
        ...(_a = props.column) == null ? void 0 : _a.cellStyle,
        ...customStyle
      };
    });
    const cellStyle = computed(() => {
      if (props.isFixedExpand && props.containerWidth) {
        return {
          width: `${props.containerWidth}px`
        };
      }
      return void 0;
    });
    const tableCtx = inject(tableInjectionKey, {});
    const renderContent = () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (slots.default) {
        return slots.default();
      }
      const data = {
        record: (_a = props.record) == null ? void 0 : _a.raw,
        column: props.column,
        rowIndex: (_b = props.rowIndex) != null ? _b : -1
      };
      if (slots.cell) {
        return slots.cell(data);
      }
      if ((_c = props.column.slots) == null ? void 0 : _c.cell) {
        return props.column.slots.cell(data);
      }
      if (props.column.render) {
        return props.column.render(data);
      }
      if (props.column.slotName && ((_d = tableCtx.slots) == null ? void 0 : _d[props.column.slotName])) {
        return (_f = (_e = tableCtx.slots)[props.column.slotName]) == null ? void 0 : _f.call(_e, data);
      }
      return String((_h = getValueByPath((_g = props.record) == null ? void 0 : _g.raw, props.column.dataIndex)) != null ? _h : "");
    };
    const isLoading = ref(false);
    const handleClick = (ev) => {
      var _a, _b;
      if (isFunction(tableCtx.loadMore) && !((_a = props.record) == null ? void 0 : _a.isLeaf) && !((_b = props.record) == null ? void 0 : _b.children)) {
        isLoading.value = true;
        new Promise((resolve) => {
          var _a2;
          (_a2 = tableCtx.loadMore) == null ? void 0 : _a2.call(tableCtx, props.record.raw, resolve);
        }).then((children) => {
          var _a2;
          (_a2 = tableCtx.addLazyLoadData) == null ? void 0 : _a2.call(tableCtx, children, props.record);
          isLoading.value = false;
        });
      }
      ev.stopPropagation();
    };
    const renderCell = () => {
      var _a, _b, _c, _d, _e, _f;
      let _slot;
      return createVNode("span", {
        "class": [`${prefixCls}-cell`, `${prefixCls}-cell-align-${(_b = (_a = props.column) == null ? void 0 : _a.align) != null ? _b : "left"}`, {
          [`${prefixCls}-cell-fixed-expand`]: props.isFixedExpand,
          [`${prefixCls}-cell-expand-icon`]: props.showExpandBtn
        }],
        "style": cellStyle.value
      }, [props.indentSize > 0 && createVNode("span", {
        "style": {
          paddingLeft: `${props.indentSize}px`
        }
      }, null), props.showExpandBtn && createVNode("span", {
        "class": `${prefixCls}-cell-inline-icon`,
        "onClick": handleClick
      }, [isLoading.value ? createVNode(IconLoading, null, null) : (_c = props.renderExpandBtn) == null ? void 0 : _c.call(props, props.record, false)]), ((_d = props.column) == null ? void 0 : _d.ellipsis) && ((_e = props.column) == null ? void 0 : _e.tooltip) ? createVNode(AutoTooltip, {
        "class": `${prefixCls}-td-content`,
        "tooltipProps": tooltipProps.value
      }, _isSlot(_slot = renderContent()) ? _slot : {
        default: () => [_slot]
      }) : createVNode("span", {
        "class": [`${prefixCls}-td-content`, {
          [`${prefixCls}-text-ellipsis`]: (_f = props.column) == null ? void 0 : _f.ellipsis
        }]
      }, [renderContent()])]);
    };
    return () => {
      var _a, _b, _c, _d;
      return createVNode((_d = (_c = slots.td) == null ? void 0 : _c.call(slots, {
        record: (_a = props.record) == null ? void 0 : _a.raw,
        column: props.column,
        rowIndex: (_b = props.rowIndex) != null ? _b : -1
      })[0]) != null ? _d : "td", {
        class: cls.value,
        style: style.value,
        rowspan: props.rowSpan > 1 ? props.rowSpan : void 0,
        colspan: props.colSpan > 1 ? props.colSpan : void 0
      }, {
        default: () => [renderCell()]
      });
    };
  }
});
export { Td as default };
