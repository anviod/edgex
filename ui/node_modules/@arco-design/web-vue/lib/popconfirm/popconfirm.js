"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index$2 = require("../icon/icon-info-circle-fill/index.js");
var index$3 = require("../icon/icon-check-circle-fill/index.js");
var index$4 = require("../icon/icon-exclamation-circle-fill/index.js");
var index$5 = require("../icon/icon-close-circle-fill/index.js");
var index = require("../button/index.js");
var index$1 = require("../trigger/index.js");
var index$6 = require("../locale/index.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "Popconfirm",
  components: {
    ArcoButton: index["default"],
    Trigger: index$1,
    IconInfoCircleFill: index$2,
    IconCheckCircleFill: index$3,
    IconExclamationCircleFill: index$4,
    IconCloseCircleFill: index$5
  },
  props: {
    content: String,
    position: {
      type: String,
      default: "top"
    },
    popupVisible: {
      type: Boolean,
      default: void 0
    },
    defaultPopupVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "info"
    },
    okText: String,
    cancelText: String,
    okLoading: {
      type: Boolean,
      default: false
    },
    okButtonProps: {
      type: Object
    },
    cancelButtonProps: {
      type: Object
    },
    contentClass: {
      type: [String, Array, Object]
    },
    contentStyle: {
      type: Object
    },
    arrowClass: {
      type: [String, Array, Object]
    },
    arrowStyle: {
      type: Object
    },
    popupContainer: {
      type: [String, Object]
    },
    onBeforeOk: {
      type: Function
    },
    onBeforeCancel: {
      type: Function
    }
  },
  emits: {
    "update:popupVisible": (visible) => true,
    "popupVisibleChange": (visible) => true,
    "ok": () => true,
    "cancel": () => true
  },
  setup(props, { emit }) {
    const prefixCls = globalConfig.getPrefixCls("popconfirm");
    const { t } = index$6.useI18n();
    const _popupVisible = vue.ref(props.defaultPopupVisible);
    const computedPopupVisible = vue.computed(
      () => {
        var _a;
        return (_a = props.popupVisible) != null ? _a : _popupVisible.value;
      }
    );
    const _okLoading = vue.ref(false);
    const mergedOkLoading = vue.computed(() => props.okLoading || _okLoading.value);
    let promiseNumber = 0;
    const close = () => {
      promiseNumber++;
      if (_okLoading.value) {
        _okLoading.value = false;
      }
      _popupVisible.value = false;
      emit("update:popupVisible", false);
      emit("popupVisibleChange", false);
    };
    const handlePopupVisibleChange = (visible) => {
      if (!visible) {
        close();
      } else {
        _popupVisible.value = visible;
        emit("update:popupVisible", visible);
        emit("popupVisibleChange", visible);
      }
    };
    const handleOk = async () => {
      const currentPromiseNumber = promiseNumber;
      const closed = await new Promise(
        async (resolve) => {
          var _a;
          if (is.isFunction(props.onBeforeOk)) {
            let result = props.onBeforeOk((closed2 = true) => resolve(closed2));
            if (is.isPromise(result) || !is.isBoolean(result)) {
              _okLoading.value = true;
            }
            if (is.isPromise(result)) {
              try {
                result = (_a = await result) != null ? _a : true;
              } catch (error) {
                result = false;
                throw error;
              }
            }
            if (is.isBoolean(result)) {
              resolve(result);
            }
          } else {
            resolve(true);
          }
        }
      );
      if (currentPromiseNumber === promiseNumber) {
        if (closed) {
          emit("ok");
          close();
        } else if (_okLoading.value) {
          _okLoading.value = false;
        }
      }
    };
    const handleCancel = () => {
      var _a;
      let result = true;
      if (is.isFunction(props.onBeforeCancel)) {
        result = (_a = props.onBeforeCancel()) != null ? _a : false;
      }
      if (result) {
        emit("cancel");
        close();
      }
    };
    const contentCls = vue.computed(() => [
      `${prefixCls}-popup-content`,
      props.contentClass
    ]);
    const arrowCls = vue.computed(() => [
      `${prefixCls}-popup-arrow`,
      props.arrowClass
    ]);
    return {
      prefixCls,
      contentCls,
      arrowCls,
      computedPopupVisible,
      mergedOkLoading,
      handlePopupVisibleChange,
      handleOk,
      handleCancel,
      t
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_info_circle_fill = vue.resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = vue.resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = vue.resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = vue.resolveComponent("icon-close-circle-fill");
  const _component_arco_button = vue.resolveComponent("arco-button");
  const _component_trigger = vue.resolveComponent("trigger");
  return vue.openBlock(), vue.createBlock(_component_trigger, {
    class: vue.normalizeClass(_ctx.prefixCls),
    trigger: "click",
    position: _ctx.position,
    "show-arrow": "",
    "popup-visible": _ctx.computedPopupVisible,
    "popup-offset": 10,
    "popup-container": _ctx.popupContainer,
    "content-class": _ctx.contentCls,
    "content-style": _ctx.contentStyle,
    "arrow-class": _ctx.arrowCls,
    "arrow-style": _ctx.arrowStyle,
    "animation-name": "zoom-in-fade-out",
    "auto-fit-transform-origin": "",
    onPopupVisibleChange: _ctx.handlePopupVisibleChange
  }, {
    content: vue.withCtx(() => [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-body`)
      }, [
        vue.createElementVNode("span", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-icon`)
        }, [
          vue.renderSlot(_ctx.$slots, "icon", {}, () => [
            _ctx.type === "info" ? (vue.openBlock(), vue.createBlock(_component_icon_info_circle_fill, { key: 0 })) : _ctx.type === "success" ? (vue.openBlock(), vue.createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (vue.openBlock(), vue.createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (vue.openBlock(), vue.createBlock(_component_icon_close_circle_fill, { key: 3 })) : vue.createCommentVNode("v-if", true)
          ])
        ], 2),
        vue.createElementVNode("span", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
        }, [
          vue.renderSlot(_ctx.$slots, "content", {}, () => [
            vue.createTextVNode(vue.toDisplayString(_ctx.content), 1)
          ])
        ], 2)
      ], 2),
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-footer`)
      }, [
        vue.createVNode(_component_arco_button, vue.mergeProps({ size: "mini" }, _ctx.cancelButtonProps, { onClick: _ctx.handleCancel }), {
          default: vue.withCtx(() => [
            vue.createTextVNode(vue.toDisplayString(_ctx.cancelText || _ctx.t("popconfirm.cancelText")), 1)
          ]),
          _: 1
        }, 16, ["onClick"]),
        vue.createVNode(_component_arco_button, vue.mergeProps({
          type: "primary",
          size: "mini"
        }, _ctx.okButtonProps, {
          loading: _ctx.mergedOkLoading,
          onClick: _ctx.handleOk
        }), {
          default: vue.withCtx(() => [
            vue.createTextVNode(vue.toDisplayString(_ctx.okText || _ctx.t("popconfirm.okText")), 1)
          ]),
          _: 1
        }, 16, ["loading", "onClick"])
      ], 2)
    ]),
    default: vue.withCtx(() => [
      vue.renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["class", "position", "popup-visible", "popup-container", "content-class", "content-style", "arrow-class", "arrow-style", "onPopupVisibleChange"]);
}
var _Popconfirm = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Popconfirm;
