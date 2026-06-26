import { caf, raf } from "./raf.js";
function throttleByRaf(cb) {
  let timer = 0;
  const throttle = (...args) => {
    if (timer) {
      caf(timer);
    }
    timer = raf(() => {
      cb(...args);
      timer = 0;
    });
  };
  throttle.cancel = () => {
    caf(timer);
    timer = 0;
  };
  return throttle;
}
export { throttleByRaf };
