"use strict";
var vue = require("vue");
var dom = require("../_utils/dom.js");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var omit = require("../_utils/omit.js");
var vueUtils = require("../_utils/vue-utils.js");
var drawer = require("./drawer.js");
const open = (config, appContext) => {
  let container = dom.getOverlay("drawer");
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
  const vm = vue.createVNode(
    drawer,
    {
      ...defaultConfig,
      ...omit.omit(config, [
        "content",
        "title",
        "footer",
        "visible",
        "unmountOnClose",
        "onOk",
        "onCancel",
        "onClose"
      ]),
      ...{
        header: typeof config.header === "boolean" ? config.header : void 0,
        footer: typeof config.footer === "boolean" ? config.footer : void 0
      }
    },
    {
      default: vueUtils.getSlotFunction(config.content),
      header: typeof config.header !== "boolean" ? vueUtils.getSlotFunction(config.header) : void 0,
      title: vueUtils.getSlotFunction(config.title),
      footer: typeof config.footer !== "boolean" ? vueUtils.getSlotFunction(config.footer) : void 0
    }
  );
  if (appContext != null ? appContext : Drawer._context) {
    vm.appContext = appContext != null ? appContext : Drawer._context;
  }
  vue.render(vm, container);
  document.body.appendChild(container);
  return {
    close: handleReturnClose,
    update: handleUpdateConfig
  };
};
const Drawer = Object.assign(drawer, {
  open,
  install: (app, options) => {
    globalConfig.setGlobalConfig(app, options);
    const componentPrefix = globalConfig.getComponentPrefix(options);
    app.component(componentPrefix + drawer.name, drawer);
    const drawerWithContext = {
      open: (config, appContext = app._context) => open(config, appContext)
    };
    app.config.globalProperties.$drawer = drawerWithContext;
  },
  _context: null
});
module.exports = Drawer;
