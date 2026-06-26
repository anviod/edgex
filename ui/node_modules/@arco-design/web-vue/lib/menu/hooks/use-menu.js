"use strict";
var vue = require("vue");
const generateId = (() => {
  let i = 0;
  return (prefix = "") => {
    i += 1;
    return `${prefix}${i}`;
  };
})();
function useMenu() {
  const instance = vue.getCurrentInstance();
  const key = vue.computed(
    () => (instance == null ? void 0 : instance.vnode.key) || generateId("__arco_menu")
  );
  return {
    key
  };
}
module.exports = useMenu;
