import { defineComponent, inject, createVNode, TransitionGroup, isVNode } from "vue";
import { configProviderInjectionKey } from "../config-provider/context.js";
import { getPrefixCls } from "../_utils/global-config.js";
import Empty from "../empty/index.js";
import Spin from "../spin/index.js";
import CascaderColumn from "./cascader-column.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var BaseCascaderPanel = defineComponent({
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
    const prefixCls = getPrefixCls("cascader");
    const configCtx = inject(configProviderInjectionKey, void 0);
    const renderEmpty = () => {
      var _a, _b, _c, _d, _e;
      return (_e = (_d = (_a = slots.empty) == null ? void 0 : _a.call(slots)) != null ? _d : (_c = configCtx == null ? void 0 : (_b = configCtx.slots).empty) == null ? void 0 : _c.call(_b, {
        component: "cascader"
      })) != null ? _e : createVNode(Empty, null, null);
    };
    const renderContent = () => {
      if (props.loading) {
        return createVNode("div", {
          "key": "panel-column-loading",
          "class": [`${prefixCls}-panel-column`, `${prefixCls}-panel-column-loading`]
        }, [createVNode(Spin, null, null)]);
      }
      if (props.displayColumns.length === 0) {
        return createVNode("div", {
          "key": "panel-column-empty",
          "class": `${prefixCls}-panel-column`
        }, [createVNode("div", {
          "class": `${prefixCls}-list-empty`
        }, [renderEmpty()])]);
      }
      return props.displayColumns.map((column, index) => createVNode(CascaderColumn, {
        "key": `column-${index}`,
        "column": column,
        "level": index,
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
      return createVNode(TransitionGroup, {
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
export { BaseCascaderPanel as default };
