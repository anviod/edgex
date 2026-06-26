import { createVNode, render, nextTick } from "vue";
import { setGlobalConfig, getComponentPrefix } from "../_utils/global-config.js";
import { MESSAGE_TYPES } from "../_utils/constant.js";
import { getOverlay } from "../_utils/dom.js";
import { isFunction } from "../_utils/is.js";
import _Modal from "./modal.js";
import { omit } from "../_utils/omit.js";
import { getSlotFunction } from "../_utils/vue-utils.js";
const open = (config, appContext) => {
  let container = getOverlay("modal");
  const handleOk = () => {
    if (vm.component) {
      vm.component.props.visible = false;
    }
    if (isFunction(config.onOk)) {
      config.onOk();
    }
  };
  const handleCancel = () => {
    if (vm.component) {
      vm.component.props.visible = false;
    }
    if (isFunction(config.onCancel)) {
      config.onCancel();
    }
  };
  const handleClose = async () => {
    await nextTick();
    if (container) {
      render(null, container);
      document.body.removeChild(container);
    }
    container = null;
    if (isFunction(config.onClose)) {
      config.onClose();
    }
  };
  const handleReturnClose = () => {
    if (vm.component) {
      vm.component.props.visible = false;
    }
  };
  const handleUpdateConfig = (config2) => {
    if (vm.component) {
      Object.entries(config2).forEach(([key, value]) => {
        vm.component.props[key] = value;
      });
    }
  };
  const defaultConfig = {
    visible: true,
    renderToBody: false,
    unmountOnClose: true,
    onOk: handleOk,
    onCancel: handleCancel,
    onClose: handleClose
  };
  const vm = createVNode(_Modal, {
    ...defaultConfig,
    ...omit(config, ["content", "title", "footer", "visible", "unmountOnClose", "onOk", "onCancel", "onClose"]),
    ...{
      footer: typeof config.footer === "boolean" ? config.footer : void 0
    }
  }, {
    default: getSlotFunction(config.content),
    title: getSlotFunction(config.title),
    footer: typeof config.footer !== "boolean" ? getSlotFunction(config.footer) : void 0
  });
  if (appContext != null ? appContext : Modal._context) {
    vm.appContext = appContext != null ? appContext : Modal._context;
  }
  render(vm, container);
  document.body.appendChild(container);
  return {
    close: handleReturnClose,
    update: handleUpdateConfig
  };
};
const modal = {
  open,
  confirm: (config, appContext) => {
    const _config = {
      simple: true,
      messageType: "warning",
      ...config
    };
    return open(_config, appContext);
  },
  ...MESSAGE_TYPES.reduce((pre, value) => {
    pre[value] = (config, appContext) => {
      const _config = {
        simple: true,
        hideCancel: true,
        messageType: value,
        ...config
      };
      return open(_config, appContext);
    };
    return pre;
  }, {})
};
const Modal = Object.assign(_Modal, {
  ...modal,
  install: (app, options) => {
    setGlobalConfig(app, options);
    const componentPrefix = getComponentPrefix(options);
    app.component(componentPrefix + _Modal.name, _Modal);
    const modalWithContext = {};
    for (const key of Object.keys(modal)) {
      modalWithContext[key] = (config, appContext = app._context) => modal[key](config, appContext);
    }
    app.config.globalProperties.$modal = modalWithContext;
  },
  _context: null
});
export { Modal as default };
