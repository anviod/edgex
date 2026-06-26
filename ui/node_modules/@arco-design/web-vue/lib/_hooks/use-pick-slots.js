"use strict";
var vue = require("vue");
function usePickSlots(slots, slotName) {
  const slot = vue.ref(slots[slotName]);
  vue.onUpdated(() => {
    const newSlot = slots[slotName];
    if (slot.value !== newSlot) {
      slot.value = newSlot;
    }
  });
  return slot;
}
module.exports = usePickSlots;
