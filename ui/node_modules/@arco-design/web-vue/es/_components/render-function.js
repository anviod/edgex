import { defineComponent } from "vue";
var RenderFunction = defineComponent({
  name: "RenderFunction",
  props: {
    renderFunc: {
      type: Function,
      required: true
    }
  },
  render() {
    return this.renderFunc(this.$attrs);
  }
});
export { RenderFunction as default };
