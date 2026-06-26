"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
function resolveItemData(cols, props) {
  var _a, _b;
  const originSpan = (_a = props.span) != null ? _a : 1;
  const originOffset = (_b = props.offset) != null ? _b : 0;
  const offset = Math.min(originOffset, cols);
  const span = Math.min(
    offset > 0 ? originSpan + originOffset : originSpan,
    cols
  );
  return {
    span,
    offset,
    suffix: "suffix" in props ? props.suffix !== false : false
  };
}
function setItemVisible({
  cols,
  collapsed,
  collapsedRows,
  itemDataList
}) {
  let overflow = false;
  let displayIndexList = [];
  function isOverflow(span) {
    return Math.ceil(span / cols) > collapsedRows;
  }
  if (collapsed) {
    let spanSum = 0;
    for (let i = 0; i < itemDataList.length; i++) {
      if (itemDataList[i].suffix) {
        spanSum += itemDataList[i].span;
        displayIndexList.push(i);
      }
    }
    if (!isOverflow(spanSum)) {
      let current = 0;
      while (current < itemDataList.length) {
        const item = itemDataList[current];
        if (!item.suffix) {
          spanSum += item.span;
          if (isOverflow(spanSum)) {
            break;
          }
          displayIndexList.push(current);
        }
        current++;
      }
    }
    overflow = itemDataList.some(
      (item, index) => !item.suffix && !displayIndexList.includes(index)
    );
  } else {
    displayIndexList = itemDataList.map((_, index) => index);
  }
  return {
    overflow,
    displayIndexList
  };
}
exports.resolveItemData = resolveItemData;
exports.setItemVisible = setItemVisible;
