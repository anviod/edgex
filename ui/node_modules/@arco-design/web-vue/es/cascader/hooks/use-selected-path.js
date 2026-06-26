import { ref, computed } from "vue";
const useSelectedPath = (options, {
  optionMap,
  filteredLeafOptions,
  showSearchPanel,
  expandChild
}) => {
  const activeKey = ref();
  const activeOption = computed(() => {
    if (activeKey.value)
      return optionMap.get(activeKey.value);
    return void 0;
  });
  const selectedPath = ref([]);
  const displayColumns = computed(() => {
    const columns = [options.value];
    for (const key of selectedPath.value) {
      const option = optionMap.get(key);
      if (option == null ? void 0 : option.children) {
        columns.push(option.children);
      }
    }
    return columns;
  });
  const setSelectedPath = (key) => {
    var _a;
    const option = getTargetOption(key);
    selectedPath.value = (_a = option == null ? void 0 : option.path.map((item) => item.key)) != null ? _a : [];
  };
  const setActiveKey = (key) => {
    activeKey.value = key;
  };
  const enabledOptions = computed(() => {
    var _a;
    if (showSearchPanel == null ? void 0 : showSearchPanel.value) {
      return filteredLeafOptions.value.filter((item) => !item.disabled);
    }
    if (activeOption.value && activeOption.value.parent) {
      return (_a = activeOption.value.parent.children) == null ? void 0 : _a.filter(
        (item) => !item.disabled
      );
    }
    return options.value.filter((item) => !item.disabled);
  });
  const getTargetOption = (key) => {
    let target = key ? optionMap.get(key) : void 0;
    if (expandChild.value) {
      while (target && target.children && target.children.length > 0) {
        target = target.children[0];
      }
    }
    return target;
  };
  const getNextActiveNode = (direction) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const _length = (_b = (_a = enabledOptions.value) == null ? void 0 : _a.length) != null ? _b : 0;
    if (activeKey.value) {
      const enabledIndex = (_d = (_c = enabledOptions.value) == null ? void 0 : _c.findIndex(
        (item) => item.key === activeKey.value
      )) != null ? _d : 0;
      if (direction === "next") {
        return (_e = enabledOptions.value) == null ? void 0 : _e[(_length + enabledIndex + 1) % _length];
      }
      return (_f = enabledOptions.value) == null ? void 0 : _f[(_length + enabledIndex - 1) % _length];
    }
    return (_g = enabledOptions.value) == null ? void 0 : _g[0];
  };
  return {
    activeKey,
    activeOption,
    selectedPath,
    displayColumns,
    setActiveKey,
    setSelectedPath,
    getNextActiveNode
  };
};
export { useSelectedPath };
