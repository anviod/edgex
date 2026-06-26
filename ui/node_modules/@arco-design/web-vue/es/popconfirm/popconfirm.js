import { defineComponent, ref, computed, resolveComponent, openBlock, createBlock, normalizeClass, withCtx, createElementVNode, renderSlot, createCommentVNode, createTextVNode, toDisplayString, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconInfoCircleFill from "../icon/icon-info-circle-fill/index.js";
import IconCheckCircleFill from "../icon/icon-check-circle-fill/index.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import IconCloseCircleFill from "../icon/icon-close-circle-fill/index.js";
import Button from "../button/index.js";
import Trigger from "../trigger/index.js";
import { useI18n } from "../locale/index.js";
import { isFunction, isPromise, isBoolean } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Popconfirm",
  components: {
    ArcoButton: Button,
    Trigger,
    IconInfoCircleFill,
    IconCheckCircleFill,
    IconExclamationCircleFill,
    IconCloseCircleFill
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
    const prefixCls = getPrefixCls("popconfirm");
    const { t } = useI18n();
    const _popupVisible = ref(props.defaultPopupVisible);
    const computedPopupVisible = computed(
      () => {
        var _a;
        return (_a = props.popupVisible) != null ? _a : _popupVisible.value;
      }
    );
    const _okLoading = ref(false);
    const mergedOkLoading = computed(() => props.okLoading || _okLoading.value);
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
          if (isFunction(props.onBeforeOk)) {
            let result = props.onBeforeOk((closed2 = true) => resolve(closed2));
            if (isPromise(result) || !isBoolean(result)) {
              _okLoading.value = true;
            }
            if (isPromise(result)) {
              try {
                result = (_a = await result) != null ? _a : true;
              } catch (error) {
                result = false;
                throw error;
              }
            }
            if (isBoolean(result)) {
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
      if (isFunction(props.onBeforeCancel)) {
        result = (_a = props.onBeforeCancel()) != null ? _a : false;
      }
      if (result) {
        emit("cancel");
        close();
      }
    };
    const contentCls = computed(() => [
      `${prefixCls}-popup-content`,
      props.contentClass
    ]);
    const arrowCls = computed(() => [
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
  const _component_icon_info_circle_fill = resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = resolveComponent("icon-close-circle-fill");
  const _component_arco_button = resolveComponent("arco-button");
  const _component_trigger = resolveComponent("trigger");
  return openBlock(), createBlock(_component_trigger, {
    class: normalizeClass(_ctx.prefixCls),
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
    content: withCtx(() => [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-body`)
      }, [
        createElementVNode("span", {
          class: normalizeClass(`${_ctx.prefixCls}-icon`)
        }, [
          renderSlot(_ctx.$slots, "icon", {}, () => [
            _ctx.type === "info" ? (openBlock(), createBlock(_component_icon_info_circle_fill, { key: 0 })) : _ctx.type === "success" ? (openBlock(), createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (openBlock(), createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (openBlock(), createBlock(_component_icon_close_circle_fill, { key: 3 })) : createCommentVNode("v-if", true)
          ])
        ], 2),
        createElementVNode("span", {
          class: normalizeClass(`${_ctx.prefixCls}-content`)
        }, [
          renderSlot(_ctx.$slots, "content", {}, () => [
            createTextVNode(toDisplayString(_ctx.content), 1)
          ])
        ], 2)
      ], 2),
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-footer`)
      }, [
        createVNode(_component_arco_button, mergeProps({ size: "mini" }, _ctx.cancelButtonProps, { onClick: _ctx.handleCancel }), {
          default: withCtx(() => [
            createTextVNode(toDisplayString(_ctx.cancelText || _ctx.t("popconfirm.cancelText")), 1)
          ]),
          _: 1
        }, 16, ["onClick"]),
        createVNode(_component_arco_button, mergeProps({
          type: "primary",
          size: "mini"
        }, _ctx.okButtonProps, {
          loading: _ctx.mergedOkLoading,
          onClick: _ctx.handleOk
        }), {
          default: withCtx(() => [
            createTextVNode(toDisplayString(_ctx.okText || _ctx.t("popconfirm.okText")), 1)
          ]),
          _: 1
        }, 16, ["loading", "onClick"])
      ], 2)
    ]),
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["class", "position", "popup-visible", "popup-container", "content-class", "content-style", "arrow-class", "arrow-style", "onPopupVisibleChange"]);
}
var _Popconfirm = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Popconfirm as default };
