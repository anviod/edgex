"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var dom = require("../../_utils/dom.js");
var useOptions = require("./use-options.js");
var keyboard = require("../../_utils/keyboard.js");
var context = require("../context.js");
const useSelect = ({
  multiple,
  options,
  extraOptions,
  inputValue,
  filterOption,
  showExtraOptions,
  component,
  valueKey,
  fieldNames,
  loading,
  popupVisible,
  valueKeys,
  dropdownRef,
  optionRefs,
  virtualListRef,
  onSelect,
  onPopupVisibleChange,
  enterToOpen = true,
  defaultActiveFirstOption
}) => {
  const {
    validOptions,
    optionInfoMap,
    validOptionInfos,
    enabledOptionKeys,
    getNextSlotOptionIndex,
    addSlotOptionInfo,
    removeSlotOptionInfo
  } = useOptions.useOptions({
    options,
    extraOptions,
    inputValue,
    filterOption,
    showExtraOptions,
    valueKey,
    fieldNames
  });
  const activeKey = vue.ref();
  vue.watch(enabledOptionKeys, (enabledKeys) => {
    if (!activeKey.value || !enabledKeys.includes(activeKey.value)) {
      activeKey.value = enabledKeys[0];
    }
  });
  const setActiveKey = (key) => {
    activeKey.value = key;
  };
  const getNextActiveKey = (direction) => {
    const _length = enabledOptionKeys.value.length;
    if (_length === 0) {
      return void 0;
    }
    if (!activeKey.value) {
      if (direction === "down") {
        return enabledOptionKeys.value[0];
      }
      return enabledOptionKeys.value[_length - 1];
    }
    const activeIndex = enabledOptionKeys.value.indexOf(activeKey.value);
    const nextIndex = (_length + activeIndex + (direction === "up" ? -1 : 1)) % _length;
    return enabledOptionKeys.value[nextIndex];
  };
  const scrollIntoView = (key) => {
    var _a, _b;
    if (virtualListRef == null ? void 0 : virtualListRef.value) {
      virtualListRef.value.scrollTo({ key });
    }
    const optionInfo = optionInfoMap.get(key);
    const wrapperEle = (_a = dropdownRef == null ? void 0 : dropdownRef.value) == null ? void 0 : _a.wrapperRef;
    const optionEle = (_b = optionRefs == null ? void 0 : optionRefs.value[key]) != null ? _b : optionInfo == null ? void 0 : optionInfo.ref;
    if (!wrapperEle || !optionEle) {
      return;
    }
    if (wrapperEle.scrollHeight === wrapperEle.offsetHeight) {
      return;
    }
    const optionRect = dom.getRelativeRect(optionEle, wrapperEle);
    const wrapperScrollTop = wrapperEle.scrollTop;
    if (optionRect.top < 0) {
      wrapperEle.scrollTo(0, wrapperScrollTop + optionRect.top);
    } else if (optionRect.bottom < 0) {
      wrapperEle.scrollTo(0, wrapperScrollTop - optionRect.bottom);
    }
  };
  vue.watch(popupVisible, (visible) => {
    var _a;
    if (visible) {
      const current = valueKeys.value[valueKeys.value.length - 1];
      let _activeKey = ((_a = defaultActiveFirstOption == null ? void 0 : defaultActiveFirstOption.value) != null ? _a : true) ? enabledOptionKeys.value[0] : void 0;
      if (enabledOptionKeys.value.includes(current)) {
        _activeKey = current;
      }
      if (_activeKey !== activeKey.value) {
        activeKey.value = _activeKey;
      }
      vue.nextTick(() => {
        if (activeKey.value) {
          scrollIntoView(activeKey.value);
        }
      });
    }
  });
  const handleKeyDown = keyboard.getKeyDownHandler(
    /* @__PURE__ */ new Map([
      [
        keyboard.KEYBOARD_KEY.ENTER,
        (e) => {
          if (!(loading == null ? void 0 : loading.value) && !e.isComposing) {
            if (popupVisible.value) {
              if (activeKey.value) {
                onSelect(activeKey.value, e);
                e.preventDefault();
              }
            } else if (enterToOpen) {
              onPopupVisibleChange(true);
              e.preventDefault();
            }
          }
        }
      ],
      [
        keyboard.KEYBOARD_KEY.ESC,
        (e) => {
          if (popupVisible.value) {
            onPopupVisibleChange(false);
            e.preventDefault();
          }
        }
      ],
      [
        keyboard.KEYBOARD_KEY.ARROW_DOWN,
        (e) => {
          if (popupVisible.value) {
            const next = getNextActiveKey("down");
            if (next) {
              activeKey.value = next;
              scrollIntoView(next);
            }
            e.preventDefault();
          }
        }
      ],
      [
        keyboard.KEYBOARD_KEY.ARROW_UP,
        (e) => {
          if (popupVisible.value) {
            const next = getNextActiveKey("up");
            if (next) {
              activeKey.value = next;
              scrollIntoView(next);
            }
            e.preventDefault();
          }
        }
      ]
    ])
  );
  vue.provide(
    context.selectInjectionKey,
    vue.reactive({
      multiple,
      valueKey,
      inputValue,
      filterOption,
      component,
      valueKeys,
      activeKey,
      setActiveKey,
      onSelect,
      getNextSlotOptionIndex,
      addSlotOptionInfo,
      removeSlotOptionInfo
    })
  );
  return {
    validOptions,
    optionInfoMap,
    validOptionInfos,
    enabledOptionKeys,
    activeKey,
    setActiveKey,
    addSlotOptionInfo,
    removeSlotOptionInfo,
    getNextActiveKey,
    scrollIntoView,
    handleKeyDown
  };
};
exports.useSelect = useSelect;
