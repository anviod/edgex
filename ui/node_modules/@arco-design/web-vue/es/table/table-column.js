import { defineComponent, toRefs, getCurrentInstance, inject, reactive, provide, ref, watch, onBeforeUnmount } from "vue";
import { tableInjectionKey, tableColumnInjectionKey } from "./context.js";
import { useChildrenComponents } from "../_hooks/use-children-components.js";
import { usePureProp } from "../_hooks/use-pure-prop.js";
var TableColumn = defineComponent({
  name: "TableColumn",
  props: {
    dataIndex: String,
    title: String,
    width: Number,
    minWidth: Number,
    align: {
      type: String
    },
    fixed: {
      type: String
    },
    ellipsis: {
      type: Boolean,
      default: false
    },
    sortable: {
      type: Object,
      default: void 0
    },
    filterable: {
      type: Object,
      default: void 0
    },
    cellClass: {
      type: [String, Array, Object]
    },
    headerCellClass: {
      type: [String, Array, Object]
    },
    bodyCellClass: {
      type: [String, Array, Object, Function]
    },
    summaryCellClass: {
      type: [String, Array, Object, Function]
    },
    cellStyle: {
      type: Object
    },
    headerCellStyle: {
      type: Object
    },
    bodyCellStyle: {
      type: [Object, Function]
    },
    summaryCellStyle: {
      type: [Object, Function]
    },
    index: {
      type: Number
    },
    tooltip: {
      type: [Boolean, Object],
      default: false
    }
  },
  setup(props, {
    slots
  }) {
    var _a;
    const {
      dataIndex,
      title,
      width,
      align,
      fixed,
      ellipsis,
      index,
      minWidth
    } = toRefs(props);
    const sortable = usePureProp(props, "sortable");
    const filterable = usePureProp(props, "filterable");
    const cellClass = usePureProp(props, "cellClass");
    const headerCellClass = usePureProp(props, "headerCellClass");
    const bodyCellClass = usePureProp(props, "bodyCellClass");
    const summaryCellClass = usePureProp(props, "summaryCellClass");
    const cellStyle = usePureProp(props, "cellStyle");
    const headerCellStyle = usePureProp(props, "headerCellStyle");
    const bodyCellStyle = usePureProp(props, "bodyCellStyle");
    const summaryCellStyle = usePureProp(props, "summaryCellStyle");
    const tooltip = usePureProp(props, "tooltip");
    const instance = getCurrentInstance();
    const tableCtx = inject(tableInjectionKey, {});
    const tableColumnCtx = inject(tableColumnInjectionKey, void 0);
    const {
      children,
      components
    } = useChildrenComponents("TableColumn");
    const childrenColumnMap = reactive(/* @__PURE__ */ new Map());
    const addChild = (id, data) => {
      childrenColumnMap.set(id, data);
    };
    const removeChild = (id) => {
      childrenColumnMap.delete(id);
    };
    provide(tableColumnInjectionKey, {
      addChild,
      removeChild
    });
    const childrenColumns = ref();
    watch([components, childrenColumnMap], ([components2, childrenColumnMap2]) => {
      if (components2.length > 0) {
        const columns = [];
        components2.forEach((id) => {
          const column2 = childrenColumnMap2.get(id);
          if (column2)
            columns.push(column2);
        });
        childrenColumns.value = columns;
      } else {
        childrenColumns.value = void 0;
      }
    });
    const column = reactive({
      dataIndex,
      title,
      width,
      minWidth,
      align,
      fixed,
      ellipsis,
      sortable,
      filterable,
      cellClass,
      headerCellClass,
      bodyCellClass,
      summaryCellClass,
      cellStyle,
      headerCellStyle,
      bodyCellStyle,
      summaryCellStyle,
      index,
      tooltip,
      children: childrenColumns,
      slots
    });
    if (instance) {
      if (tableColumnCtx) {
        tableColumnCtx.addChild(instance.uid, column);
      } else {
        (_a = tableCtx.addColumn) == null ? void 0 : _a.call(tableCtx, instance.uid, column);
      }
    }
    onBeforeUnmount(() => {
      var _a2;
      if (instance) {
        if (tableColumnCtx) {
          tableColumnCtx.removeChild(instance.uid);
        } else {
          (_a2 = tableCtx.removeColumn) == null ? void 0 : _a2.call(tableCtx, instance.uid);
        }
      }
    });
    return () => {
      var _a2;
      children.value = (_a2 = slots.default) == null ? void 0 : _a2.call(slots);
      return children.value;
    };
  }
});
export { TableColumn as default };
