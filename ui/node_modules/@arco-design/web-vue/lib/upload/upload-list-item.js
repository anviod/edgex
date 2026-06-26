"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var iconHover = require("../_components/icon-hover.js");
var uploadProgress = require("./upload-progress.js");
var index$1 = require("../tooltip/index.js");
var index$3 = require("../icon/icon-delete/index.js");
var index$8 = require("../icon/icon-file/index.js");
var index$5 = require("../icon/icon-file-pdf/index.js");
var index$4 = require("../icon/icon-file-image/index.js");
var index$7 = require("../icon/icon-file-video/index.js");
var index$6 = require("../icon/icon-file-audio/index.js");
var index$2 = require("../icon/icon-exclamation-circle-fill/index.js");
var index = require("../locale/index.js");
var context = require("./context.js");
var UploadListItem = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("upload-list");
    const itemCls = `${prefixCls}-item`;
    const {
      t
    } = index.useI18n();
    const uploadCtx = vue.inject(context.uploadInjectionKey, void 0);
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
        return vue.createVNode(index$4, null, null);
      }
      if (type.includes("pdf")) {
        return vue.createVNode(index$5, null, null);
      }
      if (type.includes("audio")) {
        return vue.createVNode(index$6, null, null);
      }
      if (type.includes("video")) {
        return vue.createVNode(index$7, null, null);
      }
      return vue.createVNode(index$8, null, null);
    };
    return () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
      return vue.createVNode("div", {
        "class": [itemCls, `${itemCls}-${props.file.status}`]
      }, [vue.createVNode("div", {
        "class": `${itemCls}-content`
      }, [(uploadCtx == null ? void 0 : uploadCtx.listType) === "picture" && vue.createVNode("span", {
        "class": `${itemCls}-thumbnail`
      }, [(_c = (_b = uploadCtx == null ? void 0 : (_a = uploadCtx.slots).image) == null ? void 0 : _b.call(_a, {
        fileItem: props.file
      })) != null ? _c : vue.createVNode("img", vue.mergeProps({
        "src": props.file.url,
        "alt": props.file.name
      }, (uploadCtx == null ? void 0 : uploadCtx.imageLoading) ? {
        loading: uploadCtx.imageLoading
      } : void 0), null)]), vue.createVNode("div", {
        "class": `${itemCls}-name`
      }, [(uploadCtx == null ? void 0 : uploadCtx.listType) === "text" && vue.createVNode("span", {
        "class": `${itemCls}-file-icon`
      }, [(_i = (_h = (_e = uploadCtx == null ? void 0 : (_d = uploadCtx.slots)["file-icon"]) == null ? void 0 : _e.call(_d, {
        fileItem: props.file
      })) != null ? _h : (_g = (_f = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _f.fileIcon) == null ? void 0 : _g.call(_f, props.file)) != null ? _i : renderFileIcon()]), (uploadCtx == null ? void 0 : uploadCtx.showLink) && props.file.url ? vue.createVNode("a", vue.mergeProps({
        "class": `${itemCls}-name-link`,
        "target": "_blank",
        "href": props.file.url
      }, (uploadCtx == null ? void 0 : uploadCtx.download) ? {
        download: props.file.name
      } : void 0), [(_o = (_n = (_k = uploadCtx == null ? void 0 : (_j = uploadCtx.slots)["file-name"]) == null ? void 0 : _k.call(_j, {
        fileItem: props.file
      })) != null ? _n : (_m = (_l = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _l.fileName) == null ? void 0 : _m.call(_l, props.file)) != null ? _o : props.file.name]) : vue.createVNode("span", {
        "class": `${itemCls}-name-text`,
        "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onPreview(props.file)
      }, [(_u = (_t = (_q = uploadCtx == null ? void 0 : (_p = uploadCtx.slots)["file-name"]) == null ? void 0 : _q.call(_p, {
        fileItem: props.file
      })) != null ? _t : (_s = (_r = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _r.fileName) == null ? void 0 : _s.call(_r, props.file)) != null ? _u : props.file.name]), props.file.status === "error" && vue.createVNode(index$1, {
        "content": t("upload.error")
      }, {
        default: () => {
          var _a2, _b2, _c2, _d2, _e2, _f2;
          return [vue.createVNode("span", {
            "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-error`]
          }, [(_f2 = (_e2 = (_b2 = uploadCtx == null ? void 0 : (_a2 = uploadCtx.slots)["error-icon"]) == null ? void 0 : _b2.call(_a2)) != null ? _e2 : (_d2 = (_c2 = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c2.errorIcon) == null ? void 0 : _d2.call(_c2)) != null ? _f2 : vue.createVNode(index$2, null, null)])];
        }
      })]), vue.createVNode(uploadProgress, {
        "file": props.file,
        "listType": props.listType
      }, null)]), (uploadCtx == null ? void 0 : uploadCtx.showRemoveButton) && vue.createVNode("span", {
        "class": `${itemCls}-operation`
      }, [vue.createVNode(iconHover, {
        "onClick": () => {
          var _a2;
          return (_a2 = uploadCtx == null ? void 0 : uploadCtx.onRemove) == null ? void 0 : _a2.call(uploadCtx, props.file);
        }
      }, {
        default: () => {
          var _a2, _b2, _c2, _d2, _e2, _f2;
          return [vue.createVNode("span", {
            "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-remove`]
          }, [(_f2 = (_e2 = (_b2 = uploadCtx == null ? void 0 : (_a2 = uploadCtx.slots)["remove-icon"]) == null ? void 0 : _b2.call(_a2)) != null ? _e2 : (_d2 = (_c2 = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c2.removeIcon) == null ? void 0 : _d2.call(_c2)) != null ? _f2 : vue.createVNode(index$3, null, null)])];
        }
      })]), (_w = uploadCtx == null ? void 0 : (_v = uploadCtx.slots)["extra-button"]) == null ? void 0 : _w.call(_v, {
        fileItem: props.file
      })]);
    };
  }
});
module.exports = UploadListItem;
