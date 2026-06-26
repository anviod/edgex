"use strict";
var vue = require("vue");
var is = require("../_utils/is.js");
var baseCascaderPanel = require("./base-cascader-panel.js");
var utils = require("./utils.js");
var useSelectedPath = require("./hooks/use-selected-path.js");
var context = require("./context.js");
var keyboard = require("../_utils/keyboard.js");
var pluginVue_exportHelper = require("../_virtual/plugin-vue_export-helper.js");
const _sfc_main = vue.defineComponent({
  name: "CascaderPanel",
  components: {
    BaseCascaderPanel: baseCascaderPanel
  },
  props: {
    pathMode: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [String, Number, Array]
    },
    defaultValue: {
      type: [String, Number, Array],
      default: (props) => props.multiple ? [] : props.pathMode ? void 0 : ""
    },
    options: {
      type: Array,
      default: () => []
    },
    expandTrigger: {
      type: String,
      default: "click"
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    loadMore: {
      type: Function
    },
    fieldNames: {
      type: Object
    },
    valueKey: {
      type: String,
      default: "value"
    },
    expandChild: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:modelValue": (value) => true,
    "change": (value) => true
  },
  setup(props, { emit, slots }) {
    const {
      options,
      checkStrictly,
      loadMore,
      modelValue,
      valueKey,
      expandChild,
      expandTrigger
    } = vue.toRefs(props);
    const _value = vue.ref(props.defaultValue);
    vue.watch(modelValue, (value) => {
      if (is.isUndefined(value) || is.isNull(value)) {
        _value.value = props.multiple ? [] : void 0;
      }
    });
    const optionInfos = vue.ref([]);
    const totalLevel = vue.ref(1);
    const optionMap = vue.reactive(/* @__PURE__ */ new Map());
    const leafOptionMap = vue.reactive(/* @__PURE__ */ new Map());
    const leafOptionValueMap = vue.reactive(/* @__PURE__ */ new Map());
    const leafOptionSet = vue.reactive(/* @__PURE__ */ new Set());
    const lazyLoadOptions = vue.reactive({});
    const addLazyLoadOptions = (children, key) => {
      lazyLoadOptions[key] = children;
    };
    const DEFAULT_FIELD_NAMES = {
      value: "value",
      label: "label",
      disabled: "disabled",
      children: "children",
      tagProps: "tagProps",
      render: "render",
      isLeaf: "isLeaf"
    };
    const mergedFieldNames = vue.computed(() => ({
      ...DEFAULT_FIELD_NAMES,
      ...props.fieldNames
    }));
    vue.watch(
      [options, lazyLoadOptions, mergedFieldNames],
      ([_options, _lazyLoadOptions, _fieldNames]) => {
        optionMap.clear();
        leafOptionMap.clear();
        leafOptionValueMap.clear();
        leafOptionSet.clear();
        optionInfos.value = utils.getOptionInfos(_options != null ? _options : [], {
          enabledLazyLoad: Boolean(props.loadMore),
          lazyLoadOptions: _lazyLoadOptions,
          optionMap,
          leafOptionSet,
          leafOptionMap,
          leafOptionValueMap,
          totalLevel,
          checkStrictly,
          fieldNames: _fieldNames,
          valueKey
        });
      },
      {
        immediate: true
      }
    );
    const computedValueMap = vue.computed(() => {
      var _a;
      const values = utils.getValidValues((_a = props.modelValue) != null ? _a : _value.value, {
        multiple: props.multiple,
        pathMode: props.pathMode
      });
      return new Map(
        values.map((value) => [
          utils.getValueKey(value, {
            valueKey: props.valueKey,
            leafOptionValueMap
          }),
          value
        ])
      );
    });
    const filteredLeafOptions = vue.computed(
      () => props.checkStrictly ? Array.from(optionMap.values()) : Array.from(leafOptionSet)
    );
    const updateValue = (values) => {
      var _a;
      const value = props.multiple ? values : (_a = values[0]) != null ? _a : "";
      if (values.length === 0) {
        setSelectedPath();
        setActiveKey();
      }
      _value.value = value;
      emit("update:modelValue", value);
      emit("change", value);
    };
    const selectSingle = (option) => {
      updateValue([props.pathMode ? option.pathValue : option.value]);
    };
    const selectMultiple = (option, checked) => {
      if (checked) {
        const leafOptionInfos = props.checkStrictly ? [option] : utils.getLeafOptionInfos(option);
        updateValue([
          ...computedValueMap.value.values(),
          ...leafOptionInfos.filter((item) => !computedValueMap.value.has(item.key)).map((item) => {
            return props.pathMode ? item.pathValue : item.value;
          })
        ]);
      } else {
        const leafOptionKeys = props.checkStrictly ? [option.key] : utils.getLeafOptionKeys(option);
        const values = [];
        computedValueMap.value.forEach((value, key) => {
          if (!leafOptionKeys.includes(key)) {
            values.push(value);
          }
        });
        updateValue(values);
      }
    };
    const handleClickOption = (option, checked) => {
      if (props.multiple) {
        selectMultiple(option, checked != null ? checked : true);
      } else {
        selectSingle(option);
      }
    };
    const {
      activeKey,
      activeOption,
      selectedPath,
      displayColumns,
      setActiveKey,
      setSelectedPath,
      getNextActiveNode
    } = useSelectedPath.useSelectedPath(optionInfos, {
      optionMap,
      filteredLeafOptions,
      expandChild
    });
    vue.provide(
      context.cascaderInjectionKey,
      vue.reactive({
        onClickOption: handleClickOption,
        setActiveKey,
        setSelectedPath,
        loadMore,
        addLazyLoadOptions,
        slots,
        valueMap: computedValueMap,
        expandTrigger
      })
    );
    const handleKeyDown = keyboard.getKeyDownHandler(
      /* @__PURE__ */ new Map([
        [
          keyboard.KEYBOARD_KEY.ENTER,
          (ev) => {
            if (activeOption.value) {
              let checked;
              if (props.checkStrictly || activeOption.value.isLeaf) {
                checked = !computedValueMap.value.has(activeOption.value.key);
              } else {
                checked = !utils.getCheckedStatus(
                  activeOption.value,
                  computedValueMap.value
                ).checked;
              }
              setSelectedPath(activeOption.value.key);
              handleClickOption(activeOption.value, checked);
            }
          }
        ],
        [
          keyboard.KEYBOARD_KEY.ARROW_DOWN,
          (ev) => {
            ev.preventDefault();
            const activeNode = getNextActiveNode("next");
            setActiveKey(activeNode == null ? void 0 : activeNode.key);
          }
        ],
        [
          keyboard.KEYBOARD_KEY.ARROW_UP,
          (ev) => {
            ev.preventDefault();
            const activeNode = getNextActiveNode("preview");
            setActiveKey(activeNode == null ? void 0 : activeNode.key);
          }
        ],
        [
          keyboard.KEYBOARD_KEY.ARROW_RIGHT,
          (ev) => {
            var _a, _b;
            ev.preventDefault();
            if ((_a = activeOption.value) == null ? void 0 : _a.children) {
              setSelectedPath(activeOption.value.key);
              setActiveKey((_b = activeOption.value.children[0]) == null ? void 0 : _b.key);
            }
          }
        ],
        [
          keyboard.KEYBOARD_KEY.ARROW_LEFT,
          (ev) => {
            var _a;
            ev.preventDefault();
            if ((_a = activeOption.value) == null ? void 0 : _a.parent) {
              setSelectedPath(activeOption.value.parent.key);
              setActiveKey(activeOption.value.parent.key);
            }
          }
        ]
      ])
    );
    return {
      optionInfos,
      filteredLeafOptions,
      selectedPath,
      activeKey,
      displayColumns,
      handleKeyDown,
      totalLevel
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_base_cascader_panel = vue.resolveComponent("base-cascader-panel");
  return vue.openBlock(), vue.createBlock(_component_base_cascader_panel, {
    "display-columns": _ctx.displayColumns,
    "selected-path": _ctx.selectedPath,
    "active-key": _ctx.activeKey,
    multiple: _ctx.multiple,
    "total-level": _ctx.totalLevel,
    "check-strictly": _ctx.checkStrictly,
    onKeydown: _ctx.handleKeyDown
  }, vue.createSlots({ _: 2 }, [
    _ctx.$slots.empty ? {
      name: "empty",
      fn: vue.withCtx(() => [
        vue.renderSlot(_ctx.$slots, "empty")
      ]),
      key: "0"
    } : void 0
  ]), 1032, ["display-columns", "selected-path", "active-key", "multiple", "total-level", "check-strictly", "onKeydown"]);
}
var CascaderPanel = /* @__PURE__ */ pluginVue_exportHelper(_sfc_main, [["render", _sfc_render]]);
module.exports = CascaderPanel;
