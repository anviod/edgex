"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index$5 = require("../checkbox/index.js");
var index$6 = require("../radio/index.js");
var index$7 = require("../button/index.js");
var index$1 = require("../trigger/index.js");
var index$4 = require("../icon/icon-caret-down/index.js");
var index$3 = require("../icon/icon-caret-up/index.js");
var index$2 = require("../icon/icon-filter/index.js");
var useColumnSorter = require("./hooks/use-column-sorter.js");
var useColumnFilter = require("./hooks/use-column-filter.js");
var index = require("../locale/index.js");
var utils = require("./utils.js");
var is = require("../_utils/is.js");
var iconHover = require("../_components/icon-hover.js");
var context = require("./context.js");
var autoTooltip = require("../_components/auto-tooltip/auto-tooltip.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var Th = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("table");
    const {
      t
    } = index.useI18n();
    const tableCtx = vue.inject(context.tableInjectionKey, {});
    const resizing = vue.computed(() => {
      var _a;
      return ((_a = props.column) == null ? void 0 : _a.dataIndex) && tableCtx.resizingColumn === props.column.dataIndex;
    });
    const tooltipProps = vue.computed(() => {
      var _a;
      if (is.isObject((_a = props.column) == null ? void 0 : _a.tooltip)) {
        return props.column.tooltip;
      }
      return void 0;
    });
    const filterIconAlignLeft = vue.computed(() => {
      var _a;
      if (((_a = props.column) == null ? void 0 : _a.filterable) && is.isBoolean(props.column.filterable.alignLeft)) {
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
    } = useColumnSorter.useColumnSorter({
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
    } = useColumnFilter.useColumnFilter({
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
      return vue.createVNode("div", {
        "class": `${prefixCls}-filters-content`
      }, [vue.createVNode("ul", {
        "class": `${prefixCls}-filters-list`
      }, [(_e = filterable == null ? void 0 : filterable.filters) == null ? void 0 : _e.map((item, index2) => {
        var _a2;
        return vue.createVNode("li", {
          "class": `${prefixCls}-filters-item`,
          "key": index2
        }, [isMultipleFilter.value ? vue.createVNode(index$5["default"], {
          "value": item.value,
          "modelValue": columnFilterValue.value,
          "uninjectGroupContext": true,
          "onChange": handleCheckboxFilterChange
        }, {
          default: () => [item.text]
        }) : vue.createVNode(index$6["default"], {
          "value": item.value,
          "modelValue": (_a2 = columnFilterValue.value[0]) != null ? _a2 : "",
          "uninjectGroupContext": true,
          "onChange": handleRadioFilterChange
        }, {
          default: () => [item.text]
        })]);
      })]), vue.createVNode("div", {
        "class": `${prefixCls}-filters-bottom`
      }, [vue.createVNode(index$7["default"], {
        "size": "mini",
        "onClick": handleFilterReset
      }, _isSlot(_slot = t("table.resetText")) ? _slot : {
        default: () => [_slot]
      }), vue.createVNode(index$7["default"], {
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
      return vue.createVNode(index$1, vue.mergeProps({
        "popupVisible": filterPopupVisible.value,
        "trigger": "click",
        "autoFitPosition": true,
        "popupOffset": filterIconAlignLeft.value ? 4 : 0,
        "onPopupVisibleChange": handleFilterPopupVisibleChange
      }, filterable.triggerProps), {
        default: () => [vue.createVNode(iconHover, {
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
            return [(_e = (_d = (_b = (_a = props.column.slots) == null ? void 0 : _a["filter-icon"]) == null ? void 0 : _b.call(_a)) != null ? _d : (_c = filterable.icon) == null ? void 0 : _c.call(filterable)) != null ? _e : vue.createVNode(index$2, null, null)];
          }
        })],
        content: renderFilterContent
      });
    };
    const cellCls = vue.computed(() => {
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
      if (is.isFunction(props.column.title)) {
        return props.column.title();
      }
      return props.column.title;
    };
    const renderCell = () => {
      var _a, _b, _c;
      let _slot3;
      return vue.createVNode("span", {
        "class": cellCls.value,
        "onClick": hasSorter.value ? handleClickSorter : void 0
      }, [((_a = props.column) == null ? void 0 : _a.ellipsis) && ((_b = props.column) == null ? void 0 : _b.tooltip) ? vue.createVNode(autoTooltip, {
        "class": `${prefixCls}-th-title`,
        "tooltipProps": tooltipProps.value
      }, _isSlot(_slot3 = renderTitle()) ? _slot3 : {
        default: () => [_slot3]
      }) : vue.createVNode("span", {
        "class": [`${prefixCls}-th-title`, {
          [`${prefixCls}-text-ellipsis`]: (_c = props.column) == null ? void 0 : _c.ellipsis
        }]
      }, [renderTitle()]), hasSorter.value && vue.createVNode("span", {
        "class": `${prefixCls}-sorter`
      }, [hasAscendBtn.value && vue.createVNode("div", {
        "class": [`${prefixCls}-sorter-icon`, {
          [`${prefixCls}-sorter-icon-active`]: sortOrder.value === "ascend"
        }]
      }, [vue.createVNode(index$3, null, null)]), hasDescendBtn.value && vue.createVNode("div", {
        "class": [`${prefixCls}-sorter-icon`, {
          [`${prefixCls}-sorter-icon-active`]: sortOrder.value === "descend"
        }]
      }, [vue.createVNode(index$4, null, null)])]), filterIconAlignLeft.value && renderFilter()]);
    };
    const style = vue.computed(() => {
      var _a, _b;
      return {
        ...utils.getStyle(props.column, {
          dataColumns: props.dataColumns,
          operations: props.operations
        }),
        ...(_a = props.column) == null ? void 0 : _a.cellStyle,
        ...(_b = props.column) == null ? void 0 : _b.headerCellStyle
      };
    });
    const cls = vue.computed(() => {
      var _a, _b;
      return [`${prefixCls}-th`, {
        [`${prefixCls}-col-sorted`]: Boolean(sortOrder.value),
        [`${prefixCls}-th-resizing`]: resizing.value
      }, ...utils.getFixedCls(prefixCls, props.column), (_a = props.column) == null ? void 0 : _a.cellClass, (_b = props.column) == null ? void 0 : _b.headerCellClass];
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
      return vue.createVNode((_d = (_c = slots.th) == null ? void 0 : _c.call(slots, {
        column: props.column
      })[0]) != null ? _d : "th", {
        class: cls.value,
        style: style.value,
        colspan: colSpan > 1 ? colSpan : void 0,
        rowspan: rowSpan > 1 ? rowSpan : void 0
      }, {
        default: () => [renderCell(), !filterIconAlignLeft.value && renderFilter(), props.resizable && vue.createVNode("span", {
          "class": `${prefixCls}-column-handle`,
          "onMousedown": handleMouseDown
        }, null)]
      });
    };
  }
});
module.exports = Th;
