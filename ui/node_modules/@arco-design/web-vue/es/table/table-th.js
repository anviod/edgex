import { defineComponent, toRefs, inject, computed, createVNode, mergeProps, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Checkbox from "../checkbox/index.js";
import Radio from "../radio/index.js";
import Button from "../button/index.js";
import Trigger from "../trigger/index.js";
import IconCaretDown from "../icon/icon-caret-down/index.js";
import IconCaretUp from "../icon/icon-caret-up/index.js";
import IconFilter from "../icon/icon-filter/index.js";
import { useColumnSorter } from "./hooks/use-column-sorter.js";
import { useColumnFilter } from "./hooks/use-column-filter.js";
import { useI18n } from "../locale/index.js";
import { getStyle, getFixedCls } from "./utils.js";
import { isObject, isBoolean, isFunction } from "../_utils/is.js";
import IconHover from "../_components/icon-hover.js";
import { tableInjectionKey } from "./context.js";
import AutoTooltip from "../_components/auto-tooltip/auto-tooltip.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var Th = defineComponent({
  name: "Th",
  props: {
    column: {
      type: Object,
      default: () => ({})
    },
    operations: {
      type: Array,
      default: () => []
    },
    dataColumns: {
      type: Array,
      default: () => []
    },
    resizable: Boolean
  },
  setup(props, {
    slots
  }) {
    const {
      column
    } = toRefs(props);
    const prefixCls = getPrefixCls("table");
    const {
      t
    } = useI18n();
    const tableCtx = inject(tableInjectionKey, {});
    const resizing = computed(() => {
      var _a;
      return ((_a = props.column) == null ? void 0 : _a.dataIndex) && tableCtx.resizingColumn === props.column.dataIndex;
    });
    const tooltipProps = computed(() => {
      var _a;
      if (isObject((_a = props.column) == null ? void 0 : _a.tooltip)) {
        return props.column.tooltip;
      }
      return void 0;
    });
    const filterIconAlignLeft = computed(() => {
      var _a;
      if (((_a = props.column) == null ? void 0 : _a.filterable) && isBoolean(props.column.filterable.alignLeft)) {
        return props.column.filterable.alignLeft;
      }
      return tableCtx.filterIconAlignLeft;
    });
    const {
      sortOrder,
      hasSorter,
      hasAscendBtn,
      hasDescendBtn,
      nextSortOrder,
      handleClickSorter
    } = useColumnSorter({
      column,
      tableCtx
    });
    const {
      filterPopupVisible,
      isFilterActive,
      isMultipleFilter,
      columnFilterValue,
      handleFilterPopupVisibleChange,
      setFilterValue,
      handleCheckboxFilterChange,
      handleRadioFilterChange,
      handleFilterConfirm,
      handleFilterReset
    } = useColumnFilter({
      column,
      tableCtx
    });
    const renderFilterContent = () => {
      var _a, _b, _c, _d, _e;
      let _slot, _slot2;
      const {
        filterable
      } = props.column;
      if ((_a = props.column.slots) == null ? void 0 : _a["filter-content"]) {
        return (_b = props.column.slots) == null ? void 0 : _b["filter-content"]({
          filterValue: columnFilterValue.value,
          setFilterValue,
          handleFilterConfirm,
          handleFilterReset
        });
      }
      if (filterable == null ? void 0 : filterable.slotName) {
        return (_d = (_c = tableCtx == null ? void 0 : tableCtx.slots) == null ? void 0 : _c[filterable == null ? void 0 : filterable.slotName]) == null ? void 0 : _d.call(_c, {
          filterValue: columnFilterValue.value,
          setFilterValue,
          handleFilterConfirm,
          handleFilterReset
        });
      }
      if (filterable == null ? void 0 : filterable.renderContent) {
        return filterable.renderContent({
          filterValue: columnFilterValue.value,
          setFilterValue,
          handleFilterConfirm,
          handleFilterReset
        });
      }
      return createVNode("div", {
        "class": `${prefixCls}-filters-content`
      }, [createVNode("ul", {
        "class": `${prefixCls}-filters-list`
      }, [(_e = filterable == null ? void 0 : filterable.filters) == null ? void 0 : _e.map((item, index) => {
        var _a2;
        return createVNode("li", {
          "class": `${prefixCls}-filters-item`,
          "key": index
        }, [isMultipleFilter.value ? createVNode(Checkbox, {
          "value": item.value,
          "modelValue": columnFilterValue.value,
          "uninjectGroupContext": true,
          "onChange": handleCheckboxFilterChange
        }, {
          default: () => [item.text]
        }) : createVNode(Radio, {
          "value": item.value,
          "modelValue": (_a2 = columnFilterValue.value[0]) != null ? _a2 : "",
          "uninjectGroupContext": true,
          "onChange": handleRadioFilterChange
        }, {
          default: () => [item.text]
        })]);
      })]), createVNode("div", {
        "class": `${prefixCls}-filters-bottom`
      }, [createVNode(Button, {
        "size": "mini",
        "onClick": handleFilterReset
      }, _isSlot(_slot = t("table.resetText")) ? _slot : {
        default: () => [_slot]
      }), createVNode(Button, {
        "type": "primary",
        "size": "mini",
        "onClick": handleFilterConfirm
      }, _isSlot(_slot2 = t("table.okText")) ? _slot2 : {
        default: () => [_slot2]
      })])]);
    };
    const renderFilter = () => {
      const {
        filterable
      } = props.column;
      if (!filterable) {
        return null;
      }
      return createVNode(Trigger, mergeProps({
        "popupVisible": filterPopupVisible.value,
        "trigger": "click",
        "autoFitPosition": true,
        "popupOffset": filterIconAlignLeft.value ? 4 : 0,
        "onPopupVisibleChange": handleFilterPopupVisibleChange
      }, filterable.triggerProps), {
        default: () => [createVNode(IconHover, {
          "class": [`${prefixCls}-filters`, {
            [`${prefixCls}-filters-active`]: isFilterActive.value,
            [`${prefixCls}-filters-open`]: filterPopupVisible.value,
            [`${prefixCls}-filters-align-left`]: filterIconAlignLeft.value
          }],
          "disabled": !filterIconAlignLeft.value,
          "onClick": (ev) => ev.stopPropagation()
        }, {
          default: () => {
            var _a, _b, _c, _d, _e;
            return [(_e = (_d = (_b = (_a = props.column.slots) == null ? void 0 : _a["filter-icon"]) == null ? void 0 : _b.call(_a)) != null ? _d : (_c = filterable.icon) == null ? void 0 : _c.call(filterable)) != null ? _e : createVNode(IconFilter, null, null)];
          }
        })],
        content: renderFilterContent
      });
    };
    const cellCls = computed(() => {
      var _a, _b;
      const cls2 = [`${prefixCls}-cell`, `${prefixCls}-cell-align-${(_b = (_a = props.column) == null ? void 0 : _a.align) != null ? _b : props.column.children ? "center" : "left"}`];
      if (hasSorter.value) {
        cls2.push(`${prefixCls}-cell-with-sorter`, {
          [`${prefixCls}-cell-next-ascend`]: nextSortOrder.value === "ascend",
          [`${prefixCls}-cell-next-descend`]: nextSortOrder.value === "descend"
        });
      }
      if (filterIconAlignLeft.value) {
        cls2.push(`${prefixCls}-cell-with-filter`);
      }
      return cls2;
    });
    const renderTitle = () => {
      var _a, _b, _c, _d, _e, _f;
      if (slots.default) {
        return slots.default();
      }
      if (((_a = props.column) == null ? void 0 : _a.titleSlotName) && ((_b = tableCtx.slots) == null ? void 0 : _b[props.column.titleSlotName])) {
        return (_d = (_c = tableCtx.slots)[props.column.titleSlotName]) == null ? void 0 : _d.call(_c, {
          column: props.column
        });
      }
      if ((_f = (_e = props.column) == null ? void 0 : _e.slots) == null ? void 0 : _f.title) {
        return props.column.slots.title();
      }
      if (isFunction(props.column.title)) {
        return props.column.title();
      }
      return props.column.title;
    };
    const renderCell = () => {
      var _a, _b, _c;
      let _slot3;
      return createVNode("span", {
        "class": cellCls.value,
        "onClick": hasSorter.value ? handleClickSorter : void 0
      }, [((_a = props.column) == null ? void 0 : _a.ellipsis) && ((_b = props.column) == null ? void 0 : _b.tooltip) ? createVNode(AutoTooltip, {
        "class": `${prefixCls}-th-title`,
        "tooltipProps": tooltipProps.value
      }, _isSlot(_slot3 = renderTitle()) ? _slot3 : {
        default: () => [_slot3]
      }) : createVNode("span", {
        "class": [`${prefixCls}-th-title`, {
          [`${prefixCls}-text-ellipsis`]: (_c = props.column) == null ? void 0 : _c.ellipsis
        }]
      }, [renderTitle()]), hasSorter.value && createVNode("span", {
        "class": `${prefixCls}-sorter`
      }, [hasAscendBtn.value && createVNode("div", {
        "class": [`${prefixCls}-sorter-icon`, {
          [`${prefixCls}-sorter-icon-active`]: sortOrder.value === "ascend"
        }]
      }, [createVNode(IconCaretUp, null, null)]), hasDescendBtn.value && createVNode("div", {
        "class": [`${prefixCls}-sorter-icon`, {
          [`${prefixCls}-sorter-icon-active`]: sortOrder.value === "descend"
        }]
      }, [createVNode(IconCaretDown, null, null)])]), filterIconAlignLeft.value && renderFilter()]);
    };
    const style = computed(() => {
      var _a, _b;
      return {
        ...getStyle(props.column, {
          dataColumns: props.dataColumns,
          operations: props.operations
        }),
        ...(_a = props.column) == null ? void 0 : _a.cellStyle,
        ...(_b = props.column) == null ? void 0 : _b.headerCellStyle
      };
    });
    const cls = computed(() => {
      var _a, _b;
      return [`${prefixCls}-th`, {
        [`${prefixCls}-col-sorted`]: Boolean(sortOrder.value),
        [`${prefixCls}-th-resizing`]: resizing.value
      }, ...getFixedCls(prefixCls, props.column), (_a = props.column) == null ? void 0 : _a.cellClass, (_b = props.column) == null ? void 0 : _b.headerCellClass];
    });
    const handleMouseDown = (ev) => {
      var _a, _b, _c;
      if ((_a = props.column) == null ? void 0 : _a.dataIndex) {
        (_c = tableCtx.onThMouseDown) == null ? void 0 : _c.call(tableCtx, (_b = props.column) == null ? void 0 : _b.dataIndex, ev);
      }
    };
    return () => {
      var _a, _b, _c, _d;
      const colSpan = (_a = props.column.colSpan) != null ? _a : 1;
      const rowSpan = (_b = props.column.rowSpan) != null ? _b : 1;
      return createVNode((_d = (_c = slots.th) == null ? void 0 : _c.call(slots, {
        column: props.column
      })[0]) != null ? _d : "th", {
        class: cls.value,
        style: style.value,
        colspan: colSpan > 1 ? colSpan : void 0,
        rowspan: rowSpan > 1 ? rowSpan : void 0
      }, {
        default: () => [renderCell(), !filterIconAlignLeft.value && renderFilter(), props.resizable && createVNode("span", {
          "class": `${prefixCls}-column-handle`,
          "onMousedown": handleMouseDown
        }, null)]
      });
    };
  }
});
export { Th as default };
