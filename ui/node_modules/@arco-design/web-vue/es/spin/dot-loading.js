import { defineComponent, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
const DOT_NUMBER = 5;
var DotLoading = defineComponent({
  name: "DotLoading",
  props: {
    size: {
      type: Number
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("dot-loading");
    return () => {
      const style = props.size ? {
        width: `${props.size}px`,
        height: `${props.size}px`
      } : {};
      return createVNode("div", {
        "class": prefixCls,
        "style": {
          width: props.size ? `${props.size * 7}px` : void 0,
          height: props.size ? `${props.size}px` : void 0
        }
      }, [Array(DOT_NUMBER).fill(1).map((_, index) => createVNode("div", {
        "class": `${prefixCls}-item`,
        "key": index,
        "style": style
      }, null))]);
    };
  }
});
export { DotLoading as default };
