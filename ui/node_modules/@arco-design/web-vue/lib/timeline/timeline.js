"use strict";
var vue = require("vue");
var globalConfig = require("../_utils/global-config.js");
var context = require("./context.js");
var item = require("./item.js");
var index = require("../spin/index.js");
var useChildrenComponents = require("../_hooks/use-children-components.js");
var _Timeline = vue.defineComponent({
  name: "Timeline",
  components: {
    Item: item,
    Spin: index
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
    const prefixCls = globalConfig.getPrefixCls("timeline");
    const hasPending = vue.computed(() => {
      return props.pending || slots.pending;
    });
    const {
      children,
      components
    } = useChildrenComponents.useChildrenComponents("TimelineItem");
    const {
      reverse: reverseRef,
      direction: directionRef,
      labelPosition: labelPositionRef,
      mode: modeRef
    } = vue.toRefs(props);
    const timelineContext = vue.reactive({
      items: components,
      direction: directionRef,
      reverse: reverseRef,
      labelPosition: labelPositionRef,
      mode: modeRef
    });
    vue.provide(context.timelineInjectionKey, timelineContext);
    const cls = vue.computed(() => {
      return [prefixCls, `${prefixCls}-${props.mode}`, `${prefixCls}-direction-${props.direction}`, {
        [`${prefixCls}-is-reverse`]: props.reverse
      }];
    });
    return () => {
      var _a, _b;
      if (hasPending.value) {
        children.value = (_a = slots.default) == null ? void 0 : _a.call(slots).concat(vue.createVNode(item, {
          "lineType": "dashed"
        }, {
          default: () => [props.pending !== true && vue.createVNode("div", null, [props.pending])],
          dot: () => {
            var _a2, _b2;
            return (_b2 = (_a2 = slots.dot) == null ? void 0 : _a2.call(slots)) != null ? _b2 : vue.createVNode(index, {
              "size": 12
            }, null);
          }
        }));
      } else {
        children.value = (_b = slots.default) == null ? void 0 : _b.call(slots);
      }
      return vue.createVNode("div", {
        "role": "list",
        "class": cls.value
      }, [children.value]);
    };
  }
});
module.exports = _Timeline;
