"use strict";
var vue = require("vue");
function usePanelSpan(props) {
  const { mode } = vue.toRefs(props);
  const span = vue.computed(
    () => ({ date: 1, week: 1, year: 10 * 12, quarter: 12, month: 12 })[mode.value]
  );
  const superSpan = vue.computed(
    () => ["year"].includes(mode.value) ? 10 * 12 : 12
  );
  return {
    span,
    superSpan
  };
}
module.exports = usePanelSpan;
