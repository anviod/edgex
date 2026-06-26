import { defineComponent, inject, ref, computed, createVNode, mergeProps } from "vue";
import Checkbox from "../checkbox/index.js";
import Radio from "../radio/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import IconRight from "../icon/icon-right/index.js";
import IconLoading from "../icon/icon-loading/index.js";
import { getCheckedStatus, getOptionLabel } from "./utils.js";
import { isFunction } from "../_utils/is.js";
import { cascaderInjectionKey } from "./context.js";
var CascaderOption = defineComponent({
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
    const prefixCls = getPrefixCls("cascader-option");
    const cascaderCtx = inject(cascaderInjectionKey, {});
    const isLoading = ref(false);
    const events = {};
    const handlePathChange = (ev) => {
      var _a;
      if (isFunction(cascaderCtx.loadMore) && !props.option.isLeaf) {
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
    const cls = computed(() => [prefixCls, {
      [`${prefixCls}-active`]: props.active,
      [`${prefixCls}-disabled`]: props.option.disabled
    }]);
    const checkedStatus = computed(() => {
      var _a;
      if (props.checkStrictly) {
        return {
          checked: (_a = cascaderCtx.valueMap) == null ? void 0 : _a.has(props.option.key),
          indeterminate: false
        };
      }
      return getCheckedStatus(props.option, cascaderCtx.valueMap);
    });
    const renderLabelContent = () => {
      var _a, _b, _c;
      if (props.pathLabel) {
        return (_b = (_a = cascaderCtx == null ? void 0 : cascaderCtx.formatLabel) == null ? void 0 : _a.call(cascaderCtx, props.option.path.map((item) => item.raw))) != null ? _b : getOptionLabel(props.option);
      }
      if ((_c = cascaderCtx.slots) == null ? void 0 : _c.option) {
        return cascaderCtx.slots.option({
          data: props.option
        });
      }
      if (isFunction(props.option.render)) {
        return props.option.render();
      }
      return props.option.label;
    };
    const renderIcon = () => {
      if (isLoading.value) {
        return createVNode(IconLoading, null, null);
      }
      if (!props.searchOption && !props.option.isLeaf) {
        return createVNode(IconRight, null, null);
      }
      return null;
    };
    return () => {
      var _a;
      return createVNode("li", mergeProps({
        "tabindex": "0",
        "role": "menuitem",
        "aria-disabled": props.option.disabled,
        "aria-haspopup": !props.option.isLeaf,
        "aria-expanded": !props.option.isLeaf && props.active,
        "title": props.option.label,
        "class": cls.value
      }, events), [props.multiple && createVNode(Checkbox, {
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
      }, null), props.checkStrictly && !props.multiple && createVNode(Radio, {
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
      }, null), createVNode("div", {
        "class": `${prefixCls}-label`
      }, [renderLabelContent(), renderIcon()])]);
    };
  }
});
export { CascaderOption as default };
