"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
const useSize = ({
  dataKeys,
  contentRef,
  fixedSize,
  estimatedSize,
  buffer
}) => {
  const firstRangeAverageSize = vue.ref(0);
  const sizeMap = /* @__PURE__ */ new Map();
  const total = vue.computed(() => dataKeys.value.length);
  const start = vue.ref(0);
  const end = vue.computed(() => {
    const _end = start.value + buffer.value * 3;
    if (_end > total.value)
      return total.value;
    return _end;
  });
  const maxStart = vue.computed(() => {
    const max = total.value - buffer.value * 3;
    if (max < 0)
      return 0;
    return max;
  });
  const setStart = (index) => {
    if (index < 0) {
      start.value = 0;
    } else if (index > maxStart.value) {
      start.value = maxStart.value;
    } else {
      start.value = index;
    }
  };
  const isFixed = vue.ref(fixedSize.value);
  const _estimatedSize = vue.computed(() => {
    if (estimatedSize.value !== 30) {
      return estimatedSize.value;
    }
    return firstRangeAverageSize.value || estimatedSize.value;
  });
  const setItemSize = (key, size) => {
    sizeMap.set(key, size);
  };
  const getItemSize = (index) => {
    var _a;
    if (isFixed.value) {
      return _estimatedSize.value;
    }
    const _key = dataKeys.value[index];
    return (_a = sizeMap.get(_key)) != null ? _a : _estimatedSize.value;
  };
  const hasItemSize = (key) => {
    return sizeMap.has(key);
  };
  vue.onMounted(() => {
    const firstRangeTotalSize = Array.from(sizeMap.values()).reduce(
      (pre, value) => pre + value,
      0
    );
    if (firstRangeTotalSize > 0) {
      firstRangeAverageSize.value = firstRangeTotalSize / sizeMap.size;
    }
  });
  const getScrollOffset = (index) => {
    if (isFixed.value) {
      return _estimatedSize.value * index;
    }
    return getOffset(0, index);
  };
  const getOffset = (start2, end2) => {
    let offset = 0;
    for (let i = start2; i < end2; i++) {
      offset += getItemSize(i);
    }
    return offset;
  };
  const frontPadding = vue.computed(() => {
    if (isFixed.value) {
      return _estimatedSize.value * start.value;
    }
    return getOffset(0, start.value);
  });
  const getOffsetIndex = (scrollOffset) => {
    const isForward = scrollOffset >= frontPadding.value;
    let offset = Math.abs(scrollOffset - frontPadding.value);
    const _start = isForward ? start.value : start.value - 1;
    let offsetIndex = 0;
    while (offset > 0) {
      offset -= getItemSize(_start + offsetIndex);
      isForward ? offsetIndex++ : offsetIndex--;
    }
    return offsetIndex;
  };
  const getStartByScroll = (scrollOffset) => {
    const offsetIndex = getOffsetIndex(scrollOffset);
    const _start = start.value + offsetIndex - buffer.value;
    if (_start < 0)
      return 0;
    if (_start > maxStart.value)
      return maxStart.value;
    return _start;
  };
  const behindPadding = vue.computed(() => {
    if (isFixed.value) {
      return _estimatedSize.value * (total.value - end.value);
    }
    return getOffset(end.value, total.value);
  });
  return {
    frontPadding,
    behindPadding,
    start,
    end,
    getStartByScroll,
    setItemSize,
    hasItemSize,
    setStart,
    getScrollOffset
  };
};
exports.useSize = useSize;
