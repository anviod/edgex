"use strict";
var vue = require("vue");
var index$6 = require("../progress/index.js");
var index$3 = require("../tooltip/index.js");
var index$5 = require("../icon/icon-pause/index.js");
var index$4 = require("../icon/icon-play-arrow-fill/index.js");
var index$1 = require("../icon/icon-upload/index.js");
var index$2 = require("../icon/icon-check/index.js");
var utils = require("./utils.js");
var globalConfig = require("../_utils/global-config.js");
var index = require("../locale/index.js");
var context = require("./context.js");
var UploadProgress = vue.defineComponent({
  name: "UploadProgress",
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
    const prefixCls = globalConfig.getPrefixCls("upload-progress");
    const {
      t
    } = index.useI18n();
    const uploadCtx = vue.inject(context.uploadInjectionKey, void 0);
    const renderIcon = () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      if (props.file.status === "error") {
        return vue.createVNode("span", {
          "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-upload`],
          "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onUpload(props.file)
        }, [(uploadCtx == null ? void 0 : uploadCtx.showRetryButton) && ((_e = (_b = uploadCtx == null ? void 0 : (_a = uploadCtx.slots)["retry-icon"]) == null ? void 0 : _b.call(_a)) != null ? _e : (_d = (_c = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c.retryIcon) == null ? void 0 : _d.call(_c)) || props.listType === "picture-card" ? vue.createVNode(index$1, null, null) : t("upload.retry")]);
      }
      if (props.file.status === "done") {
        return vue.createVNode("span", {
          "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-success`]
        }, [(_k = (_j = (_g = uploadCtx == null ? void 0 : (_f = uploadCtx.slots)["success-icon"]) == null ? void 0 : _g.call(_f)) != null ? _j : (_i = (_h = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _h.successIcon) == null ? void 0 : _i.call(_h)) != null ? _k : vue.createVNode(index$2, null, null)]);
      }
      if (props.file.status === "init") {
        return vue.createVNode(index$3, {
          "content": t("upload.start")
        }, {
          default: () => {
            var _a2, _b2, _c2, _d2, _e2, _f2;
            return [vue.createVNode("span", {
              "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-start`],
              "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onUpload(props.file)
            }, [(_f2 = (_e2 = (_b2 = uploadCtx == null ? void 0 : (_a2 = uploadCtx.slots)["start-icon"]) == null ? void 0 : _b2.call(_a2)) != null ? _e2 : (_d2 = (_c2 = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c2.startIcon) == null ? void 0 : _d2.call(_c2)) != null ? _f2 : vue.createVNode(index$4, null, null)])];
          }
        });
      }
      return (uploadCtx == null ? void 0 : uploadCtx.showCancelButton) && vue.createVNode(index$3, {
        "content": t("upload.cancel")
      }, {
        default: () => {
          var _a2, _b2, _c2, _d2, _e2, _f2;
          return [vue.createVNode("span", {
            "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-cancel`],
            "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onAbort(props.file)
          }, [(_f2 = (_e2 = (_b2 = uploadCtx == null ? void 0 : (_a2 = uploadCtx.slots)["cancel-icon"]) == null ? void 0 : _b2.call(_a2)) != null ? _e2 : (_d2 = (_c2 = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c2.cancelIcon) == null ? void 0 : _d2.call(_c2)) != null ? _f2 : vue.createVNode(index$5, null, null)])];
        }
      });
    };
    const renderProgress = () => {
      var _a;
      if (["init", "uploading"].includes((_a = props.file.status) != null ? _a : "")) {
        const status = utils.getProgressStatus(props.file.status);
        return vue.createVNode(index$6, {
          "type": "circle",
          "size": "mini",
          "showText": false,
          "status": status,
          "percent": props.file.percent
        }, null);
      }
      return null;
    };
    return () => vue.createVNode("span", {
      "class": prefixCls
    }, [renderProgress(), renderIcon()]);
  }
});
module.exports = UploadProgress;
