import { ref } from "vue";
function useState(defaultValue) {
  const value = ref(defaultValue);
  const setValue = (newValue) => {
    value.value = newValue;
  };
  return [value, setValue];
}
export { useState as default };
