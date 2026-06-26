"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("../config-provider/context.js");
var index$2 = require("../empty/index.js");
var index$1 = require("../spin/index.js");
var cascaderOption = require("./cascader-option.js");
var index = require("../scrollbar/index.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var CascaderSearchPanel = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("cascader");
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    const renderContent = () => {
      var _a, _b, _c, _d, _e;
      if (props.loading) {
        return vue.createVNode(index$1, null, null);
      }
      if (props.options.length === 0) {
        return vue.createVNode("div", {
          "class": `${prefixCls}-list-empty`
        }, [(_e = (_d = (_a = slots.empty) == null ? void 0 : _a.call(slots)) != null ? _d : (_c = configCtx == null ? void 0 : (_b = configCtx.slots).empty) == null ? void 0 : _c.call(_b, {
          component: "cascader"
        })) != null ? _e : vue.createVNode(index$2, null, null)]);
      }
      return vue.createVNode("ul", {
        "role": "menu",
        "class": [`${prefixCls}-list`, `${prefixCls}-search-list`, {
          [`${prefixCls}-list-multiple`]: props.multiple
        }]
      }, [props.options.map((item) => vue.createVNode(cascaderOption, {
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
      return vue.createVNode(index, {
        "class": [`${prefixCls}-panel`, `${prefixCls}-search-panel`]
      }, _isSlot(_slot = renderContent()) ? _slot : {
        default: () => [_slot]
      });
    };
  }
});
module.exports = CascaderSearchPanel;
