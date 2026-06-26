"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var index$1 = require("../icon/icon-more/index.js");
var index$2 = require("../icon/icon-down/index.js");
var index = require("../icon/icon-oblique-line/index.js");
var context = require("./context.js");
var index$3 = require("../dropdown/index.js");
var dropdownOption = require("../dropdown/dropdown-option.js");
var BreadcrumbItem = vue.defineComponent({
  name: "BreadcrumbItem",
  inheritAttrs: false,
  props: {
    separator: {
      type: [String, Number]
    },
    droplist: {
      type: Array
    },
    dropdownProps: {
      type: Object
    },
    index: {
      type: Number,
      default: 0
    }
  },
  setup(props, {
    slots,
    attrs
  }) {
    const prefixCls = globalConfig.getPrefixCls("breadcrumb-item");
    const breadcrumbCtx = vue.inject(context.breadcrumbInjectKey, void 0);
    const dropdownVisible = vue.ref(false);
    const show = vue.computed(() => {
      if (breadcrumbCtx && breadcrumbCtx.needHide) {
        if (props.index > 1 && props.index <= breadcrumbCtx.total - breadcrumbCtx.maxCount) {
          return false;
        }
      }
      return true;
    });
    const displayMore = vue.computed(() => {
      if (breadcrumbCtx && breadcrumbCtx.needHide) {
        return props.index === 1;
      }
      return false;
    });
    const showSeparator = vue.computed(() => breadcrumbCtx ? props.index < breadcrumbCtx.total - 1 : true);
    const handleVisibleChange = (visible) => {
      dropdownVisible.value = visible;
    };
    const separatorRender = () => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!showSeparator.value)
        return null;
      const separatorElement = (_g = (_f = (_e = (_b = (_a = slots.separator) == null ? void 0 : _a.call(slots)) != null ? _b : props.separator) != null ? _e : (_d = breadcrumbCtx == null ? void 0 : (_c = breadcrumbCtx.slots).separator) == null ? void 0 : _d.call(_c)) != null ? _f : breadcrumbCtx == null ? void 0 : breadcrumbCtx.separator) != null ? _g : vue.createVNode(index, null, null);
      return vue.createVNode("div", {
        "aria-hidden": "true",
        "class": `${prefixCls}-separator`
      }, [separatorElement]);
    };
    const renderItem = () => {
      var _a, _b, _c, _d;
      return vue.createVNode("div", vue.mergeProps({
        "role": "listitem",
        "class": [prefixCls, {
          [`${prefixCls}-with-dropdown`]: props.droplist || slots.droplist
        }]
      }, displayMore.value ? {
        "aria-label": "ellipses of breadcrumb items"
      } : void 0, attrs), [displayMore.value ? (_c = (_b = breadcrumbCtx == null ? void 0 : (_a = breadcrumbCtx.slots)["more-icon"]) == null ? void 0 : _b.call(_a)) != null ? _c : vue.createVNode(index$1, null, null) : (_d = slots.default) == null ? void 0 : _d.call(slots), (props.droplist || slots.droplist) && vue.createVNode("span", {
        "aria-hidden": true,
        "class": [`${prefixCls}-dropdown-icon`, {
          [`${prefixCls}-dropdown-icon-active`]: dropdownVisible.value
        }]
      }, [vue.createVNode(index$2, null, null)])]);
    };
    const renderDropdownContent = () => {
      var _a, _b, _c;
      return (_c = (_a = slots.droplist) == null ? void 0 : _a.call(slots)) != null ? _c : (_b = props.droplist) == null ? void 0 : _b.map((item) => vue.createVNode(dropdownOption, {
        "value": item.path
      }, {
        default: () => [item.label]
      }));
    };
    const renderDropdown = () => {
      return vue.createVNode(index$3["default"], vue.mergeProps({
        "popupVisible": dropdownVisible.value,
        "onPopupVisibleChange": handleVisibleChange
      }, props.dropdownProps), {
        default: () => [renderItem()],
        content: renderDropdownContent
      });
    };
    return () => {
      if (show.value) {
        return vue.createVNode(vue.Fragment, null, [slots.droplist || props.droplist ? renderDropdown() : renderItem(), separatorRender()]);
      }
      return null;
    };
  }
});
module.exports = BreadcrumbItem;
