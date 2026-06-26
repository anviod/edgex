import { toRefs, computed } from "vue";
function usePanelSpan(props) {
  const { mode } = toRefs(props);
  const span = computed(
    () => ({ date: 1, week: 1, year: 10 * 12, quarter: 12, month: 12 })[mode.value]
  );
  const superSpan = computed(
    () => ["year"].includes(mode.value) ? 10 * 12 : 12
  );
  return {
    span,
    superSpan
  };
}
export { usePanelSpan as default };
