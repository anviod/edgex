"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
var context = require("../context.js");
function provideLevel(level) {
  const computedLevel = vue.computed(() => vue.isRef(level) ? level.value : level);
  vue.provide(
    context.LevelInjectionKey,
    vue.reactive({
      level: computedLevel
    })
  );
}
function useLevel(props) {
  const { provideNextLevel } = props || {};
  const levelContext = vue.inject(context.LevelInjectionKey);
  const level = vue.computed(() => (levelContext == null ? void 0 : levelContext.level) || 1);
  if (provideNextLevel) {
    const nextLevel = vue.computed(() => level.value + 1);
    provideLevel(nextLevel);
  }
  return {
    level
  };
}
exports["default"] = useLevel;
exports.provideLevel = provideLevel;
