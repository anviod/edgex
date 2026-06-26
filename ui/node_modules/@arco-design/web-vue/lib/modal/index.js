"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var constant = require("../_utils/constant.js");
var dom = require("../_utils/dom.js");
var is = require("../_utils/is.js");
var modal$1 = require("./modal.js");
var omit = require("../_utils/omit.js");
var vueUtils = require("../_utils/vue-utils.js");
const open = (config, appContext) => {
  let container = dom.getOverlay("modal");
  const handleOk = () => {
    if (vm.component) {
      vm.component.props.visible = false;
    }
    if (is.isFunction(config.onOk)) {
      config.onOk();
    }
  };
  const handleCancel = () => {
    if (vm.component) {
      vm.component.props.visible = false;
    }
    if (is.isFunction(config.onCancel)) {
      config.onCancel();
    }
  };
  const handleClose = async () => {
    await vue.nextTick();
    if (container) {
      vue.render(null, container);
      document.body.removeChild(container);
    }
    container = null;
    if (is.isFunction(config.onClose)) {
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
  const vm = vue.createVNode(modal$1, {
    ...defaultConfig,
    ...omit.omit(config, ["content", "title", "footer", "visible", "unmountOnClose", "onOk", "onCancel", "onClose"]),
    ...{
      footer: typeof config.footer === "boolean" ? config.footer : void 0
    }
  }, {
    default: vueUtils.getSlotFunction(config.content),
    title: vueUtils.getSlotFunction(config.title),
    footer: typeof config.footer !== "boolean" ? vueUtils.getSlotFunction(config.footer) : void 0
  });
  if (appContext != null ? appContext : Modal._context) {
    vm.appContext = appContext != null ? appContext : Modal._context;
  }
  vue.render(vm, container);
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
  ...constant.MESSAGE_TYPES.reduce((pre, value) => {
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
const Modal = Object.assign(modal$1, {
  ...modal,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + modal$1.name, modal$1);
    const modalWithContext = {};
    for (const key of Object.keys(modal)) {
      modalWithContext[key] = (config, appContext = app._context) => modal[key](config, appContext);
    }
    app.config.globalProperties.$modal = modalWithContext;
  },
  _context: null
});
module.exports = Modal;
