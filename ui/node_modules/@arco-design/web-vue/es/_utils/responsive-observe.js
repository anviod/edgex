const responsiveArray = [
  "xxl",
  "xl",
  "lg",
  "md",
  "sm",
  "xs"
];
const responsiveMap = {
  xs: "(max-width: 575px)",
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1600px)"
};
let subscribers = [];
let subUid = -1;
let screens = {};
const responsiveObserve = {
  matchHandlers: {},
  dispatch(pointMap, breakpointChecked) {
    screens = pointMap;
    if (subscribers.length < 1) {
      return false;
    }
    subscribers.forEach((item) => {
      item.func(screens, breakpointChecked);
    });
    return true;
  },
  subscribe(func) {
    if (subscribers.length === 0) {
      this.register();
    }
    const token = (++subUid).toString();
    subscribers.push({
      token,
      func
    });
    func(screens, null);
    return token;
  },
  unsubscribe(token) {
    subscribers = subscribers.filter((item) => item.token !== token);
    if (subscribers.length === 0) {
      this.unregister();
    }
  },
  unregister() {
    Object.keys(responsiveMap).forEach(
      (screen) => {
        const matchMediaQuery = responsiveMap[screen];
        if (!matchMediaQuery)
          return;
        const handler = this.matchHandlers[matchMediaQuery];
        if (handler && handler.mql && handler.listener) {
          if (handler.mql.removeEventListener) {
            handler.mql.removeEventListener("change", handler.listener);
          } else {
            handler.mql.removeListener(handler.listener);
          }
        }
      }
    );
  },
  register() {
    Object.keys(responsiveMap).forEach(
      (screen) => {
        const matchMediaQuery = responsiveMap[screen];
        if (!matchMediaQuery)
          return;
        const listener = ({ matches }) => {
          this.dispatch(
            {
              ...screens,
              [screen]: matches
            },
            screen
          );
        };
        const mql = window.matchMedia(matchMediaQuery);
        if (mql.addEventListener) {
          mql.addEventListener("change", listener);
        } else {
          mql.addListener(listener);
        }
        this.matchHandlers[matchMediaQuery] = {
          mql,
          listener
        };
        listener(mql);
      }
    );
  }
};
export { responsiveObserve as default, responsiveArray, responsiveMap };
