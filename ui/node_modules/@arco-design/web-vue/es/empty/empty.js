import { defineComponent, inject, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconEmpty from "../icon/icon-empty/index.js";
import { useI18n } from "../locale/index.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
var Empty = defineComponent({
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
    const prefixCls = getPrefixCls("empty");
    const {
      t
    } = useI18n();
    const configCtx = inject(configProviderInjectionKey, void 0);
    return () => {
      var _a, _b, _c, _d;
      if (!props.inConfigProvider && (configCtx == null ? void 0 : configCtx.slots.empty) && !(slots.image || props.imgSrc || props.description)) {
        return configCtx.slots.empty({
          component: "empty"
        });
      }
      return createVNode("div", mergeProps({
        "class": prefixCls
      }, attrs), [createVNode("div", {
        "class": `${prefixCls}-image`
      }, [(_b = (_a = slots.image) == null ? void 0 : _a.call(slots)) != null ? _b : props.imgSrc ? createVNode("img", {
        "src": props.imgSrc,
        "alt": props.description || "empty"
      }, null) : createVNode(IconEmpty, null, null)]), createVNode("div", {
        "class": `${prefixCls}-description`
      }, [(_d = (_c = slots.default) == null ? void 0 : _c.call(slots)) != null ? _d : props.description || t("empty.description")])]);
    };
  }
});
export { Empty as default };
