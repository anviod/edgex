import { defineComponent, toRefs, ref, computed, provide, reactive, createVNode, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { breadcrumbInjectKey } from "./context.js";
import { getAllElements } from "../_utils/vue-utils.js";
import BreadcrumbItem from "./breadcrumb-item.js";
var _Breadcrumb = defineComponent({
  name: "Breadcrumb",
  props: {
    maxCount: {
      type: Number,
      default: 0
    },
    routes: {
      type: Array
    },
    separator: {
      type: [String, Number]
    },
    customUrl: {
      type: Function
    }
  },
  setup(props, {
    slots
  }) {
    const {
      maxCount,
      separator,
      routes
    } = toRefs(props);
    const prefixCls = getPrefixCls("breadcrumb");
    const total = ref(0);
    const needHide = computed(() => maxCount.value > 0 && total.value > maxCount.value + 1);
    provide(breadcrumbInjectKey, reactive({
      total,
      maxCount,
      separator,
      needHide,
      slots
    }));
    const defaultItemRender = (route, routes2, paths) => {
      var _a, _b;
      if (routes2.indexOf(route) === routes2.length - 1) {
        return createVNode("span", null, [route.label]);
      }
      const href = (_b = (_a = props.customUrl) == null ? void 0 : _a.call(props, paths)) != null ? _b : `#/${paths.join("/").replace(/^\//, "")}`;
      return createVNode("a", {
        "href": href
      }, [route.label]);
    };
    const renderByRoutes = () => {
      var _a;
      if (!((_a = routes.value) == null ? void 0 : _a.length))
        return null;
      if (total.value !== routes.value.length) {
        total.value = routes.value.length;
      }
      const paths = [];
      return routes.value.map((route, idx, origin) => {
        paths.push((route.path || "").replace(/^\//, ""));
        const currentPaths = [...paths];
        return createVNode(BreadcrumbItem, {
          "key": route.path || route.label,
          "index": idx,
          "droplist": route.children
        }, {
          default: () => {
            var _a2, _b;
            return [(_b = (_a2 = slots["item-render"]) == null ? void 0 : _a2.call(slots, {
              route,
              routes: origin,
              paths: currentPaths
            })) != null ? _b : defaultItemRender(route, origin, currentPaths)];
          }
        });
      });
    };
    const renderByChildren = () => {
      var _a, _b;
      const children = getAllElements((_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) != null ? _b : []);
      if (total.value !== children.length) {
        total.value = children.length;
      }
      return children.map((child, index) => {
        var _a2;
        child.props = mergeProps((_a2 = child.props) != null ? _a2 : {}, {
          index
        });
        return child;
      });
    };
    return () => {
      return createVNode("div", {
        "role": "list",
        "class": prefixCls
      }, [slots.default ? renderByChildren() : renderByRoutes()]);
    };
  }
});
export { _Breadcrumb as default };
