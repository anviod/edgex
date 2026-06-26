import { defineComponent, toRefs, computed, reactive, provide, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Spin from "../spin/index.js";
import { cardInjectionKey } from "./context.js";
import { getAllElements } from "../_utils/vue-utils.js";
import { useSize } from "../_hooks/use-size.js";
var _Card = defineComponent({
  name: "Card",
  components: {
    Spin
  },
  props: {
    bordered: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    hoverable: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    headerStyle: {
      type: Object,
      default: () => ({})
    },
    bodyStyle: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String
    },
    extra: {
      type: String
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = getPrefixCls("card");
    const {
      size
    } = toRefs(props);
    const {
      mergedSize: _mergedSize
    } = useSize(size);
    const mergedSize = computed(() => {
      if (_mergedSize.value === "small" || _mergedSize.value === "mini") {
        return "small";
      }
      return "medium";
    });
    const renderActions = (vns) => {
      const actions = getAllElements(vns);
      return createVNode("div", {
        "class": `${prefixCls}-actions`
      }, [createVNode("div", {
        "class": `${prefixCls}-actions-right`
      }, [actions.map((action, index) => createVNode("span", {
        "key": `action-${index}`,
        "class": `${prefixCls}-actions-item`
      }, [action]))])]);
    };
    const cardContext = reactive({
      hasMeta: false,
      hasGrid: false,
      slots,
      renderActions
    });
    provide(cardInjectionKey, cardContext);
    const cls = computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-loading`]: props.loading,
      [`${prefixCls}-bordered`]: props.bordered,
      [`${prefixCls}-hoverable`]: props.hoverable,
      [`${prefixCls}-contain-grid`]: cardContext.hasGrid
    }]);
    return () => {
      var _a, _b, _c, _d, _e, _f, _g;
      const hasTitle = Boolean((_a = slots.title) != null ? _a : props.title);
      const hasExtra = Boolean((_b = slots.extra) != null ? _b : props.extra);
      return createVNode("div", {
        "class": cls.value
      }, [(hasTitle || hasExtra) && createVNode("div", {
        "class": [`${prefixCls}-header`, {
          [`${prefixCls}-header-no-title`]: !hasTitle
        }],
        "style": props.headerStyle
      }, [hasTitle && createVNode("div", {
        "class": `${prefixCls}-header-title`
      }, [(_d = (_c = slots.title) == null ? void 0 : _c.call(slots)) != null ? _d : props.title]), hasExtra && createVNode("div", {
        "class": `${prefixCls}-header-extra`
      }, [(_f = (_e = slots.extra) == null ? void 0 : _e.call(slots)) != null ? _f : props.extra])]), slots.cover && createVNode("div", {
        "class": `${prefixCls}-cover`
      }, [slots.cover()]), createVNode("div", {
        "class": `${prefixCls}-body`,
        "style": props.bodyStyle
      }, [props.loading ? createVNode(Spin, null, null) : (_g = slots.default) == null ? void 0 : _g.call(slots), slots.actions && !cardContext.hasMeta && renderActions(slots.actions())])]);
    };
  }
});
export { _Card as default };
