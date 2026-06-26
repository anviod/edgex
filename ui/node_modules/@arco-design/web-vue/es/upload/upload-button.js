import { defineComponent, ref, computed, createVNode, mergeProps } from "vue";
import { getFiles, loopDirectory } from "./utils.js";
import { useI18n } from "../locale/index.js";
import { getPrefixCls } from "../_utils/global-config.js";
import IconPlus from "../icon/icon-plus/index.js";
import Button from "../button/index.js";
import IconUpload from "../icon/icon-upload/index.js";
import { isFunction, isPromise } from "../_utils/is.js";
var UploadButton = defineComponent({
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
    const prefixCls = getPrefixCls("upload");
    const {
      t
    } = useI18n();
    const isDragging = ref(false);
    const inputRef = ref(null);
    const dropRef = ref(null);
    const dragEnterCount = ref(0);
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
      if (isFunction(props.onButtonClick)) {
        const result = props.onButtonClick(e);
        if (isPromise(result)) {
          result.then((files) => {
            props.uploadFiles(getFiles(files));
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
        props.uploadFiles(getFiles(target.files));
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
        loopDirectory(e.dataTransfer.items, props.accept, (files) => {
          props.uploadFiles(files);
        });
      } else {
        const files = getFiles((_b = e.dataTransfer) == null ? void 0 : _b.files, props.accept);
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
        return createVNode("span", null, [slots.default()]);
      }
      if (props.listType === "picture-card") {
        return createVNode("div", {
          "class": `${prefixCls}-picture-card`
        }, [createVNode("div", {
          "class": `${prefixCls}-picture-card-text`
        }, [createVNode(IconPlus, null, null)]), props.tip && createVNode("div", {
          "class": `${prefixCls}-tip`
        }, [props.tip])]);
      }
      if (props.draggable) {
        return createVNode("div", {
          "class": [`${prefixCls}-drag`, {
            [`${prefixCls}-drag-active`]: isDragging.value
          }]
        }, [createVNode("div", null, [createVNode(IconPlus, null, null)]), createVNode("div", {
          "class": `${prefixCls}-drag-text`
        }, [isDragging.value ? t("upload.dragHover") : t("upload.drag")]), props.tip && createVNode("div", {
          "class": `${prefixCls}-tip`
        }, [props.tip])]);
      }
      return createVNode(Button, {
        "type": "primary",
        "disabled": props.disabled
      }, {
        default: () => [t("upload.buttonText")],
        icon: () => createVNode(IconUpload, null, null)
      });
    };
    const cls = computed(() => [prefixCls, {
      [`${prefixCls}-type-picture-card`]: props.listType === "picture-card",
      [`${prefixCls}-draggable`]: props.draggable,
      [`${prefixCls}-disabled`]: props.disabled,
      [`${prefixCls}-hide`]: props.hide
    }]);
    return () => createVNode("span", {
      "ref": dropRef,
      "class": cls.value,
      "onClick": handleClick,
      "onDragenter": () => {
        setDragEnterCount("add");
      },
      "onDrop": handleDrop,
      "onDragover": handleDragOver,
      "onDragleave": handleDragLeave
    }, [createVNode("input", mergeProps({
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
export { UploadButton as default };
