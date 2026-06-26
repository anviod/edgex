import { defineComponent, toRefs, computed, ref, reactive, onUnmounted, watch, onMounted, onUpdated, createVNode, mergeProps, isVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { isObject } from "../_utils/is.js";
import EditContent from "./edit-content.js";
import Operations from "./operations.js";
import ResizeObserver from "../_components/resize-observer.js";
import { omit } from "../_utils/omit.js";
import useMergeState from "../_hooks/use-merge-state.js";
import measure from "./utils/measure.js";
import { clipboard } from "../_utils/clipboard.js";
import getInnerText from "./utils/getInnerText.js";
import { caf, raf } from "../_utils/raf.js";
import Tooltip from "../tooltip/index.js";
import Popover from "../popover/index.js";
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
function getComponentTags(props) {
  const {
    bold,
    mark,
    underline,
    delete: propDelete,
    code
  } = props;
  const componentTags = [];
  if (bold) {
    componentTags.push("b");
  }
  if (underline) {
    componentTags.push("u");
  }
  if (propDelete) {
    componentTags.push("del");
  }
  if (code) {
    componentTags.push("code");
  }
  if (mark) {
    componentTags.push("mark");
  }
  return componentTags;
}
function Wrap(props, children) {
  const {
    mark
  } = props;
  const componentTags = getComponentTags(props);
  const markStyle = isObject(mark) && mark.color ? {
    backgroundColor: mark.color
  } : {};
  return componentTags.reduce((content, Tag) => {
    const attrs = Tag === "mark" ? {
      style: markStyle
    } : {};
    return createVNode(Tag, attrs, _isSlot(content) ? content : {
      default: () => [content]
    });
  }, children);
}
function normalizeEllipsisConfig(config) {
  const showTooltip = !!config.showTooltip;
  const TooltipComponent = isObject(config.showTooltip) && config.showTooltip.type === "popover" ? Popover : Tooltip;
  const tooltipProps = isObject(config.showTooltip) && config.showTooltip.props || {};
  return {
    rows: 1,
    suffix: "",
    ellipsisStr: "...",
    expandable: false,
    css: false,
    ...omit(config, ["showTooltip"]),
    showTooltip,
    TooltipComponent,
    tooltipProps
  };
}
var Base = defineComponent({
  name: "TypographyBase",
  inheritAttrs: false,
  props: {
    component: {
      type: String,
      required: true
    },
    type: {
      type: String
    },
    bold: {
      type: Boolean
    },
    mark: {
      type: [Boolean, Object],
      default: false
    },
    underline: {
      type: Boolean
    },
    delete: {
      type: Boolean
    },
    code: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    },
    editable: {
      type: Boolean
    },
    editing: {
      type: Boolean,
      default: void 0
    },
    defaultEditing: {
      type: Boolean
    },
    editText: {
      type: String
    },
    copyable: {
      type: Boolean
    },
    copyText: {
      type: String
    },
    copyDelay: {
      type: Number,
      default: 3e3
    },
    ellipsis: {
      type: [Boolean, Object],
      default: false
    },
    editTooltipProps: {
      type: Object
    },
    copyTooltipProps: {
      type: Object
    }
  },
  emits: {
    "editStart": () => true,
    "change": (text) => true,
    "update:editText": (text) => true,
    "editEnd": () => true,
    "update:editing": (editing) => true,
    "copy": (text) => true,
    "ellipsis": (isEllipsis) => true,
    "expand": (expanded) => true
  },
  setup(props, {
    slots,
    emit,
    attrs
  }) {
    const {
      editing: propEditing,
      defaultEditing,
      ellipsis,
      copyable,
      editable,
      copyText,
      editText,
      copyDelay,
      component
    } = toRefs(props);
    const prefixCls = getPrefixCls("typography");
    const classNames = computed(() => [prefixCls, {
      [`${prefixCls}-${props.type}`]: props.type,
      [`${prefixCls}-disabled`]: props.disabled
    }]);
    const wrapperRef = ref();
    const fullText = ref("");
    const [editing, setEditing] = useMergeState(defaultEditing.value, reactive({
      value: propEditing
    }));
    const mergeEditing = computed(() => editable.value && editing.value);
    function onEditStart() {
      emit("update:editing", true);
      emit("editStart");
      setEditing(true);
    }
    function onEditChange(text) {
      emit("update:editText", text);
      emit("change", text);
    }
    function onEditEnd() {
      if (!editing.value)
        return;
      emit("update:editing", false);
      emit("editEnd");
      setEditing(false);
    }
    const isCopied = ref(false);
    let copyTimer = null;
    function onCopyClick() {
      var _a;
      const text = (_a = copyText.value) != null ? _a : fullText.value;
      clipboard(text || "");
      isCopied.value = true;
      emit("copy", text);
      copyTimer = setTimeout(() => {
        isCopied.value = false;
      }, copyDelay.value);
    }
    onUnmounted(() => {
      copyTimer && clearTimeout(copyTimer);
      copyTimer = null;
    });
    const isEllipsis = ref(false);
    const expanded = ref(false);
    const ellipsisText = ref("");
    const ellipsisConfig = computed(() => normalizeEllipsisConfig(isObject(ellipsis.value) && ellipsis.value || {}));
    let rafId = null;
    function onExpandClick() {
      const newVal = !expanded.value;
      expanded.value = newVal;
      emit("expand", newVal);
    }
    function renderOperations(forceRenderExpand = false) {
      if (ellipsisConfig.value.css) {
        return createVNode(Operations, {
          "editable": editable.value,
          "copyable": copyable.value,
          "expandable": ellipsisConfig.value.expandable,
          "isCopied": isCopied.value,
          "isEllipsis": showCSSTooltip.value,
          "expanded": expanded.value,
          "forceRenderExpand": forceRenderExpand || expanded.value,
          "editTooltipProps": props.editTooltipProps,
          "copyTooltipProps": props.copyTooltipProps,
          "onEdit": onEditStart,
          "onCopy": onCopyClick,
          "onExpand": onExpandClick
        }, {
          "copy-tooltip": slots["copy-tooltip"],
          "copy-icon": slots["copy-icon"],
          "expand-node": slots["expand-node"]
        });
      }
      return createVNode(Operations, {
        "editable": editable.value,
        "copyable": copyable.value,
        "expandable": ellipsisConfig.value.expandable,
        "isCopied": isCopied.value,
        "isEllipsis": isEllipsis.value,
        "expanded": expanded.value,
        "forceRenderExpand": forceRenderExpand,
        "editTooltipProps": props.editTooltipProps,
        "copyTooltipProps": props.copyTooltipProps,
        "onEdit": onEditStart,
        "onCopy": onCopyClick,
        "onExpand": onExpandClick
      }, {
        "copy-tooltip": slots["copy-tooltip"],
        "copy-icon": slots["copy-icon"],
        "expand-node": slots["expand-node"]
      });
    }
    function calEllipsis() {
      if (!wrapperRef.value)
        return;
      const {
        ellipsis: ellipsis2,
        text
      } = measure(wrapperRef.value, ellipsisConfig.value, renderOperations(!!ellipsisConfig.value.expandable), fullText.value);
      if (isEllipsis.value !== ellipsis2) {
        isEllipsis.value = ellipsis2;
        if (!ellipsisConfig.value.css) {
          emit("ellipsis", ellipsis2);
        }
      }
      if (ellipsisText.value !== text) {
        ellipsisText.value = text || "";
      }
    }
    function resizeOnNextFrame() {
      const needCalEllipsis = ellipsis.value && !expanded.value;
      if (!needCalEllipsis)
        return;
      caf(rafId);
      rafId = raf(() => {
        calEllipsis();
      });
    }
    onUnmounted(() => {
      caf(rafId);
    });
    watch(() => ellipsisConfig.value.rows, () => {
      resizeOnNextFrame();
    });
    watch(ellipsis, (newVal) => {
      if (newVal) {
        resizeOnNextFrame();
      } else {
        isEllipsis.value = false;
      }
    });
    let children = [];
    const updateFullText = () => {
      if (ellipsis.value || copyable.value || editable.value) {
        const _fullText = getInnerText(children);
        if (_fullText !== fullText.value) {
          fullText.value = _fullText;
          resizeOnNextFrame();
        }
      }
    };
    onMounted(updateFullText);
    onUpdated(updateFullText);
    const contentRef = ref();
    const showCSSTooltip = ref(false);
    const calTooltip = () => {
      if (wrapperRef.value && contentRef.value) {
        const _show = contentRef.value.offsetHeight > wrapperRef.value.offsetHeight;
        if (_show !== showCSSTooltip.value) {
          showCSSTooltip.value = _show;
          emit("ellipsis", _show);
        }
      }
    };
    const ellipsisStyle = computed(() => {
      if (expanded.value) {
        return {};
      }
      return {
        "overflow": "hidden",
        "text-overflow": "ellipsis",
        "display": "-webkit-box",
        "-webkit-line-clamp": ellipsisConfig.value.rows,
        "-webkit-box-orient": "vertical"
      };
    });
    return () => {
      var _a, _b;
      children = ((_a = slots.default) == null ? void 0 : _a.call(slots)) || [];
      if (mergeEditing.value) {
        const _editText = (_b = editText.value) != null ? _b : fullText.value;
        return createVNode(EditContent, {
          "text": _editText,
          "onChange": (text) => {
            if (text !== _editText) {
              onEditChange(text);
            }
          },
          "onEnd": onEditEnd
        }, null);
      }
      const {
        suffix,
        ellipsisStr,
        showTooltip,
        tooltipProps,
        TooltipComponent
      } = ellipsisConfig.value;
      const showEllipsis = isEllipsis.value && !expanded.value;
      const titleAttrs = showEllipsis && !showTooltip ? {
        title: fullText.value
      } : {};
      const Component = component.value;
      if (ellipsisConfig.value.css) {
        const Content2 = Wrap(props, children);
        const Outer = createVNode(Component, mergeProps({
          "class": classNames.value,
          "ref": wrapperRef,
          "style": ellipsisStyle.value
        }, titleAttrs, attrs), {
          default: () => [createVNode("span", {
            "ref": contentRef
          }, [Content2])]
        });
        if (showCSSTooltip.value) {
          return createVNode(TooltipComponent, mergeProps(tooltipProps, {
            "onResize": () => calTooltip()
          }), {
            default: () => [Outer],
            content: () => fullText.value
          });
        }
        return createVNode(ResizeObserver, {
          "onResize": () => {
            calTooltip();
          }
        }, _isSlot(Outer) ? Outer : {
          default: () => [Outer]
        });
      }
      const Content = Wrap(props, showEllipsis ? ellipsisText.value : children);
      return createVNode(ResizeObserver, {
        "onResize": () => resizeOnNextFrame()
      }, {
        default: () => [createVNode(Component, mergeProps({
          "class": classNames.value,
          "ref": wrapperRef
        }, titleAttrs, attrs), {
          default: () => [showEllipsis && showTooltip ? createVNode(TooltipComponent, tooltipProps, {
            default: () => [createVNode("span", null, [Content])],
            content: () => fullText.value
          }) : Content, showEllipsis ? ellipsisStr : null, suffix, renderOperations()]
        })]
      });
    };
  }
});
export { Base as default };
