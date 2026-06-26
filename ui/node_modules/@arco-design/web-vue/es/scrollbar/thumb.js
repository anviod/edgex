import { defineComponent, ref, computed, openBlock, createBlock, Transition, withCtx, createElementVNode, normalizeClass, withModifiers, normalizeStyle } from "vue";
import { on, off } from "../_utils/dom.js";
import { getPrefixCls } from "../_utils/global-config.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Thumb",
  props: {
    data: {
      type: Object
    },
    direction: {
      type: String,
      default: "horizontal"
    },
    alwaysShow: {
      type: Boolean,
      default: false
    },
    both: {
      type: Boolean,
      default: false
    }
  },
  emits: ["scroll"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("scrollbar");
    const visible = ref(false);
    const trackRef = ref();
    const thumbRef = ref();
    const thumbMap = computed(() => {
      if (props.direction === "horizontal") {
        return {
          size: "width",
          direction: "left",
          offset: "offsetWidth",
          client: "clientX"
        };
      }
      return {
        size: "height",
        direction: "top",
        offset: "offsetHeight",
        client: "clientY"
      };
    });
    const offset = ref(0);
    const isDragging = ref(false);
    const mouseOffset = ref(0);
    const thumbStyle = computed(() => {
      var _a, _b;
      return {
        [thumbMap.value.size]: `${(_b = (_a = props.data) == null ? void 0 : _a.thumbSize) != null ? _b : 0}px`,
        [thumbMap.value.direction]: `${offset.value}px`
      };
    });
    const handleThumbMouseDown = (ev) => {
      ev.preventDefault();
      if (thumbRef.value) {
        mouseOffset.value = ev[thumbMap.value.client] - thumbRef.value.getBoundingClientRect()[thumbMap.value.direction];
        isDragging.value = true;
        on(window, "mousemove", handleMouseMove);
        on(window, "mouseup", handleMouseUp);
        on(window, "contextmenu", handleMouseUp);
      }
    };
    const handleTrackClick = (ev) => {
      var _a, _b, _c, _d;
      ev.preventDefault();
      if (thumbRef.value) {
        const _offset = getLegalOffset(
          ev[thumbMap.value.client] > thumbRef.value.getBoundingClientRect()[thumbMap.value.direction] ? offset.value + ((_b = (_a = props.data) == null ? void 0 : _a.thumbSize) != null ? _b : 0) : offset.value - ((_d = (_c = props.data) == null ? void 0 : _c.thumbSize) != null ? _d : 0)
        );
        if (_offset !== offset.value) {
          offset.value = _offset;
          emit("scroll", _offset);
        }
      }
    };
    const getLegalOffset = (offset2) => {
      if (offset2 < 0) {
        return 0;
      }
      if (props.data && offset2 > props.data.max) {
        return props.data.max;
      }
      return offset2;
    };
    const handleMouseMove = (ev) => {
      if (trackRef.value && thumbRef.value) {
        const _offset = getLegalOffset(
          ev[thumbMap.value.client] - trackRef.value.getBoundingClientRect()[thumbMap.value.direction] - mouseOffset.value
        );
        if (_offset !== offset.value) {
          offset.value = _offset;
          emit("scroll", _offset);
        }
      }
    };
    const handleMouseUp = () => {
      isDragging.value = false;
      off(window, "mousemove", handleMouseMove);
      off(window, "mouseup", handleMouseUp);
    };
    const setOffset = (_offset) => {
      if (!isDragging.value) {
        _offset = getLegalOffset(_offset);
        if (_offset !== offset.value) {
          offset.value = _offset;
        }
      }
    };
    const thumbCls = computed(() => [
      `${prefixCls}-thumb`,
      `${prefixCls}-thumb-direction-${props.direction}`,
      {
        [`${prefixCls}-thumb-dragging`]: isDragging.value
      }
    ]);
    return {
      visible,
      trackRef,
      thumbRef,
      prefixCls,
      thumbCls,
      thumbStyle,
      handleThumbMouseDown,
      handleTrackClick,
      setOffset
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, null, {
    default: withCtx(() => [
      createElementVNode("div", {
        ref: "trackRef",
        class: normalizeClass([
          `${_ctx.prefixCls}-track`,
          `${_ctx.prefixCls}-track-direction-${_ctx.direction}`
        ]),
        onMousedown: _cache[1] || (_cache[1] = withModifiers((...args) => _ctx.handleTrackClick && _ctx.handleTrackClick(...args), ["self"]))
      }, [
        createElementVNode("div", {
          ref: "thumbRef",
          class: normalizeClass(_ctx.thumbCls),
          style: normalizeStyle(_ctx.thumbStyle),
          onMousedown: _cache[0] || (_cache[0] = (...args) => _ctx.handleThumbMouseDown && _ctx.handleThumbMouseDown(...args))
        }, [
          createElementVNode("div", {
            class: normalizeClass(`${_ctx.prefixCls}-thumb-bar`)
          }, null, 2)
        ], 38)
      ], 34)
    ]),
    _: 1
  });
}
var Thumb = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { Thumb as default };
