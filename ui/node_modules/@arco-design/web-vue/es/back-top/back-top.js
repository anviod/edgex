import { defineComponent, ref, onMounted, onUnmounted, resolveComponent, openBlock, createBlock, Transition, withCtx, createElementBlock, normalizeClass, renderSlot, createElementVNode, createVNode, createCommentVNode } from "vue";
import BTween from "b-tween";
import { getPrefixCls } from "../_utils/global-config.js";
import { on, off } from "../_utils/dom.js";
import { throttleByRaf } from "../_utils/throttle-by-raf.js";
import IconToTop from "../icon/icon-to-top/index.js";
import { isString } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "BackTop",
  components: {
    IconToTop
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
    const prefixCls = getPrefixCls("back-top");
    const visible = ref(false);
    const target = ref();
    const isWindow = !props.targetContainer;
    const scrollHandler = throttleByRaf(() => {
      if (target.value) {
        const { visibleHeight } = props;
        const { scrollTop } = target.value;
        visible.value = scrollTop >= visibleHeight;
      }
    });
    const getContainer = (container) => {
      if (isString(container)) {
        return document.querySelector(container);
      }
      return container;
    };
    onMounted(() => {
      target.value = isWindow ? document == null ? void 0 : document.documentElement : getContainer(props.targetContainer);
      if (target.value) {
        on(isWindow ? window : target.value, "scroll", scrollHandler);
        scrollHandler();
      }
    });
    onUnmounted(() => {
      scrollHandler.cancel();
      if (target.value) {
        off(isWindow ? window : target.value, "scroll", scrollHandler);
      }
    });
    const scrollToTop = () => {
      if (target.value) {
        const { scrollTop } = target.value;
        const tween = new BTween({
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
  const _component_icon_to_top = resolveComponent("icon-to-top");
  return openBlock(), createBlock(Transition, { name: "fade-in" }, {
    default: withCtx(() => [
      _ctx.visible ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(_ctx.prefixCls),
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.scrollToTop && _ctx.scrollToTop(...args))
      }, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createElementVNode("button", {
            class: normalizeClass(`${_ctx.prefixCls}-btn`)
          }, [
            createVNode(_component_icon_to_top)
          ], 2)
        ])
      ], 2)) : createCommentVNode("v-if", true)
    ]),
    _: 3
  });
}
var _BackTop = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _BackTop as default };
