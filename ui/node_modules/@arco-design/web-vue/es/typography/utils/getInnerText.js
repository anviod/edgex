import { createApp, createVNode } from "vue";
let container;
function getInnerText(node) {
  if (!node)
    return "";
  if (!container) {
    container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");
    document.body.appendChild(container);
  }
  const vm = createApp({
    render() {
      return createVNode("div", null, [node]);
    }
  });
  vm.mount(container);
  const text = container.innerText;
  vm.unmount();
  return text;
}
export { getInnerText as default };
