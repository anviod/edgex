import { defineComponent, inject, computed, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import Checkbox from "../checkbox/index.js";
import IconClose from "../icon/icon-close/index.js";
import { transferInjectionKey } from "./context.js";
var TransferListItem = defineComponent({
  name: "TransferListItem",
  props: {
    type: {
      type: String
    },
    data: {
      type: Object,
      required: true
    },
    allowClear: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    draggable: {
      type: Boolean
    },
    simple: Boolean
  },
  setup(props) {
    const prefixCls = getPrefixCls("transfer-list-item");
    const transferCtx = inject(transferInjectionKey, void 0);
    const handleClick = () => {
      if (props.simple && !props.disabled) {
        transferCtx == null ? void 0 : transferCtx.moveTo([props.data.value], props.type === "target" ? "source" : "target");
      }
    };
    const cls = computed(() => [prefixCls, {
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-draggable`]: props.draggable
    }]);
    const handleRemove = () => {
      transferCtx == null ? void 0 : transferCtx.moveTo([props.data.value], "source");
    };
    return () => {
      var _a, _b, _c;
      return createVNode("div", {
        "class": cls.value,
        "onClick": handleClick
      }, [props.allowClear || props.simple ? createVNode("span", {
        "class": `${prefixCls}-content`
      }, [(_c = (_b = transferCtx == null ? void 0 : (_a = transferCtx.slots).item) == null ? void 0 : _b.call(_a, {
        label: props.data.label,
        value: props.data.value
      })) != null ? _c : props.data.label]) : createVNode(Checkbox, {
        "class": [`${prefixCls}-content`, `${prefixCls}-checkbox`],
        "modelValue": transferCtx == null ? void 0 : transferCtx.selected,
        "value": props.data.value,
        "onChange": (value) => transferCtx == null ? void 0 : transferCtx.onSelect(value),
        "uninjectGroupContext": true,
        "disabled": props.disabled
      }, {
        default: () => {
          var _a2, _b2, _c2;
          return [(_c2 = (_b2 = transferCtx == null ? void 0 : (_a2 = transferCtx.slots).item) == null ? void 0 : _b2.call(_a2, {
            label: props.data.label,
            value: props.data.value
          })) != null ? _c2 : props.data.label];
        }
      }), props.allowClear && !props.disabled && createVNode(IconHover, {
        "class": `${prefixCls}-remove-btn`,
        "onClick": handleRemove
      }, {
        default: () => [createVNode(IconClose, null, null)]
      })]);
    };
  }
});
export { TransferListItem as default };
