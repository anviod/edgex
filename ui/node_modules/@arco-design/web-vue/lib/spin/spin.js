"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-loading/index.js");
var dotLoading = require("./dot-loading.js");
var vueUtils = require("../_utils/vue-utils.js");
var context = require("../config-provider/context.js");
var _Spin = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("spin");
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    const cls = vue.computed(() => [prefixCls, {
      [`${prefixCls}-loading`]: props.loading,
      [`${prefixCls}-with-tip`]: props.tip && !slots.default
    }]);
    const renderIcon = () => {
      if (slots.icon) {
        const iconVNode = vueUtils.getFirstComponent(slots.icon());
        if (iconVNode) {
          return vue.cloneVNode(iconVNode, {
            spin: true
          });
        }
      }
      if (slots.element) {
        return slots.element();
      }
      if (props.dot) {
        return vue.createVNode(dotLoading, {
          "size": props.size
        }, null);
      }
      if (configCtx == null ? void 0 : configCtx.slots.loading) {
        return configCtx.slots.loading();
      }
      return vue.createVNode(index, {
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
      return vue.createVNode(vue.Fragment, null, [!props.hideIcon && vue.createVNode("div", {
        "class": `${prefixCls}-icon`,
        "style": style
      }, [renderIcon()]), hasTip && vue.createVNode("div", {
        "class": `${prefixCls}-tip`
      }, [(_c = (_b = slots.tip) == null ? void 0 : _b.call(slots)) != null ? _c : props.tip])]);
    };
    return () => vue.createVNode("div", {
      "class": cls.value
    }, [slots.default ? vue.createVNode(vue.Fragment, null, [slots.default(), props.loading && vue.createVNode("div", {
      "class": `${prefixCls}-mask`
    }, [vue.createVNode("div", {
      "class": `${prefixCls}-mask-icon`
    }, [renderSpinIcon()])])]) : renderSpinIcon()]);
  }
});
module.exports = _Spin;
