"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var uploadListItem = require("./upload-list-item.js");
var uploadPictureItem = require("./upload-picture-item.js");
var is = require("../_utils/is.js");
var UploadList = vue.defineComponent({
  name: "UploadList",
  components: {
    UploadListItem: uploadListItem,
    UploadPictureItem: uploadPictureItem
  },
  props: {
    fileList: {
      type: Array,
      required: true
    },
    listType: {
      type: String,
      required: true
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = globalConfig.getPrefixCls("upload");
    const cls = vue.computed(() => [`${prefixCls}-list`, `${prefixCls}-list-type-${props.listType}`]);
    const renderItem = (fileItem, index) => {
      if (is.isFunction(slots["upload-item"])) {
        return slots["upload-item"]({
          fileItem,
          index
        });
      }
      if (props.listType === "picture-card") {
        return vue.createVNode(uploadPictureItem, {
          "file": fileItem,
          "key": `item-${index}`
        }, null);
      }
      return vue.createVNode(uploadListItem, {
        "file": fileItem,
        "listType": props.listType,
        "key": `item-${index}`
      }, null);
    };
    return () => vue.createVNode(vue.TransitionGroup, {
      "tag": "div",
      "class": cls.value
    }, {
      default: () => {
        var _a;
        return [...props.fileList.map((item, index) => renderItem(item, index)), props.listType === "picture-card" && ((_a = slots["upload-button"]) == null ? void 0 : _a.call(slots))];
      }
    });
  }
});
module.exports = UploadList;
