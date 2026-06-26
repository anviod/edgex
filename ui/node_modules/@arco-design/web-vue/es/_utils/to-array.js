import { isArray } from "./is.js";
function toArray(val) {
  return isArray(val) ? val : [val];
}
export { toArray };
