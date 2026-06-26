"use strict";
var vue = require("vue");
var dom = require("../_utils/dom.js");
var globalConfig = require("../_utils/global-config.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("scrollbar");
    const visible = vue.ref(false);
    const trackRef = vue.ref();
    const thumbRef = vue.ref();
    const thumbMap = vue.computed(() => {
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
    const offset = vue.ref(0);
    const isDragging = vue.ref(false);
    const mouseOffset = vue.ref(0);
    const thumbStyle = vue.computed(() => {
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
        dom.on(window, "mousemove", handleMouseMove);
        dom.on(window, "mouseup", handleMouseUp);
        dom.on(window, "contextmenu", handleMouseUp);
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
      dom.off(window, "mousemove", handleMouseMove);
      dom.off(window, "mouseup", handleMouseUp);
    };
    const setOffset = (_offset) => {
      if (!isDragging.value) {
        _offset = getLegalOffset(_offset);
        if (_offset !== offset.value) {
          offset.value = _offset;
        }
      }
    };
    const thumbCls = vue.computed(() => [
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
  return vue.openBlock(), vue.createBlock(vue.Transition, null, {
    default: vue.withCtx(() => [
      vue.createElementVNode("div", {
        ref: "trackRef",
        class: vue.normalizeClass([
          `${_ctx.prefixCls}-track`,
          `${_ctx.prefixCls}-track-direction-${_ctx.direction}`
        ]),
        onMousedown: _cache[1] || (_cache[1] = vue.withModifiers((...args) => _ctx.handleTrackClick && _ctx.handleTrackClick(...args), ["self"]))
      }, [
        vue.createElementVNode("div", {
          ref: "thumbRef",
          class: vue.normalizeClass(_ctx.thumbCls),
          style: vue.normalizeStyle(_ctx.thumbStyle),
          onMousedown: _cache[0] || (_cache[0] = (...args) => _ctx.handleThumbMouseDown && _ctx.handleThumbMouseDown(...args))
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-thumb-bar`)
          }, null, 2)
        ], 38)
      ], 34)
    ]),
    _: 1
  });
}
var Thumb = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = Thumb;
