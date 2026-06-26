import { defineComponent, inject, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import UploadProgress from "./upload-progress.js";
import Tooltip from "../tooltip/index.js";
import IconDelete from "../icon/icon-delete/index.js";
import IconFile from "../icon/icon-file/index.js";
import IconFilePdf from "../icon/icon-file-pdf/index.js";
import IconFileImage from "../icon/icon-file-image/index.js";
import IconFileVideo from "../icon/icon-file-video/index.js";
import IconFileAudio from "../icon/icon-file-audio/index.js";
import IconExclamationCircleFill from "../icon/icon-exclamation-circle-fill/index.js";
import { useI18n } from "../locale/index.js";
import { uploadInjectionKey } from "./context.js";
var UploadListItem = defineComponent({
  name: "UploadListItem",
  props: {
    file: {
      type: Object,
      required: true
    },
    listType: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("upload-list");
    const itemCls = `${prefixCls}-item`;
    const {
      t
    } = useI18n();
    const uploadCtx = inject(uploadInjectionKey, void 0);
    const renderFileIcon = () => {
      var _a, _b;
      let type = "";
      if (props.file.file && props.file.file.type) {
        type = props.file.file.type;
      } else {
        const extension = (_b = (_a = props.file.name) == null ? void 0 : _a.split(".")[1]) != null ? _b : "";
        if (["png", "jpg", "jpeg", "bmp", "gif", "webp"].includes(extension)) {
          type = "image";
        } else if (["mp4", "m2v", "mkv", "m4v", "mov"].includes(extension)) {
          type = "video";
        } else if (["mp3", "wav", "wmv", "m4a", "acc", "flac"].includes(extension)) {
          type = "audio";
        }
      }
      if (type.includes("image")) {
        return createVNode(IconFileImage, null, null);
      }
      if (type.includes("pdf")) {
        return createVNode(IconFilePdf, null, null);
      }
      if (type.includes("audio")) {
        return createVNode(IconFileAudio, null, null);
      }
      if (type.includes("video")) {
        return createVNode(IconFileVideo, null, null);
      }
      return createVNode(IconFile, null, null);
    };
    return () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
      return createVNode("div", {
        "class": [itemCls, `${itemCls}-${props.file.status}`]
      }, [createVNode("div", {
        "class": `${itemCls}-content`
      }, [(uploadCtx == null ? void 0 : uploadCtx.listType) === "picture" && createVNode("span", {
        "class": `${itemCls}-thumbnail`
      }, [(_c = (_b = uploadCtx == null ? void 0 : (_a = uploadCtx.slots).image) == null ? void 0 : _b.call(_a, {
        fileItem: props.file
      })) != null ? _c : createVNode("img", mergeProps({
        "src": props.file.url,
        "alt": props.file.name
      }, (uploadCtx == null ? void 0 : uploadCtx.imageLoading) ? {
        loading: uploadCtx.imageLoading
      } : void 0), null)]), createVNode("div", {
        "class": `${itemCls}-name`
      }, [(uploadCtx == null ? void 0 : uploadCtx.listType) === "text" && createVNode("span", {
        "class": `${itemCls}-file-icon`
      }, [(_i = (_h = (_e = uploadCtx == null ? void 0 : (_d = uploadCtx.slots)["file-icon"]) == null ? void 0 : _e.call(_d, {
        fileItem: props.file
      })) != null ? _h : (_g = (_f = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _f.fileIcon) == null ? void 0 : _g.call(_f, props.file)) != null ? _i : renderFileIcon()]), (uploadCtx == null ? void 0 : uploadCtx.showLink) && props.file.url ? createVNode("a", mergeProps({
        "class": `${itemCls}-name-link`,
        "target": "_blank",
        "href": props.file.url
      }, (uploadCtx == null ? void 0 : uploadCtx.download) ? {
        download: props.file.name
      } : void 0), [(_o = (_n = (_k = uploadCtx == null ? void 0 : (_j = uploadCtx.slots)["file-name"]) == null ? void 0 : _k.call(_j, {
        fileItem: props.file
      })) != null ? _n : (_m = (_l = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _l.fileName) == null ? void 0 : _m.call(_l, props.file)) != null ? _o : props.file.name]) : createVNode("span", {
        "class": `${itemCls}-name-text`,
        "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onPreview(props.file)
      }, [(_u = (_t = (_q = uploadCtx == null ? void 0 : (_p = uploadCtx.slots)["file-name"]) == null ? void 0 : _q.call(_p, {
        fileItem: props.file
      })) != null ? _t : (_s = (_r = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _r.fileName) == null ? void 0 : _s.call(_r, props.file)) != null ? _u : props.file.name]), props.file.status === "error" && createVNode(Tooltip, {
        "content": t("upload.error")
      }, {
        default: () => {
          var _a2, _b2, _c2, _d2, _e2, _f2;
          return [createVNode("span", {
            "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-error`]
          }, [(_f2 = (_e2 = (_b2 = uploadCtx == null ? void 0 : (_a2 = uploadCtx.slots)["error-icon"]) == null ? void 0 : _b2.call(_a2)) != null ? _e2 : (_d2 = (_c2 = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c2.errorIcon) == null ? void 0 : _d2.call(_c2)) != null ? _f2 : createVNode(IconExclamationCircleFill, null, null)])];
        }
      })]), createVNode(UploadProgress, {
        "file": props.file,
        "listType": props.listType
      }, null)]), (uploadCtx == null ? void 0 : uploadCtx.showRemoveButton) && createVNode("span", {
        "class": `${itemCls}-operation`
      }, [createVNode(IconHover, {
        "onClick": () => {
          var _a2;
          return (_a2 = uploadCtx == null ? void 0 : uploadCtx.onRemove) == null ? void 0 : _a2.call(uploadCtx, props.file);
        }
      }, {
        default: () => {
          var _a2, _b2, _c2, _d2, _e2, _f2;
          return [createVNode("span", {
            "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-remove`]
          }, [(_f2 = (_e2 = (_b2 = uploadCtx == null ? void 0 : (_a2 = uploadCtx.slots)["remove-icon"]) == null ? void 0 : _b2.call(_a2)) != null ? _e2 : (_d2 = (_c2 = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c2.removeIcon) == null ? void 0 : _d2.call(_c2)) != null ? _f2 : createVNode(IconDelete, null, null)])];
        }
      })]), (_w = uploadCtx == null ? void 0 : (_v = uploadCtx.slots)["extra-button"]) == null ? void 0 : _w.call(_v, {
        fileItem: props.file
      })]);
    };
  }
});
export { UploadListItem as default };
