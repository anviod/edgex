import { defineComponent, computed, toRefs, reactive, provide, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { timelineInjectionKey } from "./context.js";
import TimelineItem from "./item.js";
import Spin from "../spin/index.js";
import { useChildrenComponents } from "../_hooks/use-children-components.js";
var _Timeline = defineComponent({
  name: "Timeline",
  components: {
    Item: TimelineItem,
    Spin
  },
  props: {
    reverse: {
      type: Boolean
    },
    direction: {
      type: String,
      default: "vertical"
    },
    mode: {
      type: String,
      default: "left"
    },
    pending: {
      type: [Boolean, String]
    },
    labelPosition: {
      type: String,
      default: "same"
    }
  },
  setup(props, {
    slots
  }) {
    const prefixCls = getPrefixCls("timeline");
    const hasPending = computed(() => {
      return props.pending || slots.pending;
    });
    const {
      children,
      components
    } = useChildrenComponents("TimelineItem");
    const {
      reverse: reverseRef,
      direction: directionRef,
      labelPosition: labelPositionRef,
      mode: modeRef
    } = toRefs(props);
    const timelineContext = reactive({
      items: components,
      direction: directionRef,
      reverse: reverseRef,
      labelPosition: labelPositionRef,
      mode: modeRef
    });
    provide(timelineInjectionKey, timelineContext);
    const cls = computed(() => {
      return [prefixCls, `${prefixCls}-${props.mode}`, `${prefixCls}-direction-${props.direction}`, {
        [`${prefixCls}-is-reverse`]: props.reverse
      }];
    });
    return () => {
      var _a, _b;
      if (hasPending.value) {
        children.value = (_a = slots.default) == null ? void 0 : _a.call(slots).concat(createVNode(TimelineItem, {
          "lineType": "dashed"
        }, {
          default: () => [props.pending !== true && createVNode("div", null, [props.pending])],
          dot: () => {
            var _a2, _b2;
            return (_b2 = (_a2 = slots.dot) == null ? void 0 : _a2.call(slots)) != null ? _b2 : createVNode(Spin, {
              "size": 12
            }, null);
          }
        }));
      } else {
        children.value = (_b = slots.default) == null ? void 0 : _b.call(slots);
      }
      return createVNode("div", {
        "role": "list",
        "class": cls.value
      }, [children.value]);
    };
  }
});
export { _Timeline as default };
