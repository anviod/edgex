import { defineComponent, toRefs, computed } from "vue";
import RenderFunction from "../_components/render-function.js";
import { getPrefixCls } from "../_utils/global-config.js";
import ImagePreviewAction from "./preview-action.js";
var _sfc_main = defineComponent({
  name: "ImagePreviewToolbar",
  components: {
    RenderFunction,
    PreviewAction: ImagePreviewAction
  },
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    actionsLayout: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const {
      actions,
      actionsLayout
    } = toRefs(props);
    const prefixCls = getPrefixCls("image-preview-toolbar");
    const resultActions = computed(() => {
      const actionsLayoutSet = new Set(actionsLayout.value);
      const filterWithLayout = (item) => actionsLayoutSet.has(item.key);
      const filteredActions = actions.value.filter(filterWithLayout);
      return filteredActions.sort((pre, cur) => {
        const preIndex = actionsLayout.value.indexOf(pre.key);
        const curIndex = actionsLayout.value.indexOf(cur.key);
        return preIndex > curIndex ? 1 : -1;
      });
    });
    return {
      prefixCls,
      resultActions
    };
  }
});
export { _sfc_main as default };
