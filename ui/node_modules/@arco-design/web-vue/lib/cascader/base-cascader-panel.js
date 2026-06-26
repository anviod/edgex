"use strict";
var vue = require("vue");
var context = require("../config-provider/context.js");
var globalConfig = require("../_utils/global-config.js");
var index$1 = require("../empty/index.js");
var index = require("../spin/index.js");
var cascaderColumn = require("./cascader-column.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var BaseCascaderPanel = vue.defineComponent({
  name: "BaseCascaderPanel",
  props: {
    displayColumns: {
      type: Array,
      required: true
    },
    selectedPath: {
      type: Array,
      required: true
    },
    activeKey: String,
    totalLevel: {
      type: Number,
      required: true
    },
    multiple: Boolean,
    checkStrictly: Boolean,
    loading: Boolean,
    dropdown: Boolean,
    virtualListProps: {
      type: Object
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("cascader");
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    const renderEmpty = () => {
      var _a, _b, _c, _d, _e;
      return (_e = (_d = (_a = slots.empty) == null ? void 0 : _a.call(slots)) != null ? _d : (_c = configCtx == null ? void 0 : (_b = configCtx.slots).empty) == null ? void 0 : _c.call(_b, {
        component: "cascader"
      })) != null ? _e : vue.createVNode(index$1, null, null);
    };
    const renderContent = () => {
      if (props.loading) {
        return vue.createVNode("div", {
          "key": "panel-column-loading",
          "class": [`${prefixCls}-panel-column`, `${prefixCls}-panel-column-loading`]
        }, [vue.createVNode(index, null, null)]);
      }
      if (props.displayColumns.length === 0) {
        return vue.createVNode("div", {
          "key": "panel-column-empty",
          "class": `${prefixCls}-panel-column`
        }, [vue.createVNode("div", {
          "class": `${prefixCls}-list-empty`
        }, [renderEmpty()])]);
      }
      return props.displayColumns.map((column, index2) => vue.createVNode(cascaderColumn, {
        "key": `column-${index2}`,
        "column": column,
        "level": index2,
        "selectedPath": props.selectedPath,
        "activeKey": props.activeKey,
        "totalLevel": props.totalLevel,
        "multiple": props.multiple,
        "checkStrictly": props.checkStrictly,
        "virtualListProps": props.virtualListProps
      }, {
        empty: slots.empty
      }));
    };
    return () => {
      let _slot;
      return vue.createVNode(vue.TransitionGroup, {
        "tag": "div",
        "name": "cascader-slide",
        "class": [`${prefixCls}-panel`, {
          [`${prefixCls}-dropdown-panel`]: props.dropdown
        }]
      }, _isSlot(_slot = renderContent()) ? _slot : {
        default: () => [_slot]
      });
    };
  }
});
module.exports = BaseCascaderPanel;
