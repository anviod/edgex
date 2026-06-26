import { defineComponent, toRefs, ref, computed, reactive, watch, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import Pager from "./page-item.js";
import StepPager from "./page-item-step.js";
import EllipsisPager from "./page-item-ellipsis.js";
import PageJumper from "./page-jumper.js";
import PageOptions from "./page-options.js";
import { useI18n } from "../locale/index.js";
import { isNumber } from "../_utils/is.js";
import { useSize } from "../_hooks/use-size.js";
var _Pagination = defineComponent({
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
    const prefixCls = getPrefixCls("pagination");
    const {
      t
    } = useI18n();
    const {
      disabled,
      pageItemStyle,
      activePageItemStyle,
      size
    } = toRefs(props);
    const {
      mergedSize
    } = useSize(size);
    const _current = ref(props.defaultCurrent);
    const _pageSize = ref(props.defaultPageSize);
    const computedCurrent = computed(() => {
      var _a;
      return (_a = props.current) != null ? _a : _current.value;
    });
    const computedPageSize = computed(() => {
      var _a;
      return (_a = props.pageSize) != null ? _a : _pageSize.value;
    });
    const pages = computed(() => Math.ceil(props.total / computedPageSize.value));
    const handleClick = (page) => {
      if (page !== computedCurrent.value && isNumber(page) && !props.disabled) {
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
    const pagerProps = reactive({
      current: computedCurrent,
      pages,
      disabled,
      style: pageItemStyle,
      activeStyle: activePageItemStyle,
      onClick: handleClick
    });
    const getPageItemElement = (type, props2 = {}) => {
      if (type === "more") {
        return createVNode(EllipsisPager, mergeProps(props2, pagerProps), {
          default: slots["page-item-ellipsis"]
        });
      }
      if (type === "previous") {
        return createVNode(StepPager, mergeProps({
          "type": "previous"
        }, props2, pagerProps), {
          default: slots["page-item-step"]
        });
      }
      if (type === "next") {
        return createVNode(StepPager, mergeProps({
          "type": "next"
        }, props2, pagerProps), {
          default: slots["page-item-step"]
        });
      }
      return createVNode(Pager, mergeProps(props2, pagerProps), {
        default: slots["page-item"]
      });
    };
    const pageList = computed(() => {
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
        return createVNode("span", {
          "class": `${prefixCls}-simple`
        }, [getPageItemElement("previous", {
          simple: true
        }), createVNode(PageJumper, {
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
      return createVNode("ul", {
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
    watch(computedPageSize, (curPageSize, prePageSize) => {
      if (props.autoAdjust && curPageSize !== prePageSize && computedCurrent.value > 1) {
        const index = prePageSize * (computedCurrent.value - 1) + 1;
        const newPage = Math.ceil(index / curPageSize);
        if (newPage !== computedCurrent.value) {
          _current.value = newPage;
          emit("update:current", newPage);
          emit("change", newPage);
        }
      }
    });
    watch(pages, (curPages, prePages) => {
      if (props.autoAdjust && curPages !== prePages && computedCurrent.value > 1 && computedCurrent.value > curPages) {
        const newCurrent = Math.max(curPages, 1);
        _current.value = newCurrent;
        emit("update:current", newCurrent);
        emit("change", newCurrent);
      }
    });
    const cls = computed(() => [prefixCls, `${prefixCls}-size-${mergedSize.value}`, {
      [`${prefixCls}-simple`]: props.simple,
      [`${prefixCls}-disabled`]: props.disabled
    }]);
    return () => {
      var _a, _b;
      if (props.hideOnSinglePage && pages.value <= 1) {
        return null;
      }
      return createVNode("div", {
        "class": cls.value
      }, [props.showTotal && createVNode("span", {
        "class": `${prefixCls}-total`
      }, [(_b = (_a = slots.total) == null ? void 0 : _a.call(slots, {
        total: props.total
      })) != null ? _b : t("pagination.total", props.total)]), renderPager(), props.showPageSize && createVNode(PageOptions, {
        "disabled": props.disabled,
        "sizeOptions": props.pageSizeOptions,
        "pageSize": computedPageSize.value,
        "size": mergedSize.value,
        "onChange": handlePageSizeChange,
        "selectProps": props.pageSizeProps
      }, null), !props.simple && props.showJumper && createVNode(PageJumper, {
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
export { _Pagination as default };
