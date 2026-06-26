import { isUndefined, isNumber } from "../../_utils/is.js";
function normalizeImageSizeProp(size) {
  if (isUndefined(size))
    return void 0;
  if (!isNumber(size) && /^\d+(%)$/.test(size))
    return size;
  const num = parseInt(size, 10);
  return isNumber(num) ? `${num}px` : void 0;
}
export { normalizeImageSizeProp };
