import BTween from "b-tween";
import { isFunction } from "../_utils/is.js";
function slide(el, top, cb) {
  const tween = new BTween({
    from: {
      scrollTop: el.scrollTop
    },
    to: {
      scrollTop: top
    },
    easing: "quartOut",
    duration: 300,
    onUpdate: (keys) => {
      el.scrollTop = keys.scrollTop;
    },
    onFinish: () => {
      if (isFunction(cb)) {
        cb();
      }
    }
  });
  tween.start();
}
export { slide };
