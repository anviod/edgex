"use strict";
var vue = require("vue");
var RenderFunction = vue.defineComponent({
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
module.exports = RenderFunction;
