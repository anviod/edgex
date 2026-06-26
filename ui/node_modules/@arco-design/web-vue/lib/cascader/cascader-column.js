"use strict";
var vue = require("vue");
var context = require("../config-provider/context.js");
var cascaderOption = require("./cascader-option.js");
var globalConfig = require("../_utils/global-config.js");
var index$1 = require("../empty/index.js");
var index = require("../scrollbar/index.js");
var virtualList = require("../_components/virtual-list-v2/virtual-list.js");
var CascaderColumn = vue.defineComponent({
  name: "CascaderColumn",
  props: {
    column: {
      type: Array,
      required: true
    },
    level: {
      type: Number,
      default: 0
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
    virtualListProps: {
      type: Object
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("cascader");
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    const virtualListRef = vue.ref();
    const isVirtual = vue.ref(Boolean(props.virtualListProps));
    const renderEmpty = () => {
      var _a, _b, _c, _d, _e;
      return (_e = (_d = (_a = slots.empty) == null ? void 0 : _a.call(slots)) != null ? _d : (_c = configCtx == null ? void 0 : (_b = configCtx.slots).empty) == null ? void 0 : _c.call(_b, {
        component: "cascader"
      })) != null ? _e : vue.createVNode(index$1, null, null);
    };
    return () => {
      var _a;
      return vue.createVNode("div", {
        "class": `${prefixCls}-panel-column`,
        "style": {
          zIndex: props.totalLevel - props.level
        }
      }, [props.column.length === 0 ? vue.createVNode(index, {
        "class": `${prefixCls}-column-content`
      }, {
        default: () => [vue.createVNode("div", {
          "class": `${prefixCls}-list-empty`
        }, [renderEmpty()])]
      }) : isVirtual.value ? vue.createVNode(virtualList, vue.mergeProps({
        "key": (_a = props.column) == null ? void 0 : _a.length
      }, props.virtualListProps, {
        "ref": virtualListRef,
        "data": props.column
      }), {
        item: ({
          item
        }) => {
          return vue.createVNode(cascaderOption, {
            "key": item.key,
            "option": item,
            "active": props.selectedPath.includes(item.key) || item.key === props.activeKey,
            "multiple": props.multiple,
            "checkStrictly": props.checkStrictly
          }, null);
        }
      }) : vue.createVNode(index, {
        "class": `${prefixCls}-column-content`
      }, {
        default: () => [vue.createVNode("ul", {
          "role": "menu",
          "class": [`${prefixCls}-list`, {
            [`${prefixCls}-list-multiple`]: Boolean(props == null ? void 0 : props.multiple),
            [`${prefixCls}-list-strictly`]: Boolean(props == null ? void 0 : props.checkStrictly)
          }]
        }, [props.column.map((item) => {
          return vue.createVNode(cascaderOption, {
            "key": item.key,
            "option": item,
            "active": props.selectedPath.includes(item.key) || item.key === props.activeKey,
            "multiple": props.multiple,
            "checkStrictly": props.checkStrictly
          }, null);
        })])]
      })]);
    };
  }
});
module.exports = CascaderColumn;
