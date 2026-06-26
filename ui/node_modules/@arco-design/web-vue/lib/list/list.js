"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("../config-provider/context.js");
var index$1 = require("../spin/index.js");
var index$4 = require("../grid/index.js");
var index$2 = require("../pagination/index.js");
var index$3 = require("../empty/index.js");
var virtualList = require("../_components/virtual-list-v2/virtual-list.js");
var usePagination = require("./use-pagination.js");
var omit = require("../_utils/omit.js");
var vueUtils = require("../_utils/vue-utils.js");
var index = require("../scrollbar/index.js");
var useComponentRef = require("../_hooks/use-component-ref.js");
var useScrollbar = require("../_hooks/use-scrollbar.js");
var is = require("../_utils/is.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var _List = vue.defineComponent({
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
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("list");
    const configCtx = vue.inject(context.configProviderInjectionKey, void 0);
    const {
      componentRef,
      elementRef: listRef
    } = useComponentRef.useComponentRef("containerRef");
    const isVirtualList = vue.computed(() => props.virtualListProps);
    const {
      displayScrollbar,
      scrollbarProps
    } = useScrollbar.useScrollbar(scrollbar);
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
    vue.onMounted(() => {
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
    } = usePagination.usePagination(props, {
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
          items.push(vue.createVNode(index$4["default"].Row, {
            "key": rowIndex,
            "class": `${prefixCls}-row`,
            "gutter": props.gridProps.gutter
          }, _isSlot(_slot = currentPageItems.slice(i, nextIndex).map((item, index2) => {
            var _a;
            return vue.createVNode(index$4["default"].Col, {
              "key": `${rowIndex}-${index2}`,
              "class": `${prefixCls}-col`,
              "span": (_a = props.gridProps) == null ? void 0 : _a.span
            }, {
              default: () => {
                var _a2;
                return [vue.isVNode(item) ? item : (_a2 = slots.item) == null ? void 0 : _a2.call(slots, {
                  item,
                  index: index2
                })];
              }
            });
          })) ? _slot : {
            default: () => [_slot]
          }));
        }
        return items;
      }
      return vue.createVNode(index$4["default"].Row, {
        "class": `${prefixCls}-row`,
        "gutter": props.gridProps.gutter
      }, _isSlot(_slot2 = currentPageItems.map((item, index2) => vue.createVNode(index$4["default"].Col, vue.mergeProps({
        "key": index2,
        "class": `${prefixCls}-col`
      }, omit.omit(props.gridProps, ["gutter"])), {
        default: () => {
          var _a;
          return [vue.isVNode(item) ? item : (_a = slots.item) == null ? void 0 : _a.call(slots, {
            item,
            index: index2
          })];
        }
      }))) ? _slot2 : {
        default: () => [_slot2]
      });
    };
    const renderListItems = (data) => {
      const currentPageItems = getCurrentPageItems(data);
      return currentPageItems.map((item, index2) => {
        var _a;
        return vue.isVNode(item) ? item : (_a = slots.item) == null ? void 0 : _a.call(slots, {
          item,
          index: index2
        });
      });
    };
    const renderItems = () => {
      const data = slots.default ? vueUtils.getAllElements(slots.default()) : props.data;
      if (data && data.length > 0) {
        return props.gridProps ? renderGridItems(data) : renderListItems(data);
      }
      return renderEmpty();
    };
    const renderPagination = () => {
      if (!props.paginationProps) {
        return null;
      }
      const paginationProps = omit.omit(props.paginationProps, ["current", "pageSize", "defaultCurrent", "defaultPageSize"]);
      return vue.createVNode(index$2, vue.mergeProps({
        "class": `${prefixCls}-pagination`
      }, paginationProps, {
        "current": current.value,
        "pageSize": pageSize.value,
        "onChange": handlePageChange,
        "onPageSizeChange": handlePageSizeChange
      }), null);
    };
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-${props.size}`, {
      [`${prefixCls}-bordered`]: props.bordered,
      [`${prefixCls}-split`]: props.split,
      [`${prefixCls}-hover`]: props.hoverable
    }]);
    const contentStyle = vue.computed(() => {
      if (props.maxHeight) {
        const maxHeight = is.isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight;
        return {
          maxHeight,
          overflowY: "auto"
        };
      }
      return void 0;
    });
    const contentCls = vue.computed(() => [`${prefixCls}-content`, {
      [`${prefixCls}-virtual`]: isVirtualList.value
    }]);
    const virtualListRef = vue.ref();
    const renderVirtualList = () => {
      var _a;
      const currentPageItems = getCurrentPageItems((_a = props.data) != null ? _a : []);
      return currentPageItems.length ? vue.createVNode(virtualList, vue.mergeProps({
        "ref": virtualListRef,
        "class": contentCls.value,
        "data": currentPageItems
      }, props.virtualListProps, {
        "onScroll": handleScroll
      }), {
        item: ({
          item,
          index: index2
        }) => {
          var _a2;
          return (_a2 = slots.item) == null ? void 0 : _a2.call(slots, {
            item,
            index: index2
          });
        }
      }) : renderEmpty();
    };
    const renderScrollLoading = () => {
      if (slots["scroll-loading"]) {
        return vue.createVNode("div", {
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
      })) != null ? _e : vue.createVNode(index$3, null, null);
    };
    const render = () => {
      const Component = displayScrollbar.value ? index : "div";
      return vue.createVNode("div", {
        "class": `${prefixCls}-wrapper`
      }, [vue.createVNode(index$1, {
        "class": `${prefixCls}-spin`,
        "loading": props.loading
      }, {
        default: () => [vue.createVNode(Component, vue.mergeProps({
          "ref": componentRef,
          "class": cls.value,
          "style": contentStyle.value
        }, scrollbarProps.value, {
          "onScroll": handleScroll
        }), {
          default: () => [vue.createVNode("div", {
            "class": `${prefixCls}-content-wrapper`
          }, [slots.header && vue.createVNode("div", {
            "class": `${prefixCls}-header`
          }, [slots.header()]), isVirtualList.value && !props.gridProps ? vue.createVNode(vue.Fragment, null, [renderVirtualList(), renderScrollLoading()]) : vue.createVNode("div", {
            "role": "list",
            "class": contentCls.value
          }, [renderItems(), renderScrollLoading()]), slots.footer && vue.createVNode("div", {
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
module.exports = _List;
