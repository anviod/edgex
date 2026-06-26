import { defineComponent, getCurrentInstance, inject, computed, ref, watch, createVNode, Transition, mergeProps, withDirectives, vShow, resolveComponent } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { collapseKey } from "./context.js";
import IconHover from "../_components/icon-hover.js";
import IconCaretRight from "../icon/icon-caret-right/index.js";
import IconCaretLeft from "../icon/icon-caret-left/index.js";
import { isNumber } from "../_utils/is.js";
var CollapseItem = defineComponent({
  name: "CollapseItem",
  components: {
    IconHover,
    IconCaretRight,
    IconCaretLeft
  },
  props: {
    header: String,
    disabled: {
      type: Boolean,
      default: false
    },
    showExpandIcon: {
      type: Boolean,
      default: true
    },
    destroyOnHide: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {
    slots
  }) {
    var _a;
    const instance = getCurrentInstance();
    const prefixCls = getPrefixCls("collapse-item");
    const collapseCtx = inject(collapseKey, {});
    const key = instance && isNumber(instance == null ? void 0 : instance.vnode.key) ? instance.vnode.key : String((_a = instance == null ? void 0 : instance.vnode.key) != null ? _a : "");
    const isActive = computed(() => {
      var _a2;
      return (_a2 = collapseCtx.activeKeys) == null ? void 0 : _a2.includes(key);
    });
    const mergedDestroyOnHide = computed(() => collapseCtx.destroyOnHide || props.destroyOnHide);
    const mergedShowExpandIcon = computed(() => {
      var _a2;
      return (_a2 = collapseCtx == null ? void 0 : collapseCtx.showExpandIcon) != null ? _a2 : props.showExpandIcon;
    });
    const mounted = ref(mergedDestroyOnHide.value ? isActive.value : true);
    const expandIconPosition = computed(() => {
      var _a2;
      return (_a2 = collapseCtx == null ? void 0 : collapseCtx.expandIconPosition) != null ? _a2 : "left";
    });
    const handleClick = (e) => {
      var _a2;
      if (!props.disabled) {
        (_a2 = collapseCtx.handleClick) == null ? void 0 : _a2.call(collapseCtx, key, e);
      }
    };
    watch(isActive, (isActive2) => {
      if (isActive2 && !mounted.value) {
        mounted.value = true;
      }
    });
    const transitionEvents = {
      onEnter: (el) => {
        el.style.height = `${el.scrollHeight}px`;
      },
      onAfterEnter: (el) => {
        el.style.height = "auto";
      },
      onBeforeLeave: (el) => {
        el.style.height = `${el.scrollHeight}px`;
      },
      onLeave: (el) => {
        el.style.height = "0";
      },
      onAfterLeave: () => {
        if (mergedDestroyOnHide.value) {
          mounted.value = false;
        }
      }
    };
    const cls = computed(() => [prefixCls, {
      [`${prefixCls}-active`]: isActive.value
    }]);
    const headerCls = computed(() => [`${prefixCls}-header`, `${prefixCls}-header-${collapseCtx == null ? void 0 : collapseCtx.expandIconPosition}`, {
      [`${prefixCls}-header-disabled`]: props.disabled
    }]);
    const iconCls = computed(() => [{
      [`${prefixCls}-icon-right`]: (collapseCtx == null ? void 0 : collapseCtx.expandIconPosition) === "right"
    }]);
    const contentCls = computed(() => [`${prefixCls}-content`, {
      [`${prefixCls}-content-expend`]: isActive.value
    }]);
    const defaultExpandIcon = () => expandIconPosition.value === "right" ? createVNode(resolveComponent("icon-caret-left"), {
      "class": `${prefixCls}-expand-icon`
    }, null) : createVNode(resolveComponent("icon-caret-right"), {
      "class": `${prefixCls}-expand-icon`
    }, null);
    const expandIconRender = () => mergedShowExpandIcon.value && createVNode(resolveComponent("icon-hover"), {
      "prefix": prefixCls,
      "class": iconCls.value,
      "disabled": props.disabled
    }, {
      default: () => {
        var _a2, _b, _c, _d;
        return [(_d = (_c = (_b = slots["expand-icon"]) != null ? _b : (_a2 = collapseCtx == null ? void 0 : collapseCtx.slots) == null ? void 0 : _a2["expand-icon"]) == null ? void 0 : _c({
          active: isActive.value,
          disabled: props.disabled,
          position: expandIconPosition.value
        })) != null ? _d : defaultExpandIcon()];
      }
    });
    return () => {
      var _a2, _b, _c;
      return createVNode("div", {
        "class": cls.value
      }, [createVNode("div", {
        "role": "button",
        "aria-disabled": props.disabled,
        "aria-expanded": isActive.value,
        "tabindex": "0",
        "class": headerCls.value,
        "onClick": handleClick
      }, [expandIconRender(), createVNode("div", {
        "class": `${prefixCls}-header-title`
      }, [(_b = (_a2 = slots.header) == null ? void 0 : _a2.call(slots)) != null ? _b : props.header]), slots.extra && createVNode("div", {
        "class": `${prefixCls}-header-extra`
      }, [(_c = slots.extra) == null ? void 0 : _c.call(slots)])]), createVNode(Transition, mergeProps({
        "name": "collapse-slider"
      }, transitionEvents), {
        default: () => {
          var _a3;
          return [withDirectives(createVNode("div", {
            "role": "region",
            "class": contentCls.value
          }, [mounted.value && createVNode("div", {
            "ref": "contentBoxRef",
            "class": `${prefixCls}-content-box`
          }, [(_a3 = slots.default) == null ? void 0 : _a3.call(slots)])]), [[vShow, isActive.value]])];
        }
      })]);
    };
  }
});
export { CollapseItem as default };
