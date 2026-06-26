import { inject } from "vue";
import { TreeInjectionKey } from "../context.js";
function useTreeContext() {
  const treeContext = inject(TreeInjectionKey);
  return treeContext || {};
}
export { useTreeContext as default };
