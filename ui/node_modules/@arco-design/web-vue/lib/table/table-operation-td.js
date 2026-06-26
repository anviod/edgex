"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var utils = require("./utils.js");
var index = require("../checkbox/index.js");
var index$1 = require("../radio/index.js");
var index$2 = require("../icon/icon-plus/index.js");
var index$3 = require("../icon/icon-minus/index.js");
var index$4 = require("../icon/icon-drag-dot-vertical/index.js");
var context = require("./context.js");
var OperationTd = vue.defineComponent({
  name: "OperationTd",
  components: {
    Checkbox: index["default"],
    Radio: index$1["default"],
    IconPlus: index$2,
    IconMinus: index$3
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
    const prefixCls = globalConfig.getPrefixCls("table");
    const tableCtx = vue.inject(context.tableInjectionKey, {});
    const style = vue.computed(() => utils.getOperationStyle(props.operationColumn, props.operations));
    const cls = vue.computed(() => [`${prefixCls}-td`, `${prefixCls}-operation`, {
      [`${prefixCls}-checkbox`]: props.operationColumn.name === "selection-checkbox",
      [`${prefixCls}-radio`]: props.operationColumn.name === "selection-radio",
      [`${prefixCls}-expand`]: props.operationColumn.name === "expand",
      [`${prefixCls}-drag-handle`]: props.operationColumn.name === "drag-handle"
    }, ...utils.getOperationFixedCls(prefixCls, props.operationColumn)]);
    const leafKeys = vue.computed(() => utils.getLeafKeys(props.record));
    const selectionStatus = vue.computed(() => {
      var _a;
      return utils.getSelectionStatus((_a = tableCtx.currentSelectedRowKeys) != null ? _a : [], leafKeys.value);
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
          return vue.createVNode(index["default"], {
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
        return vue.createVNode(index["default"], {
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
        return vue.createVNode(index$1["default"], {
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
        return (_f = (_e = slots["drag-handle-icon"]) == null ? void 0 : _e.call(slots)) != null ? _f : vue.createVNode(index$4, null, null);
      }
      return null;
    };
    return () => vue.createVNode("td", {
      "class": cls.value,
      "style": style.value,
      "rowspan": props.rowSpan > 1 ? props.rowSpan : void 0,
      "colspan": props.colSpan > 1 ? props.colSpan : void 0
    }, [vue.createVNode("span", {
      "class": `${prefixCls}-cell`
    }, [renderContent()])]);
  }
});
module.exports = OperationTd;
