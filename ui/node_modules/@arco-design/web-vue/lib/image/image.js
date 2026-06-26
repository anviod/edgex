"use strict";
var vue = require("vue");
var index = require("../icon/icon-image-close/index.js");
var index$1 = require("../icon/icon-loading/index.js");
var imageFooter = require("./image-footer.js");
var preview = require("./preview.js");
var globalConfig = require("../_utils/global-config.js");
var useImageLoadStatus = require("./hooks/use-image-load-status.js");
var dom = require("../_utils/dom.js");
var index$3 = require("./utils/index.js");
var omit = require("../_utils/omit.js");
var useMergeState = require("../_hooks/use-merge-state.js");
var context = require("./context.js");
var index$2 = require("../locale/index.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
let uuid = 0;
const _sfc_main = vue.defineComponent({
  name: "Image",
  components: {
    IconImageClose: index,
    IconLoading: index$1,
    ImageFooter: imageFooter,
    ImagePreview: preview
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
    const { t } = index$2.useI18n();
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
      preview: preview2,
      previewProps
    } = vue.toRefs(props);
    const groupContext = vue.inject(context.PreviewGroupInjectionKey, void 0);
    const prefixCls = globalConfig.getPrefixCls("image");
    const refImg = vue.ref();
    const { isLoaded, isError, isLoading, setLoadStatus } = useImageLoadStatus();
    const sizeStyle = vue.computed(() => ({
      width: index$3.normalizeImageSizeProp(width == null ? void 0 : width.value),
      height: index$3.normalizeImageSizeProp(height == null ? void 0 : height.value)
    }));
    const fitStyle = vue.computed(() => {
      if (props.fit) {
        return { objectFit: props.fit };
      }
      return {};
    });
    const wrapperClassNames = vue.computed(() => [
      `${prefixCls}`,
      {
        [`${prefixCls}-loading`]: isLoading.value,
        [`${prefixCls}-loading-error`]: isError.value,
        [`${prefixCls}-with-footer-inner`]: isLoaded && showFooter && footerPosition.value === "inner",
        [`${prefixCls}-with-footer-outer`]: isLoaded && showFooter && footerPosition.value === "outer"
      },
      attrs.class
    ]);
    const wrapperStyles = vue.computed(() => [
      sizeStyle.value,
      attrs.style
    ]);
    const showFooter = vue.computed(() => {
      if (!((title == null ? void 0 : title.value) || (description == null ? void 0 : description.value) || slots.extra)) {
        return false;
      }
      if (is.isBoolean(hideFooter.value))
        return !hideFooter.value && isLoaded.value;
      return hideFooter.value === "never";
    });
    const imgProps = vue.computed(() => omit.omit(attrs, ["class", "style"]));
    const [mergedPreviewVisible, setPreviewVisible] = useMergeState(
      defaultPreviewVisible.value,
      vue.reactive({
        value: previewVisible
      })
    );
    const mergePreview = vue.computed(
      () => !(groupContext == null ? void 0 : groupContext.preview) && preview2.value
    );
    vue.watchEffect(() => {
      if (dom.isServerRendering || !refImg.value)
        return;
      refImg.value.src = src == null ? void 0 : src.value;
      setLoadStatus("loading");
    });
    const imageId = uuid++;
    vue.watchEffect((onInvalidate) => {
      var _a, _b, _c;
      const unRegister = (_c = groupContext == null ? void 0 : groupContext.registerImageUrl) == null ? void 0 : _c.call(
        groupContext,
        imageId,
        ((_b = (_a = previewProps == null ? void 0 : previewProps.value) == null ? void 0 : _a.src) != null ? _b : src == null ? void 0 : src.value) || "",
        preview2.value
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
      if (!preview2.value)
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
  const _component_IconImageClose = vue.resolveComponent("IconImageClose");
  const _component_IconLoading = vue.resolveComponent("IconLoading");
  const _component_ImageFooter = vue.resolveComponent("ImageFooter");
  const _component_ImagePreview = vue.resolveComponent("ImagePreview");
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.wrapperClassNames),
    style: vue.normalizeStyle(_ctx.wrapperStyles)
  }, [
    vue.createElementVNode("img", vue.mergeProps({
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
    !_ctx.isLoaded ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-overlay`)
    }, [
      _ctx.isError ? vue.renderSlot(_ctx.$slots, "error", { key: 0 }, () => [
        vue.createElementVNode("div", {
          class: vue.normalizeClass(`${_ctx.prefixCls}-error`)
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-error-icon`)
          }, [
            vue.renderSlot(_ctx.$slots, "error-icon", {}, () => [
              vue.createVNode(_component_IconImageClose)
            ])
          ], 2),
          _ctx.alt || _ctx.description ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(`${_ctx.prefixCls}-error-alt`)
          }, vue.toDisplayString(_ctx.alt || _ctx.description), 3)) : vue.createCommentVNode("v-if", true)
        ], 2)
      ]) : vue.createCommentVNode("v-if", true),
      _ctx.isLoading && (_ctx.showLoader || _ctx.$slots.loader) ? vue.renderSlot(_ctx.$slots, "loader", { key: 1 }, () => [
        vue.createElementVNode("div", {
          class: vue.normalizeClass([`${_ctx.prefixCls}-loader`])
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`${_ctx.prefixCls}-loader-spin`)
          }, [
            vue.createVNode(_component_IconLoading),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(`${_ctx.prefixCls}-loader-spin-text`)
            }, vue.toDisplayString(_ctx.t("image.loading")), 3)
          ], 2)
        ], 2)
      ]) : vue.createCommentVNode("v-if", true)
    ], 2)) : vue.createCommentVNode("v-if", true),
    _ctx.showFooter ? (vue.openBlock(), vue.createBlock(_component_ImageFooter, {
      key: 1,
      class: vue.normalizeClass(_ctx.footerClass),
      "prefix-cls": _ctx.prefixCls,
      title: _ctx.title,
      description: _ctx.description
    }, vue.createSlots({ _: 2 }, [
      _ctx.$slots.extra ? {
        name: "extra",
        fn: vue.withCtx(() => [
          vue.renderSlot(_ctx.$slots, "extra")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["class", "prefix-cls", "title", "description"])) : vue.createCommentVNode("v-if", true),
    _ctx.isLoaded && _ctx.mergePreview ? (vue.openBlock(), vue.createBlock(_component_ImagePreview, vue.mergeProps({
      key: 2,
      src: _ctx.src
    }, _ctx.previewProps, {
      visible: _ctx.mergedPreviewVisible,
      "render-to-body": _ctx.renderToBody,
      onClose: _ctx.onPreviewClose
    }), {
      actions: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "preview-actions")
      ]),
      _: 3
    }, 16, ["src", "visible", "render-to-body", "onClose"])) : vue.createCommentVNode("v-if", true)
  ], 6);
}
var _Image = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Image;
