"use strict";
var vue = require("vue");
var context = require("./context.js");
var useChildrenComponents = require("../_hooks/use-children-components.js");
var usePureProp = require("../_hooks/use-pure-prop.js");
var TableColumn = vue.defineComponent({
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
    } = vue.toRefs(props);
    const sortable = usePureProp.usePureProp(props, "sortable");
    const filterable = usePureProp.usePureProp(props, "filterable");
    const cellClass = usePureProp.usePureProp(props, "cellClass");
    const headerCellClass = usePureProp.usePureProp(props, "headerCellClass");
    const bodyCellClass = usePureProp.usePureProp(props, "bodyCellClass");
    const summaryCellClass = usePureProp.usePureProp(props, "summaryCellClass");
    const cellStyle = usePureProp.usePureProp(props, "cellStyle");
    const headerCellStyle = usePureProp.usePureProp(props, "headerCellStyle");
    const bodyCellStyle = usePureProp.usePureProp(props, "bodyCellStyle");
    const summaryCellStyle = usePureProp.usePureProp(props, "summaryCellStyle");
    const tooltip = usePureProp.usePureProp(props, "tooltip");
    const instance = vue.getCurrentInstance();
    const tableCtx = vue.inject(context.tableInjectionKey, {});
    const tableColumnCtx = vue.inject(context.tableColumnInjectionKey, void 0);
    const {
      children,
      components
    } = useChildrenComponents.useChildrenComponents("TableColumn");
    const childrenColumnMap = vue.reactive(/* @__PURE__ */ new Map());
    const addChild = (id, data) => {
      childrenColumnMap.set(id, data);
    };
    const removeChild = (id) => {
      childrenColumnMap.delete(id);
    };
    vue.provide(context.tableColumnInjectionKey, {
      addChild,
      removeChild
    });
    const childrenColumns = vue.ref();
    vue.watch([components, childrenColumnMap], ([components2, childrenColumnMap2]) => {
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
    const column = vue.reactive({
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
    vue.onBeforeUnmount(() => {
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
module.exports = TableColumn;
