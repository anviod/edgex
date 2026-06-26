import { defineComponent, inject, toRefs, computed, ref, reactive, watch, watchEffect, provide, onMounted, createVNode, Fragment, mergeProps, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { isObject, isFunction, isNumber, isString, isArray, isUndefined, isNull } from "../_utils/is.js";
import { debounce } from "../_utils/debounce.js";
import { getGroupColumns, mapArrayWithChildren, mapRawTableData } from "./utils.js";
import { useRowSelection } from "./hooks/use-row-selection.js";
import { useExpand } from "./hooks/use-expand.js";
import { usePagination } from "./hooks/use-pagination.js";
import IconPlus from "../icon/icon-plus/index.js";
import IconMinus from "../icon/icon-minus/index.js";
import Spin from "../spin/index.js";
import Pagination from "../pagination/index.js";
import Empty from "../empty/index.js";
import ColGroup from "./table-col-group.js";
import Thead from "./table-thead.js";
import Tbody from "./table-tbody.js";
import Tr from "./table-tr.js";
import Th from "./table-th.js";
import Td from "./table-td.js";
import OperationTh from "./table-operation-th.js";
import OperationTd from "./table-operation-td.js";
import VirtualList from "../_components/virtual-list-v2/virtual-list.js";
import ResizeObserver from "../_components/resize-observer.js";
import { omit } from "../_utils/omit.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
import { useDrag } from "./hooks/use-drag.js";
import { useColumnResize } from "./hooks/use-column-resize.js";
import { tableInjectionKey } from "./context.js";
import { useFilter } from "./hooks/use-filter.js";
import { useSorter } from "./hooks/use-sorter.js";
import { useSpan } from "./hooks/use-span.js";
import { useChildrenComponents } from "../_hooks/use-children-components.js";
import Scrollbar from "../scrollbar/index.js";
import { useComponentRef } from "../_hooks/use-component-ref.js";
import { useScrollbar } from "../_hooks/use-scrollbar.js";
import { getValueByPath, setValueByPath } from "../_utils/get-value-by-path.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
const DEFAULT_BORDERED = {
  wrapper: true,
  cell: false,
  headerCell: false,
  bodyCell: false
};
var _Table = defineComponent({
  name: "Table",
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    bordered: {
      type: [Boolean, Object],
      default: true
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: () => {
        var _a, _b;
        return (_b = (_a = inject(configProviderInjectionKey, void 0)) == null ? void 0 : _a.size) != null ? _b : "large";
      }
    },
    tableLayoutFixed: {
      type: Boolean,
      default: false
    },
    loading: {
      type: [Boolean, Object],
      default: false
    },
    rowSelection: {
      type: Object
    },
    expandable: {
      type: Object
    },
    scroll: {
      type: Object
    },
    pagination: {
      type: [Boolean, Object],
      default: true
    },
    pagePosition: {
      type: String,
      default: "br"
    },
    indentSize: {
      type: Number,
      default: 16
    },
    rowKey: {
      type: String,
      default: "key"
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    virtualListProps: {
      type: Object
    },
    spanMethod: {
      type: Function
    },
    spanAll: {
      type: Boolean,
      default: false
    },
    components: {
      type: Object
    },
    loadMore: {
      type: Function
    },
    filterIconAlignLeft: {
      type: Boolean,
      default: false
    },
    hideExpandButtonOnEmpty: {
      type: Boolean,
      default: false
    },
    rowClass: {
      type: [String, Array, Object, Function]
    },
    draggable: {
      type: Object
    },
    rowNumber: {
      type: [Boolean, Object]
    },
    columnResizable: {
      type: Boolean
    },
    summary: {
      type: [Boolean, Function]
    },
    summaryText: {
      type: String,
      default: "Summary"
    },
    summarySpanMethod: {
      type: Function
    },
    selectedKeys: {
      type: Array
    },
    defaultSelectedKeys: {
      type: Array
    },
    expandedKeys: {
      type: Array
    },
    defaultExpandedKeys: {
      type: Array
    },
    defaultExpandAllRows: {
      type: Boolean,
      default: false
    },
    stickyHeader: {
      type: [Boolean, Number],
      default: false
    },
    scrollbar: {
      type: [Object, Boolean],
      default: true
    },
    showEmptyTree: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:selectedKeys": (rowKeys) => true,
    "update:expandedKeys": (rowKeys) => true,
    "expand": (rowKey, record) => true,
    "expandedChange": (rowKeys) => true,
    "select": (rowKeys, rowKey, record) => true,
    "selectAll": (checked) => true,
    "selectionChange": (rowKeys) => true,
    "sorterChange": (dataIndex, direction) => true,
    "filterChange": (dataIndex, filteredValues) => true,
    "pageChange": (page) => true,
    "pageSizeChange": (pageSize) => true,
    "change": (data, extra, currentData) => true,
    "cellMouseEnter": (record, column, ev) => true,
    "cellMouseLeave": (record, column, ev) => true,
    "cellClick": (record, column, ev) => true,
    "rowClick": (record, ev) => true,
    "headerClick": (column, ev) => true,
    "columnResize": (dataIndex, width) => true,
    "rowDblclick": (record, ev) => true,
    "cellDblclick": (record, column, ev) => true,
    "rowContextmenu": (record, ev) => true,
    "cellContextmenu": (record, column, ev) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      columns,
      rowKey,
      rowSelection,
      expandable,
      loadMore,
      filterIconAlignLeft,
      selectedKeys,
      defaultSelectedKeys,
      expandedKeys,
      defaultExpandedKeys,
      defaultExpandAllRows,
      spanMethod,
      draggable,
      summarySpanMethod,
      scrollbar,
      showEmptyTree
    } = toRefs(props);
    const prefixCls = getPrefixCls("table");
    const configCtx = inject(configProviderInjectionKey, void 0);
    const bordered = computed(() => {
      if (isObject(props.bordered)) {
        return {
          ...DEFAULT_BORDERED,
          ...props.bordered
        };
      }
      return {
        ...DEFAULT_BORDERED,
        wrapper: props.bordered
      };
    });
    const {
      children,
      components
    } = useChildrenComponents("TableColumn");
    const checkStrictly = computed(() => {
      var _a, _b;
      return (_b = (_a = rowSelection.value) == null ? void 0 : _a.checkStrictly) != null ? _b : true;
    });
    const {
      displayScrollbar,
      scrollbarProps
    } = useScrollbar(scrollbar);
    const isScroll = computed(() => {
      var _a, _b, _c, _d;
      const x = Boolean(((_a = props.scroll) == null ? void 0 : _a.x) || ((_b = props.scroll) == null ? void 0 : _b.minWidth));
      const y = Boolean(((_c = props.scroll) == null ? void 0 : _c.y) || ((_d = props.scroll) == null ? void 0 : _d.maxHeight));
      return {
        x,
        y
      };
    });
    const summaryRef = ref();
    const thRefs = ref({});
    const {
      componentRef: contentComRef,
      elementRef: contentRef
    } = useComponentRef("containerRef");
    const {
      componentRef: tbodyComRef,
      elementRef: tbodyRef
    } = useComponentRef("containerRef");
    const {
      componentRef: virtualComRef,
      elementRef: virtualRef
    } = useComponentRef("viewportRef");
    const {
      componentRef: theadComRef,
      elementRef: theadRef
    } = useComponentRef("containerRef");
    const containerElement = computed(() => {
      if (splitTable.value) {
        if (isVirtualList.value) {
          return virtualRef.value;
        }
        return tbodyRef.value;
      }
      return contentRef.value;
    });
    const splitTable = computed(() => isScroll.value.y || props.stickyHeader || isVirtualList.value || isScroll.value.x && flattenData.value.length === 0);
    const slotColumnMap = reactive(/* @__PURE__ */ new Map());
    const slotColumns = ref();
    watch([components, slotColumnMap], ([components2, slotColumnMap2]) => {
      if (components2.length > 0) {
        const columns2 = [];
        components2.forEach((id) => {
          const column = slotColumnMap2.get(id);
          if (column)
            columns2.push(column);
        });
        slotColumns.value = columns2;
      } else {
        slotColumns.value = void 0;
      }
    });
    const dataColumnMap = /* @__PURE__ */ new Map();
    const dataColumns = ref([]);
    const groupColumns = ref([]);
    const {
      resizingColumn,
      columnWidth,
      handleThMouseDown
    } = useColumnResize(thRefs, emit);
    watch([columns, slotColumns, columnWidth], ([columns2, slotColumns2]) => {
      var _a;
      const result = getGroupColumns((_a = slotColumns2 != null ? slotColumns2 : columns2) != null ? _a : [], dataColumnMap, columnWidth);
      dataColumns.value = result.dataColumns;
      groupColumns.value = result.groupColumns;
    }, {
      immediate: true,
      deep: true
    });
    const isPaginationTop = computed(() => ["tl", "top", "tr"].includes(props.pagePosition));
    const hasLeftFixedColumn = ref(false);
    const hasRightFixedColumn = ref(false);
    const hasLeftFixedDataColumns = ref(false);
    watchEffect(() => {
      var _a, _b, _c;
      let _hasLeftFixedColumn = false;
      let _hasRightFixedColumn = false;
      let _hasLeftFixedDataColumns = false;
      if (((_a = props.rowSelection) == null ? void 0 : _a.fixed) || ((_b = props.expandable) == null ? void 0 : _b.fixed) || ((_c = props.draggable) == null ? void 0 : _c.fixed)) {
        _hasLeftFixedColumn = true;
      }
      for (const column of dataColumns.value) {
        if (column.fixed === "left") {
          _hasLeftFixedColumn = true;
          _hasLeftFixedDataColumns = true;
        } else if (column.fixed === "right") {
          _hasRightFixedColumn = true;
        }
      }
      if (_hasLeftFixedColumn !== hasLeftFixedColumn.value) {
        hasLeftFixedColumn.value = _hasLeftFixedColumn;
      }
      if (_hasRightFixedColumn !== hasRightFixedColumn.value) {
        hasRightFixedColumn.value = _hasRightFixedColumn;
      }
      if (_hasLeftFixedDataColumns !== hasLeftFixedDataColumns.value) {
        hasLeftFixedDataColumns.value = _hasLeftFixedDataColumns;
      }
    });
    const hasEllipsis = computed(() => {
      for (const col of dataColumns.value) {
        if (col.ellipsis) {
          return true;
        }
      }
      return false;
    });
    const handleChange = (type) => {
      const extra = {
        type,
        page: page.value,
        pageSize: pageSize.value,
        sorter: computedSorter.value,
        filters: computedFilters.value,
        dragTarget: type === "drag" ? dragState.data : void 0
      };
      emit("change", flattenRawData.value, extra, sortedData.value);
    };
    const handleFilterChange = (dataIndex, filteredValues) => {
      _filters.value = {
        ...computedFilters.value,
        [dataIndex]: filteredValues
      };
      emit("filterChange", dataIndex, filteredValues);
      handleChange("filter");
    };
    const handleSorterChange = (dataIndex, direction) => {
      _sorter.value = direction ? {
        field: dataIndex,
        direction
      } : void 0;
      emit("sorterChange", dataIndex, direction);
      handleChange("sorter");
    };
    const {
      _filters,
      computedFilters,
      resetFilters,
      clearFilters
    } = useFilter({
      columns: dataColumns,
      onFilterChange: handleFilterChange
    });
    const {
      _sorter,
      computedSorter,
      resetSorters,
      clearSorters
    } = useSorter({
      columns: dataColumns,
      onSorterChange: handleSorterChange
    });
    const disabledKeys = /* @__PURE__ */ new Set();
    const allRowKeys = computed(() => {
      const allRowKeys2 = [];
      disabledKeys.clear();
      const travelData = (data) => {
        if (isArray(data) && data.length > 0) {
          for (const record of data) {
            allRowKeys2.push(record[rowKey.value]);
            if (record.disabled) {
              disabledKeys.add(record[rowKey.value]);
            }
            if (record.children) {
              travelData(record.children);
            }
          }
        }
      };
      travelData(props.data);
      return allRowKeys2;
    });
    const currentAllRowKeys = computed(() => {
      const keys = [];
      const travel = (data) => {
        for (const record of data) {
          keys.push(record.key);
          if (record.children) {
            travel(record.children);
          }
        }
      };
      travel(flattenData.value);
      return keys;
    });
    const currentAllEnabledRowKeys = computed(() => {
      const keys = [];
      const travel = (data) => {
        for (const record of data) {
          if (!record.disabled) {
            keys.push(record.key);
          }
          if (record.children) {
            travel(record.children);
          }
        }
      };
      travel(flattenData.value);
      return keys;
    });
    const {
      isRadio,
      selectedRowKeys,
      currentSelectedRowKeys,
      handleSelect,
      handleSelectAllLeafs,
      handleSelectAll,
      select,
      selectAll,
      clearSelected
    } = useRowSelection({
      selectedKeys,
      defaultSelectedKeys,
      rowSelection,
      currentAllRowKeys,
      currentAllEnabledRowKeys,
      emit
    });
    const {
      expandedRowKeys,
      handleExpand,
      expand,
      expandAll
    } = useExpand({
      expandedKeys,
      defaultExpandedKeys,
      defaultExpandAllRows,
      expandable,
      allRowKeys,
      emit
    });
    const lazyLoadData = reactive({});
    const addLazyLoadData = (children2, record) => {
      if (children2) {
        lazyLoadData[record.key] = children2;
      }
    };
    const isValidRecord = (record) => {
      var _a, _b;
      for (const field of Object.keys(computedFilters.value)) {
        const filteredValues = computedFilters.value[field];
        const column = dataColumnMap.get(field);
        if (column && ((_a = column.filterable) == null ? void 0 : _a.filter) && filteredValues.length > 0) {
          const result = (_b = column.filterable) == null ? void 0 : _b.filter(filteredValues, record.raw);
          if (!result) {
            return result;
          }
        }
      }
      return true;
    };
    const {
      dragType,
      dragState,
      handleDragStart,
      handleDragEnter,
      handleDragLeave,
      handleDragover,
      handleDragEnd,
      handleDrop
    } = useDrag(draggable);
    const processedData = computed(() => {
      var _a;
      const travel = (data) => {
        const result = [];
        for (const _record of data) {
          const record = {
            raw: _record,
            key: _record[props.rowKey],
            disabled: _record.disabled,
            expand: _record.expand,
            isLeaf: _record.isLeaf
          };
          if (_record.children) {
            record.isLeaf = false;
            record.children = travel(_record.children);
          } else if (props.loadMore && !_record.isLeaf) {
            record.isLeaf = false;
            if (lazyLoadData[record.key]) {
              record.children = travel(lazyLoadData[record.key]);
            }
          } else {
            record.isLeaf = true;
          }
          record.hasSubtree = Boolean(record.children ? props.hideExpandButtonOnEmpty ? record.children.length > 0 : true : props.loadMore && !record.isLeaf);
          result.push(record);
        }
        return result;
      };
      return travel((_a = props.data) != null ? _a : []);
    });
    const validData = computed(() => {
      const travel = (data) => data.filter((record) => {
        if (isValidRecord(record)) {
          if (record.children) {
            record.children = travel(record.children);
          }
          return true;
        }
        return false;
      });
      return Object.keys(computedFilters.value).length > 0 ? travel(processedData.value) : processedData.value;
    });
    const sortedData = computed(() => {
      var _a, _b, _c;
      const data = mapArrayWithChildren(validData.value);
      if (data.length > 0) {
        if ((_a = computedSorter.value) == null ? void 0 : _a.field) {
          const column = dataColumnMap.get(computedSorter.value.field);
          if (column && ((_b = column.sortable) == null ? void 0 : _b.sorter) !== true) {
            const {
              field,
              direction
            } = computedSorter.value;
            data.sort((a, b) => {
              var _a2;
              const valueA = getValueByPath(a.raw, field);
              const valueB = getValueByPath(b.raw, field);
              if (((_a2 = column.sortable) == null ? void 0 : _a2.sorter) && isFunction(column.sortable.sorter)) {
                return column.sortable.sorter(a.raw, b.raw, {
                  dataIndex: field,
                  direction
                });
              }
              const result = valueA > valueB ? 1 : -1;
              return direction === "descend" ? -result : result;
            });
          }
        }
        const {
          sourcePath,
          targetPath
        } = dragState;
        if (dragState.dragging && targetPath.length && targetPath.toString() !== sourcePath.toString()) {
          if (sourcePath.length === targetPath.length && sourcePath.slice(0, -1).toString() === targetPath.slice(0, -1).toString()) {
            let children2 = data;
            for (let i = 0; i < sourcePath.length; i++) {
              const sourceIndex = sourcePath[i];
              const isLast = i >= sourcePath.length - 1;
              if (isLast) {
                const sourceChild = children2[sourceIndex];
                const targetIndex = targetPath[i];
                if (targetIndex > sourceIndex) {
                  children2.splice(targetIndex + 1, 0, sourceChild);
                  children2.splice(sourceIndex, 1);
                } else {
                  children2.splice(targetIndex, 0, sourceChild);
                  children2.splice(sourceIndex + 1, 1);
                }
              } else {
                children2 = (_c = children2[sourceIndex].children) != null ? _c : [];
              }
            }
          }
        }
      }
      return data;
    });
    const {
      page,
      pageSize,
      handlePageChange,
      handlePageSizeChange
    } = usePagination(props, emit);
    const onlyCurrent = computed(() => {
      var _a, _b;
      return (_b = (_a = rowSelection.value) == null ? void 0 : _a.onlyCurrent) != null ? _b : false;
    });
    watch(page, (cur, pre) => {
      if (cur !== pre && onlyCurrent.value) {
        clearSelected();
      }
    });
    const flattenData = computed(() => {
      if (props.pagination && sortedData.value.length > pageSize.value) {
        return sortedData.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
      }
      return sortedData.value;
    });
    const flattenRawData = computed(() => mapRawTableData(flattenData.value));
    const getSummaryData = () => {
      return dataColumns.value.reduce((per, column, index) => {
        if (column.dataIndex) {
          if (index === 0) {
            setValueByPath(per, column.dataIndex, props.summaryText, {
              addPath: true
            });
          } else {
            let count = 0;
            let isNotNumber = false;
            flattenData.value.forEach((data) => {
              if (column.dataIndex) {
                const _number = getValueByPath(data.raw, column.dataIndex);
                if (isNumber(_number)) {
                  count += _number;
                } else if (!isUndefined(_number) && !isNull(_number)) {
                  isNotNumber = true;
                }
              }
            });
            setValueByPath(per, column.dataIndex, isNotNumber ? "" : count, {
              addPath: true
            });
          }
        }
        return per;
      }, {});
    };
    const getTableDataWithRaw = (data) => {
      if (data && data.length > 0) {
        return data.map((raw) => {
          return {
            raw,
            key: raw[props.rowKey]
          };
        });
      }
      return [];
    };
    const summaryData = computed(() => {
      if (props.summary) {
        if (isFunction(props.summary)) {
          return getTableDataWithRaw(props.summary({
            columns: dataColumns.value,
            data: flattenRawData.value
          }));
        }
        return getTableDataWithRaw([getSummaryData()]);
      }
      return [];
    });
    const containerScrollLeft = ref(0);
    const alignLeft = ref(true);
    const alignRight = ref(true);
    const setAlignPosition = () => {
      let _alignLeft = true;
      let _alignRight = true;
      const scrollContainer = containerElement.value;
      if (scrollContainer) {
        _alignLeft = containerScrollLeft.value === 0;
        _alignRight = Math.ceil(containerScrollLeft.value + scrollContainer.offsetWidth) >= scrollContainer.scrollWidth;
      }
      if (_alignLeft !== alignLeft.value) {
        alignLeft.value = _alignLeft;
      }
      if (_alignRight !== alignRight.value) {
        alignRight.value = _alignRight;
      }
    };
    const getTableScrollCls = () => {
      if (alignLeft.value && alignRight.value) {
        return `${prefixCls}-scroll-position-both`;
      }
      if (alignLeft.value) {
        return `${prefixCls}-scroll-position-left`;
      }
      if (alignRight.value) {
        return `${prefixCls}-scroll-position-right`;
      }
      return `${prefixCls}-scroll-position-middle`;
    };
    const getTableFixedCls = () => {
      const cls2 = [];
      if (hasLeftFixedColumn.value) {
        cls2.push(`${prefixCls}-has-fixed-col-left`);
      }
      if (hasRightFixedColumn.value) {
        cls2.push(`${prefixCls}-has-fixed-col-right`);
      }
      return cls2;
    };
    const handleScroll = (e) => {
      if (e.target.scrollLeft !== containerScrollLeft.value) {
        containerScrollLeft.value = e.target.scrollLeft;
      }
      setAlignPosition();
    };
    const onTbodyScroll = (e) => {
      handleScroll(e);
      const {
        scrollLeft
      } = e.target;
      if (theadRef.value) {
        theadRef.value.scrollLeft = scrollLeft;
      }
      if (summaryRef.value) {
        summaryRef.value.scrollLeft = scrollLeft;
      }
    };
    const handleRowClick = (record, ev) => {
      emit("rowClick", record.raw, ev);
    };
    const handleRowDblclick = (record, ev) => {
      emit("rowDblclick", record.raw, ev);
    };
    const handleRowContextMenu = (record, ev) => {
      emit("rowContextmenu", record.raw, ev);
    };
    const handleCellClick = (record, column, ev) => {
      emit("cellClick", record.raw, column, ev);
    };
    const handleCellMouseEnter = debounce((record, column, ev) => {
      emit("cellMouseEnter", record.raw, column, ev);
    }, 30);
    const handleCellMouseLeave = debounce((record, column, ev) => {
      emit("cellMouseLeave", record.raw, column, ev);
    }, 30);
    const handleCellDblclick = (record, column, ev) => {
      emit("cellDblclick", record.raw, column, ev);
    };
    const handleCellContextmenu = (record, column, ev) => {
      emit("cellContextmenu", record.raw, column, ev);
    };
    const handleHeaderClick = (column, ev) => {
      emit("headerClick", column, ev);
    };
    const operations = computed(() => {
      var _a, _b;
      const operations2 = [];
      const hasFixedColumn = hasLeftFixedColumn.value || hasRightFixedColumn.value;
      let dragHandle;
      let expand2;
      let selection;
      if (((_a = props.draggable) == null ? void 0 : _a.type) === "handle") {
        dragHandle = {
          name: "drag-handle",
          title: props.draggable.title,
          width: props.draggable.width,
          fixed: props.draggable.fixed || hasFixedColumn
        };
        operations2.push(dragHandle);
      }
      if (props.expandable) {
        expand2 = {
          name: "expand",
          title: props.expandable.title,
          width: props.expandable.width,
          fixed: props.expandable.fixed || hasFixedColumn
        };
        operations2.push(expand2);
      }
      if (props.rowSelection) {
        selection = {
          name: props.rowSelection.type === "radio" ? "selection-radio" : "selection-checkbox",
          title: props.rowSelection.title,
          width: props.rowSelection.width,
          fixed: props.rowSelection.fixed || hasFixedColumn
        };
        operations2.push(selection);
      }
      if (!hasLeftFixedDataColumns.value && operations2.length > 0 && operations2[operations2.length - 1].fixed) {
        operations2[operations2.length - 1].isLastLeftFixed = true;
      }
      const operationsFn = (_b = props.components) == null ? void 0 : _b.operations;
      return isFunction(operationsFn) ? operationsFn({
        dragHandle,
        expand: expand2,
        selection
      }) : operations2;
    });
    const headerStyle = computed(() => {
      var _a, _b, _c, _d;
      if (isScroll.value.x) {
        const style2 = {
          width: isNumber((_a = props.scroll) == null ? void 0 : _a.x) ? `${(_b = props.scroll) == null ? void 0 : _b.x}px` : (_c = props.scroll) == null ? void 0 : _c.x
        };
        if ((_d = props.scroll) == null ? void 0 : _d.minWidth) {
          style2.minWidth = isNumber(props.scroll.minWidth) ? `${props.scroll.minWidth}px` : props.scroll.minWidth;
        }
        return style2;
      }
      return void 0;
    });
    const contentStyle = computed(() => {
      var _a, _b, _c, _d;
      if (isScroll.value.x && flattenData.value.length > 0) {
        const style2 = {
          width: isNumber((_a = props.scroll) == null ? void 0 : _a.x) ? `${(_b = props.scroll) == null ? void 0 : _b.x}px` : (_c = props.scroll) == null ? void 0 : _c.x
        };
        if ((_d = props.scroll) == null ? void 0 : _d.minWidth) {
          style2.minWidth = isNumber(props.scroll.minWidth) ? `${props.scroll.minWidth}px` : props.scroll.minWidth;
        }
        return style2;
      }
      return void 0;
    });
    const addColumn = (id, column) => {
      slotColumnMap.set(id, column);
    };
    const removeColumn = (id) => {
      slotColumnMap.delete(id);
    };
    provide(tableInjectionKey, reactive({
      loadMore,
      addLazyLoadData,
      slots,
      sorter: computedSorter,
      filters: computedFilters,
      filterIconAlignLeft,
      resizingColumn,
      checkStrictly,
      currentAllEnabledRowKeys,
      currentSelectedRowKeys,
      addColumn,
      removeColumn,
      onSelectAll: handleSelectAll,
      onSelect: handleSelect,
      onSelectAllLeafs: handleSelectAllLeafs,
      onSorterChange: handleSorterChange,
      onFilterChange: handleFilterChange,
      onThMouseDown: handleThMouseDown
    }));
    const cls = computed(() => [prefixCls, `${prefixCls}-size-${props.size}`, {
      [`${prefixCls}-border`]: bordered.value.wrapper,
      [`${prefixCls}-border-cell`]: bordered.value.cell,
      [`${prefixCls}-border-header-cell`]: !bordered.value.cell && bordered.value.headerCell,
      [`${prefixCls}-border-body-cell`]: !bordered.value.cell && bordered.value.bodyCell,
      [`${prefixCls}-stripe`]: props.stripe,
      [`${prefixCls}-hover`]: props.hoverable,
      [`${prefixCls}-dragging`]: dragState.dragging,
      [`${prefixCls}-type-selection`]: Boolean(props.rowSelection),
      [`${prefixCls}-empty`]: props.data && flattenData.value.length === 0,
      [`${prefixCls}-layout-fixed`]: props.tableLayoutFixed || isScroll.value.x || splitTable.value || hasEllipsis.value
    }]);
    const paginationCls = computed(() => [`${prefixCls}-pagination`, {
      [`${prefixCls}-pagination-left`]: props.pagePosition === "tl" || props.pagePosition === "bl",
      [`${prefixCls}-pagination-center`]: props.pagePosition === "top" || props.pagePosition === "bottom",
      [`${prefixCls}-pagination-right`]: props.pagePosition === "tr" || props.pagePosition === "br",
      [`${prefixCls}-pagination-top`]: isPaginationTop.value
    }]);
    const tableCls = computed(() => {
      const cls2 = getTableFixedCls();
      if (isScroll.value.x) {
        cls2.push(getTableScrollCls());
      }
      if (splitTable.value) {
        cls2.push(`${prefixCls}-scroll-y`);
      }
      return cls2;
    });
    const isVirtualList = computed(() => Boolean(props.virtualListProps));
    const thWidth = ref({});
    const getThWidth = () => {
      const width = {};
      for (const key of Object.keys(thRefs.value)) {
        width[key] = thRefs.value[key].offsetWidth;
      }
      thWidth.value = width;
    };
    const hasScrollBar = ref(false);
    const isTbodyHasScrollBar = () => {
      if (tbodyRef.value) {
        return tbodyRef.value.offsetWidth > tbodyRef.value.clientWidth;
      }
      return false;
    };
    const handleTbodyResize = () => {
      const _hasScrollBar = isTbodyHasScrollBar();
      if (hasScrollBar.value !== _hasScrollBar) {
        hasScrollBar.value = _hasScrollBar;
      }
      setAlignPosition();
      getThWidth();
    };
    onMounted(() => {
      hasScrollBar.value = isTbodyHasScrollBar();
      getThWidth();
    });
    const spinProps = computed(() => isObject(props.loading) ? props.loading : {
      loading: props.loading
    });
    const renderEmpty = () => {
      return createVNode(Tr, {
        "empty": true
      }, {
        default: () => [createVNode(Td, {
          "colSpan": dataColumns.value.length + operations.value.length
        }, {
          default: () => {
            var _a, _b, _c, _d, _e;
            return [(_e = (_d = (_a = slots.empty) == null ? void 0 : _a.call(slots)) != null ? _d : (_c = configCtx == null ? void 0 : (_b = configCtx.slots).empty) == null ? void 0 : _c.call(_b, {
              component: "table"
            })) != null ? _e : createVNode(Empty, null, null)];
          }
        })]
      });
    };
    const renderExpandContent = (record) => {
      var _a;
      if (record.expand) {
        return isFunction(record.expand) ? record.expand() : record.expand;
      }
      if (slots["expand-row"]) {
        return slots["expand-row"]({
          record: record.raw
        });
      }
      if ((_a = props.expandable) == null ? void 0 : _a.expandedRowRender) {
        return props.expandable.expandedRowRender(record.raw);
      }
      return void 0;
    };
    const allColumns = computed(() => [].concat(operations.value, dataColumns.value));
    const spanColumns = computed(() => props.spanAll ? allColumns.value : dataColumns.value);
    const {
      tableSpan,
      removedCells
    } = useSpan({
      spanMethod,
      data: flattenData,
      columns: spanColumns
    });
    const {
      tableSpan: tableSummarySpan,
      removedCells: removedSummaryCells
    } = useSpan({
      spanMethod: summarySpanMethod,
      data: summaryData,
      columns: allColumns
    });
    const getVirtualColumnStyle = (name) => {
      if (!isVirtualList.value || !name || !thWidth.value[name]) {
        return void 0;
      }
      return {
        width: `${thWidth.value[name]}px`
      };
    };
    const renderSummaryRow = (record, rowIndex) => {
      return createVNode(Tr, {
        "key": `table-summary-${rowIndex}`,
        "class": [`${prefixCls}-tr-summary`, isFunction(props.rowClass) ? props.rowClass(record.raw, rowIndex) : props.rowClass],
        "onClick": (ev) => handleRowClick(record, ev)
      }, {
        default: () => [operations.value.map((operation, index) => {
          var _a;
          const cellId = `${rowIndex}-${index}-${record.key}`;
          const [rowspan, colspan] = (_a = tableSummarySpan.value[cellId]) != null ? _a : [1, 1];
          if (removedSummaryCells.value.includes(cellId)) {
            return null;
          }
          const style2 = getVirtualColumnStyle(operation.name);
          return createVNode(OperationTd, {
            "style": style2,
            "operationColumn": operation,
            "operations": operations.value,
            "record": record,
            "rowSpan": rowspan,
            "colSpan": colspan,
            "summary": true
          }, null);
        }), dataColumns.value.map((column, index) => {
          var _a;
          const cellId = `${rowIndex}-${operations.value.length + index}-${record.key}`;
          const [rowspan, colspan] = (_a = tableSummarySpan.value[cellId]) != null ? _a : [1, 1];
          if (removedSummaryCells.value.includes(cellId)) {
            return null;
          }
          const style2 = getVirtualColumnStyle(column.dataIndex);
          return createVNode(Td, {
            "key": `td-${cellId}`,
            "style": style2,
            "rowIndex": rowIndex,
            "record": record,
            "column": column,
            "operations": operations.value,
            "dataColumns": dataColumns.value,
            "rowSpan": rowspan,
            "colSpan": colspan,
            "summary": true,
            "onClick": (ev) => handleCellClick(record, column, ev),
            "onDblclick": (ev) => handleCellDblclick(record, column, ev),
            "onMouseenter": (ev) => handleCellMouseEnter(record, column, ev),
            "onMouseleave": (ev) => handleCellMouseLeave(record, column, ev),
            "onContextmenu": (ev) => handleCellContextmenu(record, column, ev)
          }, {
            td: slots.td,
            cell: slots["summary-cell"]
          });
        })],
        tr: slots.tr
      });
    };
    const renderSummary = () => {
      if (summaryData.value && summaryData.value.length > 0) {
        return createVNode("tfoot", null, [summaryData.value.map((data, index) => renderSummaryRow(data, index))]);
      }
      return null;
    };
    const renderExpandBtn = (record, stopPropagation = true) => {
      var _a, _b, _c, _d, _e;
      const currentKey = record.key;
      const expanded = expandedRowKeys.value.includes(currentKey);
      return createVNode("button", {
        "type": "button",
        "class": `${prefixCls}-expand-btn`,
        "onClick": (ev) => {
          handleExpand(currentKey, record.raw);
          if (stopPropagation) {
            ev.stopPropagation();
          }
        }
      }, [(_e = (_d = (_a = slots["expand-icon"]) == null ? void 0 : _a.call(slots, {
        expanded,
        record: record.raw
      })) != null ? _d : (_c = (_b = props.expandable) == null ? void 0 : _b.icon) == null ? void 0 : _c.call(_b, expanded, record.raw)) != null ? _e : expanded ? createVNode(IconMinus, null, null) : createVNode(IconPlus, null, null)]);
    };
    const renderExpand = (record, {
      indentSize,
      indexPath,
      allowDrag,
      expandContent
    }) => {
      var _a, _b;
      if (record.hasSubtree) {
        if (((_a = record.children) == null ? void 0 : _a.length) === 0 && showEmptyTree.value) {
          return renderEmpty();
        }
        return (_b = record.children) == null ? void 0 : _b.map((item, index) => renderRecord(item, index, {
          indentSize,
          indexPath,
          allowDrag
        }));
      }
      if (expandContent) {
        const scrollContainer = containerElement.value;
        return createVNode(Tr, {
          "key": `${record.key}-expand`,
          "expand": true
        }, {
          default: () => [createVNode(Td, {
            "isFixedExpand": hasLeftFixedColumn.value || hasRightFixedColumn.value,
            "containerWidth": scrollContainer == null ? void 0 : scrollContainer.clientWidth,
            "colSpan": dataColumns.value.length + operations.value.length
          }, _isSlot(expandContent) ? expandContent : {
            default: () => [expandContent]
          })]
        });
      }
      return null;
    };
    const renderRecord = (record, rowIndex, {
      indentSize = 0,
      indexPath,
      allowDrag = true
    } = {}) => {
      var _a;
      const currentKey = record.key;
      const currentPath = (indexPath != null ? indexPath : []).concat(rowIndex);
      const expandContent = renderExpandContent(record);
      const showExpand = expandedRowKeys.value.includes(currentKey);
      const isDragTarget = dragState.sourceKey === record.key;
      const dragSourceEvent = dragType.value ? {
        draggable: allowDrag,
        onDragstart: (ev) => {
          if (!allowDrag)
            return;
          handleDragStart(ev, record.key, currentPath, record.raw);
        },
        onDragend: (ev) => {
          if (!allowDrag)
            return;
          handleDragEnd(ev);
        }
      } : {};
      const dragTargetEvent = dragType.value ? {
        onDragenter: (ev) => {
          if (!allowDrag)
            return;
          handleDragEnter(ev, currentPath);
        },
        onDragover: (ev) => {
          if (!allowDrag)
            return;
          handleDragover(ev);
        },
        onDrop: (ev) => {
          if (!allowDrag)
            return;
          handleChange("drag");
          handleDrop(ev);
        }
      } : {};
      return createVNode(Fragment, null, [createVNode(Tr, mergeProps({
        "key": currentKey,
        "class": [{
          [`${prefixCls}-tr-draggable`]: dragType.value === "row",
          [`${prefixCls}-tr-drag`]: isDragTarget
        }, isFunction(props.rowClass) ? props.rowClass(record.raw, rowIndex) : props.rowClass],
        "rowIndex": rowIndex,
        "record": record,
        "checked": props.rowSelection && ((_a = selectedRowKeys.value) == null ? void 0 : _a.includes(currentKey)),
        "onClick": (ev) => handleRowClick(record, ev),
        "onDblclick": (ev) => handleRowDblclick(record, ev),
        "onContextmenu": (ev) => handleRowContextMenu(record, ev)
      }, dragType.value === "row" ? dragSourceEvent : {}, dragTargetEvent), {
        default: () => [operations.value.map((operation, index) => {
          var _a2;
          const cellId = `${rowIndex}-${index}-${record.key}`;
          const [rowspan, colspan] = props.spanAll ? (_a2 = tableSpan.value[cellId]) != null ? _a2 : [1, 1] : [1, 1];
          if (props.spanAll && removedCells.value.includes(cellId)) {
            return null;
          }
          const style2 = getVirtualColumnStyle(operation.name);
          return createVNode(OperationTd, mergeProps({
            "key": `operation-td-${index}`,
            "style": style2,
            "operationColumn": operation,
            "operations": operations.value,
            "record": record,
            "hasExpand": Boolean(expandContent),
            "selectedRowKeys": currentSelectedRowKeys.value,
            "rowSpan": rowspan,
            "colSpan": colspan,
            "renderExpandBtn": renderExpandBtn
          }, dragType.value === "handle" ? dragSourceEvent : {}), {
            "drag-handle-icon": slots["drag-handle-icon"]
          });
        }), dataColumns.value.map((column, index) => {
          var _a2;
          const cellId = `${rowIndex}-${props.spanAll ? operations.value.length + index : index}-${record.key}`;
          const [rowspan, colspan] = (_a2 = tableSpan.value[cellId]) != null ? _a2 : [1, 1];
          if (removedCells.value.includes(cellId)) {
            return null;
          }
          const extraProps = index === 0 ? {
            showExpandBtn: record.hasSubtree,
            indentSize: record.hasSubtree ? indentSize - 20 : indentSize
          } : {};
          const style2 = getVirtualColumnStyle(column.dataIndex);
          return createVNode(Td, mergeProps({
            "key": `td-${index}`,
            "style": style2,
            "rowIndex": rowIndex,
            "record": record,
            "column": column,
            "operations": operations.value,
            "dataColumns": dataColumns.value,
            "rowSpan": rowspan,
            "renderExpandBtn": renderExpandBtn,
            "colSpan": colspan
          }, extraProps, {
            "onClick": (ev) => handleCellClick(record, column, ev),
            "onDblclick": (ev) => handleCellDblclick(record, column, ev),
            "onMouseenter": (ev) => handleCellMouseEnter(record, column, ev),
            "onMouseleave": (ev) => handleCellMouseLeave(record, column, ev),
            "onContextmenu": (ev) => handleCellContextmenu(record, column, ev)
          }), {
            td: slots.td
          });
        })],
        tr: slots.tr
      }), showExpand && renderExpand(record, {
        indentSize: indentSize + props.indentSize,
        indexPath: currentPath,
        allowDrag: allowDrag && !isDragTarget,
        expandContent
      })]);
    };
    const renderBody = () => {
      const hasSubData = flattenData.value.some((record) => Boolean(record.hasSubtree));
      return createVNode(Tbody, null, {
        default: () => [flattenData.value.length > 0 ? flattenData.value.map((record, index) => renderRecord(record, index, {
          indentSize: hasSubData ? 20 : 0
        })) : renderEmpty()],
        tbody: slots.tbody
      });
    };
    const renderHeader = () => createVNode(Thead, null, {
      default: () => [groupColumns.value.map((row, index) => createVNode(Tr, {
        "key": `header-row-${index}`
      }, {
        default: () => [index === 0 && operations.value.map((operation, index2) => {
          var _a;
          return createVNode(OperationTh, {
            "key": `operation-th-${index2}`,
            "ref": (ins) => {
              if ((ins == null ? void 0 : ins.$el) && operation.name) {
                thRefs.value[operation.name] = ins.$el;
              }
            },
            "operationColumn": operation,
            "operations": operations.value,
            "selectAll": Boolean(operation.name === "selection-checkbox" && ((_a = props.rowSelection) == null ? void 0 : _a.showCheckedAll)),
            "rowSpan": groupColumns.value.length
          }, null);
        }), row.map((column, index2) => {
          const resizable = props.columnResizable && Boolean(column.dataIndex) && index2 < row.length - 1;
          return createVNode(Th, {
            "key": `th-${index2}`,
            "ref": (ins) => {
              if ((ins == null ? void 0 : ins.$el) && column.dataIndex) {
                thRefs.value[column.dataIndex] = ins.$el;
              }
            },
            "column": column,
            "operations": operations.value,
            "dataColumns": dataColumns.value,
            "resizable": resizable,
            "onClick": (ev) => handleHeaderClick(column, ev)
          }, {
            th: slots.th
          });
        })]
      }))],
      thead: slots.thead
    });
    const renderContent = () => {
      var _a, _b;
      if (splitTable.value) {
        const top = isNumber(props.stickyHeader) ? `${props.stickyHeader}px` : void 0;
        const mergeOuterClass = [(_a = scrollbarProps.value) == null ? void 0 : _a.outerClass];
        if (props.stickyHeader) {
          mergeOuterClass.push(`${prefixCls}-header-sticky`);
        }
        const mergeOuterStyle = {
          top,
          ...(_b = scrollbarProps.value) == null ? void 0 : _b.outerStyle
        };
        const Component = displayScrollbar.value ? Scrollbar : "div";
        return createVNode(Fragment, null, [props.showHeader && createVNode(Component, mergeProps({
          "ref": theadComRef,
          "class": [`${prefixCls}-header`, {
            [`${prefixCls}-header-sticky`]: props.stickyHeader && !displayScrollbar.value
          }],
          "style": {
            overflowY: hasScrollBar.value ? "scroll" : void 0,
            top: !displayScrollbar.value ? top : void 0
          }
        }, scrollbar.value ? {
          hide: flattenData.value.length !== 0,
          disableVertical: true,
          ...scrollbarProps.value,
          outerClass: mergeOuterClass,
          outerStyle: mergeOuterStyle
        } : void 0), {
          default: () => [createVNode("table", {
            "class": `${prefixCls}-element`,
            "style": headerStyle.value,
            "cellpadding": 0,
            "cellspacing": 0
          }, [createVNode(ColGroup, {
            "dataColumns": dataColumns.value,
            "operations": operations.value,
            "columnWidth": columnWidth
          }, null), renderHeader()])]
        }), createVNode(ResizeObserver, {
          "onResize": handleTbodyResize
        }, {
          default: () => {
            var _a2, _b2;
            return [isVirtualList.value && flattenData.value.length ? createVNode(VirtualList, mergeProps({
              "ref": (ins) => {
                if (ins == null ? void 0 : ins.$el)
                  tbodyRef.value = ins.$el;
              },
              "class": `${prefixCls}-body`,
              "data": flattenData.value,
              "itemKey": "_key",
              "component": {
                list: "table",
                content: "tbody"
              },
              "listAttrs": {
                class: `${prefixCls}-element`,
                style: contentStyle.value
              },
              "paddingPosition": "list",
              "height": "auto"
            }, props.virtualListProps, {
              "onScroll": onTbodyScroll
            }), {
              item: ({
                item,
                index
              }) => renderRecord(item, index)
            }) : createVNode(Component, mergeProps({
              "ref": tbodyComRef,
              "class": `${prefixCls}-body`,
              "style": {
                maxHeight: isNumber((_a2 = props.scroll) == null ? void 0 : _a2.y) ? `${(_b2 = props.scroll) == null ? void 0 : _b2.y}px` : "100%"
              }
            }, scrollbar.value ? {
              outerStyle: {
                display: "flex",
                minHeight: "0"
              },
              ...scrollbarProps.value
            } : void 0, {
              "onScroll": onTbodyScroll
            }), {
              default: () => [createVNode("table", {
                "class": `${prefixCls}-element`,
                "style": contentStyle.value,
                "cellpadding": 0,
                "cellspacing": 0
              }, [flattenData.value.length !== 0 && createVNode(ColGroup, {
                "dataColumns": dataColumns.value,
                "operations": operations.value,
                "columnWidth": columnWidth
              }, null), renderBody()])]
            })];
          }
        }), summaryData.value && summaryData.value.length > 0 && createVNode("div", {
          "ref": summaryRef,
          "class": `${prefixCls}-tfoot`,
          "style": {
            overflowY: hasScrollBar.value ? "scroll" : "hidden"
          }
        }, [createVNode("table", {
          "class": `${prefixCls}-element`,
          "style": contentStyle.value,
          "cellpadding": 0,
          "cellspacing": 0
        }, [createVNode(ColGroup, {
          "dataColumns": dataColumns.value,
          "operations": operations.value,
          "columnWidth": columnWidth
        }, null), renderSummary()])])]);
      }
      return createVNode(ResizeObserver, {
        "onResize": () => setAlignPosition()
      }, {
        default: () => [createVNode("table", {
          "class": `${prefixCls}-element`,
          "cellpadding": 0,
          "cellspacing": 0,
          "style": contentStyle.value
        }, [createVNode(ColGroup, {
          "dataColumns": dataColumns.value,
          "operations": operations.value,
          "columnWidth": columnWidth
        }, null), props.showHeader && renderHeader(), renderBody(), summaryData.value && summaryData.value.length > 0 && renderSummary()])]
      });
    };
    const renderTable = (content) => {
      var _a;
      const style2 = ((_a = props.scroll) == null ? void 0 : _a.maxHeight) ? {
        maxHeight: props.scroll.maxHeight
      } : void 0;
      const Component = displayScrollbar.value ? Scrollbar : "div";
      return createVNode(Fragment, null, [createVNode("div", {
        "class": [`${prefixCls}-container`, tableCls.value]
      }, [createVNode(Component, mergeProps({
        "ref": contentComRef,
        "class": [`${prefixCls}-content`, {
          [`${prefixCls}-content-scroll-x`]: !splitTable.value
        }],
        "style": style2
      }, scrollbar.value ? {
        outerStyle: {
          height: "100%"
        },
        ...scrollbarProps.value
      } : void 0, {
        "onScroll": handleScroll
      }), {
        default: () => [content ? createVNode("table", {
          "class": `${prefixCls}-element`,
          "cellpadding": 0,
          "cellspacing": 0
        }, [content()]) : renderContent()]
      })]), slots.footer && createVNode("div", {
        "class": `${prefixCls}-footer`
      }, [slots.footer()])]);
    };
    const renderPagination = () => {
      var _a, _b;
      const paginationProps = isObject(props.pagination) ? omit(props.pagination, ["current", "pageSize", "defaultCurrent", "defaultPageSize"]) : {};
      return createVNode("div", {
        "class": paginationCls.value
      }, [(_a = slots["pagination-left"]) == null ? void 0 : _a.call(slots), createVNode(Pagination, mergeProps({
        "total": validData.value.length,
        "current": page.value,
        "pageSize": pageSize.value,
        "onChange": (page2) => {
          handlePageChange(page2);
          handleChange("pagination");
        },
        "onPageSizeChange": (pageSize2) => {
          handlePageSizeChange(pageSize2);
          handleChange("pagination");
        }
      }, paginationProps), null), (_b = slots["pagination-right"]) == null ? void 0 : _b.call(slots)]);
    };
    const style = computed(() => {
      var _a, _b;
      if (isString((_a = props.scroll) == null ? void 0 : _a.y)) {
        return {
          height: (_b = props.scroll) == null ? void 0 : _b.y
        };
      }
      return void 0;
    });
    const render = () => {
      var _a;
      if (slots.default) {
        return createVNode("div", {
          "class": cls.value
        }, [renderTable(slots.default)]);
      }
      children.value = (_a = slots.columns) == null ? void 0 : _a.call(slots);
      return createVNode("div", {
        "class": cls.value,
        "style": style.value
      }, [children.value, createVNode(Spin, spinProps.value, {
        default: () => [props.pagination !== false && (flattenData.value.length > 0 || sortedData.value.length > 0) && isPaginationTop.value && renderPagination(), renderTable(), props.pagination !== false && (flattenData.value.length > 0 || sortedData.value.length > 0) && !isPaginationTop.value && renderPagination()]
      })]);
    };
    return {
      render,
      selfExpand: expand,
      selfExpandAll: expandAll,
      selfSelect: select,
      selfSelectAll: selectAll,
      selfResetFilters: resetFilters,
      selfClearFilters: clearFilters,
      selfResetSorters: resetSorters,
      selfClearSorters: clearSorters
    };
  },
  methods: {
    selectAll(checked) {
      return this.selfSelectAll(checked);
    },
    select(rowKey, checked) {
      return this.selfSelect(rowKey, checked);
    },
    expandAll(checked) {
      return this.selfExpandAll(checked);
    },
    expand(rowKey, checked) {
      return this.selfExpand(rowKey, checked);
    },
    resetFilters(dataIndex) {
      return this.selfResetFilters(dataIndex);
    },
    clearFilters(dataIndex) {
      return this.selfClearFilters(dataIndex);
    },
    resetSorters() {
      return this.selfResetSorters();
    },
    clearSorters() {
      return this.selfClearSorters();
    }
  },
  render() {
    return this.render();
  }
});
export { _Table as default };
