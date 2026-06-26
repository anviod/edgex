"use strict";
var vue = require("vue");
var useSize = require("./hooks/use-size.js");
var virtualListItem = require("./virtual-list-item.js");
var globalConfig = require("../../_utils/global-config.js");
var is = require("../../_utils/is.js");
var pluginVue_exportHelper = require("../../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "VirtualList",
  components: { VirtualListItem: virtualListItem },
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
    const { data, itemKey, fixedSize, estimatedSize, buffer, height } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("virtual-list");
    const mergedComponent = vue.computed(() => {
      if (is.isObject(props.component)) {
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
    const containerRef = vue.ref();
    const contentRef = vue.ref();
    const style = vue.computed(() => {
      return {
        height: is.isNumber(height.value) ? `${height.value}px` : height.value,
        overflow: "auto"
      };
    });
    const dataKeys = vue.computed(
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
    } = useSize.useSize({
      dataKeys,
      contentRef,
      fixedSize,
      estimatedSize,
      buffer
    });
    const currentList = vue.computed(() => {
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
        vue.nextTick(() => {
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
        if (is.isNumber(options)) {
          containerRef.value.scrollTop = options;
        } else {
          const _index = (_b = options.index) != null ? _b : dataKeys.value.indexOf((_a = options.key) != null ? _a : "");
          setStart(_index - buffer.value);
          containerRef.value.scrollTop = getScrollOffset(_index);
          vue.nextTick(() => {
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
  const _component_VirtualListItem = vue.resolveComponent("VirtualListItem");
  return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.mergedComponent.container), {
    ref: "containerRef",
    class: vue.normalizeClass(_ctx.prefixCls),
    style: vue.normalizeStyle(_ctx.style),
    onScroll: _ctx.onScroll
  }, {
    default: vue.withCtx(() => [
      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.mergedComponent.list), vue.mergeProps(_ctx.listAttrs, {
        style: _ctx.paddingPosition === "list" ? {
          paddingTop: `${_ctx.frontPadding}px`,
          paddingBottom: `${_ctx.behindPadding}px`
        } : {}
      }), {
        default: vue.withCtx(() => [
          (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.mergedComponent.content), vue.mergeProps({ ref: "contentRef" }, _ctx.contentAttrs, {
            style: _ctx.paddingPosition === "content" ? {
              paddingTop: `${_ctx.frontPadding}px`,
              paddingBottom: `${_ctx.behindPadding}px`
            } : {}
          }), {
            default: vue.withCtx(() => [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.currentList, (item, index) => {
                var _a;
                return vue.openBlock(), vue.createBlock(_component_VirtualListItem, {
                  key: (_a = item[_ctx.itemKey]) != null ? _a : _ctx.start + index,
                  "has-item-size": _ctx.hasItemSize,
                  "set-item-size": _ctx.setItemSize
                }, {
                  default: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "item", {
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
var VirtualList = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = VirtualList;
