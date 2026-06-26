import { defineComponent, toRefs, inject, ref, computed, reactive, watchEffect, resolveComponent, openBlock, createElementBlock, normalizeClass, normalizeStyle, createElementVNode, mergeProps, renderSlot, createVNode, toDisplayString, createCommentVNode, createBlock, createSlots, withCtx } from "vue";
import IconImageClose from "../icon/icon-image-close/index.js";
import IconLoading from "../icon/icon-loading/index.js";
import ImageFooter from "./image-footer.js";
import ImagePreview from "./preview.js";
import { getPrefixCls } from "../_utils/global-config.js";
import useImageLoadStatus from "./hooks/use-image-load-status.js";
import { isServerRendering } from "../_utils/dom.js";
import { normalizeImageSizeProp } from "./utils/index.js";
import { omit } from "../_utils/omit.js";
import useMergeState from "../_hooks/use-merge-state.js";
import { PreviewGroupInjectionKey } from "./context.js";
import { useI18n } from "../locale/index.js";
import { isBoolean } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
let uuid = 0;
const _sfc_main = defineComponent({
  name: "Image",
  components: {
    IconImageClose,
    IconLoading,
    ImageFooter,
    ImagePreview
  },
  inheritAttrs: false,
  props: {
    renderToBody: {
      type: Boolean,
      default: true
    },
    src: {
      type: String
    },
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    fit: {
      type: String
    },
    alt: {
      type: String
    },
    hideFooter: {
      type: [Boolean, String],
      default: false
    },
    footerPosition: {
      type: String,
      default: "inner"
    },
    showLoader: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: true
    },
    previewVisible: {
      type: Boolean,
      default: void 0
    },
    defaultPreviewVisible: {
      type: Boolean,
      default: false
    },
    previewProps: {
      type: Object
    },
    footerClass: {
      type: [String, Array, Object]
    }
  },
  emits: [
    "preview-visible-change",
    "update:previewVisible"
  ],
  setup(props, { attrs, slots, emit }) {
    const { t } = useI18n();
    const {
      height,
      width,
      hideFooter,
      title,
      description,
      src,
      footerPosition,
      defaultPreviewVisible,
      previewVisible,
      preview,
      previewProps
    } = toRefs(props);
    const groupContext = inject(PreviewGroupInjectionKey, void 0);
    const prefixCls = getPrefixCls("image");
    const refImg = ref();
    const { isLoaded, isError, isLoading, setLoadStatus } = useImageLoadStatus();
    const sizeStyle = computed(() => ({
      width: normalizeImageSizeProp(width == null ? void 0 : width.value),
      height: normalizeImageSizeProp(height == null ? void 0 : height.value)
    }));
    const fitStyle = computed(() => {
      if (props.fit) {
        return { objectFit: props.fit };
      }
      return {};
    });
    const wrapperClassNames = computed(() => [
      `${prefixCls}`,
      {
        [`${prefixCls}-loading`]: isLoading.value,
        [`${prefixCls}-loading-error`]: isError.value,
        [`${prefixCls}-with-footer-inner`]: isLoaded && showFooter && footerPosition.value === "inner",
        [`${prefixCls}-with-footer-outer`]: isLoaded && showFooter && footerPosition.value === "outer"
      },
      attrs.class
    ]);
    const wrapperStyles = computed(() => [
      sizeStyle.value,
      attrs.style
    ]);
    const showFooter = computed(() => {
      if (!((title == null ? void 0 : title.value) || (description == null ? void 0 : description.value) || slots.extra)) {
        return false;
      }
      if (isBoolean(hideFooter.value))
        return !hideFooter.value && isLoaded.value;
      return hideFooter.value === "never";
    });
    const imgProps = computed(() => omit(attrs, ["class", "style"]));
    const [mergedPreviewVisible, setPreviewVisible] = useMergeState(
      defaultPreviewVisible.value,
      reactive({
        value: previewVisible
      })
    );
    const mergePreview = computed(
      () => !(groupContext == null ? void 0 : groupContext.preview) && preview.value
    );
    watchEffect(() => {
      if (isServerRendering || !refImg.value)
        return;
      refImg.value.src = src == null ? void 0 : src.value;
      setLoadStatus("loading");
    });
    const imageId = uuid++;
    watchEffect((onInvalidate) => {
      var _a, _b, _c;
      const unRegister = (_c = groupContext == null ? void 0 : groupContext.registerImageUrl) == null ? void 0 : _c.call(
        groupContext,
        imageId,
        ((_b = (_a = previewProps == null ? void 0 : previewProps.value) == null ? void 0 : _a.src) != null ? _b : src == null ? void 0 : src.value) || "",
        preview.value
      );
      onInvalidate(() => {
        unRegister == null ? void 0 : unRegister();
      });
    });
    function onImgLoaded() {
      setLoadStatus("loaded");
    }
    function onImgLoadError() {
      setLoadStatus("error");
    }
    function onImgClick() {
      if (!preview.value)
        return;
      if (groupContext == null ? void 0 : groupContext.preview) {
        groupContext.preview(imageId);
      } else {
        emit("preview-visible-change", true);
        setPreviewVisible(true);
      }
    }
    function onPreviewClose() {
      emit("preview-visible-change", false);
      setPreviewVisible(false);
    }
    return {
      t,
      refImg,
      prefixCls,
      wrapperClassNames,
      wrapperStyles,
      showFooter,
      imgProps,
      imgStyle: sizeStyle,
      isLoaded,
      isError,
      isLoading,
      mergedPreviewVisible,
      mergePreview,
      onImgLoaded,
      onImgLoadError,
      onImgClick,
      onPreviewClose,
      fitStyle
    };
  }
});
const _hoisted_1 = ["title", "alt"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_IconImageClose = resolveComponent("IconImageClose");
  const _component_IconLoading = resolveComponent("IconLoading");
  const _component_ImageFooter = resolveComponent("ImageFooter");
  const _component_ImagePreview = resolveComponent("ImagePreview");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.wrapperClassNames),
    style: normalizeStyle(_ctx.wrapperStyles)
  }, [
    createElementVNode("img", mergeProps({
      ref: "refImg",
      class: `${_ctx.prefixCls}-img`
    }, _ctx.imgProps, {
      style: { ..._ctx.imgStyle, ..._ctx.fitStyle },
      title: _ctx.title,
      alt: _ctx.alt,
      onLoad: _cache[0] || (_cache[0] = (...args) => _ctx.onImgLoaded && _ctx.onImgLoaded(...args)),
      onError: _cache[1] || (_cache[1] = (...args) => _ctx.onImgLoadError && _ctx.onImgLoadError(...args)),
      onClick: _cache[2] || (_cache[2] = (...args) => _ctx.onImgClick && _ctx.onImgClick(...args))
    }), null, 16, _hoisted_1),
    !_ctx.isLoaded ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-overlay`)
    }, [
      _ctx.isError ? renderSlot(_ctx.$slots, "error", { key: 0 }, () => [
        createElementVNode("div", {
          class: normalizeClass(`${_ctx.prefixCls}-error`)
        }, [
          createElementVNode("div", {
            class: normalizeClass(`${_ctx.prefixCls}-error-icon`)
          }, [
            renderSlot(_ctx.$slots, "error-icon", {}, () => [
              createVNode(_component_IconImageClose)
            ])
          ], 2),
          _ctx.alt || _ctx.description ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: normalizeClass(`${_ctx.prefixCls}-error-alt`)
          }, toDisplayString(_ctx.alt || _ctx.description), 3)) : createCommentVNode("v-if", true)
        ], 2)
      ]) : createCommentVNode("v-if", true),
      _ctx.isLoading && (_ctx.showLoader || _ctx.$slots.loader) ? renderSlot(_ctx.$slots, "loader", { key: 1 }, () => [
        createElementVNode("div", {
          class: normalizeClass([`${_ctx.prefixCls}-loader`])
        }, [
          createElementVNode("div", {
            class: normalizeClass(`${_ctx.prefixCls}-loader-spin`)
          }, [
            createVNode(_component_IconLoading),
            createElementVNode("div", {
              class: normalizeClass(`${_ctx.prefixCls}-loader-spin-text`)
            }, toDisplayString(_ctx.t("image.loading")), 3)
          ], 2)
        ], 2)
      ]) : createCommentVNode("v-if", true)
    ], 2)) : createCommentVNode("v-if", true),
    _ctx.showFooter ? (openBlock(), createBlock(_component_ImageFooter, {
      key: 1,
      class: normalizeClass(_ctx.footerClass),
      "prefix-cls": _ctx.prefixCls,
      title: _ctx.title,
      description: _ctx.description
    }, createSlots({ _: 2 }, [
      _ctx.$slots.extra ? {
        name: "extra",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "extra")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["class", "prefix-cls", "title", "description"])) : createCommentVNode("v-if", true),
    _ctx.isLoaded && _ctx.mergePreview ? (openBlock(), createBlock(_component_ImagePreview, mergeProps({
      key: 2,
      src: _ctx.src
    }, _ctx.previewProps, {
      visible: _ctx.mergedPreviewVisible,
      "render-to-body": _ctx.renderToBody,
      onClose: _ctx.onPreviewClose
    }), {
      actions: withCtx(() => [
        renderSlot(_ctx.$slots, "preview-actions")
      ]),
      _: 3
    }, 16, ["src", "visible", "render-to-body", "onClose"])) : createCommentVNode("v-if", true)
  ], 6);
}
var _Image = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Image as default };
