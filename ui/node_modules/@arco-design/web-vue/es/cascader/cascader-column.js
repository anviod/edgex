import { defineComponent, inject, ref, createVNode, mergeProps } from "vue";
import { configProviderInjectionKey } from "../config-provider/context.js";
import CascaderOption from "./cascader-option.js";
import { getPrefixCls } from "../_utils/global-config.js";
import Empty from "../empty/index.js";
import Scrollbar from "../scrollbar/index.js";
import VirtualList from "../_components/virtual-list-v2/virtual-list.js";
var CascaderColumn = defineComponent({
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
    const prefixCls = getPrefixCls("cascader");
    const configCtx = inject(configProviderInjectionKey, void 0);
    const virtualListRef = ref();
    const isVirtual = ref(Boolean(props.virtualListProps));
    const renderEmpty = () => {
      var _a, _b, _c, _d, _e;
      return (_e = (_d = (_a = slots.empty) == null ? void 0 : _a.call(slots)) != null ? _d : (_c = configCtx == null ? void 0 : (_b = configCtx.slots).empty) == null ? void 0 : _c.call(_b, {
        component: "cascader"
      })) != null ? _e : createVNode(Empty, null, null);
    };
    return () => {
      var _a;
      return createVNode("div", {
        "class": `${prefixCls}-panel-column`,
        "style": {
          zIndex: props.totalLevel - props.level
        }
      }, [props.column.length === 0 ? createVNode(Scrollbar, {
        "class": `${prefixCls}-column-content`
      }, {
        default: () => [createVNode("div", {
          "class": `${prefixCls}-list-empty`
        }, [renderEmpty()])]
      }) : isVirtual.value ? createVNode(VirtualList, mergeProps({
        "key": (_a = props.column) == null ? void 0 : _a.length
      }, props.virtualListProps, {
        "ref": virtualListRef,
        "data": props.column
      }), {
        item: ({
          item
        }) => {
          return createVNode(CascaderOption, {
            "key": item.key,
            "option": item,
            "active": props.selectedPath.includes(item.key) || item.key === props.activeKey,
            "multiple": props.multiple,
            "checkStrictly": props.checkStrictly
          }, null);
        }
      }) : createVNode(Scrollbar, {
        "class": `${prefixCls}-column-content`
      }, {
        default: () => [createVNode("ul", {
          "role": "menu",
          "class": [`${prefixCls}-list`, {
            [`${prefixCls}-list-multiple`]: Boolean(props == null ? void 0 : props.multiple),
            [`${prefixCls}-list-strictly`]: Boolean(props == null ? void 0 : props.checkStrictly)
          }]
        }, [props.column.map((item) => {
          return createVNode(CascaderOption, {
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
export { CascaderColumn as default };
