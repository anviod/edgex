import { defineComponent, ref, computed, onMounted, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createVNode, withCtx, createElementVNode, mergeProps, renderSlot, createBlock, createCommentVNode } from "vue";
import ResizeObserver from "../_components/resize-observer-v2.js";
import Thumb from "./thumb.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { isObject } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const THUMB_MIN_SIZE = 20;
const TRACK_SIZE = 15;
const _sfc_main = defineComponent({
  name: "Scrollbar",
  components: {
    ResizeObserver,
    Thumb
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: "embed"
    },
    outerClass: [String, Object, Array],
    outerStyle: {
      type: [String, Object, Array]
    },
    hide: {
      type: Boolean,
      default: false
    },
    disableHorizontal: {
      type: Boolean,
      default: false
    },
    disableVertical: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    scroll: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("scrollbar");
    const containerRef = ref();
    const horizontalData = ref();
    const verticalData = ref();
    const horizontalThumbRef = ref();
    const verticalThumbRef = ref();
    const _hasHorizontalScrollbar = ref(false);
    const _hasVerticalScrollbar = ref(false);
    const hasHorizontalScrollbar = computed(
      () => _hasHorizontalScrollbar.value && !props.disableHorizontal
    );
    const hasVerticalScrollbar = computed(
      () => _hasVerticalScrollbar.value && !props.disableVertical
    );
    const isBoth = ref(false);
    const getContainerSize = () => {
      var _a, _b, _c, _d, _e, _f;
      if (containerRef.value) {
        const {
          clientWidth,
          clientHeight,
          offsetWidth,
          offsetHeight,
          scrollWidth,
          scrollHeight,
          scrollTop,
          scrollLeft
        } = containerRef.value;
        _hasHorizontalScrollbar.value = scrollWidth > clientWidth;
        _hasVerticalScrollbar.value = scrollHeight > clientHeight;
        isBoth.value = hasHorizontalScrollbar.value && hasVerticalScrollbar.value;
        const horizontalTrackWidth = props.type === "embed" && isBoth.value ? offsetWidth - TRACK_SIZE : offsetWidth;
        const verticalTrackHeight = props.type === "embed" && isBoth.value ? offsetHeight - TRACK_SIZE : offsetHeight;
        const horizontalThumbWidth = Math.round(
          horizontalTrackWidth / Math.min(
            scrollWidth / clientWidth,
            horizontalTrackWidth / THUMB_MIN_SIZE
          )
        );
        const maxHorizontalOffset = horizontalTrackWidth - horizontalThumbWidth;
        const horizontalRatio = (scrollWidth - clientWidth) / maxHorizontalOffset;
        const verticalThumbHeight = Math.round(
          verticalTrackHeight / Math.min(
            scrollHeight / clientHeight,
            verticalTrackHeight / THUMB_MIN_SIZE
          )
        );
        const maxVerticalOffset = verticalTrackHeight - verticalThumbHeight;
        const verticalRatio = (scrollHeight - clientHeight) / maxVerticalOffset;
        horizontalData.value = {
          ratio: horizontalRatio,
          thumbSize: horizontalThumbWidth,
          max: maxHorizontalOffset
        };
        verticalData.value = {
          ratio: verticalRatio,
          thumbSize: verticalThumbHeight,
          max: maxVerticalOffset
        };
        if (scrollTop > 0) {
          const verticalOffset = Math.round(
            scrollTop / ((_b = (_a = verticalData.value) == null ? void 0 : _a.ratio) != null ? _b : 1)
          );
          (_c = verticalThumbRef.value) == null ? void 0 : _c.setOffset(verticalOffset);
        }
        if (scrollLeft > 0) {
          const horizontalOffset = Math.round(
            scrollLeft / ((_e = (_d = verticalData.value) == null ? void 0 : _d.ratio) != null ? _e : 1)
          );
          (_f = horizontalThumbRef.value) == null ? void 0 : _f.setOffset(horizontalOffset);
        }
      }
    };
    onMounted(() => {
      getContainerSize();
    });
    const handleResize = () => {
      getContainerSize();
    };
    const handleScroll = (ev) => {
      var _a, _b, _c, _d, _e, _f;
      if (containerRef.value) {
        if (hasHorizontalScrollbar.value && !props.disableHorizontal) {
          const horizontalOffset = Math.round(
            containerRef.value.scrollLeft / ((_b = (_a = horizontalData.value) == null ? void 0 : _a.ratio) != null ? _b : 1)
          );
          (_c = horizontalThumbRef.value) == null ? void 0 : _c.setOffset(horizontalOffset);
        }
        if (hasVerticalScrollbar.value && !props.disableVertical) {
          const verticalOffset = Math.round(
            containerRef.value.scrollTop / ((_e = (_d = verticalData.value) == null ? void 0 : _d.ratio) != null ? _e : 1)
          );
          (_f = verticalThumbRef.value) == null ? void 0 : _f.setOffset(verticalOffset);
        }
      }
      emit("scroll", ev);
    };
    const handleHorizontalScroll = (offset) => {
      var _a, _b;
      if (containerRef.value) {
        containerRef.value.scrollTo({
          left: offset * ((_b = (_a = horizontalData.value) == null ? void 0 : _a.ratio) != null ? _b : 1)
        });
      }
    };
    const handleVerticalScroll = (offset) => {
      var _a, _b;
      if (containerRef.value) {
        containerRef.value.scrollTo({
          top: offset * ((_b = (_a = verticalData.value) == null ? void 0 : _a.ratio) != null ? _b : 1)
        });
      }
    };
    const style = computed(() => {
      const style2 = {};
      if (props.type === "track") {
        if (hasHorizontalScrollbar.value) {
          style2.paddingBottom = `${TRACK_SIZE}px`;
        }
        if (hasVerticalScrollbar.value) {
          style2.paddingRight = `${TRACK_SIZE}px`;
        }
      }
      return [style2, props.outerStyle];
    });
    const cls = computed(() => [
      `${prefixCls}`,
      `${prefixCls}-type-${props.type}`,
      {
        [`${prefixCls}-both`]: isBoth.value
      },
      props.outerClass
    ]);
    return {
      prefixCls,
      cls,
      style,
      containerRef,
      horizontalThumbRef,
      verticalThumbRef,
      horizontalData,
      verticalData,
      isBoth,
      hasHorizontalScrollbar,
      hasVerticalScrollbar,
      handleResize,
      handleScroll,
      handleHorizontalScroll,
      handleVerticalScroll
    };
  },
  methods: {
    scrollTo(options, y) {
      var _a, _b;
      if (isObject(options)) {
        (_a = this.$refs.containerRef) == null ? void 0 : _a.scrollTo(options);
      } else if (options || y) {
        (_b = this.$refs.containerRef) == null ? void 0 : _b.scrollTo(
          options,
          y
        );
      }
    },
    scrollTop(top) {
      var _a;
      (_a = this.$refs.containerRef) == null ? void 0 : _a.scrollTo({
        top
      });
    },
    scrollLeft(left) {
      var _a;
      (_a = this.$refs.containerRef) == null ? void 0 : _a.scrollTo({
        left
      });
    }
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_ResizeObserver = resolveComponent("ResizeObserver");
  const _component_thumb = resolveComponent("thumb");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.style)
  }, [
    createVNode(_component_ResizeObserver, { onResize: _ctx.handleResize }, {
      default: withCtx(() => [
        createElementVNode("div", mergeProps({
          ref: "containerRef",
          class: `${_ctx.prefixCls}-container`
        }, _ctx.$attrs, {
          onScroll: _cache[0] || (_cache[0] = (...args) => _ctx.handleScroll && _ctx.handleScroll(...args))
        }), [
          createVNode(_component_ResizeObserver, { onResize: _ctx.handleResize }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["onResize"])
        ], 16)
      ]),
      _: 3
    }, 8, ["onResize"]),
    !_ctx.hide && _ctx.hasHorizontalScrollbar ? (openBlock(), createBlock(_component_thumb, {
      key: 0,
      ref: "horizontalThumbRef",
      data: _ctx.horizontalData,
      direction: "horizontal",
      both: _ctx.isBoth,
      onScroll: _ctx.handleHorizontalScroll
    }, null, 8, ["data", "both", "onScroll"])) : createCommentVNode("v-if", true),
    !_ctx.hide && _ctx.hasVerticalScrollbar ? (openBlock(), createBlock(_component_thumb, {
      key: 1,
      ref: "verticalThumbRef",
      data: _ctx.verticalData,
      direction: "vertical",
      both: _ctx.isBoth,
      onScroll: _ctx.handleVerticalScroll
    }, null, 8, ["data", "both", "onScroll"])) : createCommentVNode("v-if", true)
  ], 6);
}
var _Scrollbar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Scrollbar as default };
