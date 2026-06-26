import { defineComponent, computed, inject, createVNode, Fragment, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import UploadProgress from "./upload-progress.js";
import { uploadInjectionKey } from "./context.js";
import IconImageClose from "../icon/icon-image-close/index.js";
import IconEye from "../icon/icon-eye/index.js";
import IconUpload from "../icon/icon-upload/index.js";
import IconDelete from "../icon/icon-delete/index.js";
var UploadPictureItem = defineComponent({
  name: "UploadPictureItem",
  props: {
    file: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const prefixCls = getPrefixCls("upload-list");
    const itemCls = `${prefixCls}-picture`;
    const cls = computed(() => [itemCls, {
      [`${itemCls}-status-error`]: props.file.status === "error"
    }]);
    const uploadCtx = inject(uploadInjectionKey, void 0);
    const renderCard = () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C;
      if (props.file.status === "uploading") {
        return createVNode(UploadProgress, {
          "file": props.file,
          "listType": "picture-card"
        }, null);
      }
      return createVNode(Fragment, null, [(_c = (_b = uploadCtx == null ? void 0 : (_a = uploadCtx.slots).image) == null ? void 0 : _b.call(_a, {
        fileItem: props.file
      })) != null ? _c : createVNode("img", mergeProps({
        "src": props.file.url,
        "alt": props.file.name
      }, (uploadCtx == null ? void 0 : uploadCtx.imageLoading) ? {
        loading: uploadCtx.imageLoading
      } : void 0), null), createVNode("div", {
        "class": `${itemCls}-mask`
      }, [props.file.status === "error" && (uploadCtx == null ? void 0 : uploadCtx.showCancelButton) && createVNode("div", {
        "class": `${itemCls}-error-tip`
      }, [createVNode("span", {
        "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-error`]
      }, [(_i = (_h = (_e = uploadCtx == null ? void 0 : (_d = uploadCtx.slots)["error-icon"]) == null ? void 0 : _e.call(_d)) != null ? _h : (_g = (_f = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _f.errorIcon) == null ? void 0 : _g.call(_f)) != null ? _i : createVNode(IconImageClose, null, null)])]), createVNode("div", {
        "class": `${itemCls}-operation`
      }, [props.file.status !== "error" && (uploadCtx == null ? void 0 : uploadCtx.showPreviewButton) && createVNode("span", {
        "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-preview`],
        "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onPreview(props.file)
      }, [(_o = (_n = (_k = uploadCtx == null ? void 0 : (_j = uploadCtx.slots)["preview-icon"]) == null ? void 0 : _k.call(_j)) != null ? _n : (_m = (_l = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _l.previewIcon) == null ? void 0 : _m.call(_l)) != null ? _o : createVNode(IconEye, null, null)]), ["init", "error"].includes(props.file.status) && (uploadCtx == null ? void 0 : uploadCtx.showRetryButton) && createVNode("span", {
        "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-upload`],
        "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onUpload(props.file)
      }, [(_u = (_t = (_q = uploadCtx == null ? void 0 : (_p = uploadCtx.slots)["retry-icon"]) == null ? void 0 : _q.call(_p)) != null ? _t : (_s = (_r = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _r.retryIcon) == null ? void 0 : _s.call(_r)) != null ? _u : createVNode(IconUpload, null, null)]), !(uploadCtx == null ? void 0 : uploadCtx.disabled) && (uploadCtx == null ? void 0 : uploadCtx.showRemoveButton) && createVNode("span", {
        "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-remove`],
        "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onRemove(props.file)
      }, [(_A = (_z = (_w = uploadCtx == null ? void 0 : (_v = uploadCtx.slots)["remove-icon"]) == null ? void 0 : _w.call(_v)) != null ? _z : (_y = (_x = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _x.removeIcon) == null ? void 0 : _y.call(_x)) != null ? _A : createVNode(IconDelete, null, null)]), (_C = uploadCtx == null ? void 0 : (_B = uploadCtx.slots)["extra-button"]) == null ? void 0 : _C.call(_B, props.file)])])]);
    };
    return () => createVNode("span", {
      "class": cls.value
    }, [renderCard()]);
  }
});
export { UploadPictureItem as default };
