"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var usePropOrSlot = require("../_utils/use-prop-or-slot.js");
var is = require("../_utils/is.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
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
    const prefixCls = globalConfig.getPrefixCls("comment");
    const [hasAuthor, hasAvatar, hasContent, hasDatetime] = [
      "author",
      "avatar",
      "content",
      "datetime"
    ].map((propName) => usePropOrSlot.hasPropOrSlot(props, slots, propName));
    const computedAlign = vue.computed(() => {
      const { align } = props;
      return {
        ...is.isString(align) ? {
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
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(_ctx.prefixCls)
  }, [
    _ctx.hasAvatar ? (vue.openBlock(), vue.createElementBlock("div", {
      key: 0,
      class: vue.normalizeClass(`${_ctx.prefixCls}-avatar`)
    }, [
      _ctx.avatar ? (vue.openBlock(), vue.createElementBlock("img", {
        key: 0,
        src: _ctx.avatar,
        alt: "comment-avatar"
      }, null, 8, _hoisted_1)) : vue.renderSlot(_ctx.$slots, "avatar", { key: 1 })
    ], 2)) : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", {
      class: vue.normalizeClass(`${_ctx.prefixCls}-inner`)
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(`${_ctx.prefixCls}-inner-content`)
      }, [
        _ctx.hasAuthor || _ctx.hasDatetime ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(`${_ctx.prefixCls}-title ${_ctx.prefixCls}-title-align-${_ctx.computedAlign.datetime}`)
        }, [
          _ctx.hasAuthor ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 0,
            class: vue.normalizeClass(`${_ctx.prefixCls}-author`)
          }, [
            _ctx.author ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2, vue.toDisplayString(_ctx.author), 1)) : vue.renderSlot(_ctx.$slots, "author", { key: 1 })
          ], 2)) : vue.createCommentVNode("v-if", true),
          _ctx.hasDatetime ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(`${_ctx.prefixCls}-datetime`)
          }, [
            _ctx.datetime ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3, vue.toDisplayString(_ctx.datetime), 1)) : vue.renderSlot(_ctx.$slots, "datetime", { key: 1 })
          ], 2)) : vue.createCommentVNode("v-if", true)
        ], 2)) : vue.createCommentVNode("v-if", true),
        _ctx.hasContent ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 1,
          class: vue.normalizeClass(`${_ctx.prefixCls}-content`)
        }, [
          _ctx.content ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_4, vue.toDisplayString(_ctx.content), 1)) : vue.renderSlot(_ctx.$slots, "content", { key: 1 })
        ], 2)) : vue.createCommentVNode("v-if", true),
        _ctx.$slots.actions ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 2,
          class: vue.normalizeClass(`${_ctx.prefixCls}-actions ${_ctx.prefixCls}-actions-align-${_ctx.computedAlign.actions}`)
        }, [
          vue.renderSlot(_ctx.$slots, "actions")
        ], 2)) : vue.createCommentVNode("v-if", true)
      ], 2),
      _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 0,
        class: vue.normalizeClass(`${_ctx.prefixCls}-inner-comment`)
      }, [
        vue.renderSlot(_ctx.$slots, "default")
      ], 2)) : vue.createCommentVNode("v-if", true)
    ], 2)
  ], 2);
}
var _Comment = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = _Comment;
