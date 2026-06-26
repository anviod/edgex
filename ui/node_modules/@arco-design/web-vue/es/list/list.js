import { defineComponent, toRefs, inject, computed, onMounted, ref, createVNode, mergeProps, Fragment, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { configProviderInjectionKey } from "../config-provider/context.js";
import Spin from "../spin/index.js";
import Grid from "../grid/index.js";
import Pagination from "../pagination/index.js";
import Empty from "../empty/index.js";
import VirtualList from "../_components/virtual-list-v2/virtual-list.js";
import { usePagination } from "./use-pagination.js";
import { omit } from "../_utils/omit.js";
import { getAllElements } from "../_utils/vue-utils.js";
import Scrollbar from "../scrollbar/index.js";
import { useComponentRef } from "../_hooks/use-component-ref.js";
import { useScrollbar } from "../_hooks/use-scrollbar.js";
import { isNumber } from "../_utils/is.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var _List = defineComponent({
  name: "List",
  props: {
    data: {
      type: Array
    },
    size: {
      type: String,
      default: "medium"
    },
    bordered: {
      type: Boolean,
      default: true
    },
    split: {
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
    paginationProps: {
      type: Object
    },
    gridProps: {
      type: Object
    },
    maxHeight: {
      type: [String, Number],
      default: 0
    },
    bottomOffset: {
      type: Number,
      default: 0
    },
    virtualListProps: {
      type: Object
    },
    scrollbar: {
      type: [Object, Boolean],
      default: true
    }
  },
  emits: {
    scroll: () => true,
    reachBottom: () => true,
    pageChange: (page) => true,
    pageSizeChange: (pageSize) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      scrollbar
    } = toRefs(props);
    const prefixCls = getPrefixCls("list");
    const configCtx = inject(configProviderInjectionKey, void 0);
    const {
      componentRef,
      elementRef: listRef
    } = useComponentRef("containerRef");
    const isVirtualList = computed(() => props.virtualListProps);
    const {
      displayScrollbar,
      scrollbarProps
    } = useScrollbar(scrollbar);
    let preScrollTop = 0;
    const handleScroll = (e) => {
      const {
        scrollTop,
        scrollHeight,
        offsetHeight
      } = e.target;
      const bottom = Math.floor(scrollHeight - (scrollTop + offsetHeight));
      if (scrollTop > preScrollTop && bottom <= props.bottomOffset) {
        emit("reachBottom");
      }
      emit("scroll");
      preScrollTop = scrollTop;
    };
    onMounted(() => {
      if (listRef.value) {
        const {
          scrollTop,
          scrollHeight,
          offsetHeight
        } = listRef.value;
        if (scrollHeight <= scrollTop + offsetHeight) {
          emit("reachBottom");
        }
      }
    });
    const {
      current,
      pageSize,
      handlePageChange,
      handlePageSizeChange
    } = usePagination(props, {
      emit
    });
    const getCurrentPageItems = (data) => {
      if (!props.paginationProps) {
        return data;
      }
      if (props.paginationProps && data.length > pageSize.value) {
        const startIndex = (current.value - 1) * pageSize.value;
        return data.slice(startIndex, startIndex + pageSize.value);
      }
      return data;
    };
    const renderGridItems = (data) => {
      let _slot2;
      if (!props.gridProps) {
        return null;
      }
      const currentPageItems = getCurrentPageItems(data);
      if (props.gridProps.span) {
        const items = [];
        const rowSize = 24 / props.gridProps.span;
        for (let i = 0; i < currentPageItems.length; i += rowSize) {
          let _slot;
          const nextIndex = i + rowSize;
          const rowIndex = Math.floor(i / rowSize);
          items.push(createVNode(Grid.Row, {
            "key": rowIndex,
            "class": `${prefixCls}-row`,
            "gutter": props.gridProps.gutter
          }, _isSlot(_slot = currentPageItems.slice(i, nextIndex).map((item, index) => {
            var _a;
            return createVNode(Grid.Col, {
              "key": `${rowIndex}-${index}`,
              "class": `${prefixCls}-col`,
              "span": (_a = props.gridProps) == null ? void 0 : _a.span
            }, {
              default: () => {
                var _a2;
                return [isVNode(item) ? item : (_a2 = slots.item) == null ? void 0 : _a2.call(slots, {
                  item,
                  index
                })];
              }
            });
          })) ? _slot : {
            default: () => [_slot]
          }));
        }
        return items;
      }
      return createVNode(Grid.Row, {
        "class": `${prefixCls}-row`,
        "gutter": props.gridProps.gutter
      }, _isSlot(_slot2 = currentPageItems.map((item, index) => createVNode(Grid.Col, mergeProps({
        "key": index,
        "class": `${prefixCls}-col`
      }, omit(props.gridProps, ["gutter"])), {
        default: () => {
          var _a;
          return [isVNode(item) ? item : (_a = slots.item) == null ? void 0 : _a.call(slots, {
            item,
            index
          })];
        }
      }))) ? _slot2 : {
        default: () => [_slot2]
      });
    };
    const renderListItems = (data) => {
      const currentPageItems = getCurrentPageItems(data);
      return currentPageItems.map((item, index) => {
        var _a;
        return isVNode(item) ? item : (_a = slots.item) == null ? void 0 : _a.call(slots, {
          item,
          index
        });
      });
    };
    const renderItems = () => {
      const data = slots.default ? getAllElements(slots.default()) : props.data;
      if (data && data.length > 0) {
        return props.gridProps ? renderGridItems(data) : renderListItems(data);
      }
      return renderEmpty();
    };
    const renderPagination = () => {
      if (!props.paginationProps) {
        return null;
      }
      const paginationProps = omit(props.paginationProps, ["current", "pageSize", "defaultCurrent", "defaultPageSize"]);
      return createVNode(Pagination, mergeProps({
        "class": `${prefixCls}-pagination`
      }, paginationProps, {
        "current": current.value,
        "pageSize": pageSize.value,
        "onChange": handlePageChange,
        "onPageSizeChange": handlePageSizeChange
      }), null);
    };
    const cls = computed(() => [prefixCls, `${prefixCls}-${props.size}`, {
      [`${prefixCls}-bordered`]: props.bordered,
      [`${prefixCls}-split`]: props.split,
      [`${prefixCls}-hover`]: props.hoverable
    }]);
    const contentStyle = computed(() => {
      if (props.maxHeight) {
        const maxHeight = isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight;
        return {
          maxHeight,
          overflowY: "auto"
        };
      }
      return void 0;
    });
    const contentCls = computed(() => [`${prefixCls}-content`, {
      [`${prefixCls}-virtual`]: isVirtualList.value
    }]);
    const virtualListRef = ref();
    const renderVirtualList = () => {
      var _a;
      const currentPageItems = getCurrentPageItems((_a = props.data) != null ? _a : []);
      return currentPageItems.length ? createVNode(VirtualList, mergeProps({
        "ref": virtualListRef,
        "class": contentCls.value,
        "data": currentPageItems
      }, props.virtualListProps, {
        "onScroll": handleScroll
      }), {
        item: ({
          item,
          index
        }) => {
          var _a2;
          return (_a2 = slots.item) == null ? void 0 : _a2.call(slots, {
            item,
            index
          });
        }
      }) : renderEmpty();
    };
    const renderScrollLoading = () => {
      if (slots["scroll-loading"]) {
        return createVNode("div", {
          "class": [`${prefixCls}-item`, `${prefixCls}-scroll-loading`]
        }, [slots["scroll-loading"]()]);
      }
      return null;
    };
    const renderEmpty = () => {
      var _a, _b, _c, _d, _e;
      if (slots["scroll-loading"]) {
        return null;
      }
      return (_e = (_d = (_a = slots.empty) == null ? void 0 : _a.call(slots)) != null ? _d : (_c = configCtx == null ? void 0 : (_b = configCtx.slots).empty) == null ? void 0 : _c.call(_b, {
        component: "list"
      })) != null ? _e : createVNode(Empty, null, null);
    };
    const render = () => {
      const Component = displayScrollbar.value ? Scrollbar : "div";
      return createVNode("div", {
        "class": `${prefixCls}-wrapper`
      }, [createVNode(Spin, {
        "class": `${prefixCls}-spin`,
        "loading": props.loading
      }, {
        default: () => [createVNode(Component, mergeProps({
          "ref": componentRef,
          "class": cls.value,
          "style": contentStyle.value
        }, scrollbarProps.value, {
          "onScroll": handleScroll
        }), {
          default: () => [createVNode("div", {
            "class": `${prefixCls}-content-wrapper`
          }, [slots.header && createVNode("div", {
            "class": `${prefixCls}-header`
          }, [slots.header()]), isVirtualList.value && !props.gridProps ? createVNode(Fragment, null, [renderVirtualList(), renderScrollLoading()]) : createVNode("div", {
            "role": "list",
            "class": contentCls.value
          }, [renderItems(), renderScrollLoading()]), slots.footer && createVNode("div", {
            "class": `${prefixCls}-footer`
          }, [slots.footer()])])]
        }), renderPagination()]
      })]);
    };
    return {
      virtualListRef,
      render
    };
  },
  methods: {
    scrollIntoView(options) {
      if (this.virtualListRef) {
        this.virtualListRef.scrollTo(options);
      }
    }
  },
  render() {
    return this.render();
  }
});
export { _List as default };
