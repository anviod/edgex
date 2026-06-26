"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../spin/index.js");
var context = require("./context.js");
var vueUtils = require("../_utils/vue-utils.js");
var useSize = require("../_hooks/use-size.js");
var _Card = vue.defineComponent({
  name: "Card",
  components: {
    Spin: index
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
    const prefixCls = globalConfig.getPrefixCls("card");
    const {
      size
    } = vue.toRefs(props);
    const {
      mergedSize: _mergedSize
    } = useSize.useSize(size);
    const mergedSize = vue.computed(() => {
      if (_mergedSize.value === "small" || _mergedSize.value === "mini") {
        return "small";
      }
      return "medium";
    });
    const renderActions = (vns) => {
      const actions = vueUtils.getAllElements(vns);
      return vue.createVNode("div", {
        "class": `${prefixCls}-actions`
      }, [vue.createVNode("div", {
        "class": `${prefixCls}-actions-right`
      }, [actions.map((action, index2) => vue.createVNode("span", {
        "key": `action-${index2}`,
        "class": `${prefixCls}-actions-item`
      }, [action]))])]);
    };
    const cardContext = vue.reactive({
      hasMeta: false,
      hasGrid: false,
      slots,
      renderActions
    });
    vue.provide(context.cardInjectionKey, cardContext);
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-loading`]: props.loading,
      [`${prefixCls}-bordered`]: props.bordered,
      [`${prefixCls}-hoverable`]: props.hoverable,
      [`${prefixCls}-contain-grid`]: cardContext.hasGrid
    }]);
    return () => {
      var _a, _b, _c, _d, _e, _f, _g;
      const hasTitle = Boolean((_a = slots.title) != null ? _a : props.title);
      const hasExtra = Boolean((_b = slots.extra) != null ? _b : props.extra);
      return vue.createVNode("div", {
        "class": cls.value
      }, [(hasTitle || hasExtra) && vue.createVNode("div", {
        "class": [`${prefixCls}-header`, {
          [`${prefixCls}-header-no-title`]: !hasTitle
        }],
        "style": props.headerStyle
      }, [hasTitle && vue.createVNode("div", {
        "class": `${prefixCls}-header-title`
      }, [(_d = (_c = slots.title) == null ? void 0 : _c.call(slots)) != null ? _d : props.title]), hasExtra && vue.createVNode("div", {
        "class": `${prefixCls}-header-extra`
      }, [(_f = (_e = slots.extra) == null ? void 0 : _e.call(slots)) != null ? _f : props.extra])]), slots.cover && vue.createVNode("div", {
        "class": `${prefixCls}-cover`
      }, [slots.cover()]), vue.createVNode("div", {
        "class": `${prefixCls}-body`,
        "style": props.bodyStyle
      }, [props.loading ? vue.createVNode(index, null, null) : (_g = slots.default) == null ? void 0 : _g.call(slots), slots.actions && !cardContext.hasMeta && renderActions(slots.actions())])]);
    };
  }
});
module.exports = _Card;
