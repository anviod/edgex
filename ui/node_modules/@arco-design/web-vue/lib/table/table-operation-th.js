"use strict";
var vue = require("vue");
var utils = require("./utils.js");
var globalConfig = require("../_utils/global-config.js");
var index = require("../checkbox/index.js");
var is = require("../_utils/is.js");
var context = require("./context.js");
var OperationTh = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("table");
    const tableCtx = vue.inject(context.tableInjectionKey, {});
    const checkboxStatus = vue.computed(() => {
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
        return vue.createVNode(index["default"], {
          "modelValue": checkboxStatus.value.checked,
          "indeterminate": checkboxStatus.value.indeterminate,
          "uninjectGroupContext": true,
          "onChange": (checked) => {
            var _a;
            (_a = tableCtx.onSelectAll) == null ? void 0 : _a.call(tableCtx, checked);
          }
        }, {
          default: is.isFunction(props.operationColumn.title) ? props.operationColumn.title() : props.operationColumn.title
        });
      }
      if (props.operationColumn.title) {
        return is.isFunction(props.operationColumn.title) ? props.operationColumn.title() : props.operationColumn.title;
      }
      return null;
    };
    const style = vue.computed(() => utils.getOperationStyle(props.operationColumn, props.operations));
    const cls = vue.computed(() => [`${prefixCls}-th`, `${prefixCls}-operation`, {
      [`${prefixCls}-checkbox`]: props.selectAll
    }, ...utils.getOperationFixedCls(prefixCls, props.operationColumn)]);
    return () => vue.createVNode("th", {
      "class": cls.value,
      "style": style.value,
      "rowspan": props.rowSpan > 1 ? props.rowSpan : void 0
    }, [vue.createVNode("span", {
      "class": `${prefixCls}-cell`
    }, [renderContent()])]);
  }
});
module.exports = OperationTh;
