import { ref, computed } from "vue";
const useSpan = ({
  spanMethod,
  data,
  columns
}) => {
  const flattenTableSpan = (tableData, span) => {
    tableData == null ? void 0 : tableData.forEach((record, rowIndex) => {
      var _a;
      if (record.hasSubtree && ((_a = record.children) == null ? void 0 : _a.length)) {
        flattenTableSpan(record.children || [], span);
      }
      columns.value.forEach((column, columnIndex) => {
        var _a2, _b;
        const { rowspan = 1, colspan = 1 } = (_b = (_a2 = spanMethod.value) == null ? void 0 : _a2.call(spanMethod, {
          record: record.raw,
          column,
          rowIndex,
          columnIndex
        })) != null ? _b : {};
        if (rowspan > 1 || colspan > 1) {
          span[`${rowIndex}-${columnIndex}-${record.key}`] = [rowspan, colspan];
          Array.from({ length: rowspan }).forEach((_, r) => {
            var _a3;
            if (rowIndex + r < tableData.length) {
              const { key } = (_a3 = tableData[rowIndex + r]) != null ? _a3 : {};
              Array.from({ length: colspan }).forEach((_2, c) => {
                if (columnIndex + c < columns.value.length && `${rowIndex}-${columnIndex}-${record.key}` !== `${rowIndex + r}-${columnIndex + c}-${key}`) {
                  spanzero.value[`${rowIndex + r}-${columnIndex + c}-${key}`] = [0, 0];
                }
              });
            }
          });
        }
      });
    });
  };
  let spanzero = ref({});
  const tableSpan = computed(() => {
    const span = {};
    spanzero.value = {};
    if (spanMethod.value) {
      flattenTableSpan(data.value, span);
    }
    return span;
  });
  const removedCells = computed(() => {
    const data2 = [];
    for (const indexKey of Object.keys(spanzero.value)) {
      data2.push(indexKey);
    }
    return data2;
  });
  return {
    tableSpan,
    removedCells
  };
};
export { useSpan };
