import { defineComponent, computed, createVNode, TransitionGroup } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import UploadListItem from "./upload-list-item.js";
import UploadPictureItem from "./upload-picture-item.js";
import { isFunction } from "../_utils/is.js";
var UploadList = defineComponent({
  name: "UploadList",
  components: {
    UploadListItem,
    UploadPictureItem
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
    const prefixCls = getPrefixCls("upload");
    const cls = computed(() => [`${prefixCls}-list`, `${prefixCls}-list-type-${props.listType}`]);
    const renderItem = (fileItem, index) => {
      if (isFunction(slots["upload-item"])) {
        return slots["upload-item"]({
          fileItem,
          index
        });
      }
      if (props.listType === "picture-card") {
        return createVNode(UploadPictureItem, {
          "file": fileItem,
          "key": `item-${index}`
        }, null);
      }
      return createVNode(UploadListItem, {
        "file": fileItem,
        "listType": props.listType,
        "key": `item-${index}`
      }, null);
    };
    return () => createVNode(TransitionGroup, {
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
export { UploadList as default };
