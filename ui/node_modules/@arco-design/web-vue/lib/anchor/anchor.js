"use strict";
var vue = require("vue");
var computeScrollIntoView = require("compute-scroll-into-view");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var dom = require("../_utils/dom.js");
var utils = require("./utils.js");
var context = require("./context.js");
var throttleByRaf = require("../_utils/throttle-by-raf.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var computeScrollIntoView__default = /* @__PURE__ */ _interopDefaultLegacy(computeScrollIntoView);
const BOUNDARY_POSITIONS = ["start", "end", "center", "nearest"];
const _sfc_main = vue.defineComponent({
  name: "Anchor",
  props: {
    boundary: {
      type: [Number, String],
      default: "start",
      validator: (value) => {
        return is.isNumber(value) || BOUNDARY_POSITIONS.includes(value);
      }
    },
    lineLess: {
      type: Boolean,
      default: false
    },
    scrollContainer: {
      type: [String, Object]
    },
    changeHash: {
      type: Boolean,
      default: true
    },
    smooth: {
      type: Boolean,
      default: true
    }
  },
  emits: {
    select: (hash, preHash) => true,
    change: (hash) => true
  },
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("anchor");
    const anchorRef = vue.ref();
    const lineSliderRef = vue.ref();
    const links = vue.reactive({});
    const currentLink = vue.ref("");
    const isScrolling = vue.ref(false);
    const scrollContainerEle = vue.ref();
    const containerEle = vue.ref();
    const addLink = (hash, node) => {
      if (!hash)
        return;
      links[hash] = node;
    };
    const removeLink = (hash) => {
      delete links[hash];
    };
    const handleClick = (e, hash) => {
      if (!props.changeHash) {
        e.preventDefault();
      }
      if (hash) {
        scrollIntoView(hash);
        handleAnchorChange(hash);
      }
      emit("select", hash, currentLink.value);
    };
    const scrollIntoView = (hash) => {
      try {
        const element = dom.getElement(hash);
        if (!element)
          return;
        let block;
        let diff = 0;
        if (is.isNumber(props.boundary)) {
          block = "start";
          diff = props.boundary;
        } else {
          block = props.boundary;
        }
        const actions = computeScrollIntoView__default["default"](element, { block });
        if (!actions.length)
          return;
        const { el, top } = actions[0];
        const targetTop = top - diff;
        utils.slide(el, targetTop, () => {
          isScrolling.value = false;
        });
        isScrolling.value = true;
      } catch (e) {
        console.error(e);
      }
    };
    const handleScroll = throttleByRaf.throttleByRaf(() => {
      if (isScrolling.value)
        return;
      const element = getFirstInViewportEle();
      if (element && element.id) {
        const hash = `#${element.id}`;
        handleAnchorChange(hash);
      }
    });
    const handleAnchorChange = (hash) => {
      if (!links[hash] && anchorRef.value) {
        const element = dom.getElement(`a[data-href='${hash}']`, anchorRef.value);
        if (!element)
          return;
        links[hash] = element;
      }
      if (hash !== currentLink.value) {
        currentLink.value = hash;
        vue.nextTick(() => {
          emit("change", hash);
        });
      }
    };
    const getFirstInViewportEle = () => {
      if (!scrollContainerEle.value || !containerEle.value) {
        return void 0;
      }
      const boundary = is.isNumber(props.boundary) ? props.boundary : 0;
      const containerRect = containerEle.value.getBoundingClientRect();
      for (const hash of Object.keys(links)) {
        const element = dom.getElement(hash);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const offsetTop = is.isWindow(scrollContainerEle.value) ? top - boundary : top - containerRect.top - boundary;
          if (offsetTop >= 0 && offsetTop <= containerRect.height / 2) {
            return element;
          }
        }
      }
      return void 0;
    };
    vue.watch(currentLink, () => {
      const link = links[currentLink.value];
      if (!props.lineLess && link && lineSliderRef.value) {
        lineSliderRef.value.style.top = `${link.offsetTop}px`;
      }
    });
    const bindScrollEvent = () => {
      if (scrollContainerEle.value) {
        dom.on(scrollContainerEle.value, "scroll", handleScroll);
      }
    };
    const unbindScrollEvent = () => {
      if (scrollContainerEle.value) {
        dom.off(scrollContainerEle.value, "scroll", handleScroll);
      }
    };
    const getContainer = () => {
      if (props.scrollContainer) {
        scrollContainerEle.value = is.isWindow(props.scrollContainer) ? window : dom.getElement(props.scrollContainer);
        containerEle.value = is.isWindow(props.scrollContainer) ? document.documentElement : dom.getElement(props.scrollContainer);
      } else {
        scrollContainerEle.value = window;
        containerEle.value = document.documentElement;
      }
    };
    vue.onMounted(() => {
      getContainer();
      const hash = decodeURIComponent(window.location.hash);
      if (hash) {
        scrollIntoView(hash);
        handleAnchorChange(hash);
      } else {
        handleScroll();
      }
      bindScrollEvent();
    });
    vue.onBeforeUnmount(() => {
      unbindScrollEvent();
    });
    vue.provide(
      context.anchorInjectionKey,
      vue.reactive({
        currentLink,
        addLink,
        removeLink,
        handleClick
      })
    );
    const cls = vue.computed(() => [
      prefixCls,
      {
        [`${prefixCls}-line-less`]: props.lineLess
      }
    ]);
    return {
      prefixCls,
      cls,
      anchorRef,
      lineSliderRef
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    ref: "anchorRef",
    class: vue.normalizeClass(_ctx.cls)
  }, [
    !_ctx.lineLess ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      ref: "lineSliderRef",
      class: vue.normalizeClass(`${_ctx.prefixCls}-line-slider`)
    }, null, 2)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("ul", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-list`)
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 2)
  ], 2);
}
var _Anchor = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Anchor;
