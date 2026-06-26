import { defineComponent, toRefs, computed, createVNode, isVNode, Fragment } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { isObject, isFunction } from "../_utils/is.js";
import { getAllElements, isSlotsChildren } from "../_utils/vue-utils.js";
import { useResponsiveState } from "../grid/hook/use-responsive-state.js";
import { useSize } from "../_hooks/use-size.js";
var _Descriptions = defineComponent({
  name: "Descriptions",
  props: {
    data: {
      type: Array,
      default: () => []
    },
    column: {
      type: [Number, Object],
      default: 3
    },
    title: String,
    layout: {
      type: String,
      default: "horizontal"
    },
    align: {
      type: [String, Object],
      default: "left"
    },
    size: {
      type: String
    },
    bordered: {
      type: Boolean,
      default: false
    },
    labelStyle: {
      type: Object
    },
    valueStyle: {
      type: Object
    },
    tableLayout: {
      type: String,
      default: "auto"
    }
  },
  setup(props, {
    slots
  }) {
    const {
      column,
      size
    } = toRefs(props);
    const prefixCls = getPrefixCls("descriptions");
    const {
      mergedSize
    } = useSize(size);
    const computedColumn = useResponsiveState(column, 3, true);
    const labelAlign = computed(() => {
      var _a;
      return (_a = isObject(props.align) ? props.align.label : props.align) != null ? _a : "left";
    });
    const valueAlign = computed(() => {
      var _a;
      return (_a = isObject(props.align) ? props.align.value : props.align) != null ? _a : "left";
    });
    const labelStyle = computed(() => ({
      textAlign: labelAlign.value,
      ...props.labelStyle
    }));
    const valueStyle = computed(() => ({
      textAlign: valueAlign.value,
      ...props.valueStyle
    }));
    const getGroupedData = (data) => {
      const groupedData2 = [];
      let currentRow = [];
      let currentSpan = 0;
      const addRow = () => {
        if (currentRow.length) {
          const restSpan = computedColumn.value - currentSpan;
          currentRow[currentRow.length - 1].span += restSpan;
          groupedData2.push(currentRow);
        }
      };
      data.forEach((item) => {
        var _a, _b;
        const itemSpan = Math.min((_b = isVNode(item) ? (_a = item.props) == null ? void 0 : _a.span : item.span) != null ? _b : 1, computedColumn.value);
        if (currentSpan + itemSpan > computedColumn.value) {
          addRow();
          currentRow = [];
          currentSpan = 0;
        }
        currentRow.push({
          data: item,
          span: itemSpan
        });
        currentSpan += itemSpan;
      });
      addRow();
      return groupedData2;
    };
    const groupedData = computed(() => {
      var _a;
      return getGroupedData((_a = props.data) != null ? _a : []);
    });
    const renderLabel = (item, index) => {
      var _a, _b, _c, _d, _e;
      if (isVNode(item)) {
        return isSlotsChildren(item, item.children) && ((_b = (_a = item.children).label) == null ? void 0 : _b.call(_a)) || ((_c = item.props) == null ? void 0 : _c.label);
      }
      return (_e = (_d = slots.label) == null ? void 0 : _d.call(slots, {
        label: item.label,
        index,
        data: item
      })) != null ? _e : isFunction(item.label) ? item.label() : item.label;
    };
    const renderValue = (item, index) => {
      var _a, _b;
      if (isVNode(item)) {
        return item;
      }
      return (_b = (_a = slots.value) == null ? void 0 : _a.call(slots, {
        value: item.value,
        index,
        data: item
      })) != null ? _b : isFunction(item.value) ? item.value() : item.value;
    };
    const renderVerticalItems = (data) => createVNode(Fragment, null, [createVNode("tr", {
      "class": `${prefixCls}-row`
    }, [data.map((item, index) => createVNode("td", {
      "key": `label-${index}`,
      "class": [`${prefixCls}-item-label`, `${prefixCls}-item-label-block`],
      "style": labelStyle.value,
      "colspan": item.span
    }, [renderLabel(item.data, index)]))]), createVNode("tr", {
      "class": `${prefixCls}-row`
    }, [data.map((item, index) => createVNode("td", {
      "key": `value-${index}`,
      "class": [`${prefixCls}-item-value`, `${prefixCls}-item-value-block`],
      "style": valueStyle.value,
      "colspan": item.span
    }, [renderValue(item.data, index)]))])]);
    const renderHorizontalItems = (data, index) => createVNode("tr", {
      "class": `${prefixCls}-row`,
      "key": `tr-${index}`
    }, [data.map((item) => createVNode(Fragment, null, [createVNode("td", {
      "class": [`${prefixCls}-item-label`, `${prefixCls}-item-label-block`],
      "style": labelStyle.value
    }, [renderLabel(item.data, index)]), createVNode("td", {
      "class": [`${prefixCls}-item-value`, `${prefixCls}-item-value-block`],
      "style": valueStyle.value,
      "colspan": item.span * 2 - 1
    }, [renderValue(item.data, index)])]))]);
    const renderInlineItems = (data, index) => createVNode("tr", {
      "class": `${prefixCls}-row`,
      "key": `inline-${index}`
    }, [data.map((item, index2) => createVNode("td", {
      "key": `item-${index2}`,
      "class": `${prefixCls}-item`,
      "colspan": item.span
    }, [createVNode("div", {
      "class": [`${prefixCls}-item-label`, `${prefixCls}-item-label-inline`],
      "style": labelStyle.value
    }, [renderLabel(item.data, index2)]), createVNode("div", {
      "class": [`${prefixCls}-item-value`, `${prefixCls}-item-value-inline`],
      "style": valueStyle.value
    }, [renderValue(item.data, index2)])]))]);
    const renderItems = (data, index) => {
      if (["inline-horizontal", "inline-vertical"].includes(props.layout)) {
        return renderInlineItems(data, index);
      }
      if (props.layout === "vertical") {
        return renderVerticalItems(data);
      }
      return renderHorizontalItems(data, index);
    };
    const cls = computed(() => [prefixCls, `${prefixCls}-layout-${props.layout}`, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-border`]: props.bordered
    }, {
      [`${prefixCls}-table-layout-fixed`]: props.tableLayout === "fixed"
    }]);
    const renderTitle = () => {
      var _a, _b;
      const title = (_b = (_a = slots.title) == null ? void 0 : _a.call(slots)) != null ? _b : props.title;
      if (title) {
        return createVNode("div", {
          "class": `${prefixCls}-title`
        }, [title]);
      }
      return null;
    };
    return () => {
      const _groupedData = slots.default ? getGroupedData(getAllElements(slots.default())) : groupedData.value;
      return createVNode("div", {
        "class": cls.value
      }, [renderTitle(), createVNode("div", {
        "class": `${prefixCls}-body`
      }, [createVNode("table", {
        "class": `${prefixCls}-table`
      }, [createVNode("tbody", null, [_groupedData.map((data, index) => renderItems(data, index))])])])]);
    };
  }
});
export { _Descriptions as default };
