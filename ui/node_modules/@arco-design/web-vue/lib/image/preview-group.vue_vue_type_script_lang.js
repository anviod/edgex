"use strict";
var vue = require("vue");
var useMergeState = require("../_hooks/use-merge-state.js");
var preview = require("./preview.js");
var context = require("./context.js");
var is = require("../_utils/is.js");
var _sfc_main = vue.defineComponent({
  name: "ImagePreviewGroup",
  components: {
    ImagePreview: preview
  },
  inheritAttrs: false,
  props: {
    renderToBody: {
      type: Boolean,
      default: true
    },
    srcList: {
      type: Array
    },
    current: {
      type: Number
    },
    defaultCurrent: {
      type: Number,
      default: 0
    },
    infinite: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: void 0
    },
    defaultVisible: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    actionsLayout: {
      type: Array,
      default: () => ["fullScreen", "rotateRight", "rotateLeft", "zoomIn", "zoomOut", "originalSize"]
    },
    popupContainer: {
      type: [String, Object]
    }
  },
  emits: [
    "change",
    "update:current",
    "visible-change",
    "update:visible"
  ],
  setup(props, {
    emit
  }) {
    const {
      srcList,
      visible,
      defaultVisible,
      current,
      defaultCurrent,
      infinite
    } = vue.toRefs(props);
    const [mergedVisible, setLocalVisible] = useMergeState(defaultVisible.value, vue.reactive({
      value: visible
    }));
    const setVisible = (newVisible) => {
      if (newVisible !== mergedVisible.value) {
        emit("visible-change", newVisible);
        emit("update:visible", newVisible);
        setLocalVisible(newVisible);
      }
    };
    const propImageUrlMap = vue.computed(() => new Map(is.isArray(srcList == null ? void 0 : srcList.value) ? srcList == null ? void 0 : srcList.value.map((url, index) => [index, {
      url,
      canPreview: true
    }]) : []));
    const imageUrlMap = vue.ref(new Map(propImageUrlMap.value || []));
    const imageIdList = vue.computed(() => Array.from(imageUrlMap.value.keys()));
    const imageCount = vue.computed(() => imageIdList.value.length);
    function registerImageUrl(id, url, canPreview) {
      if (!propImageUrlMap.value.has(id))
        imageUrlMap.value.set(id, {
          url,
          canPreview
        });
      return function unRegisterPreviewUrl() {
        if (!propImageUrlMap.value.has(id)) {
          imageUrlMap.value.delete(id);
        }
      };
    }
    vue.watch(propImageUrlMap, () => {
      imageUrlMap.value = new Map(propImageUrlMap.value || []);
    });
    const [currentIndex, setLocalCurrentIndex] = useMergeState(defaultCurrent.value, vue.reactive({
      value: current
    }));
    const setCurrentIndex = (index) => {
      if (index !== currentIndex.value) {
        emit("change", index);
        emit("update:current", index);
        setLocalCurrentIndex(index);
      }
    };
    const currentId = vue.computed(() => imageIdList.value[currentIndex.value]);
    const setCurrentId = (nextId) => {
      const nextIndex2 = imageIdList.value.indexOf(nextId);
      if (nextIndex2 !== currentIndex.value) {
        setCurrentIndex(nextIndex2);
      }
    };
    const currentUrl = vue.computed(() => {
      var _a;
      return (_a = imageUrlMap.value.get(currentId.value)) == null ? void 0 : _a.url;
    });
    vue.provide(context.PreviewGroupInjectionKey, vue.reactive({
      registerImageUrl,
      preview: (imageId) => {
        setVisible(true);
        setCurrentId(imageId);
      }
    }));
    const nextIndex = vue.computed(() => {
      const findNext = (start, end) => {
        var _a;
        for (let i = start; i <= end; i++) {
          const id = imageIdList.value[i];
          if ((_a = imageUrlMap.value.get(id)) == null ? void 0 : _a.canPreview) {
            return i;
          }
        }
        return void 0;
      };
      const next = findNext(currentIndex.value + 1, imageCount.value - 1);
      return is.isUndefined(next) && infinite.value ? findNext(0, currentIndex.value - 1) : next;
    });
    const prevIndex = vue.computed(() => {
      const findPrev = (start, end) => {
        var _a;
        for (let i = start; i >= end; i--) {
          const id = imageIdList.value[i];
          if ((_a = imageUrlMap.value.get(id)) == null ? void 0 : _a.canPreview) {
            return i;
          }
        }
        return void 0;
      };
      const prev = findPrev(currentIndex.value - 1, 0);
      return is.isUndefined(prev) && infinite.value ? findPrev(imageCount.value - 1, currentIndex.value + 1) : prev;
    });
    const onPrev = vue.computed(() => !is.isUndefined(prevIndex.value) ? () => {
      !is.isUndefined(prevIndex.value) && setCurrentIndex(prevIndex.value);
    } : void 0);
    const onNext = vue.computed(() => !is.isUndefined(nextIndex.value) ? () => {
      !is.isUndefined(nextIndex.value) && setCurrentIndex(nextIndex.value);
    } : void 0);
    return {
      mergedVisible,
      currentUrl,
      prevIndex,
      nextIndex,
      onClose() {
        setVisible(false);
      },
      groupArrowProps: vue.reactive({
        onPrev,
        onNext
      })
    };
  }
});
module.exports = _sfc_main;
