import { getCurrentInstance, ref, onUpdated } from "vue";
import { generateKey } from "../utils/tree-data.js";
function useNodeKey() {
  const instance = getCurrentInstance();
  const getKey = () => {
    var _a;
    return (_a = instance == null ? void 0 : instance.vnode.key) != null ? _a : generateKey();
  };
  const key = ref(getKey());
  onUpdated(() => {
    key.value = getKey();
  });
  return key;
}
export { useNodeKey as default };
