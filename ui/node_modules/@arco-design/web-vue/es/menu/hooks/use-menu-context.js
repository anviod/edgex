import { inject } from "vue";
import { MenuInjectionKey } from "../context.js";
function useMenuContext() {
  const menuContext = inject(MenuInjectionKey);
  return menuContext || {};
}
export { useMenuContext as default };
