import { defineComponent, ref, onMounted, onUpdated, createVNode, mergeProps, isVNode } from "vue";
import Tooltip from "../../tooltip/index.js";
import ResizeObserver from "../resize-observer-v2.js";
import { getPrefixCls } from "../../_utils/global-config.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var AutoTooltip = defineComponent({
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
    const prefix = getPrefixCls("auto-tooltip");
    const containerRef = ref();
    const contentRef = ref();
    const text = ref("");
    const showTooltip = ref(false);
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
    onMounted(() => {
      getText();
      calTooltip();
    });
    onUpdated(() => {
      getText();
      calTooltip();
    });
    const renderContent = () => {
      return createVNode("span", mergeProps({
        "ref": containerRef,
        "class": prefix
      }, attrs), [createVNode(ResizeObserver, {
        "onResize": onResize
      }, {
        default: () => {
          var _a;
          return [createVNode("span", {
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
        return createVNode(Tooltip, mergeProps({
          "content": text.value,
          "onResize": onResize
        }, props.tooltipProps), _isSlot(_slot = renderContent()) ? _slot : {
          default: () => [_slot]
        });
      }
      return createVNode(ResizeObserver, {
        "onResize": onResize
      }, _isSlot(_slot2 = renderContent()) ? _slot2 : {
        default: () => [_slot2]
      });
    };
  }
});
export { AutoTooltip as default };
