"use strict";
var vue = require("vue");
var BTween = require("b-tween");
var globalConfig = require("../_utils/global-config.js");
var dom = require("../_utils/dom.js");
var throttleByRaf = require("../_utils/throttle-by-raf.js");
var index = require("../icon/icon-to-top/index.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var BTween__default = /* @__PURE__ */ _interopDefaultLegacy(BTween);
const _sfc_main = vue.defineComponent({
  name: "BackTop",
  components: {
    IconToTop: index
  },
  props: {
    visibleHeight: {
      type: Number,
      default: 200
    },
    targetContainer: {
      type: [String, Object]
    },
    easing: {
      type: String,
      default: "quartOut"
    },
    duration: {
      type: Number,
      default: 200
    }
  },
  setup(props) {
    const prefixCls = globalConfig.getPrefixCls("back-top");
    const visible = vue.ref(false);
    const target = vue.ref();
    const isWindow = !props.targetContainer;
    const scrollHandler = throttleByRaf.throttleByRaf(() => {
      if (target.value) {
        const { visibleHeight } = props;
        const { scrollTop } = target.value;
        visible.value = scrollTop >= visibleHeight;
      }
    });
    const getContainer = (container) => {
      if (is.isString(container)) {
        return document.querySelector(container);
      }
      return container;
    };
    vue.onMounted(() => {
      target.value = isWindow ? document == null ? void 0 : document.documentElement : getContainer(props.targetContainer);
      if (target.value) {
        dom.on(isWindow ? window : target.value, "scroll", scrollHandler);
        scrollHandler();
      }
    });
    vue.onUnmounted(() => {
      scrollHandler.cancel();
      if (target.value) {
        dom.off(isWindow ? window : target.value, "scroll", scrollHandler);
      }
    });
    const scrollToTop = () => {
      if (target.value) {
        const { scrollTop } = target.value;
        const tween = new BTween__default["default"]({
          from: { scrollTop },
          to: { scrollTop: 0 },
          easing: props.easing,
          duration: props.duration,
          onUpdate: (keys) => {
            if (target.value) {
              target.value.scrollTop = keys.scrollTop;
            }
          }
        });
        tween.start();
      }
    };
    return {
      prefixCls,
      visible,
      scrollToTop
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_to_top = vue.resolveComponent("icon-to-top");
  return vue.openBlock(), vue.createBlock(vue.Transition, { name: "fade-in" }, {
    default: vue.withCtx(() => [
      _ctx.visible ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(_ctx.prefixCls),
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.scrollToTop && _ctx.scrollToTop(...args))
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, () => [
          vue.createElementVNode("button", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-btn`)
          }, [
            vue.createVNode(_component_icon_to_top)
          ], 2)
        ])
      ], 2)) : vue.createCommentVNode("v-if", true)
    ]),
    _: 3
  });
}
var _BackTop = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _BackTop;
