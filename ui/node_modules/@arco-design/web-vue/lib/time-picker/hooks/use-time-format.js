"use strict";
var vue = require("vue");
var index = require("../utils/index.js");
function useTimeFormat(props) {
  const {
    format: propFormat,
    use12Hours: propUse12Hours,
    defaultFormat
  } = vue.toRefs(props);
  const format = vue.computed(() => {
    let res = (propFormat == null ? void 0 : propFormat.value) || (defaultFormat == null ? void 0 : defaultFormat.value);
    if (!res || !index.getColumnsFromFormat(res).list.length) {
      res = (propUse12Hours == null ? void 0 : propUse12Hours.value) ? "hh:mm:ss a" : "HH:mm:ss";
    }
    return res;
  });
  const configFromFormat = vue.computed(() => index.getColumnsFromFormat(format.value));
  const list = vue.computed(() => configFromFormat.value.list);
  const formatUse12Hours = vue.computed(() => configFromFormat.value.use12Hours);
  const computedUse12Hours = vue.computed(
    () => !!((propUse12Hours == null ? void 0 : propUse12Hours.value) || formatUse12Hours.value)
  );
  return {
    columns: list,
    use12Hours: computedUse12Hours,
    format
  };
}
module.exports = useTimeFormat;
