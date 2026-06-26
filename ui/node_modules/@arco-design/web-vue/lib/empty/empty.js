"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index$1 = require("../icon/icon-empty/index.js");
var index = require("../locale/index.js");
var context = require("../config-provider/context.js");
var Empty = vue.defineComponent({
  name: "Empty",
  inheritAttrs: false,
  props: {
    description: String,
    imgSrc: String,
    inConfigProvider: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {
    slots,
    attrs
  }) {
    const prefixCls = globalConfig.getPrefixCls("empty");
    const {
      t
    } = index.useI18n();
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    return () => {
      var _a, _b, _c, _d;
      if (!props.inConfigProvider && (configCtx == null ? void 0 : configCtx.slots.empty) && !(slots.image || props.imgSrc || props.description)) {
        return configCtx.slots.empty({
          component: "empty"
        });
      }
      return vue.createVNode("div", vue.mergeProps({
        "class": prefixCls
      }, attrs), [vue.createVNode("div", {
        "class": `${prefixCls}-image`
      }, [(_b = (_a = slots.image) == null ? void 0 : _a.call(slots)) != null ? _b : props.imgSrc ? vue.createVNode("img", {
        "src": props.imgSrc,
        "alt": props.description || "empty"
      }, null) : vue.createVNode(index$1, null, null)]), vue.createVNode("div", {
        "class": `${prefixCls}-description`
      }, [(_d = (_c = slots.default) == null ? void 0 : _c.call(slots)) != null ? _d : props.description || t("empty.description")])]);
    };
  }
});
module.exports = Empty;
