"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var pageItem = require("./page-item.js");
var pageItemStep = require("./page-item-step.js");
var pageItemEllipsis = require("./page-item-ellipsis.js");
var pageJumper = require("./page-jumper.js");
var pageOptions = require("./page-options.js");
var index = require("../locale/index.js");
var is = require("../_utils/is.js");
var useSize = require("../_hooks/use-size.js");
var _Pagination = vue.defineComponent({
  name: "Pagination",
  props: {
    total: {
      type: Number,
      required: true
    },
    current: Number,
    defaultCurrent: {
      type: Number,
      default: 1
    },
    pageSize: Number,
    defaultPageSize: {
      type: Number,
      default: 10
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hideOnSinglePage: {
      type: Boolean,
      default: false
    },
    simple: {
      type: Boolean,
      default: false
    },
    showTotal: {
      type: Boolean,
      default: false
    },
    showMore: {
      type: Boolean,
      default: false
    },
    showJumper: {
      type: Boolean,
      default: false
    },
    showPageSize: {
      type: Boolean,
      default: false
    },
    pageSizeOptions: {
      type: Array,
      default: () => [10, 20, 30, 40, 50]
    },
    pageSizeProps: {
      type: Object
    },
    size: {
      type: String
    },
    pageItemStyle: {
      type: Object
    },
    activePageItemStyle: {
      type: Object
    },
    baseSize: {
      type: Number,
      default: 6
    },
    bufferSize: {
      type: Number,
      default: 2
    },
    autoAdjust: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    "update:current": (current) => true,
    "update:pageSize": (pageSize) => true,
    "change": (current) => true,
    "pageSizeChange": (pageSize) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("pagination");
    const {
      t
    } = index.useI18n();
    const {
      disabled,
      pageItemStyle,
      activePageItemStyle,
      size
    } = vue.toRefs(props);
    const {
      mergedSize
    } = useSize.useSize(size);
    const _current = vue.ref(props.defaultCurrent);
    const _pageSize = vue.ref(props.defaultPageSize);
    const computedCurrent = vue.computed(() => {
      var _a;
      return (_a = props.current) != null ? _a : _current.value;
    });
    const computedPageSize = vue.computed(() => {
      var _a;
      return (_a = props.pageSize) != null ? _a : _pageSize.value;
    });
    const pages = vue.computed(() => Math.ceil(props.total / computedPageSize.value));
    const handleClick = (page) => {
      if (page !== computedCurrent.value && is.isNumber(page) && !props.disabled) {
        _current.value = page;
        emit("update:current", page);
        emit("change", page);
      }
    };
    const handlePageSizeChange = (pageSize) => {
      _pageSize.value = pageSize;
      emit("update:pageSize", pageSize);
      emit("pageSizeChange", pageSize);
    };
    const pagerProps = vue.reactive({
      current: computedCurrent,
      pages,
      disabled,
      style: pageItemStyle,
      activeStyle: activePageItemStyle,
      onClick: handleClick
    });
    const getPageItemElement = (type, props2 = {}) => {
      if (type === "more") {
        return vue.createVNode(pageItemEllipsis, vue.mergeProps(props2, pagerProps), {
          default: slots["page-item-ellipsis"]
        });
      }
      if (type === "previous") {
        return vue.createVNode(pageItemStep, vue.mergeProps({
          "type": "previous"
        }, props2, pagerProps), {
          default: slots["page-item-step"]
        });
      }
      if (type === "next") {
        return vue.createVNode(pageItemStep, vue.mergeProps({
          "type": "next"
        }, props2, pagerProps), {
          default: slots["page-item-step"]
        });
      }
      return vue.createVNode(pageItem, vue.mergeProps(props2, pagerProps), {
        default: slots["page-item"]
      });
    };
    const pageList = vue.computed(() => {
      const pageList2 = [];
      if (pages.value < props.baseSize + props.bufferSize * 2) {
        for (let i = 1; i <= pages.value; i++) {
          pageList2.push(getPageItemElement("page", {
            key: i,
            pageNumber: i
          }));
        }
      } else {
        let left = 1;
        let right = pages.value;
        let hasLeftEllipsis = false;
        let hasRightEllipsis = false;
        if (computedCurrent.value > 2 + props.bufferSize) {
          hasLeftEllipsis = true;
          left = Math.min(computedCurrent.value - props.bufferSize, pages.value - 2 * props.bufferSize);
        }
        if (computedCurrent.value < pages.value - (props.bufferSize + 1)) {
          hasRightEllipsis = true;
          right = Math.max(computedCurrent.value + props.bufferSize, 2 * props.bufferSize + 1);
        }
        if (hasLeftEllipsis) {
          pageList2.push(getPageItemElement("page", {
            key: 1,
            pageNumber: 1
          }));
          pageList2.push(getPageItemElement("more", {
            key: "left-ellipsis-pager",
            step: -(props.bufferSize * 2 + 1)
          }));
        }
        for (let i = left; i <= right; i++) {
          pageList2.push(getPageItemElement("page", {
            key: i,
            pageNumber: i
          }));
        }
        if (hasRightEllipsis) {
          pageList2.push(getPageItemElement("more", {
            key: "right-ellipsis-pager",
            step: props.bufferSize * 2 + 1
          }));
          pageList2.push(getPageItemElement("page", {
            key: pages.value,
            pageNumber: pages.value
          }));
        }
      }
      return pageList2;
    });
    const renderPager = () => {
      if (props.simple) {
        return vue.createVNode("span", {
          "class": `${prefixCls}-simple`
        }, [getPageItemElement("previous", {
          simple: true
        }), vue.createVNode(pageJumper, {
          "disabled": props.disabled,
          "current": computedCurrent.value,
          "size": mergedSize.value,
          "pages": pages.value,
          "simple": true,
          "onChange": handleClick
        }, null), getPageItemElement("next", {
          simple: true
        })]);
      }
      return vue.createVNode("ul", {
        "class": `${prefixCls}-list`
      }, [getPageItemElement("previous", {
        simple: true
      }), pageList.value, props.showMore && getPageItemElement("more", {
        key: "more",
        step: props.bufferSize * 2 + 1
      }), getPageItemElement("next", {
        simple: true
      })]);
    };
    vue.watch(computedPageSize, (curPageSize, prePageSize) => {
      if (props.autoAdjust && curPageSize !== prePageSize && computedCurrent.value > 1) {
        const index2 = prePageSize * (computedCurrent.value - 1) + 1;
        const newPage = Math.ceil(index2 / curPageSize);
        if (newPage !== computedCurrent.value) {
          _current.value = newPage;
          emit("update:current", newPage);
          emit("change", newPage);
        }
      }
    });
    vue.watch(pages, (curPages, prePages) => {
      if (props.autoAdjust && curPages !== prePages && computedCurrent.value > 1 && computedCurrent.value > curPages) {
        const newCurrent = Math.max(curPages, 1);
        _current.value = newCurrent;
        emit("update:current", newCurrent);
        emit("change", newCurrent);
      }
    });
    const cls = vue.computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-simple`]: props.simple,
      [`${prefixCls}-disabled`]: props.disabled
    }]);
    return () => {
      var _a, _b;
      if (props.hideOnSinglePage && pages.value <= 1) {
        return null;
      }
      return vue.createVNode("div", {
        "class": cls.value
      }, [props.showTotal && vue.createVNode("span", {
        "class": `${prefixCls}-total`
      }, [(_b = (_a = slots.total) == null ? void 0 : _a.call(slots, {
        total: props.total
      })) != null ? _b : t("pagination.total", props.total)]), renderPager(), props.showPageSize && vue.createVNode(pageOptions, {
        "disabled": props.disabled,
        "sizeOptions": props.pageSizeOptions,
        "pageSize": computedPageSize.value,
        "size": mergedSize.value,
        "onChange": handlePageSizeChange,
        "selectProps": props.pageSizeProps
      }, null), !props.simple && props.showJumper && vue.createVNode(pageJumper, {
        "disabled": props.disabled,
        "current": computedCurrent.value,
        "pages": pages.value,
        "size": mergedSize.value,
        "onChange": handleClick
      }, {
        "jumper-prepend": slots["jumper-prepend"],
        "jumper-append": slots["jumper-append"]
      })]);
    };
  }
});
module.exports = _Pagination;
