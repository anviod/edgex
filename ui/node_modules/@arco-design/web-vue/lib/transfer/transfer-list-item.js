"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var iconHover = require("../_components/icon-hover.js");
var index = require("../checkbox/index.js");
var index$1 = require("../icon/icon-close/index.js");
var context = require("./context.js");
var TransferListItem = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("transfer-list-item");
    const transferCtx = vue.inject(context.transferInjectionKey, void 0);
    const handleClick = () => {
      if (props.simple && !props.disabled) {
        transferCtx == null ? void 0 : transferCtx.moveTo([props.data.value], props.type === "target" ? "source" : "target");
      }
    };
    const cls = vue.computed(() => [prefixCls, {
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-draggable`]: props.draggable
    }]);
    const handleRemove = () => {
      transferCtx == null ? void 0 : transferCtx.moveTo([props.data.value], "source");
    };
    return () => {
      var _a, _b, _c;
      return vue.createVNode("div", {
        "class": cls.value,
        "onClick": handleClick
      }, [props.allowClear || props.simple ? vue.createVNode("span", {
        "class": `${prefixCls}-content`
      }, [(_c = (_b = transferCtx == null ? void 0 : (_a = transferCtx.slots).item) == null ? void 0 : _b.call(_a, {
        label: props.data.label,
        value: props.data.value
      })) != null ? _c : props.data.label]) : vue.createVNode(index["default"], {
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
      }), props.allowClear && !props.disabled && vue.createVNode(iconHover, {
        "class": `${prefixCls}-remove-btn`,
        "onClick": handleRemove
      }, {
        default: () => [vue.createVNode(index$1, null, null)]
      })]);
    };
  }
});
module.exports = TransferListItem;
