import { getCurrentInstance, computed } from "vue";
const generateId = (() => {
  let i = 0;
  return (prefix = "") => {
    i += 1;
    return `${prefix}${i}`;
  };
})();
function useMenu() {
  const instance = getCurrentInstance();
  const key = computed(
    () => (instance == null ? void 0 : instance.vnode.key) || generateId("__arco_menu")
  );
  return {
    key
  };
}
export { useMenu as default };
