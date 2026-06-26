"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var is = require("../_utils/is.js");
var utils = require("./utils.js");
var uploadButton = require("./upload-button.js");
var uploadList = require("./upload-list.js");
var context = require("./context.js");
require("../image/index.js");
var useFormItem = require("../_hooks/use-form-item.js");
var previewGroup = require("../image/preview-group.js");
var _Upload = vue.defineComponent({
  name: "Upload",
  props: {
    fileList: {
      type: Array,
      default: void 0
    },
    defaultFileList: {
      type: Array,
      default: () => []
    },
    accept: String,
    action: String,
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    directory: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    tip: String,
    headers: {
      type: Object
    },
    data: {
      type: [Object, Function]
    },
    name: {
      type: [String, Function]
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    customRequest: {
      type: Function
    },
    limit: {
      type: Number,
      default: 0
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    showRemoveButton: {
      type: Boolean,
      default: true
    },
    showRetryButton: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    showUploadButton: {
      type: [Boolean, Object],
      default: true
    },
    showPreviewButton: {
      type: Boolean,
      default: true
    },
    download: {
      type: Boolean,
      default: false
    },
    showLink: {
      type: Boolean,
      default: true
    },
    imageLoading: {
      type: String
    },
    listType: {
      type: String,
      default: "text"
    },
    responseUrlKey: {
      type: [String, Function]
    },
    customIcon: {
      type: Object
    },
    imagePreview: {
      type: Boolean,
      default: false
    },
    onBeforeUpload: {
      type: Function
    },
    onBeforeRemove: {
      type: Function
    },
    onButtonClick: {
      type: Function
    }
  },
  emits: {
    "update:fileList": (fileList) => true,
    "exceedLimit": (fileList, files) => true,
    "change": (fileList, fileItem) => true,
    "progress": (fileItem, ev) => true,
    "preview": (fileItem) => true,
    "success": (fileItem) => true,
    "error": (fileItem) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      fileList,
      disabled,
      listType,
      customIcon,
      showRetryButton,
      showCancelButton,
      showRemoveButton,
      showPreviewButton,
      imageLoading,
      download,
      showLink
    } = vue.toRefs(props);
    const prefixCls = globalConfig.getPrefixCls("upload");
    const {
      mergedDisabled,
      eventHandlers
    } = useFormItem.useFormItem({
      disabled
    });
    const _fileList = vue.ref([]);
    const fileMap = /* @__PURE__ */ new Map();
    const requestMap = /* @__PURE__ */ new Map();
    const isMax = vue.computed(() => {
      return props.limit > 0 && _fileList.value.length >= props.limit;
    });
    const checkFileList = (fileList2) => {
      fileMap.clear();
      const newFileList = fileList2 == null ? void 0 : fileList2.map((data, index) => {
        var _a, _b, _c;
        const status = (_a = data.status) != null ? _a : "done";
        const fileItem = vue.reactive({
          ...data,
          uid: (_b = data.uid) != null ? _b : `${Date.now()}${index}`,
          status,
          percent: (_c = data.percent) != null ? _c : ["error", "init"].indexOf(status) > -1 ? 0 : 1
        });
        fileMap.set(fileItem.uid, fileItem);
        return fileItem;
      });
      _fileList.value = newFileList != null ? newFileList : [];
    };
    checkFileList(props.defaultFileList);
    vue.watch(fileList, (fileList2) => {
      if (fileList2) {
        checkFileList(fileList2);
      }
    }, {
      immediate: true,
      deep: true
    });
    const updateFileList = (file) => {
      var _a, _b;
      emit("update:fileList", _fileList.value);
      emit("change", _fileList.value, file);
      (_b = (_a = eventHandlers.value) == null ? void 0 : _a.onChange) == null ? void 0 : _b.call(_a);
    };
    const updateFile = (id, file) => {
      for (const item of _fileList.value) {
        if (item.uid === id) {
          item.file = file;
          updateFileList(item);
          break;
        }
      }
    };
    const uploadFile = (fileItem) => {
      const handleProgress = (percent, event) => {
        const file = fileMap.get(fileItem.uid);
        if (file) {
          file.status = "uploading";
          file.percent = percent;
          emit("progress", file, event);
          updateFileList(file);
        }
      };
      const handleSuccess = (response) => {
        const file = fileMap.get(fileItem.uid);
        if (file) {
          file.status = "done";
          file.percent = 1;
          file.response = response;
          if (props.responseUrlKey) {
            if (is.isFunction(props.responseUrlKey)) {
              file.url = props.responseUrlKey(file);
            } else if (response[props.responseUrlKey]) {
              file.url = response[props.responseUrlKey];
            }
          }
          requestMap.delete(file.uid);
          emit("success", file);
          updateFileList(file);
        }
      };
      const handleError = (response) => {
        const file = fileMap.get(fileItem.uid);
        if (file) {
          file.status = "error";
          file.percent = 0;
          file.response = response;
          requestMap.delete(file.uid);
          emit("error", file);
          updateFileList(file);
        }
      };
      const option = {
        fileItem,
        action: props.action,
        name: props.name,
        data: props.data,
        headers: props.headers,
        withCredentials: props.withCredentials,
        onProgress: handleProgress,
        onSuccess: handleSuccess,
        onError: handleError
      };
      fileItem.status = "uploading";
      fileItem.percent = 0;
      const request = is.isFunction(props.customRequest) ? props.customRequest(option) : utils.uploadRequest(option);
      requestMap.set(fileItem.uid, request);
      updateFileList(fileItem);
    };
    const abort = (fileItem) => {
      var _a;
      const req = requestMap.get(fileItem.uid);
      if (req) {
        (_a = req.abort) == null ? void 0 : _a.call(req);
        requestMap.delete(fileItem.uid);
        const file = fileMap.get(fileItem.uid);
        if (file) {
          file.status = "error";
          file.percent = 0;
          updateFileList(file);
        }
      }
    };
    const submit = (fileItem) => {
      if (fileItem) {
        const file = fileMap.get(fileItem.uid);
        if (file) {
          uploadFile(file);
        }
      } else {
        for (const item of _fileList.value) {
          if (item.status === "init") {
            uploadFile(item);
          }
        }
      }
    };
    const initUpload = async (file, index) => {
      const uid = `${Date.now()}-${index}`;
      const dataURL = utils.isImage(file) ? URL.createObjectURL(file) : void 0;
      const fileItem = vue.reactive({
        uid,
        file,
        url: dataURL,
        name: file.name,
        status: "init",
        percent: 0
      });
      fileMap.set(uid, fileItem);
      _fileList.value = [..._fileList.value, fileItem];
      updateFileList(fileItem);
      if (props.autoUpload) {
        uploadFile(fileItem);
      }
    };
    const uploadFiles = (files) => {
      if (props.limit > 0 && _fileList.value.length + files.length > props.limit) {
        emit("exceedLimit", _fileList.value, files);
        return;
      }
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (is.isFunction(props.onBeforeUpload)) {
          Promise.resolve(props.onBeforeUpload(file)).then((result) => {
            if (result) {
              initUpload(is.isBoolean(result) ? file : result, i);
            }
          }).catch((err) => {
            console.error(err);
          });
        } else {
          initUpload(file, i);
        }
      }
    };
    const removeFile = (fileItem) => {
      _fileList.value = _fileList.value.filter((item) => {
        return item.uid !== fileItem.uid;
      });
      updateFileList(fileItem);
    };
    const handleRemove = (fileItem) => {
      if (is.isFunction(props.onBeforeRemove)) {
        Promise.resolve(props.onBeforeRemove(fileItem)).then((result) => {
          if (result) {
            removeFile(fileItem);
          }
        }).catch((err) => {
          console.error(err);
        });
      } else {
        removeFile(fileItem);
      }
    };
    const handlePreview = (fileItem) => {
      if (props.imagePreview && fileItem.url) {
        const current = imageList.value.indexOf(fileItem.url);
        if (current > -1) {
          imagePreviewCurrent.value = current;
          imagePreviewVisible.value = true;
        }
      }
      emit("preview", fileItem);
    };
    vue.provide(context.uploadInjectionKey, vue.reactive({
      disabled: mergedDisabled,
      listType,
      iconCls: `${prefixCls}-icon`,
      showRemoveButton,
      showRetryButton,
      showCancelButton,
      showPreviewButton,
      showLink,
      imageLoading,
      download,
      customIcon,
      slots,
      onUpload: uploadFile,
      onAbort: abort,
      onRemove: handleRemove,
      onPreview: handlePreview
    }));
    const mergedAccept = vue.computed(() => {
      if (props.accept) {
        return props.accept;
      }
      if (props.listType === "picture" || props.listType === "picture-card") {
        return "image/*";
      }
      return void 0;
    });
    const renderButton = () => {
      const button = vue.createVNode(uploadButton, {
        "key": "arco-upload-button",
        "disabled": mergedDisabled.value,
        "draggable": props.draggable,
        "listType": props.listType,
        "uploadFiles": uploadFiles,
        "multiple": props.multiple,
        "directory": props.directory,
        "tip": props.tip,
        "hide": !props.showUploadButton || isMax.value && !(is.isObject(props.showUploadButton) && props.showUploadButton.showOnExceedLimit),
        "accept": mergedAccept.value,
        "onButtonClick": props.onButtonClick
      }, {
        default: slots["upload-button"]
      });
      if (props.tip && props.listType !== "picture-card" && !props.draggable) {
        return vue.createVNode("span", null, [button, vue.createVNode("div", {
          "class": `${prefixCls}-tip`
        }, [props.tip])]);
      }
      return button;
    };
    const imagePreviewVisible = vue.ref(false);
    const imagePreviewCurrent = vue.ref(0);
    const handleImagePreviewChange = (current) => {
      imagePreviewCurrent.value = current;
    };
    const handleImagePreviewVisibleChange = (visible) => {
      imagePreviewVisible.value = visible;
    };
    const imageList = vue.computed(() => _fileList.value.filter((item) => Boolean(item.url)).map((item) => item.url));
    const render = () => {
      if (!props.showFileList) {
        return props.showUploadButton && renderButton();
      }
      return vue.createVNode("div", {
        "class": [`${prefixCls}-wrapper`, `${prefixCls}-wrapper-type-${props.listType}`]
      }, [props.imagePreview && imageList.value.length > 0 && vue.createVNode(previewGroup, {
        "srcList": imageList.value,
        "visible": imagePreviewVisible.value,
        "current": imagePreviewCurrent.value,
        "onChange": handleImagePreviewChange,
        "onVisibleChange": handleImagePreviewVisibleChange
      }, null), props.listType !== "picture-card" && props.showUploadButton && renderButton(), vue.createVNode(uploadList, {
        "fileList": _fileList.value,
        "listType": props.listType
      }, {
        "upload-button": renderButton,
        "upload-item": slots["upload-item"]
      })]);
    };
    return {
      prefixCls,
      render,
      innerSubmit: submit,
      innerAbort: abort,
      innerUpdateFile: updateFile,
      innerUpload: uploadFiles
    };
  },
  methods: {
    submit(fileItem) {
      return this.innerSubmit(fileItem);
    },
    abort(fileItem) {
      return this.innerAbort(fileItem);
    },
    updateFile(id, file) {
      return this.innerUpdateFile(id, file);
    },
    upload(files) {
      return this.innerUpload(files);
    }
  },
  render() {
    return this.render();
  }
});
module.exports = _Upload;
