import { defineComponent, toRefs, computed, ref, nextTick, resolveComponent, openBlock, createBlock, resolveDynamicComponent, normalizeClass, normalizeStyle, withCtx, mergeProps, createElementBlock, Fragment, renderList, renderSlot } from "vue";
import { useSize } from "./hooks/use-size.js";
import VirtualListItem from "./virtual-list-item.js";
import { getPrefixCls } from "../../_utils/global-config.js";
import { isObject, isNumber } from "../../_utils/is.js";
import _export_sfc from "../../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "VirtualList",
  components: { VirtualListItem },
  props: {
    height: {
      type: [Number, String],
      default: 200
    },
    data: {
      type: Array,
      default: () => []
    },
    threshold: {
      type: Number,
      default: 0
    },
    itemKey: {
      type: String,
      default: "key"
    },
    fixedSize: {
      type: Boolean,
      default: false
    },
    estimatedSize: {
      type: Number,
      default: 30
    },
    buffer: {
      type: Number,
      default: 10
    },
    component: {
      type: [String, Object],
      default: "div"
    },
    listAttrs: {
      type: Object
    },
    contentAttrs: {
      type: Object
    },
    paddingPosition: {
      type: String,
      default: "content"
    }
  },
  emits: {
    scroll: (ev) => true,
    reachBottom: (ev) => true
  },
  setup(props, { emit }) {
    const { data, itemKey, fixedSize, estimatedSize, buffer, height } = toRefs(props);
    const prefixCls = getPrefixCls("virtual-list");
    const mergedComponent = computed(() => {
      if (isObject(props.component)) {
        return {
          container: "div",
          list: "div",
          content: "div",
          ...props.component
        };
      }
      return {
        container: props.component,
        list: "div",
        content: "div"
      };
    });
    const containerRef = ref();
    const contentRef = ref();
    const style = computed(() => {
      return {
        height: isNumber(height.value) ? `${height.value}px` : height.value,
        overflow: "auto"
      };
    });
    const dataKeys = computed(
      () => data.value.map((item, index) => {
        var _a;
        return (_a = item[itemKey.value]) != null ? _a : index;
      })
    );
    const {
      frontPadding,
      behindPadding,
      start,
      end,
      getStartByScroll,
      setItemSize,
      hasItemSize,
      setStart,
      getScrollOffset
    } = useSize({
      dataKeys,
      contentRef,
      fixedSize,
      estimatedSize,
      buffer
    });
    const currentList = computed(() => {
      if (props.threshold && data.value.length <= props.threshold) {
        return data.value;
      }
      return data.value.slice(start.value, end.value);
    });
    const onScroll = (ev) => {
      const { scrollTop, scrollHeight, offsetHeight } = ev.target;
      const _start = getStartByScroll(scrollTop);
      if (_start !== start.value) {
        setStart(_start);
        nextTick(() => {
          scrollTo(scrollTop);
        });
      }
      emit("scroll", ev);
      const bottom = Math.floor(scrollHeight - (scrollTop + offsetHeight));
      if (bottom <= 0) {
        emit("reachBottom", ev);
      }
    };
    const scrollTo = (options) => {
      var _a, _b;
      if (containerRef.value) {
        if (isNumber(options)) {
          containerRef.value.scrollTop = options;
        } else {
          const _index = (_b = options.index) != null ? _b : dataKeys.value.indexOf((_a = options.key) != null ? _a : "");
          setStart(_index - buffer.value);
          containerRef.value.scrollTop = getScrollOffset(_index);
          nextTick(() => {
            if (containerRef.value) {
              const _scrollTop = getScrollOffset(_index);
              if (_scrollTop !== containerRef.value.scrollTop) {
                containerRef.value.scrollTop = _scrollTop;
              }
            }
          });
        }
      }
    };
    return {
      prefixCls,
      containerRef,
      contentRef,
      frontPadding,
      currentList,
      behindPadding,
      onScroll,
      setItemSize,
      hasItemSize,
      start,
      scrollTo,
      style,
      mergedComponent
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_VirtualListItem = resolveComponent("VirtualListItem");
  return openBlock(), createBlock(resolveDynamicComponent(_ctx.mergedComponent.container), {
    ref: "containerRef",
    class: normalizeClass(_ctx.prefixCls),
    style: normalizeStyle(_ctx.style),
    onScroll: _ctx.onScroll
  }, {
    default: withCtx(() => [
      (openBlock(), createBlock(resolveDynamicComponent(_ctx.mergedComponent.list), mergeProps(_ctx.listAttrs, {
        style: _ctx.paddingPosition === "list" ? {
          paddingTop: `${_ctx.frontPadding}px`,
          paddingBottom: `${_ctx.behindPadding}px`
        } : {}
      }), {
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(_ctx.mergedComponent.content), mergeProps({ ref: "contentRef" }, _ctx.contentAttrs, {
            style: _ctx.paddingPosition === "content" ? {
              paddingTop: `${_ctx.frontPadding}px`,
              paddingBottom: `${_ctx.behindPadding}px`
            } : {}
          }), {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.currentList, (item, index) => {
                var _a;
                return openBlock(), createBlock(_component_VirtualListItem, {
                  key: (_a = item[_ctx.itemKey]) != null ? _a : _ctx.start + index,
                  "has-item-size": _ctx.hasItemSize,
                  "set-item-size": _ctx.setItemSize
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "item", {
                      item,
                      index: _ctx.start + index
                    })
                  ]),
                  _: 2
                }, 1032, ["has-item-size", "set-item-size"]);
              }), 128))
            ]),
            _: 3
          }, 16, ["style"]))
        ]),
        _: 3
      }, 16, ["style"]))
    ]),
    _: 3
  }, 40, ["class", "style", "onScroll"]);
}
var VirtualList = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { VirtualList as default };
