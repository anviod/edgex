import { defineComponent, inject, createVNode } from "vue";
import Progress from "../progress/index.js";
import Tooltip from "../tooltip/index.js";
import IconPause from "../icon/icon-pause/index.js";
import IconPlayArrowFill from "../icon/icon-play-arrow-fill/index.js";
import IconUpload from "../icon/icon-upload/index.js";
import IconCheck from "../icon/icon-check/index.js";
import { getProgressStatus } from "./utils.js";
import { getPrefixCls } from "../_utils/global-config.js";
import { useI18n } from "../locale/index.js";
import { uploadInjectionKey } from "./context.js";
var UploadProgress = defineComponent({
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
    const prefixCls = getPrefixCls("upload-progress");
    const {
      t
    } = useI18n();
    const uploadCtx = inject(uploadInjectionKey, void 0);
    const renderIcon = () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      if (props.file.status === "error") {
        return createVNode("span", {
          "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-upload`],
          "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onUpload(props.file)
        }, [(uploadCtx == null ? void 0 : uploadCtx.showRetryButton) && ((_e = (_b = uploadCtx == null ? void 0 : (_a = uploadCtx.slots)["retry-icon"]) == null ? void 0 : _b.call(_a)) != null ? _e : (_d = (_c = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c.retryIcon) == null ? void 0 : _d.call(_c)) || props.listType === "picture-card" ? createVNode(IconUpload, null, null) : t("upload.retry")]);
      }
      if (props.file.status === "done") {
        return createVNode("span", {
          "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-success`]
        }, [(_k = (_j = (_g = uploadCtx == null ? void 0 : (_f = uploadCtx.slots)["success-icon"]) == null ? void 0 : _g.call(_f)) != null ? _j : (_i = (_h = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _h.successIcon) == null ? void 0 : _i.call(_h)) != null ? _k : createVNode(IconCheck, null, null)]);
      }
      if (props.file.status === "init") {
        return createVNode(Tooltip, {
          "content": t("upload.start")
        }, {
          default: () => {
            var _a2, _b2, _c2, _d2, _e2, _f2;
            return [createVNode("span", {
              "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-start`],
              "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onUpload(props.file)
            }, [(_f2 = (_e2 = (_b2 = uploadCtx == null ? void 0 : (_a2 = uploadCtx.slots)["start-icon"]) == null ? void 0 : _b2.call(_a2)) != null ? _e2 : (_d2 = (_c2 = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c2.startIcon) == null ? void 0 : _d2.call(_c2)) != null ? _f2 : createVNode(IconPlayArrowFill, null, null)])];
          }
        });
      }
      return (uploadCtx == null ? void 0 : uploadCtx.showCancelButton) && createVNode(Tooltip, {
        "content": t("upload.cancel")
      }, {
        default: () => {
          var _a2, _b2, _c2, _d2, _e2, _f2;
          return [createVNode("span", {
            "class": [uploadCtx == null ? void 0 : uploadCtx.iconCls, `${uploadCtx == null ? void 0 : uploadCtx.iconCls}-cancel`],
            "onClick": () => uploadCtx == null ? void 0 : uploadCtx.onAbort(props.file)
          }, [(_f2 = (_e2 = (_b2 = uploadCtx == null ? void 0 : (_a2 = uploadCtx.slots)["cancel-icon"]) == null ? void 0 : _b2.call(_a2)) != null ? _e2 : (_d2 = (_c2 = uploadCtx == null ? void 0 : uploadCtx.customIcon) == null ? void 0 : _c2.cancelIcon) == null ? void 0 : _d2.call(_c2)) != null ? _f2 : createVNode(IconPause, null, null)])];
        }
      });
    };
    const renderProgress = () => {
      var _a;
      if (["init", "uploading"].includes((_a = props.file.status) != null ? _a : "")) {
        const status = getProgressStatus(props.file.status);
        return createVNode(Progress, {
          "type": "circle",
          "size": "mini",
          "showText": false,
          "status": status,
          "percent": props.file.percent
        }, null);
      }
      return null;
    };
    return () => createVNode("span", {
      "class": prefixCls
    }, [renderProgress(), renderIcon()]);
  }
});
export { UploadProgress as default };
