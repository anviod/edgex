import { defineComponent, inject, createVNode, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
import Empty from "../empty/index.js";
import Spin from "../spin/index.js";
import CascaderOption from "./cascader-option.js";
import Scrollbar from "../scrollbar/index.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var CascaderSearchPanel = defineComponent({
  name: "CascaderSearchPanel",
  props: {
    options: {
      type: Array,
      required: true
    },
    loading: Boolean,
    activeKey: String,
    multiple: Boolean,
    checkStrictly: Boolean,
    pathLabel: Boolean
  },
  setup(props, {
    slots
  }) {
    const prefixCls = getPrefixCls("cascader");
    const configCtx = inject(configProviderInjectionKey, void 0);
    const renderContent = () => {
      var _a, _b, _c, _d, _e;
      if (props.loading) {
        return createVNode(Spin, null, null);
      }
      if (props.options.length === 0) {
        return createVNode("div", {
          "class": `${prefixCls}-list-empty`
        }, [(_e = (_d = (_a = slots.empty) == null ? void 0 : _a.call(slots)) != null ? _d : (_c = configCtx == null ? void 0 : (_b = configCtx.slots).empty) == null ? void 0 : _c.call(_b, {
          component: "cascader"
        })) != null ? _e : createVNode(Empty, null, null)]);
      }
      return createVNode("ul", {
        "role": "menu",
        "class": [`${prefixCls}-list`, `${prefixCls}-search-list`, {
          [`${prefixCls}-list-multiple`]: props.multiple
        }]
      }, [props.options.map((item) => createVNode(CascaderOption, {
        "key": item.key,
        "class": `${prefixCls}-search-option`,
        "option": item,
        "active": item.key === props.activeKey,
        "multiple": props.multiple,
        "checkStrictly": props.checkStrictly,
        "pathLabel": props.pathLabel,
        "searchOption": true
      }, null))]);
    };
    return () => {
      let _slot;
      return createVNode(Scrollbar, {
        "class": [`${prefixCls}-panel`, `${prefixCls}-search-panel`]
      }, _isSlot(_slot = renderContent()) ? _slot : {
        default: () => [_slot]
      });
    };
  }
});
export { CascaderSearchPanel as default };
