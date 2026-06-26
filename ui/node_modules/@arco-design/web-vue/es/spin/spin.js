import { defineComponent, inject, computed, createVNode, Fragment, cloneVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconLoading from "../icon/icon-loading/index.js";
import DotLoading from "./dot-loading.js";
import { getFirstComponent } from "../_utils/vue-utils.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
var _Spin = defineComponent({
  name: "Spin",
  props: {
    size: {
      type: Number
    },
    loading: Boolean,
    dot: Boolean,
    tip: String,
    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = getPrefixCls("spin");
    const configCtx = inject(configProviderInjectionKey, void 0);
    const cls = computed(() => [prefixCls, {
      [`${prefixCls}-loading`]: props.loading,
      [`${prefixCls}-with-tip`]: props.tip && !slots.default
    }]);
    const renderIcon = () => {
      if (slots.icon) {
        const iconVNode = getFirstComponent(slots.icon());
        if (iconVNode) {
          return cloneVNode(iconVNode, {
            spin: true
          });
        }
      }
      if (slots.element) {
        return slots.element();
      }
      if (props.dot) {
        return createVNode(DotLoading, {
          "size": props.size
        }, null);
      }
      if (configCtx == null ? void 0 : configCtx.slots.loading) {
        return configCtx.slots.loading();
      }
      return createVNode(IconLoading, {
        "spin": true,
        "size": props.size
      }, null);
    };
    const renderSpinIcon = () => {
      var _a, _b, _c;
      const style = props.size ? {
        fontSize: `${props.size}px`
      } : void 0;
      const hasTip = Boolean((_a = slots.tip) != null ? _a : props.tip);
      return createVNode(Fragment, null, [!props.hideIcon && createVNode("div", {
        "class": `${prefixCls}-icon`,
        "style": style
      }, [renderIcon()]), hasTip && createVNode("div", {
        "class": `${prefixCls}-tip`
      }, [(_c = (_b = slots.tip) == null ? void 0 : _b.call(slots)) != null ? _c : props.tip])]);
    };
    return () => createVNode("div", {
      "class": cls.value
    }, [slots.default ? createVNode(Fragment, null, [slots.default(), props.loading && createVNode("div", {
      "class": `${prefixCls}-mask`
    }, [createVNode("div", {
      "class": `${prefixCls}-mask-icon`
    }, [renderSpinIcon()])])]) : renderSpinIcon()]);
  }
});
export { _Spin as default };
