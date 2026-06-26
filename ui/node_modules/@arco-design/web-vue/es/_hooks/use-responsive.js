import { computed, isRef, onMounted, onUnmounted } from "vue";
import responsiveObserve from "../_utils/responsive-observe.js";
function useResponsive(breakpoint, callback) {
  const resultBreakpoint = computed(
    () => isRef(breakpoint) ? breakpoint.value : breakpoint
  );
  let subscribeToken = "";
  onMounted(() => {
    subscribeToken = responsiveObserve.subscribe(
      (screens, breakpointChecked) => {
        if (!resultBreakpoint.value)
          return;
        if (!breakpointChecked || breakpointChecked === resultBreakpoint.value) {
          callback(!!screens[resultBreakpoint.value]);
        }
      }
    );
  });
  onUnmounted(() => {
    if (subscribeToken) {
      responsiveObserve.unsubscribe(subscribeToken);
    }
  });
}
export { useResponsive };
