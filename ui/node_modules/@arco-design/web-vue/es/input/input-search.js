import { defineComponent, toRefs, ref, createVNode, Fragment, mergeProps } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import IconHover from "../_components/icon-hover.js";
import IconSearch from "../icon/icon-search/index.js";
import IconLoading from "../icon/icon-loading/index.js";
import Button from "../button/index.js";
import _Input from "./input.js";
import { useSize } from "../_hooks/use-size.js";
var InputSearch = defineComponent({
  name: "InputSearch",
  props: {
    searchButton: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    buttonText: {
      type: String
    },
    buttonProps: {
      type: Object
    }
  },
  emits: {
    search: (value, ev) => true
  },
  setup(props, {
    emit,
    slots
  }) {
    const {
      size
    } = toRefs(props);
    const prefixCls = getPrefixCls("input-search");
    const {
      mergedSize
    } = useSize(size);
    const inputRef = ref();
    const handleClick = (e) => {
      if (inputRef.value.inputRef) {
        emit("search", inputRef.value.inputRef.value, e);
      }
    };
    const renderSuffix = () => {
      var _a;
      return createVNode(Fragment, null, [props.loading ? createVNode(IconLoading, null, null) : createVNode(IconHover, {
        "onClick": handleClick
      }, {
        default: () => [createVNode(IconSearch, null, null)]
      }), (_a = slots.suffix) == null ? void 0 : _a.call(slots)]);
    };
    const renderButton = () => {
      var _a;
      let _slots = {};
      if (props.buttonText || slots["button-default"] || slots["button-icon"]) {
        _slots = {
          default: (_a = slots["button-default"]) != null ? _a : props.buttonText ? () => props.buttonText : void 0,
          icon: slots["button-icon"]
        };
      } else {
        _slots = {
          icon: () => createVNode(IconSearch, null, null)
        };
      }
      return createVNode(Button, mergeProps({
        "type": "primary",
        "class": `${prefixCls}-btn`,
        "disabled": props.disabled,
        "size": mergedSize.value,
        "loading": props.loading
      }, props.buttonProps, {
        "onClick": handleClick
      }), _slots);
    };
    const render = () => createVNode(_Input, {
      "ref": inputRef,
      "class": prefixCls,
      "size": mergedSize.value,
      "disabled": props.disabled
    }, {
      prepend: slots.prepend,
      prefix: slots.prefix,
      suffix: props.searchButton ? slots.suffix : renderSuffix,
      append: props.searchButton ? renderButton : slots.append
    });
    return {
      inputRef,
      render
    };
  },
  methods: {
    focus() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.focus();
    },
    blur() {
      var _a;
      (_a = this.inputRef) == null ? void 0 : _a.blur();
    }
  },
  render() {
    return this.render();
  }
});
export { InputSearch as default };
