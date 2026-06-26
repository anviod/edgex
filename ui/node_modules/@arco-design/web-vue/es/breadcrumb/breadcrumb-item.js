import { defineComponent, inject, ref, computed, createVNode, Fragment, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconMore from "../icon/icon-more/index.js";
import IconDown from "../icon/icon-down/index.js";
import IconObliqueLine from "../icon/icon-oblique-line/index.js";
import { breadcrumbInjectKey } from "./context.js";
import Dropdown from "../dropdown/index.js";
import Doption from "../dropdown/dropdown-option.js";
var BreadcrumbItem = defineComponent({
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
    const prefixCls = getPrefixCls("breadcrumb-item");
    const breadcrumbCtx = inject(breadcrumbInjectKey, void 0);
    const dropdownVisible = ref(false);
    const show = computed(() => {
      if (breadcrumbCtx && breadcrumbCtx.needHide) {
        if (props.index > 1 && props.index <= breadcrumbCtx.total - breadcrumbCtx.maxCount) {
          return false;
        }
      }
      return true;
    });
    const displayMore = computed(() => {
      if (breadcrumbCtx && breadcrumbCtx.needHide) {
        return props.index === 1;
      }
      return false;
    });
    const showSeparator = computed(() => breadcrumbCtx ? props.index < breadcrumbCtx.total - 1 : true);
    const handleVisibleChange = (visible) => {
      dropdownVisible.value = visible;
    };
    const separatorRender = () => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!showSeparator.value)
        return null;
      const separatorElement = (_g = (_f = (_e = (_b = (_a = slots.separator) == null ? void 0 : _a.call(slots)) != null ? _b : props.separator) != null ? _e : (_d = breadcrumbCtx == null ? void 0 : (_c = breadcrumbCtx.slots).separator) == null ? void 0 : _d.call(_c)) != null ? _f : breadcrumbCtx == null ? void 0 : breadcrumbCtx.separator) != null ? _g : createVNode(IconObliqueLine, null, null);
      return createVNode("div", {
        "aria-hidden": "true",
        "class": `${prefixCls}-separator`
      }, [separatorElement]);
    };
    const renderItem = () => {
      var _a, _b, _c, _d;
      return createVNode("div", mergeProps({
        "role": "listitem",
        "class": [prefixCls, {
          [`${prefixCls}-with-dropdown`]: props.droplist || slots.droplist
        }]
      }, displayMore.value ? {
        "aria-label": "ellipses of breadcrumb items"
      } : void 0, attrs), [displayMore.value ? (_c = (_b = breadcrumbCtx == null ? void 0 : (_a = breadcrumbCtx.slots)["more-icon"]) == null ? void 0 : _b.call(_a)) != null ? _c : createVNode(IconMore, null, null) : (_d = slots.default) == null ? void 0 : _d.call(slots), (props.droplist || slots.droplist) && createVNode("span", {
        "aria-hidden": true,
        "class": [`${prefixCls}-dropdown-icon`, {
          [`${prefixCls}-dropdown-icon-active`]: dropdownVisible.value
        }]
      }, [createVNode(IconDown, null, null)])]);
    };
    const renderDropdownContent = () => {
      var _a, _b, _c;
      return (_c = (_a = slots.droplist) == null ? void 0 : _a.call(slots)) != null ? _c : (_b = props.droplist) == null ? void 0 : _b.map((item) => createVNode(Doption, {
        "value": item.path
      }, {
        default: () => [item.label]
      }));
    };
    const renderDropdown = () => {
      return createVNode(Dropdown, mergeProps({
        "popupVisible": dropdownVisible.value,
        "onPopupVisibleChange": handleVisibleChange
      }, props.dropdownProps), {
        default: () => [renderItem()],
        content: renderDropdownContent
      });
    };
    return () => {
      if (show.value) {
        return createVNode(Fragment, null, [slots.droplist || props.droplist ? renderDropdown() : renderItem(), separatorRender()]);
      }
      return null;
    };
  }
});
export { BreadcrumbItem as default };
