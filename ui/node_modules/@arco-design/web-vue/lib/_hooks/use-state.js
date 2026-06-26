"use strict";
var vue = require("vue");
function useState(defaultValue) {
  const value = vue.ref(defaultValue);
  const setValue = (newValue) => {
    value.value = newValue;
  };
  return [value, setValue];
}
module.exports = useState;
