"use strict";
var vue = require("vue");
var utils = require("./utils.js");
var index = require("../locale/index.js");
var globalConfig = require("../_utils/global-config.js");
var index$1 = require("../icon/icon-plus/index.js");
var index$2 = require("../button/index.js");
var index$3 = require("../icon/icon-upload/index.js");
var is = require("../_utils/is.js");
var UploadButton = vue.defineComponent({
  name: "UploadButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    directory: {
      type: Boolean,
      default: false
    },
    accept: String,
    listType: {
      type: String
    },
    tip: String,
    draggable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    uploadFiles: {
      type: Function,
      required: true
    },
    hide: Boolean,
    onButtonClick: {
      type: Function
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("upload");
    const {
      t
    } = index.useI18n();
    const isDragging = vue.ref(false);
    const inputRef = vue.ref(null);
    const dropRef = vue.ref(null);
    const dragEnterCount = vue.ref(0);
    const setDragEnterCount = (type) => {
      if (type === "subtract") {
        dragEnterCount.value -= 1;
      } else if (type === "add") {
        dragEnterCount.value += 1;
      } else if (type === "reset") {
        dragEnterCount.value = 0;
      }
    };
    const handleClick = (e) => {
      if (props.disabled)
        return;
      if (is.isFunction(props.onButtonClick)) {
        const result = props.onButtonClick(e);
        if (is.isPromise(result)) {
          result.then((files) => {
            props.uploadFiles(utils.getFiles(files));
          });
          return;
        }
      }
      if (inputRef.value) {
        inputRef.value.click();
      }
    };
    const handleInputChange = (e) => {
      const target = e.target;
      if (target.files) {
        props.uploadFiles(utils.getFiles(target.files));
      }
      target.value = "";
    };
    const handleDrop = (e) => {
      var _a, _b;
      e.preventDefault();
      isDragging.value = false;
      setDragEnterCount("reset");
      if (props.disabled) {
        return;
      }
      if (props.directory && ((_a = e.dataTransfer) == null ? void 0 : _a.items)) {
        utils.loopDirectory(e.dataTransfer.items, props.accept, (files) => {
          props.uploadFiles(files);
        });
      } else {
        const files = utils.getFiles((_b = e.dataTransfer) == null ? void 0 : _b.files, props.accept);
        props.uploadFiles(props.multiple ? files : files.slice(0, 1));
      }
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragEnterCount("subtract");
      if (dragEnterCount.value === 0) {
        isDragging.value = false;
        setDragEnterCount("reset");
      }
    };
    const handleDragOver = (e) => {
      e.preventDefault();
      if (!props.disabled && !isDragging.value) {
        isDragging.value = true;
      }
    };
    const renderButton = () => {
      if (slots.default) {
        return vue.createVNode("span", null, [slots.default()]);
      }
      if (props.listType === "picture-card") {
        return vue.createVNode("div", {
          "class": `${prefixCls}-picture-card`
        }, [vue.createVNode("div", {
          "class": `${prefixCls}-picture-card-text`
        }, [vue.createVNode(index$1, null, null)]), props.tip && vue.createVNode("div", {
          "class": `${prefixCls}-tip`
        }, [props.tip])]);
      }
      if (props.draggable) {
        return vue.createVNode("div", {
          "class": [`${prefixCls}-drag`, {
            [`${prefixCls}-drag-active`]: isDragging.value
          }]
        }, [vue.createVNode("div", null, [vue.createVNode(index$1, null, null)]), vue.createVNode("div", {
          "class": `${prefixCls}-drag-text`
        }, [isDragging.value ? t("upload.dragHover") : t("upload.drag")]), props.tip && vue.createVNode("div", {
          "class": `${prefixCls}-tip`
        }, [props.tip])]);
      }
      return vue.createVNode(index$2["default"], {
        "type": "primary",
        "disabled": props.disabled
      }, {
        default: () => [t("upload.buttonText")],
        icon: () => vue.createVNode(index$3, null, null)
      });
    };
    const cls = vue.computed(() => [prefixCls, {
      [`${prefixCls}-type-picture-card`]: props.listType === "picture-card",
      [`${prefixCls}-draggable`]: props.draggable,
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-hide`]: props.hide
    }]);
    return () => vue.createVNode("span", {
      "ref": dropRef,
      "class": cls.value,
      "onClick": handleClick,
      "onDragenter": () => {
        setDragEnterCount("add");
      },
      "onDrop": handleDrop,
      "onDragover": handleDragOver,
      "onDragleave": handleDragLeave
    }, [vue.createVNode("input", vue.mergeProps({
      "ref": inputRef,
      "type": "file",
      "style": {
        display: "none"
      },
      "disabled": props.disabled,
      "accept": props.accept,
      "multiple": props.multiple
    }, props.directory ? {
      webkitdirectory: "webkitdirectory"
    } : {}, {
      "onChange": handleInputChange
    }), null), renderButton()]);
  }
});
module.exports = UploadButton;
