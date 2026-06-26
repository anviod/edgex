import { inject, computed, isRef, provide, reactive } from "vue";
import { LevelInjectionKey } from "../context.js";
function provideLevel(level) {
  const computedLevel = computed(() => isRef(level) ? level.value : level);
  provide(
    LevelInjectionKey,
    reactive({
      level: computedLevel
    })
  );
}
function useLevel(props) {
  const { provideNextLevel } = props || {};
  const levelContext = inject(LevelInjectionKey);
  const level = computed(() => (levelContext == null ? void 0 : levelContext.level) || 1);
  if (provideNextLevel) {
    const nextLevel = computed(() => level.value + 1);
    provideLevel(nextLevel);
  }
  return {
    level
  };
}
export { useLevel as default, provideLevel };
