import { defineComponent, ref, computed, provide } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { LayoutSiderInjectionKey } from "./context.js";
var _sfc_main = defineComponent({
  name: "Layout",
  props: {
    hasSider: {
      type: Boolean
    }
  },
  setup(props) {
    const siderIds = ref([]);
    const prefixCls = getPrefixCls("layout");
    const classNames = computed(() => [prefixCls, {
      [`${prefixCls}-has-sider`]: props.hasSider || siderIds.value.length
    }]);
    provide(LayoutSiderInjectionKey, {
      onSiderMount: (id) => siderIds.value.push(id),
      onSiderUnMount: (id) => {
        siderIds.value = siderIds.value.filter((_id) => _id !== id);
      }
    });
    return {
      classNames
    };
  }
});
export { _sfc_main as default };
