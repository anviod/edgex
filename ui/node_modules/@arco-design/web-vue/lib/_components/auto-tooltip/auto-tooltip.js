"use strict";
var vue = require("vue");
var index = require("../../tooltip/index.js");
var resizeObserverV2 = require("../resize-observer-v2.js");
var globalConfig = require("../../_utils/global-config.js");
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
}
var AutoTooltip = vue.defineComponent({
  name: "AutoTooltip",
  inheritAttrs: false,
  props: {
    tooltipProps: {
      type: Object
    }
  },
  setup(props, {
    attrs,
    slots
  }) {
    const prefix = globalConfig.getPrefixCls("auto-tooltip");
    const containerRef = vue.ref();
    const contentRef = vue.ref();
    const text = vue.ref("");
    const showTooltip = vue.ref(false);
    const calTooltip = () => {
      if (containerRef.value && contentRef.value) {
        const _show = contentRef.value.offsetWidth > containerRef.value.offsetWidth;
        if (_show !== showTooltip.value) {
          showTooltip.value = _show;
        }
      }
    };
    const getText = () => {
      var _a;
      if (((_a = contentRef.value) == null ? void 0 : _a.textContent) && contentRef.value.textContent !== text.value) {
        text.value = contentRef.value.textContent;
      }
    };
    const onResize = () => {
      getText();
      calTooltip();
    };
    vue.onMounted(() => {
      getText();
      calTooltip();
    });
    vue.onUpdated(() => {
      getText();
      calTooltip();
    });
    const renderContent = () => {
      return vue.createVNode("span", vue.mergeProps({
        "ref": containerRef,
        "class": prefix
      }, attrs), [vue.createVNode(resizeObserverV2, {
        "onResize": onResize
      }, {
        default: () => {
          var _a;
          return [vue.createVNode("span", {
            "ref": contentRef,
            "class": `${prefix}-content`
          }, [(_a = slots.default) == null ? void 0 : _a.call(slots)])];
        }
      })]);
    };
    return () => {
      let _slot2;
      if (showTooltip.value) {
        let _slot;
        return vue.createVNode(index, vue.mergeProps({
          "content": text.value,
          "onResize": onResize
        }, props.tooltipProps), _isSlot(_slot = renderContent()) ? _slot : {
          default: () => [_slot]
        });
      }
      return vue.createVNode(resizeObserverV2, {
        "onResize": onResize
      }, _isSlot(_slot2 = renderContent()) ? _slot2 : {
        default: () => [_slot2]
      });
    };
  }
});
module.exports = AutoTooltip;
