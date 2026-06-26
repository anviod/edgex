"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var iconHover = require("../_components/icon-hover.js");
var index = require("../icon/icon-caret-right/index.js");
var index$1 = require("../icon/icon-caret-left/index.js");
var is = require("../_utils/is.js");
var CollapseItem = vue.defineComponent({
  name: "CollapseItem",
  components: {
    IconHover: iconHover,
    IconCaretRight: index,
    IconCaretLeft: index$1
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
    const instance = vue.getCurrentInstance();
    const prefixCls = globalConfig.getPrefixCls("collapse-item");
    const collapseCtx = vue.inject(context.collapseKey, {});
    const key = instance && is.isNumber(instance == null ? void 0 : instance.vnode.key) ? instance.vnode.key : String((_a = instance == null ? void 0 : instance.vnode.key) != null ? _a : "");
    const isActive = vue.computed(() => {
      var _a2;
      return (_a2 = collapseCtx.activeKeys) == null ? void 0 : _a2.includes(key);
    });
    const mergedDestroyOnHide = vue.computed(() => collapseCtx.destroyOnHide || props.destroyOnHide);
    const mergedShowExpandIcon = vue.computed(() => {
      var _a2;
      return (_a2 = collapseCtx == null ? void 0 : collapseCtx.showExpandIcon) != null ? _a2 : props.showExpandIcon;
    });
    const mounted = vue.ref(mergedDestroyOnHide.value ? isActive.value : true);
    const expandIconPosition = vue.computed(() => {
      var _a2;
      return (_a2 = collapseCtx == null ? void 0 : collapseCtx.expandIconPosition) != null ? _a2 : "left";
    });
    const handleClick = (e) => {
      var _a2;
      if (!props.disabled) {
        (_a2 = collapseCtx.handleClick) == null ? void 0 : _a2.call(collapseCtx, key, e);
      }
    };
    vue.watch(isActive, (isActive2) => {
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
    const cls = vue.computed(() => [prefixCls, {
      [`${prefixCls}-active`]: isActive.value
    }]);
    const headerCls = vue.computed(() => [`${prefixCls}-header`, `${prefixCls}-header-${collapseCtx == null ? void 0 : collapseCtx.expandIconPosition}`, {
      [`${prefixCls}-header-disabled`]: props.disabled
    }]);
    const iconCls = vue.computed(() => [{
      [`${prefixCls}-icon-right`]: (collapseCtx == null ? void 0 : collapseCtx.expandIconPosition) === "right"
    }]);
    const contentCls = vue.computed(() => [`${prefixCls}-content`, {
      [`${prefixCls}-content-expend`]: isActive.value
    }]);
    const defaultExpandIcon = () => expandIconPosition.value === "right" ? vue.createVNode(vue.resolveComponent("icon-caret-left"), {
      "class": `${prefixCls}-expand-icon`
    }, null) : vue.createVNode(vue.resolveComponent("icon-caret-right"), {
      "class": `${prefixCls}-expand-icon`
    }, null);
    const expandIconRender = () => mergedShowExpandIcon.value && vue.createVNode(vue.resolveComponent("icon-hover"), {
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
      return vue.createVNode("div", {
        "class": cls.value
      }, [vue.createVNode("div", {
        "role": "button",
        "aria-disabled": props.disabled,
        "aria-expanded": isActive.value,
        "tabindex": "0",
        "class": headerCls.value,
        "onClick": handleClick
      }, [expandIconRender(), vue.createVNode("div", {
        "class": `${prefixCls}-header-title`
      }, [(_b = (_a2 = slots.header) == null ? void 0 : _a2.call(slots)) != null ? _b : props.header]), slots.extra && vue.createVNode("div", {
        "class": `${prefixCls}-header-extra`
      }, [(_c = slots.extra) == null ? void 0 : _c.call(slots)])]), vue.createVNode(vue.Transition, vue.mergeProps({
        "name": "collapse-slider"
      }, transitionEvents), {
        default: () => {
          var _a3;
          return [vue.withDirectives(vue.createVNode("div", {
            "role": "region",
            "class": contentCls.value
          }, [mounted.value && vue.createVNode("div", {
            "ref": "contentBoxRef",
            "class": `${prefixCls}-content-box`
          }, [(_a3 = slots.default) == null ? void 0 : _a3.call(slots)])]), [[vue.vShow, isActive.value]])];
        }
      })]);
    };
  }
});
module.exports = CollapseItem;
