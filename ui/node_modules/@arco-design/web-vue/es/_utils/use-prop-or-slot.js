import { computed } from "vue";
function hasPropOrSlot(props, slots, propName) {
  return computed(() => Boolean(props[propName] || slots[propName]));
}
export { hasPropOrSlot };
