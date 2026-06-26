import { defineComponent, computed, openBlock, createElementBlock, normalizeClass, renderSlot, createCommentVNode, createElementVNode, toDisplayString } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { hasPropOrSlot } from "../_utils/use-prop-or-slot.js";
import { isString } from "../_utils/is.js";
import _export_sfc from "../_virtual/plugin-vue_export-helper.js";
const _sfc_main = defineComponent({
  name: "Comment",
  props: {
    author: {
      type: String
    },
    avatar: {
      type: String
    },
    content: {
      type: String
    },
    datetime: {
      type: String
    },
    align: {
      type: [String, Object],
      default: "left"
    }
  },
  setup(props, { slots }) {
    const prefixCls = getPrefixCls("comment");
    const [hasAuthor, hasAvatar, hasContent, hasDatetime] = [
      "author",
      "avatar",
      "content",
      "datetime"
    ].map((propName) => hasPropOrSlot(props, slots, propName));
    const computedAlign = computed(() => {
      const { align } = props;
      return {
        ...isString(align) ? {
          datetime: align,
          actions: align
        } : align
      };
    });
    return {
      prefixCls,
      hasAuthor,
      hasAvatar,
      hasContent,
      hasDatetime,
      computedAlign
    };
  }
});
const _hoisted_1 = ["src"];
const _hoisted_2 = { key: 0 };
const _hoisted_3 = { key: 0 };
const _hoisted_4 = { key: 0 };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(_ctx.prefixCls)
  }, [
    _ctx.hasAvatar ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-avatar`)
    }, [
      _ctx.avatar ? (openBlock(), createElementBlock("img", {
        key: 0,
        src: _ctx.avatar,
        alt: "comment-avatar"
      }, null, 8, _hoisted_1)) : renderSlot(_ctx.$slots, "avatar", { key: 1 })
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("div", {
      class: normalizeClass(`${_ctx.prefixCls}-inner`)
    }, [
      createElementVNode("div", {
        class: normalizeClass(`${_ctx.prefixCls}-inner-content`)
      }, [
        _ctx.hasAuthor || _ctx.hasDatetime ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: normalizeClass(`${_ctx.prefixCls}-title ${_ctx.prefixCls}-title-align-${_ctx.computedAlign.datetime}`)
        }, [
          _ctx.hasAuthor ? (openBlock(), createElementBlock("span", {
            key: 0,
            class: normalizeClass(`${_ctx.prefixCls}-author`)
          }, [
            _ctx.author ? (openBlock(), createElementBlock("span", _hoisted_2, toDisplayString(_ctx.author), 1)) : renderSlot(_ctx.$slots, "author", { key: 1 })
          ], 2)) : createCommentVNode("v-if", true),
          _ctx.hasDatetime ? (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(`${_ctx.prefixCls}-datetime`)
          }, [
            _ctx.datetime ? (openBlock(), createElementBlock("span", _hoisted_3, toDisplayString(_ctx.datetime), 1)) : renderSlot(_ctx.$slots, "datetime", { key: 1 })
          ], 2)) : createCommentVNode("v-if", true)
        ], 2)) : createCommentVNode("v-if", true),
        _ctx.hasContent ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: normalizeClass(`${_ctx.prefixCls}-content`)
        }, [
          _ctx.content ? (openBlock(), createElementBlock("span", _hoisted_4, toDisplayString(_ctx.content), 1)) : renderSlot(_ctx.$slots, "content", { key: 1 })
        ], 2)) : createCommentVNode("v-if", true),
        _ctx.$slots.actions ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: normalizeClass(`${_ctx.prefixCls}-actions ${_ctx.prefixCls}-actions-align-${_ctx.computedAlign.actions}`)
        }, [
          renderSlot(_ctx.$slots, "actions")
        ], 2)) : createCommentVNode("v-if", true)
      ], 2),
      _ctx.$slots.default ? (openBlock(), createElementBlock("div", {
        key: 0,
        class: normalizeClass(`${_ctx.prefixCls}-inner-comment`)
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2)) : createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var _Comment = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export { _Comment as default };
