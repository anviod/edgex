"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var vue = require("vue");
const defaultWindow = typeof window !== "undefined" ? window : void 0;
function unrefElement(elRef) {
  var _a;
  const plain = vue.unref(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function tryOnScopeDispose(fn) {
  if (vue.getCurrentScope()) {
    vue.onScopeDispose(fn);
    return true;
  }
  return false;
}
function useMutationObserver(target, callback, options = {}) {
  const { window: window2 = defaultWindow, ...mutationOptions } = options;
  const isSupported = window2 && "MutationObserver" in window2;
  let observer;
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const stopWatch = vue.watch(
    () => unrefElement(target),
    (el) => {
      cleanup();
      if (isSupported && window2 && el) {
        observer = new MutationObserver(callback);
        observer.observe(el, mutationOptions);
      }
    },
    { immediate: true }
  );
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
exports.defaultWindow = defaultWindow;
exports.tryOnScopeDispose = tryOnScopeDispose;
exports.unrefElement = unrefElement;
exports.useMutationObserver = useMutationObserver;
