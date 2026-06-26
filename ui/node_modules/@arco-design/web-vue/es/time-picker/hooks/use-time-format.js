import { toRefs, computed } from "vue";
import { getColumnsFromFormat } from "../utils/index.js";
function useTimeFormat(props) {
  const {
    format: propFormat,
    use12Hours: propUse12Hours,
    defaultFormat
  } = toRefs(props);
  const format = computed(() => {
    let res = (propFormat == null ? void 0 : propFormat.value) || (defaultFormat == null ? void 0 : defaultFormat.value);
    if (!res || !getColumnsFromFormat(res).list.length) {
      res = (propUse12Hours == null ? void 0 : propUse12Hours.value) ? "hh:mm:ss a" : "HH:mm:ss";
    }
    return res;
  });
  const configFromFormat = computed(() => getColumnsFromFormat(format.value));
  const list = computed(() => configFromFormat.value.list);
  const formatUse12Hours = computed(() => configFromFormat.value.use12Hours);
  const computedUse12Hours = computed(
    () => !!((propUse12Hours == null ? void 0 : propUse12Hours.value) || formatUse12Hours.value)
  );
  return {
    columns: list,
    use12Hours: computedUse12Hours,
    format
  };
}
export { useTimeFormat as default };
