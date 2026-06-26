"use strict";
var vue = require("vue");
var index = require("../checkbox/index.js");
var index$1 = require("../radio/index.js");
var globalConfig = require("../_utils/global-config.js");
var index$3 = require("../icon/icon-right/index.js");
var index$2 = require("../icon/icon-loading/index.js");
var utils = require("./utils.js");
var is = require("../_utils/is.js");
var context = require("./context.js");
var CascaderOption = vue.defineComponent({
  name: "CascaderOption",
  props: {
    option: {
      type: Object,
      required: true
    },
    active: Boolean,
    multiple: Boolean,
    checkStrictly: Boolean,
    searchOption: Boolean,
    pathLabel: Boolean
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("cascader-option");
    const cascaderCtx = vue.inject(context.cascaderInjectionKey, {});
    const isLoading = vue.ref(false);
    const events = {};
    const handlePathChange = (ev) => {
      var _a;
      if (is.isFunction(cascaderCtx.loadMore) && !props.option.isLeaf) {
        const {
          isLeaf,
          children,
          key
        } = props.option;
        if (!isLeaf && !children) {
          isLoading.value = true;
          new Promise((resolve) => {
            var _a2;
            (_a2 = cascaderCtx.loadMore) == null ? void 0 : _a2.call(cascaderCtx, props.option.raw, resolve);
          }).then((children2) => {
            var _a2;
            isLoading.value = false;
            if (children2) {
              (_a2 = cascaderCtx.addLazyLoadOptions) == null ? void 0 : _a2.call(cascaderCtx, children2, key);
            }
          });
        }
      }
      (_a = cascaderCtx.setSelectedPath) == null ? void 0 : _a.call(cascaderCtx, props.option.key);
    };
    if (!props.option.disabled) {
      events.onMouseenter = [() => {
        var _a;
        return (_a = cascaderCtx.setActiveKey) == null ? void 0 : _a.call(cascaderCtx, props.option.key);
      }];
      events.onMouseleave = () => {
        var _a;
        return (_a = cascaderCtx.setActiveKey) == null ? void 0 : _a.call(cascaderCtx);
      };
      events.onClick = [];
      if (cascaderCtx.expandTrigger === "hover") {
        events.onMouseenter.push((ev) => handlePathChange());
      } else {
        events.onClick.push((ev) => handlePathChange());
      }
      if (props.option.isLeaf && !props.multiple) {
        events.onClick.push((ev) => {
          var _a;
          handlePathChange();
          (_a = cascaderCtx.onClickOption) == null ? void 0 : _a.call(cascaderCtx, props.option);
        });
      }
    }
    const cls = vue.computed(() => [prefixCls, {
      [`${prefixCls}-active`]: props.active,
      [`${prefixCls}-disabled`]: props.option.disabled
    }]);
    const checkedStatus = vue.computed(() => {
      var _a;
      if (props.checkStrictly) {
        return {
          checked: (_a = cascaderCtx.valueMap) == null ? void 0 : _a.has(props.option.key),
          indeterminate: false
        };
      }
      return utils.getCheckedStatus(props.option, cascaderCtx.valueMap);
    });
    const renderLabelContent = () => {
      var _a, _b, _c;
      if (props.pathLabel) {
        return (_b = (_a = cascaderCtx == null ? void 0 : cascaderCtx.formatLabel) == null ? void 0 : _a.call(cascaderCtx, props.option.path.map((item) => item.raw))) != null ? _b : utils.getOptionLabel(props.option);
      }
      if ((_c = cascaderCtx.slots) == null ? void 0 : _c.option) {
        return cascaderCtx.slots.option({
          data: props.option
        });
      }
      if (is.isFunction(props.option.render)) {
        return props.option.render();
      }
      return props.option.label;
    };
    const renderIcon = () => {
      if (isLoading.value) {
        return vue.createVNode(index$2, null, null);
      }
      if (!props.searchOption && !props.option.isLeaf) {
        return vue.createVNode(index$3, null, null);
      }
      return null;
    };
    return () => {
      var _a;
      return vue.createVNode("li", vue.mergeProps({
        "tabindex": "0",
        "role": "menuitem",
        "aria-disabled": props.option.disabled,
        "aria-haspopup": !props.option.isLeaf,
        "aria-expanded": !props.option.isLeaf && props.active,
        "title": props.option.label,
        "class": cls.value
      }, events), [props.multiple && vue.createVNode(index["default"], {
        "modelValue": checkedStatus.value.checked,
        "indeterminate": checkedStatus.value.indeterminate,
        "disabled": props.option.disabled || props.option.selectionDisabled,
        "uninjectGroupContext": true,
        "onChange": (value, ev) => {
          var _a2;
          ev.stopPropagation();
          handlePathChange();
          (_a2 = cascaderCtx.onClickOption) == null ? void 0 : _a2.call(cascaderCtx, props.option, !checkedStatus.value.checked);
        },
        "onClick": (ev) => ev.stopPropagation()
      }, null), props.checkStrictly && !props.multiple && vue.createVNode(index$1["default"], {
        "modelValue": (_a = cascaderCtx.valueMap) == null ? void 0 : _a.has(props.option.key),
        "disabled": props.option.disabled,
        "uninjectGroupContext": true,
        "onChange": (value, ev) => {
          var _a2;
          ev.stopPropagation();
          handlePathChange();
          (_a2 = cascaderCtx.onClickOption) == null ? void 0 : _a2.call(cascaderCtx, props.option, true);
        },
        "onClick": (ev) => ev.stopPropagation()
      }, null), vue.createVNode("div", {
        "class": `${prefixCls}-label`
      }, [renderLabelContent(), renderIcon()])]);
    };
  }
});
module.exports = CascaderOption;
