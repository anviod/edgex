import { defineComponent, ref, reactive, watch, onMounted, onBeforeUnmount, provide, computed, nextTick, openBlock, createElementBlock, normalizeClass, createCommentVNode, createElementVNode, renderSlot } from "vue";
import computeScrollIntoView from "compute-scroll-into-view";
import { getPrefixCls } from "../_utils/global-config.js";
import { isNumber, isWindow } from "../_utils/is.js";
import { getElement, on, off } from "../_utils/dom.js";
import { slide } from "./utils.js";
import { anchorInjectionKey } from "./context.js";
import { throttleByRaf } from "../_utils/throttle-by-raf.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const BOUNDARY_POSITIONS = ["start", "end", "center", "nearest"];
const _sfc_main = defineComponent({
  name: "Anchor",
  props: {
    boundary: {
      type: [Number, String],
      default: "start",
      validator: (value) => {
        return isNumber(value) || BOUNDARY_POSITIONS.includes(value);
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
    const prefixCls = getPrefixCls("anchor");
    const anchorRef = ref();
    const lineSliderRef = ref();
    const links = reactive({});
    const currentLink = ref("");
    const isScrolling = ref(false);
    const scrollContainerEle = ref();
    const containerEle = ref();
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
        const element = getElement(hash);
        if (!element)
          return;
        let block;
        let diff = 0;
        if (isNumber(props.boundary)) {
          block = "start";
          diff = props.boundary;
        } else {
          block = props.boundary;
        }
        const actions = computeScrollIntoView(element, { block });
        if (!actions.length)
          return;
        const { el, top } = actions[0];
        const targetTop = top - diff;
        slide(el, targetTop, () => {
          isScrolling.value = false;
        });
        isScrolling.value = true;
      } catch (e) {
        console.error(e);
      }
    };
    const handleScroll = throttleByRaf(() => {
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
        const element = getElement(`a[data-href='${hash}']`, anchorRef.value);
        if (!element)
          return;
        links[hash] = element;
      }
      if (hash !== currentLink.value) {
        currentLink.value = hash;
        nextTick(() => {
          emit("change", hash);
        });
      }
    };
    const getFirstInViewportEle = () => {
      if (!scrollContainerEle.value || !containerEle.value) {
        return void 0;
      }
      const boundary = isNumber(props.boundary) ? props.boundary : 0;
      const containerRect = containerEle.value.getBoundingClientRect();
      for (const hash of Object.keys(links)) {
        const element = getElement(hash);
        if (element) {
          const { top } = element.getBoundingClientRect();
          const offsetTop = isWindow(scrollContainerEle.value) ? top - boundary : top - containerRect.top - boundary;
          if (offsetTop >= 0 && offsetTop <= containerRect.height / 2) {
            return element;
          }
        }
      }
      return void 0;
    };
    watch(currentLink, () => {
      const link = links[currentLink.value];
      if (!props.lineLess && link && lineSliderRef.value) {
        lineSliderRef.value.style.top = `${link.offsetTop}px`;
      }
    });
    const bindScrollEvent = () => {
      if (scrollContainerEle.value) {
        on(scrollContainerEle.value, "scroll", handleScroll);
      }
    };
    const unbindScrollEvent = () => {
      if (scrollContainerEle.value) {
        off(scrollContainerEle.value, "scroll", handleScroll);
      }
    };
    const getContainer = () => {
      if (props.scrollContainer) {
        scrollContainerEle.value = isWindow(props.scrollContainer) ? window : getElement(props.scrollContainer);
        containerEle.value = isWindow(props.scrollContainer) ? document.documentElement : getElement(props.scrollContainer);
      } else {
        scrollContainerEle.value = window;
        containerEle.value = document.documentElement;
      }
    };
    onMounted(() => {
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
    onBeforeUnmount(() => {
      unbindScrollEvent();
    });
    provide(
      anchorInjectionKey,
      reactive({
        currentLink,
        addLink,
        removeLink,
        handleClick
      })
    );
    const cls = computed(() => [
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
  return openBlock(), createElementBlock("div", {
    ref: "anchorRef",
    class: normalizeClass(_ctx.cls)
  }, [
    !_ctx.lineLess ? (openBlock(), createElementBlock("div", {
      key: 0,
      ref: "lineSliderRef",
      class: normalizeClass(`${_ctx.prefixCls}-line-slider`)
    }, null, 2)) : createCommentVNode("v-if", true),
    createElementVNode("ul", {
      class: normalizeClass(`${_ctx.prefixCls}-list`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2)
  ], 2);
}
var _Anchor = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Anchor as default };
