import { ref, onUpdated } from "vue";
function usePickSlots(slots, slotName) {
  const slot = ref(slots[slotName]);
  onUpdated(() => {
    const newSlot = slots[slotName];
    if (slot.value !== newSlot) {
      slot.value = newSlot;
    }
  });
  return slot;
}
export { usePickSlots as default };
