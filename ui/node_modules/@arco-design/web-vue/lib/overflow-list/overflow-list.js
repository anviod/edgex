"use strict";
var vue = require("vue");
var resizeObserverV2 = require("../_components/resize-observer-v2.js");
var vueUtils = require("../_utils/vue-utils.js");
var globalConfig = require("../_utils/global-config.js");
var index = require("../tag/index.js");
var array = require("../_utils/array.js");
var _OverflowList = vue.defineComponent({
  name: "OverflowList",
  props: {
    min: {
      type: Number,
      default: 0
    },
    margin: {
      type: Number,
      default: 8
    },
    from: {
      type: String,
      default: "end"
    }
  },
  emits: {
    change: (value) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("overflow-list");
    const listRef = vue.ref();
    const overflowRef = vue.ref();
    const spacerRef = vue.ref();
    const children = {};
    const itemWidths = [];
    const total = vue.ref(0);
    const overflowNumber = vue.ref(0);
    const showOverflow = vue.computed(() => overflowNumber.value > 0);
    const nextWidth = vue.ref(0);
    const isStart = vue.computed(() => props.from === "start");
    vue.watch(total, (cur, pre) => {
      if (overflowNumber.value > 0) {
        overflowNumber.value += cur - pre;
        if (overflowNumber.value < 0) {
          overflowNumber.value = 0;
        }
      }
    });
    vue.watch(overflowNumber, (val) => {
      emit("change", val);
    });
    const onResize = () => {
      var _a, _b, _c;
      if (listRef.value && children.value && spacerRef.value) {
        const spacerWidth = spacerRef.value.offsetWidth;
        if (spacerWidth > 1 && (overflowNumber.value === 0 || spacerWidth < nextWidth.value)) {
          return;
        }
        for (let i = 0; i < children.value.length; i++) {
          const element = children.value[i].el;
          if (element && element.offsetWidth) {
            itemWidths[i] = element.offsetWidth + props.margin;
          }
        }
        let remainingWidth = listRef.value.clientWidth - ((_b = (_a = overflowRef.value) == null ? void 0 : _a.offsetWidth) != null ? _b : 0) - (isStart.value ? props.margin : 0);
        const _itemWidths = isStart.value ? array.getReverse(itemWidths) : itemWidths;
        let count = 0;
        for (let i = 0; i < _itemWidths.length; i++) {
          const itemWidth = (_c = _itemWidths[i]) != null ? _c : 0;
          if (itemWidth < remainingWidth - 1) {
            remainingWidth -= itemWidth;
            count += 1;
          } else {
            nextWidth.value = itemWidth;
            break;
          }
        }
        if (count < props.min && props.min < total.value) {
          count = props.min;
        }
        if (overflowNumber.value !== total.value - count) {
          overflowNumber.value = total.value - count;
        }
      }
    };
    vue.watch(showOverflow, () => onResize(), {
      flush: "post"
    });
    vue.onMounted(() => {
      if (spacerRef.value && spacerRef.value.offsetWidth < 1) {
        onResize();
      }
    });
    const renderOverflow = () => {
      var _a, _b;
      const style = isStart.value ? {
        marginRight: `${props.margin}px`
      } : void 0;
      return vue.createVNode("div", {
        "ref": overflowRef,
        "class": `${prefixCls}-overflow`,
        "style": style
      }, [(_b = (_a = slots.overflow) == null ? void 0 : _a.call(slots, {
        number: overflowNumber.value
      })) != null ? _b : vue.createVNode(index, null, {
        default: () => [vue.createTextVNode("+"), overflowNumber.value]
      })]);
    };
    return () => {
      var _a, _b;
      children.value = vueUtils.getAllElements((_a = slots.default) == null ? void 0 : _a.call(slots));
      if (total.value !== children.value.length) {
        total.value = children.value.length;
        itemWidths.length = total.value;
      }
      let visibleChildren = children.value;
      if (overflowNumber.value > 0) {
        visibleChildren = isStart.value ? children.value.slice(overflowNumber.value) : children.value.slice(0, -overflowNumber.value);
      }
      const withMarginNumber = overflowNumber.value === 0 || isStart.value ? visibleChildren.length - 1 : visibleChildren.length;
      for (let i = 0; i < withMarginNumber; i++) {
        visibleChildren[i].props = vue.mergeProps((_b = visibleChildren[i].props) != null ? _b : {}, {
          style: {
            marginRight: `${props.margin}px`
          }
        });
      }
      return vue.createVNode("div", {
        "ref": listRef,
        "class": prefixCls
      }, [isStart.value && overflowNumber.value > 0 && renderOverflow(), visibleChildren, !isStart.value && overflowNumber.value > 0 && renderOverflow(), vue.createVNode(resizeObserverV2, {
        "onResize": onResize
      }, {
        default: () => [vue.createVNode("div", {
          "ref": spacerRef,
          "class": `${prefixCls}-spacer`
        }, null)]
      })]);
    };
  }
});
module.exports = _OverflowList;
