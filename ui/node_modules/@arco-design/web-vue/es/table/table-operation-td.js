import { defineComponent, inject, computed, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { getOperationStyle, getOperationFixedCls, getLeafKeys, getSelectionStatus } from "./utils.js";
import Checkbox from "../checkbox/index.js";
import Radio from "../radio/index.js";
import IconPlus from "../icon/icon-plus/index.js";
import IconMinus from "../icon/icon-minus/index.js";
import IconDragDotVertical from "../icon/icon-drag-dot-vertical/index.js";
import { tableInjectionKey } from "./context.js";
var OperationTd = defineComponent({
  name: "OperationTd",
  components: {
    Checkbox,
    Radio,
    IconPlus,
    IconMinus
  },
  props: {
    operationColumn: {
      type: Object,
      required: true
    },
    operations: {
      type: Array,
      required: true
    },
    record: {
      type: Object,
      required: true
    },
    hasExpand: {
      type: Boolean,
      default: false
    },
    selectedRowKeys: {
      type: Array
    },
    renderExpandBtn: {
      type: Function
    },
    colSpan: {
      type: Number,
      default: 1
    },
    rowSpan: {
      type: Number,
      default: 1
    },
    summary: {
      type: Boolean,
      default: false
    }
  },
  emits: ["select"],
  setup(props, {
    emit,
    slots
  }) {
    const prefixCls = getPrefixCls("table");
    const tableCtx = inject(tableInjectionKey, {});
    const style = computed(() => getOperationStyle(props.operationColumn, props.operations));
    const cls = computed(() => [`${prefixCls}-td`, `${prefixCls}-operation`, {
      [`${prefixCls}-checkbox`]: props.operationColumn.name === "selection-checkbox",
      [`${prefixCls}-radio`]: props.operationColumn.name === "selection-radio",
      [`${prefixCls}-expand`]: props.operationColumn.name === "expand",
      [`${prefixCls}-drag-handle`]: props.operationColumn.name === "drag-handle"
    }, ...getOperationFixedCls(prefixCls, props.operationColumn)]);
    const leafKeys = computed(() => getLeafKeys(props.record));
    const selectionStatus = computed(() => {
      var _a;
      return getSelectionStatus((_a = tableCtx.currentSelectedRowKeys) != null ? _a : [], leafKeys.value);
    });
    const renderContent = () => {
      var _a, _b, _c, _d, _e, _f;
      if (props.summary) {
        return null;
      }
      if (props.operationColumn.render) {
        return props.operationColumn.render(props.record.raw);
      }
      if (props.operationColumn.name === "selection-checkbox") {
        const value = props.record.key;
        if (!tableCtx.checkStrictly && !props.record.isLeaf) {
          return createVNode(Checkbox, {
            "modelValue": selectionStatus.value.checked,
            "indeterminate": selectionStatus.value.indeterminate,
            "disabled": Boolean(props.record.disabled),
            "uninjectGroupContext": true,
            "onChange": (checked) => {
              var _a2;
              return (_a2 = tableCtx.onSelectAllLeafs) == null ? void 0 : _a2.call(tableCtx, props.record, checked);
            },
            "onClick": (ev) => ev.stopPropagation()
          }, null);
        }
        return createVNode(Checkbox, {
          "modelValue": (_b = (_a = props.selectedRowKeys) == null ? void 0 : _a.includes(value)) != null ? _b : false,
          "disabled": Boolean(props.record.disabled),
          "uninjectGroupContext": true,
          "onChange": (checked) => {
            var _a2;
            return (_a2 = tableCtx.onSelect) == null ? void 0 : _a2.call(tableCtx, checked, props.record);
          },
          "onClick": (ev) => ev.stopPropagation()
        }, null);
      }
      if (props.operationColumn.name === "selection-radio") {
        const value = props.record.key;
        return createVNode(Radio, {
          "modelValue": (_d = (_c = props.selectedRowKeys) == null ? void 0 : _c.includes(value)) != null ? _d : false,
          "disabled": Boolean(props.record.disabled),
          "uninjectGroupContext": true,
          "onChange": (checked) => {
            var _a2;
            return (_a2 = tableCtx.onSelect) == null ? void 0 : _a2.call(tableCtx, checked, props.record);
          },
          "onClick": (ev) => ev.stopPropagation()
        }, null);
      }
      if (props.operationColumn.name === "expand") {
        if (props.hasExpand && props.renderExpandBtn) {
          return props.renderExpandBtn(props.record);
        }
        return null;
      }
      if (props.operationColumn.name === "drag-handle") {
        return (_f = (_e = slots["drag-handle-icon"]) == null ? void 0 : _e.call(slots)) != null ? _f : createVNode(IconDragDotVertical, null, null);
      }
      return null;
    };
    return () => createVNode("td", {
      "class": cls.value,
      "style": style.value,
      "rowspan": props.rowSpan > 1 ? props.rowSpan : void 0,
      "colspan": props.colSpan > 1 ? props.colSpan : void 0
    }, [createVNode("span", {
      "class": `${prefixCls}-cell`
    }, [renderContent()])]);
  }
});
export { OperationTd as default };
