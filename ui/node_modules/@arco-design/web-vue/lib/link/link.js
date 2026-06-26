"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index = require("../icon/icon-link/index.js");
var index$1 = require("../icon/icon-loading/index.js");
var usePropOrSlot = require("../_utils/use-prop-or-slot.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Link",
  components: { IconLink: index, IconLoading: index$1 },
  props: {
    href: String,
    status: {
      type: String,
      default: "normal"
    },
    hoverable: {
      type: Boolean,
      default: true
    },
    icon: Boolean,
    loading: Boolean,
    disabled: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { slots, emit }) {
    const prefixCls = globalConfig.getPrefixCls("link");
    const showIcon = usePropOrSlot.hasPropOrSlot(props, slots, "icon");
    const handleClick = (ev) => {
      if (props.disabled || props.loading) {
        ev.preventDefault();
        return;
      }
      emit("click", ev);
    };
    const cls = vue.computed(() => [
      prefixCls,
      `${prefixCls}-status-${props.status}`,
      {
        [`${prefixCls}-disabled`]: props.disabled,
        [`${prefixCls}-loading`]: props.loading,
        [`${prefixCls}-hoverless`]: !props.hoverable,
        [`${prefixCls}-with-icon`]: props.loading || showIcon.value
      }
    ]);
    return {
      cls,
      prefixCls,
      showIcon,
      handleClick
    };
  }
});
const _hoisted_1 = ["href"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_loading = vue.resolveComponent("icon-loading");
  const _component_icon_link = vue.resolveComponent("icon-link");
  return vue.openBlock(), vue.createElementBlock("a", {
    href: _ctx.disabled ? void 0 : _ctx.href,
    class: vue.normalizeClass(_ctx.cls),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
  }, [
    _ctx.loading || _ctx.showIcon ? (vue.openBlock(), vue.createElementBlock("span", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-icon`)
    }, [
      _ctx.loading ? (vue.openBlock(), vue.createBlock(_component_icon_loading, { key: 0 })) : vue.renderSlot(_ctx.$slots, "icon", { key: 1 }, () => [
        vue.createVNode(_component_icon_link)
      ])
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.renderSlot(_ctx.$slots, "default")
  ], 10, _hoisted_1);
}
var _Link = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Link;
