function pickSubCompSlots(slots, subCompName) {
  const prefix = `${subCompName}-slot-`;
  const subSlots = Object.keys(slots).reduce(
    (cur, s) => {
      if (s.startsWith(prefix)) {
        const subSlotName = s.slice(prefix.length);
        if (subSlotName) {
          cur[subSlotName] = slots[s];
        }
      }
      return cur;
    },
    {}
  );
  return subSlots;
}
export { pickSubCompSlots as default };
