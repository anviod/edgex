import { defineComponent, inject, computed, createVNode } from "vue";
import { getOperationStyle, getOperationFixedCls } from "./utils.js";
import { getPrefixCls } from "../_utils/global-config.js";
import Checkbox from "../checkbox/index.js";
import { isFunction } from "../_utils/is.js";
import { tableInjectionKey } from "./context.js";
var OperationTh = defineComponent({
  name: "OperationTh",
  props: {
    operationColumn: {
      type: Object,
      required: true
    },
    operations: {
      type: Array,
      required: true
    },
    rowSpan: {
      type: Number,
      default: 1
    },
    selectAll: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("table");
    const tableCtx = inject(tableInjectionKey, {});
    const checkboxStatus = computed(() => {
      var _a, _b, _c, _d;
      let checked = false;
      let indeterminate = false;
      const currentSelectedEnabledRowKeys = (_b = (_a = tableCtx.currentSelectedRowKeys) == null ? void 0 : _a.filter((key) => {
        var _a2, _b2;
        return (_b2 = (_a2 = tableCtx.currentAllEnabledRowKeys) == null ? void 0 : _a2.includes(key)) != null ? _b2 : true;
      })) != null ? _b : [];
      const selectedNumber = currentSelectedEnabledRowKeys.length;
      const totalEnabledNumber = (_d = (_c = tableCtx.currentAllEnabledRowKeys) == null ? void 0 : _c.length) != null ? _d : 0;
      if (selectedNumber > 0) {
        if (selectedNumber >= totalEnabledNumber) {
          checked = true;
        } else {
          indeterminate = true;
        }
      }
      return {
        checked,
        indeterminate
      };
    });
    const renderContent = () => {
      if (props.selectAll) {
        return createVNode(Checkbox, {
          "modelValue": checkboxStatus.value.checked,
          "indeterminate": checkboxStatus.value.indeterminate,
          "uninjectGroupContext": true,
          "onChange": (checked) => {
            var _a;
            (_a = tableCtx.onSelectAll) == null ? void 0 : _a.call(tableCtx, checked);
          }
        }, {
          default: isFunction(props.operationColumn.title) ? props.operationColumn.title() : props.operationColumn.title
        });
      }
      if (props.operationColumn.title) {
        return isFunction(props.operationColumn.title) ? props.operationColumn.title() : props.operationColumn.title;
      }
      return null;
    };
    const style = computed(() => getOperationStyle(props.operationColumn, props.operations));
    const cls = computed(() => [`${prefixCls}-th`, `${prefixCls}-operation`, {
      [`${prefixCls}-checkbox`]: props.selectAll
    }, ...getOperationFixedCls(prefixCls, props.operationColumn)]);
    return () => createVNode("th", {
      "class": cls.value,
      "style": style.value,
      "rowspan": props.rowSpan > 1 ? props.rowSpan : void 0
    }, [createVNode("span", {
      "class": `${prefixCls}-cell`
    }, [renderContent()])]);
  }
});
export { OperationTh as default };
