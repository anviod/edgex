!function(e, t) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = t(require("vue")) : "function" == typeof define && define.amd ? define(["vue"], t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).ArcoVueIcon = t(e.Vue);
}(this, function(e) {
  "use strict";
  const t = Symbol("ArcoConfigProvider"), n = (n2) => {
    var _a2, _b, _c2;
    const o2 = e.getCurrentInstance(), i2 = e.inject(t, void 0), r2 = (_c2 = (_b = i2 == null ? void 0 : i2.prefixCls) != null ? _b : (_a2 = o2 == null ? void 0 : o2.appContext.config.globalProperties.$arco) == null ? void 0 : _a2.classPrefix) != null ? _c2 : "arco";
    return n2 ? `${r2}-${n2}` : r2;
  }, o = Object.prototype.toString;
  function i(e2) {
    return "[object Number]" === o.call(e2) && e2 == e2;
  }
  var r = (e2, t2) => {
    const n2 = e2.__vccOpts || e2;
    for (const [e3, o2] of t2)
      n2[e3] = o2;
    return n2;
  };
  const l = e.defineComponent({ name: "IconArrowDown", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-arrow-down`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), s = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var c = r(l, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m11.27 27.728 12.727 12.728 12.728-12.728M24 5v34.295" }, null, -1)]), 14, s);
  }]]);
  const a = Object.assign(c, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + c.name, c);
  } }), p = e.defineComponent({ name: "IconArrowFall", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-arrow-fall`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), u = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var m = r(p, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24.008 41.99a.01.01 0 0 1-.016 0l-9.978-11.974A.01.01 0 0 1 14.02 30H33.98a.01.01 0 0 1 .007.016l-9.978 11.975Z" }, null, -1), e.createElementVNode("path", { d: "M24 42 14 30h20L24 42Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M22 6h4v26h-4z" }, null, -1), e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "M22 6h4v26h-4z" }, null, -1)]), 14, u);
  }]]);
  const d = Object.assign(m, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + m.name, m);
  } }), k = e.defineComponent({ name: "IconArrowLeft", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-arrow-left`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), f = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var v = r(k, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M20.272 11.27 7.544 23.998l12.728 12.728M43 24H8.705" }, null, -1)]), 14, f);
  }]]);
  const h = Object.assign(v, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + v.name, v);
  } }), g = e.defineComponent({ name: "IconArrowRight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-arrow-right`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), y = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var z = r(g, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m27.728 11.27 12.728 12.728-12.728 12.728M5 24h34.295" }, null, -1)]), 14, y);
  }]]);
  const C = Object.assign(z, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + z.name, z);
  } }), S = e.defineComponent({ name: "IconArrowRise", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-arrow-rise`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), b = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var w = r(S, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M23.992 6.01a.01.01 0 0 1 .016 0l9.978 11.974a.01.01 0 0 1-.007.016H14.02a.01.01 0 0 1-.007-.016l9.978-11.975Z" }, null, -1), e.createElementVNode("path", { d: "m24 6 10 12H14L24 6Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M26 42h-4V16h4z" }, null, -1), e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "M26 42h-4V16h4z" }, null, -1)]), 14, b);
  }]]);
  const j = Object.assign(w, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + w.name, w);
  } }), L = e.defineComponent({ name: "IconArrowUp", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-arrow-up`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), N = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var x = r(L, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M11.27 20.272 23.997 7.544l12.728 12.728M24 43V8.705" }, null, -1)]), 14, N);
  }]]);
  const B = Object.assign(x, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + x.name, x);
  } }), $ = e.defineComponent({ name: "IconCaretDown", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-caret-down`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), E = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var M = r($, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24.938 34.829a1.2 1.2 0 0 1-1.875 0L9.56 17.949c-.628-.785-.069-1.949.937-1.949h27.007c1.006 0 1.565 1.164.937 1.95L24.937 34.829Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, E);
  }]]);
  const V = Object.assign(M, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + M.name, M);
  } }), I = e.defineComponent({ name: "IconCaretLeft", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-caret-left`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), W = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Z = r(I, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13.171 24.937a1.2 1.2 0 0 1 0-1.874L30.051 9.56c.785-.629 1.949-.07 1.949.937v27.006c0 1.006-1.164 1.566-1.95.937L13.171 24.937Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, W);
  }]]);
  const P = Object.assign(Z, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Z.name, Z);
  } }), q = e.defineComponent({ name: "IconCaretRight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-caret-right`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), O = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var H = r(q, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M34.829 23.063c.6.48.6 1.394 0 1.874L17.949 38.44c-.785.629-1.949.07-1.949-.937V10.497c0-1.007 1.164-1.566 1.95-.937l16.879 13.503Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, O);
  }]]);
  const F = Object.assign(H, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + H.name, H);
  } }), A = e.defineComponent({ name: "IconCaretUp", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-caret-up`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), D = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var R = r(A, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M23.063 13.171a1.2 1.2 0 0 1 1.875 0l13.503 16.88c.628.785.069 1.949-.937 1.949H10.497c-1.006 0-1.565-1.164-.937-1.95l13.503-16.879Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, D);
  }]]);
  const T = Object.assign(R, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + R.name, R);
  } }), U = e.defineComponent({ name: "IconDoubleDown", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-double-down`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Q = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var G = r(U, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m9.9 11.142 14.143 14.142 14.142-14.142M9.9 22.456l14.143 14.142 14.142-14.142" }, null, -1)]), 14, Q);
  }]]);
  const X = Object.assign(G, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + G.name, G);
  } }), _ = e.defineComponent({ name: "IconDoubleLeft", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-double-left`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), J = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var K = r(_, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M36.857 9.9 22.715 24.042l14.142 14.142M25.544 9.9 11.402 24.042l14.142 14.142" }, null, -1)]), 14, J);
  }]]);
  const Y = Object.assign(K, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + K.name, K);
  } }), ee = e.defineComponent({ name: "IconDoubleRight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-double-right`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), te = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ne = r(ee, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m11.143 38.1 14.142-14.142L11.143 9.816M22.456 38.1l14.142-14.142L22.456 9.816" }, null, -1)]), 14, te);
  }]]);
  const oe = Object.assign(ne, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ne.name, ne);
  } }), ie = e.defineComponent({ name: "IconDoubleUp", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-double-up`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), re = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var le = r(ie, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M38.1 36.858 23.957 22.716 9.816 36.858M38.1 25.544 23.957 11.402 9.816 25.544" }, null, -1)]), 14, re);
  }]]);
  const se = Object.assign(le, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + le.name, le);
  } }), ce = e.defineComponent({ name: "IconDownCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-down-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ae = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var pe = r(ce, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "24", cy: "24", r: "18", transform: "rotate(-180 24 24)" }, null, -1), e.createElementVNode("path", { d: "M32.484 20.515 24 29l-8.485-8.485" }, null, -1)]), 14, ae);
  }]]);
  const ue = Object.assign(pe, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + pe.name, pe);
  } }), me = e.defineComponent({ name: "IconDown", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-down`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), de = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ke = r(me, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M39.6 17.443 24.043 33 8.487 17.443" }, null, -1)]), 14, de);
  }]]);
  const fe = Object.assign(ke, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ke.name, ke);
  } }), ve = e.defineComponent({ name: "IconDragArrow", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-drag-arrow`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), he = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ge = r(ve, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 24h34M24 7v34M30 12l-6-6-6 6M36 30l6-6-6-6M12 30l-6-6 6-6M18 36l6 6 6-6" }, null, -1)]), 14, he);
  }]]);
  const ye = Object.assign(ge, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ge.name, ge);
  } }), ze = e.defineComponent({ name: "IconExpand", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-expand`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ce = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Se = r(ze, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 26v14c0 .552.444 1 .996 1H22m19-19V8c0-.552-.444-1-.996-1H26" }, null, -1)]), 14, Ce);
  }]]);
  const be = Object.assign(Se, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Se.name, Se);
  } }), we = e.defineComponent({ name: "IconLeftCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-left-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), je = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Le = r(we, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "24", cy: "24", r: "18" }, null, -1), e.createElementVNode("path", { d: "M28.485 32.485 20 24l8.485-8.485" }, null, -1)]), 14, je);
  }]]);
  const Ne = Object.assign(Le, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Le.name, Le);
  } }), xe = e.defineComponent({ name: "IconLeft", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-left`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Be = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var $e = r(xe, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M32 8.4 16.444 23.956 32 39.513" }, null, -1)]), 14, Be);
  }]]);
  const Ee = Object.assign($e, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + $e.name, $e);
  } }), Me = e.defineComponent({ name: "IconMenuFold", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-menu-fold`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ve = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ie = r(Me, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42 11H6M42 24H22M42 37H6M13.66 26.912l-4.82-3.118 4.82-3.118v6.236Z" }, null, -1)]), 14, Ve);
  }]]);
  const We = Object.assign(Ie, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ie.name, Ie);
  } }), Ze = e.defineComponent({ name: "IconMenuUnfold", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-menu-unfold`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Pe = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var qe = r(Ze, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 11h36M22 24h20M6 37h36M8 20.882 12.819 24 8 27.118v-6.236Z" }, null, -1)]), 14, Pe);
  }]]);
  const Oe = Object.assign(qe, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + qe.name, qe);
  } }), He = e.defineComponent({ name: "IconRightCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-right-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Fe = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ae = r(He, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "24", cy: "24", r: "18" }, null, -1), e.createElementVNode("path", { d: "M19.485 15.515 27.971 24l-8.486 8.485" }, null, -1)]), 14, Fe);
  }]]);
  const De = Object.assign(Ae, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ae.name, Ae);
  } }), Re = e.defineComponent({ name: "IconRight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-right`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Te = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ue = r(Re, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m16 39.513 15.556-15.557L16 8.4" }, null, -1)]), 14, Te);
  }]]);
  const Qe = Object.assign(Ue, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ue.name, Ue);
  } }), Ge = e.defineComponent({ name: "IconRotateLeft", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-rotate-left`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Xe = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var _e = r(Ge, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M10 22a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V22ZM23 11h11a6 6 0 0 1 6 6v6M22.5 12.893 19.587 11 22.5 9.107v3.786Z" }, null, -1)]), 14, Xe);
  }]]);
  const Je = Object.assign(_e, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + _e.name, _e);
  } }), Ke = e.defineComponent({ name: "IconRotateRight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-rotate-right`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ye = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var et = r(Ke, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M38 22a1 1 0 0 0-1-1H17a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V22ZM25 11H14a6 6 0 0 0-6 6v6M25.5 12.893 28.413 11 25.5 9.107v3.786Z" }, null, -1)]), 14, Ye);
  }]]);
  const tt = Object.assign(et, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + et.name, et);
  } }), nt = e.defineComponent({ name: "IconShrink", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-shrink`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ot = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var it = r(nt, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M20 44V29c0-.552-.444-1-.996-1H4M28 4v15c0 .552.444 1 .996 1H44" }, null, -1)]), 14, ot);
  }]]);
  const rt = Object.assign(it, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + it.name, it);
  } }), lt = e.defineComponent({ name: "IconSwap", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-swap`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), st = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ct = r(lt, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M5 17h35.586c.89 0 1.337-1.077.707-1.707L33 7M43 31H7.414c-.89 0-1.337 1.077-.707 1.707L15 41" }, null, -1)]), 14, st);
  }]]);
  const at = Object.assign(ct, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ct.name, ct);
  } }), pt = e.defineComponent({ name: "IconToBottom", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-to-bottom`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ut = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var mt = r(pt, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M5 41h38M24 28V5M24 34.04 17.547 27h12.907L24 34.04Zm-.736.803v.001Z" }, null, -1), e.createElementVNode("path", { d: "m24 34 6-7H18l6 7Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, ut);
  }]]);
  const dt = Object.assign(mt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + mt.name, mt);
  } }), kt = e.defineComponent({ name: "IconToLeft", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-to-left`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ft = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var vt = r(kt, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 5v38M20 24h23M20.999 17.547v12.907L13.959 24l7.04-6.453Z" }, null, -1), e.createElementVNode("path", { d: "m14 24 7 6V18l-7 6Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, ft);
  }]]);
  const ht = Object.assign(vt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + vt.name, vt);
  } }), gt = e.defineComponent({ name: "IconToRight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-to-right`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), yt = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var zt = r(gt, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M41 43V5M28 24H5M34.04 24 27 30.453V17.546L34.04 24Zm.803.736h.001Z" }, null, -1), e.createElementVNode("path", { d: "m34 24-7-6v12l7-6Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, yt);
  }]]);
  const Ct = Object.assign(zt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + zt.name, zt);
  } }), St = e.defineComponent({ name: "IconToTop", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-to-top`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), bt = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var wt = r(St, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M43 7H5M24 20v23M24 13.96 30.453 21H17.546L24 13.96Zm.736-.804Z" }, null, -1), e.createElementVNode("path", { d: "m24 14-6 7h12l-6-7Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, bt);
  }]]);
  const jt = Object.assign(wt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + wt.name, wt);
  } }), Lt = e.defineComponent({ name: "IconUpCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-up-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Nt = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var xt = r(Lt, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "24", cy: "24", r: "18" }, null, -1), e.createElementVNode("path", { d: "M15.516 28.485 24 20l8.485 8.485" }, null, -1)]), 14, Nt);
  }]]);
  const Bt = Object.assign(xt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + xt.name, xt);
  } }), $t = e.defineComponent({ name: "IconUp", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-up`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Et = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Mt = r($t, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M39.6 30.557 24.043 15 8.487 30.557" }, null, -1)]), 14, Et);
  }]]);
  const Vt = Object.assign(Mt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Mt.name, Mt);
  } }), It = e.defineComponent({ name: "IconCheckCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-check-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Wt = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Zt = r(It, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm10.207-24.379a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0L22 26.172l-4.878-4.88a1 1 0 0 0-1.415 0l-1.414 1.415a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414 0l11.5-11.5Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Wt);
  }]]);
  const Pt = Object.assign(Zt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Zt.name, Zt);
  } }), qt = e.defineComponent({ name: "IconCloseCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-close-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ot = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ht = r(qt, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm4.955-27.771-4.95 4.95-4.95-4.95a1 1 0 0 0-1.414 0l-1.414 1.414a1 1 0 0 0 0 1.414l4.95 4.95-4.95 4.95a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-4.95-4.95 4.95-4.95a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Ot);
  }]]);
  const Ft = Object.assign(Ht, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ht.name, Ht);
  } }), At = e.defineComponent({ name: "IconExclamationCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-exclamation-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Dt = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Rt = r(At, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-2-11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2Zm4-18a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V15Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Dt);
  }]]);
  const Tt = Object.assign(Rt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Rt.name, Rt);
  } }), Ut = e.defineComponent({ name: "IconExclamationPolygonFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-exclamation-polygon-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Qt = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Gt = r(Ut, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M15.553 4a1 1 0 0 0-.74.327L4.26 15.937a1 1 0 0 0-.26.672V31.39a1 1 0 0 0 .26.673l10.553 11.609a1 1 0 0 0 .74.327h16.893a1 1 0 0 0 .74-.327l10.554-11.61a1 1 0 0 0 .26-.672V16.61a1 1 0 0 0-.26-.673L33.187 4.327a1 1 0 0 0-.74-.327H15.553ZM22 33a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2Zm4-18a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V15Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Qt);
  }]]);
  const Xt = Object.assign(Gt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Gt.name, Gt);
  } }), _t = e.defineComponent({ name: "IconInfoCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-info-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Jt = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Kt = r(_t, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm2-30a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2Zm0 17h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1v-8a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Jt);
  }]]);
  const Yt = Object.assign(Kt, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Kt.name, Kt);
  } }), en = e.defineComponent({ name: "IconMinusCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-minus-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), tn = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var nn = r(en, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-7-22a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H17Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, tn);
  }]]);
  const on = Object.assign(nn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + nn.name, nn);
  } }), rn = e.defineComponent({ name: "IconPlusCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-plus-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ln = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var sn = r(rn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm2-28v6h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-6h-6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h6v-6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, ln);
  }]]);
  const cn = Object.assign(sn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + sn.name, sn);
  } }), an = e.defineComponent({ name: "IconQuestionCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-question-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), pn = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var un = r(an, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-3.862-24.021a.461.461 0 0 0 .462-.462 2.37 2.37 0 0 1 .636-1.615C21.64 17.48 22.43 17 23.988 17c1.465 0 2.483.7 3.002 1.493.555.848.446 1.559.182 1.914-.328.444-.736.853-1.228 1.296-.15.135-.335.296-.533.468-.354.308-.75.654-1.067.955C23.22 24.195 22 25.686 22 28v.013a1 1 0 0 0 1.006.993l2.008-.012a.993.993 0 0 0 .986-1c.002-.683.282-1.19 1.101-1.97.276-.262.523-.477.806-.722.21-.18.439-.379.713-.626.57-.513 1.205-1.13 1.767-1.888 1.516-2.047 1.161-4.634-.05-6.485C29.092 14.398 26.825 13 23.988 13c-2.454 0-4.357.794-5.642 2.137-1.25 1.307-1.742 2.954-1.746 4.37 0 .26.21.472.47.472h3.068Zm1.868 14.029a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V32a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2.008Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, pn);
  }]]);
  const mn = Object.assign(un, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + un.name, un);
  } }), dn = e.defineComponent({ name: "IconCheckCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-check-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), kn = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var fn = r(dn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m15 22 7 7 11.5-11.5M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1)]), 14, kn);
  }]]);
  const vn = Object.assign(fn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + fn.name, fn);
  } }), hn = e.defineComponent({ name: "IconCheckSquare", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-check-square`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), gn = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var yn = r(hn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M34.603 16.672 21.168 30.107l-7.778-7.779M8 41h32a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v32a1 1 0 0 0 1 1Z" }, null, -1)]), 14, gn);
  }]]);
  const zn = Object.assign(yn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + yn.name, yn);
  } }), Cn = e.defineComponent({ name: "IconCheck", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-check`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Sn = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var bn = r(Cn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M41.678 11.05 19.05 33.678 6.322 20.95" }, null, -1)]), 14, Sn);
  }]]);
  const wn = Object.assign(bn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + bn.name, bn);
  } }), jn = e.defineComponent({ name: "IconClockCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-clock-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ln = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Nn = r(jn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 14v10h9.5m8.5 0c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1)]), 14, Ln);
  }]]);
  const xn = Object.assign(Nn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Nn.name, Nn);
  } }), Bn = e.defineComponent({ name: "IconCloseCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-close-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), $n = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var En = r(Bn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m17.643 17.643 6.364 6.364m0 0 6.364 6.364m-6.364-6.364 6.364-6.364m-6.364 6.364-6.364 6.364M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1)]), 14, $n);
  }]]);
  const Mn = Object.assign(En, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + En.name, En);
  } }), Vn = e.defineComponent({ name: "IconClose", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-close`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), In = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Wn = r(Vn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142" }, null, -1)]), 14, In);
  }]]);
  const Zn = Object.assign(Wn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Wn.name, Wn);
  } }), Pn = e.defineComponent({ name: "IconExclamationCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-exclamation-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), qn = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var On = r(Pn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 28V14m0 16v4M6 24c0-9.941 8.059-18 18-18s18 8.059 18 18-8.059 18-18 18S6 33.941 6 24Z" }, null, -1)]), 14, qn);
  }]]);
  const Hn = Object.assign(On, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + On.name, On);
  } }), Fn = e.defineComponent({ name: "IconExclamation", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-exclamation`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), An = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Dn = r(Fn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M23 9h2v21h-2z" }, null, -1), e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "M23 9h2v21h-2z" }, null, -1), e.createElementVNode("path", { d: "M23 37h2v2h-2z" }, null, -1), e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "M23 37h2v2h-2z" }, null, -1)]), 14, An);
  }]]);
  const Rn = Object.assign(Dn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Dn.name, Dn);
  } }), Tn = e.defineComponent({ name: "IconInfoCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-info-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Un = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Qn = r(Tn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 20v14m0-16v-4m18 10c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1)]), 14, Un);
  }]]);
  const Gn = Object.assign(Qn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Qn.name, Qn);
  } }), Xn = e.defineComponent({ name: "IconInfo", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-info`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), _n = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Jn = r(Xn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M25 39h-2V18h2z" }, null, -1), e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "M25 39h-2V18h2z" }, null, -1), e.createElementVNode("path", { d: "M25 11h-2V9h2z" }, null, -1), e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "M25 11h-2V9h2z" }, null, -1)]), 14, _n);
  }]]);
  const Kn = Object.assign(Jn, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Jn.name, Jn);
  } }), Yn = e.defineComponent({ name: "IconMinusCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-minus-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), eo = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var to = r(Yn, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M32 24H16m26 0c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1)]), 14, eo);
  }]]);
  const no = Object.assign(to, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + to.name, to);
  } }), oo = e.defineComponent({ name: "IconMinus", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-minus`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), io = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ro = r(oo, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M5 24h38" }, null, -1)]), 14, io);
  }]]);
  const lo = Object.assign(ro, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ro.name, ro);
  } }), so = e.defineComponent({ name: "IconPlusCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-plus-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), co = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ao = r(so, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M32 24h-8m-8 0h8m0 0v8m0-8v-8m18 8c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1)]), 14, co);
  }]]);
  const po = Object.assign(ao, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ao.name, ao);
  } }), uo = e.defineComponent({ name: "IconPlus", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-plus`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), mo = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ko = r(uo, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M5 24h38M24 5v38" }, null, -1)]), 14, mo);
  }]]);
  const fo = Object.assign(ko, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ko.name, ko);
  } }), vo = e.defineComponent({ name: "IconQuestionCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-question-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ho = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var go = r(vo, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1), e.createElementVNode("path", { d: "M24.006 31v4.008m0-6.008L24 28c0-3 3-4 4.78-6.402C30.558 19.195 28.288 15 23.987 15c-4.014 0-5.382 2.548-5.388 4.514v.465" }, null, -1)]), 14, ho);
  }]]);
  const yo = Object.assign(go, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + go.name, go);
  } }), zo = e.defineComponent({ name: "IconQuestion", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-question`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Co = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var So = r(zo, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13 17c0-5.523 4.925-10 11-10s11 4.477 11 10c0 3.607-2.1 6.767-5.25 8.526C26.857 27.142 24 29.686 24 33v3m0 5h.02v.02H24V41Z" }, null, -1)]), 14, Co);
  }]]);
  const bo = Object.assign(So, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + So.name, So);
  } }), wo = e.defineComponent({ name: "IconStop", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-stop`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), jo = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Lo = r(wo, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M36.728 36.728c7.03-7.03 7.03-18.427 0-25.456-7.03-7.03-18.427-7.03-25.456 0m25.456 25.456c-7.03 7.03-18.427 7.03-25.456 0-7.03-7.03-7.03-18.427 0-25.456m25.456 25.456L11.272 11.272" }, null, -1)]), 14, jo);
  }]]);
  const No = Object.assign(Lo, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Lo.name, Lo);
  } }), xo = e.defineComponent({ name: "IconHeartFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-heart-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Bo = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var $o = r(xo, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 10.541c4.35-4.522 11.405-4.814 15.756-.292 4.35 4.522 4.15 11.365.448 17.135C36.153 33.7 28 41.5 24 42c-4-.5-12.152-8.3-16.204-14.616-3.702-5.77-3.902-12.613.448-17.135C12.595 5.727 19.65 6.019 24 10.54Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Bo);
  }]]);
  const Eo = Object.assign($o, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + $o.name, $o);
  } }), Mo = e.defineComponent({ name: "IconStarFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-star-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Vo = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Io = r(Mo, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M22.683 5.415c.568-1.043 2.065-1.043 2.634 0l5.507 10.098a1.5 1.5 0 0 0 1.04.756l11.306 2.117c1.168.219 1.63 1.642.814 2.505l-7.902 8.359a1.5 1.5 0 0 0-.397 1.223l1.48 11.407c.153 1.177-1.058 2.057-2.131 1.548l-10.391-4.933a1.5 1.5 0 0 0-1.287 0l-10.39 4.933c-1.073.51-2.284-.37-2.131-1.548l1.48-11.407a1.5 1.5 0 0 0-.398-1.223L4.015 20.89c-.816-.863-.353-2.286.814-2.505l11.306-2.117a1.5 1.5 0 0 0 1.04-.756l5.508-10.098Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Vo);
  }]]);
  const Wo = Object.assign(Io, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Io.name, Io);
  } }), Zo = e.defineComponent({ name: "IconThumbDownFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-thumb-down-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Po = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var qo = r(Zo, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M43 5v26h-4V5h4Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M20.9 43.537a2 2 0 0 0 2.83-.364L32.964 31H36V5H12.424a2 2 0 0 0-1.89 1.346L4.838 25.692C3.938 28.29 5.868 31 8.618 31h10.568l-2.421 5.448a4 4 0 0 0 1.184 4.77l2.951 2.32Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Po);
  }]]);
  const Oo = Object.assign(qo, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + qo.name, qo);
  } }), Ho = e.defineComponent({ name: "IconThumbUpFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-thumb-up-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Fo = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ao = r(Ho, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M5 43V17h4v26H5Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M27.1 4.463a2 2 0 0 0-2.83.364L15.036 17H12v26h23.576a2 2 0 0 0 1.89-1.346l5.697-19.346c.899-2.598-1.03-5.308-3.78-5.308h-10.57l2.422-5.448a4 4 0 0 0-1.184-4.77L27.1 4.462Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Fo);
  }]]);
  const Do = Object.assign(Ao, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ao.name, Ao);
  } }), Ro = e.defineComponent({ name: "IconAt", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-at`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), To = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Uo = r(Ro, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M31 23a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm0 0c0 3.038 2.462 6.5 5.5 6.5A5.5 5.5 0 0 0 42 24c0-9.941-8.059-18-18-18S6 14.059 6 24s8.059 18 18 18c4.244 0 8.145-1.469 11.222-3.925" }, null, -1)]), 14, To);
  }]]);
  const Qo = Object.assign(Uo, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Uo.name, Uo);
  } }), Go = e.defineComponent({ name: "IconCloudDownload", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-cloud-download`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Xo = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var _o = r(Go, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M43 22c0-7.732-6.492-14-14.5-14S14 14.268 14 22v.055A9.001 9.001 0 0 0 15 40h13m16.142-5.929-7.07 7.071L30 34.072M37.07 26v15" }, null, -1)]), 14, Xo);
  }]]);
  const Jo = Object.assign(_o, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + _o.name, _o);
  } }), Ko = e.defineComponent({ name: "IconCodeBlock", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-code-block`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Yo = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ei = r(Ko, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M19 6h-4a3 3 0 0 0-3 3v10c0 3-4.343 5-6 5 1.657 0 6 2 6 5v10a3 3 0 0 0 3 3h4M29 6h4a3 3 0 0 1 3 3v10c0 3 4.343 5 6 5-1.657 0-6 2-6 5v10a3 3 0 0 1-3 3h-4" }, null, -1)]), 14, Yo);
  }]]);
  const ti = Object.assign(ei, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ei.name, ei);
  } }), ni = e.defineComponent({ name: "IconCodeSquare", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-code-square`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), oi = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ii = r(ni, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M23.071 17 16 24.071l7.071 7.071m9.001-14.624-4.14 15.454M9 42h30a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v34a1 1 0 0 0 1 1Z" }, null, -1)]), 14, oi);
  }]]);
  const ri = Object.assign(ii, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ii.name, ii);
  } }), li = e.defineComponent({ name: "IconCode", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-code`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), si = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ci = r(li, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M16.734 12.686 5.42 24l11.314 11.314m14.521-22.628L42.57 24 31.255 35.314M27.2 6.28l-6.251 35.453" }, null, -1)]), 14, si);
  }]]);
  const ai = Object.assign(ci, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ci.name, ci);
  } }), pi = e.defineComponent({ name: "IconCustomerService", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-customer-service`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ui = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var mi = r(pi, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M11 31V20c0-7.18 5.82-13 13-13s13 5.82 13 13v8c0 5.784-3.778 10.686-9 12.373m0 0A12.99 12.99 0 0 1 24 41h-3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2.373Zm0 0V41m9-20h3a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-3v-8Zm-26 0H8a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3v-8Z" }, null, -1)]), 14, ui);
  }]]);
  const di = Object.assign(mi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + mi.name, mi);
  } }), ki = e.defineComponent({ name: "IconDownload", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-download`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), fi = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var vi = r(ki, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m33.072 22.071-9.07 9.071-9.072-9.07M24 5v26m16 4v6H8v-6" }, null, -1)]), 14, fi);
  }]]);
  const hi = Object.assign(vi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + vi.name, vi);
  } }), gi = e.defineComponent({ name: "IconExport", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-export`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), yi = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var zi = r(gi, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M31.928 33.072 41 24.002l-9.072-9.072M16.858 24h24M31 41H7V7h24" }, null, -1)]), 14, yi);
  }]]);
  const Ci = Object.assign(zi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + zi.name, zi);
  } }), Si = e.defineComponent({ name: "IconEyeInvisible", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-eye-invisible`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), bi = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var wi = r(Si, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M14 14.5c-2.69 2-5.415 5.33-8 9.5 5.373 8.667 11.373 13 18 13 3.325 0 6.491-1.09 9.5-3.271M17.463 12.5C19 11 21.75 11 24 11c6.627 0 12.627 4.333 18 13-1.766 2.848-3.599 5.228-5.5 7.14" }, null, -1), e.createElementVNode("path", { d: "M29 24a5 5 0 1 1-10 0 5 5 0 0 1 10 0ZM6.852 7.103l34.294 34.294" }, null, -1)]), 14, bi);
  }]]);
  const ji = Object.assign(wi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + wi.name, wi);
  } }), Li = e.defineComponent({ name: "IconEye", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-eye`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ni = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var xi = r(Li, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "clip-rule": "evenodd", d: "M24 37c6.627 0 12.627-4.333 18-13-5.373-8.667-11.373-13-18-13-6.627 0-12.627 4.333-18 13 5.373 8.667 11.373 13 18 13Z" }, null, -1), e.createElementVNode("path", { d: "M29 24a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" }, null, -1)]), 14, Ni);
  }]]);
  const Bi = Object.assign(xi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + xi.name, xi);
  } }), $i = e.defineComponent({ name: "IconHeart", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-heart`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ei = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Mi = r($i, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M38.083 12.912a9.929 9.929 0 0 1 .177 13.878l-.177.18L25.76 39.273c-.972.97-2.548.97-3.52 0L9.917 26.971l-.177-.181a9.929 9.929 0 0 1 .177-13.878c3.889-3.883 10.194-3.883 14.083 0 3.889-3.883 10.194-3.883 14.083 0Z" }, null, -1)]), 14, Ei);
  }]]);
  const Vi = Object.assign(Mi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Mi.name, Mi);
  } }), Ii = e.defineComponent({ name: "IconHistory", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-history`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Wi = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Zi = r(Ii, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 24c0-9.941 8.059-18 18-18s18 8.059 18 18-8.059 18-18 18c-6.26 0-11.775-3.197-15-8.047M6 24l-.5-.757h1L6 24Zm26 2h-9v-9" }, null, -1)]), 14, Wi);
  }]]);
  const Pi = Object.assign(Zi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Zi.name, Zi);
  } }), qi = e.defineComponent({ name: "IconHome", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-home`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Oi = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Hi = r(qi, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 17 24 7l17 10v24H7V17Z" }, null, -1), e.createElementVNode("path", { d: "M20 28h8v13h-8V28Z" }, null, -1)]), 14, Oi);
  }]]);
  const Fi = Object.assign(Hi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Hi.name, Hi);
  } }), Ai = e.defineComponent({ name: "IconImport", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-import`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Di = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ri = r(Ai, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m27.929 33.072-9.071-9.07 9.07-9.072M43 24H19m12 17H7V7h24" }, null, -1)]), 14, Di);
  }]]);
  const Ti = Object.assign(Ri, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ri.name, Ri);
  } }), Ui = e.defineComponent({ name: "IconLaunch", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-launch`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Qi = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Gi = r(Ui, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M41 26v14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h14M19.822 28.178 39.899 8.1M41 20V7H28" }, null, -1)]), 14, Qi);
  }]]);
  const Xi = Object.assign(Gi, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Gi.name, Gi);
  } }), _i = e.defineComponent({ name: "IconList", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-list`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ji = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ki = r(_i, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13 24h30M5 12h4m4 24h30M13 12h30M5 24h4M5 36h4" }, null, -1)]), 14, Ji);
  }]]);
  const Yi = Object.assign(Ki, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ki.name, Ki);
  } }), er = e.defineComponent({ name: "IconMessageBanned", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-message-banned`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), tr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var nr = r(er, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M40.527 20C38.727 12.541 32.01 7 24 7 14.611 7 7 14.611 7 24v17h14m19.364-.636a9 9 0 0 0-12.728-12.728m12.728 12.728a9 9 0 0 1-12.728-12.728m12.728 12.728L27.636 27.636M13 20h12m-12 9h6" }, null, -1)]), 14, tr);
  }]]);
  const or = Object.assign(nr, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + nr.name, nr);
  } }), ir = e.defineComponent({ name: "IconMessage", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-message`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), rr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var lr = r(ir, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M15 20h18m-18 9h9M7 41h17.63C33.67 41 41 33.67 41 24.63V24c0-9.389-7.611-17-17-17S7 14.611 7 24v17Z" }, null, -1)]), 14, rr);
  }]]);
  const sr = Object.assign(lr, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + lr.name, lr);
  } }), cr = e.defineComponent({ name: "IconMoreVertical", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-more-vertical`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ar = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var pr = r(cr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M25 10h-2V8h2v2ZM25 25h-2v-2h2v2ZM25 40h-2v-2h2v2Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M25 10h-2V8h2v2ZM25 25h-2v-2h2v2ZM25 40h-2v-2h2v2Z" }, null, -1)]), 14, ar);
  }]]);
  const ur = Object.assign(pr, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + pr.name, pr);
  } }), mr = e.defineComponent({ name: "IconMore", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-more`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), dr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var kr = r(mr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M38 25v-2h2v2h-2ZM23 25v-2h2v2h-2ZM8 25v-2h2v2H8Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M38 25v-2h2v2h-2ZM23 25v-2h2v2h-2ZM8 25v-2h2v2H8Z" }, null, -1)]), 14, dr);
  }]]);
  const fr = Object.assign(kr, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + kr.name, kr);
  } }), vr = e.defineComponent({ name: "IconPoweroff", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-poweroff`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), hr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var gr = r(vr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M15.5 9.274C10.419 12.214 7 17.708 7 24c0 9.389 7.611 17 17 17s17-7.611 17-17c0-6.292-3.419-11.786-8.5-14.726M24 5v22" }, null, -1)]), 14, hr);
  }]]);
  const yr = Object.assign(gr, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + gr.name, gr);
  } }), zr = e.defineComponent({ name: "IconRefresh", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-refresh`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Cr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Sr = r(zr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M38.837 18C36.463 12.136 30.715 8 24 8 15.163 8 8 15.163 8 24s7.163 16 16 16c7.455 0 13.72-5.1 15.496-12M40 8v10H30" }, null, -1)]), 14, Cr);
  }]]);
  const br = Object.assign(Sr, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Sr.name, Sr);
  } }), wr = e.defineComponent({ name: "IconReply", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-reply`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), jr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Lr = r(wr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m6.642 24.684 14.012 14.947a.2.2 0 0 0 .346-.137v-8.949A23.077 23.077 0 0 1 26 30c6.208 0 11.84 2.459 15.978 6.456a.01.01 0 0 0 .017-.007C42 36.299 42 36.15 42 36c0-10.493-8.506-19-19-19-.675 0-1.342.035-2 .104V8.506a.2.2 0 0 0-.346-.137L6.642 23.316a1 1 0 0 0 0 1.368Z" }, null, -1)]), 14, jr);
  }]]);
  const Nr = Object.assign(Lr, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Lr.name, Lr);
  } }), xr = e.defineComponent({ name: "IconSave", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-save`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Br = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var $r = r(xr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M21 13v9m18 20H9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h22.55a1 1 0 0 1 .748.336l7.45 8.38a1 1 0 0 1 .252.664V41a1 1 0 0 1-1 1ZM14 6h14v15a1 1 0 0 1-1 1H15a1 1 0 0 1-1-1V6Z" }, null, -1)]), 14, Br);
  }]]);
  const Er = Object.assign($r, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + $r.name, $r);
  } }), Mr = e.defineComponent({ name: "IconScan", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-scan`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Vr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ir = r(Mr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 17V7h10m24 10V7H31m10 24v10H31M7 31v10h10M5 24h38" }, null, -1)]), 14, Vr);
  }]]);
  const Wr = Object.assign(Ir, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ir.name, Ir);
  } }), Zr = e.defineComponent({ name: "IconSearch", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-search`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Pr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var qr = r(Zr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M33.072 33.071c6.248-6.248 6.248-16.379 0-22.627-6.249-6.249-16.38-6.249-22.628 0-6.248 6.248-6.248 16.379 0 22.627 6.248 6.248 16.38 6.248 22.628 0Zm0 0 8.485 8.485" }, null, -1)]), 14, Pr);
  }]]);
  const Or = Object.assign(qr, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + qr.name, qr);
  } }), Hr = e.defineComponent({ name: "IconSelectAll", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-select-all`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Fr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ar = r(Hr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m17.314 7.243-7.071 7.07L6 10.072m11.314 10.172-7.071 7.07L6 23.072m11.314 10.172-7.071 7.07L6 36.072M21 11h22M21 25h22M21 39h22" }, null, -1)]), 14, Fr);
  }]]);
  const Dr = Object.assign(Ar, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ar.name, Ar);
  } }), Rr = e.defineComponent({ name: "IconSend", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-send`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Tr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ur = r(Rr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m14 24-7-5V7l34 17L7 41V29l7-5Zm0 0h25", "stroke-miterlimit": "3.864" }, null, -1)]), 14, Tr);
  }]]);
  const Qr = Object.assign(Ur, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ur.name, Ur);
  } }), Gr = e.defineComponent({ name: "IconSettings", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-settings`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Xr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var _r = r(Gr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M18.797 6.732A1 1 0 0 1 19.76 6h8.48a1 1 0 0 1 .964.732l1.285 4.628a1 1 0 0 0 1.213.7l4.651-1.2a1 1 0 0 1 1.116.468l4.24 7.344a1 1 0 0 1-.153 1.2L38.193 23.3a1 1 0 0 0 0 1.402l3.364 3.427a1 1 0 0 1 .153 1.2l-4.24 7.344a1 1 0 0 1-1.116.468l-4.65-1.2a1 1 0 0 0-1.214.7l-1.285 4.628a1 1 0 0 1-.964.732h-8.48a1 1 0 0 1-.963-.732L17.51 36.64a1 1 0 0 0-1.213-.7l-4.65 1.2a1 1 0 0 1-1.116-.468l-4.24-7.344a1 1 0 0 1 .153-1.2L9.809 24.7a1 1 0 0 0 0-1.402l-3.364-3.427a1 1 0 0 1-.153-1.2l4.24-7.344a1 1 0 0 1 1.116-.468l4.65 1.2a1 1 0 0 0 1.213-.7l1.286-4.628Z" }, null, -1), e.createElementVNode("path", { d: "M30 24a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" }, null, -1)]), 14, Xr);
  }]]);
  const Jr = Object.assign(_r, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + _r.name, _r);
  } }), Kr = e.defineComponent({ name: "IconShareAlt", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-share-alt`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Yr = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var el = r(Kr, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M32.442 21.552a4.5 4.5 0 1 1 .065 4.025m-.065-4.025-16.884-8.104m16.884 8.104A4.483 4.483 0 0 0 32 23.5c0 .75.183 1.455.507 2.077m-16.95-12.13a4.5 4.5 0 1 1-8.113-3.895 4.5 4.5 0 0 1 8.114 3.896Zm-.064 20.977A4.5 4.5 0 1 0 11.5 41c3.334-.001 5.503-3.68 3.993-6.578Zm0 0 17.014-8.847" }, null, -1)]), 14, Yr);
  }]]);
  const tl = Object.assign(el, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + el.name, el);
  } }), nl = e.defineComponent({ name: "IconShareExternal", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-share-external`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ol = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var il = r(nl, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M18 20h-7a1 1 0 0 0-1 1v20a1 1 0 0 0 1 1h26a1 1 0 0 0 1-1V21a1 1 0 0 0-1-1h-7m2.368-5.636L24.004 6l-8.364 8.364M24.003 28V6.604", "stroke-miterlimit": "16" }, null, -1)]), 14, ol);
  }]]);
  const rl = Object.assign(il, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + il.name, il);
  } }), ll = e.defineComponent({ name: "IconShareInternal", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-share-internal`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), sl = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var cl = r(ll, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M40 35v6H8v-6m1.108-4c1.29-8.868 13.917-15.85 29.392-15.998M30 6l9 9-9 9" }, null, -1)]), 14, sl);
  }]]);
  const al = Object.assign(cl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + cl.name, cl);
  } }), pl = e.defineComponent({ name: "IconStar", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-star`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ul = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ml = r(pl, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M22.552 6.908a.5.5 0 0 1 .896 0l5.02 10.17a.5.5 0 0 0 .376.274l11.224 1.631a.5.5 0 0 1 .277.853l-8.122 7.916a.5.5 0 0 0-.143.443l1.917 11.178a.5.5 0 0 1-.726.527l-10.038-5.278a.5.5 0 0 0-.466 0L12.73 39.9a.5.5 0 0 1-.726-.527l1.918-11.178a.5.5 0 0 0-.144-.443l-8.122-7.916a.5.5 0 0 1 .278-.853l11.223-1.63a.5.5 0 0 0 .376-.274l5.02-10.17Z" }, null, -1)]), 14, ul);
  }]]);
  const dl = Object.assign(ml, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ml.name, ml);
  } }), kl = e.defineComponent({ name: "IconSync", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-sync`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), fl = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var vl = r(kl, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M11.98 11.703c-6.64 6.64-6.64 17.403 0 24.042a16.922 16.922 0 0 0 8.942 4.7M34.603 37.156l1.414-1.415c6.64-6.639 6.64-17.402 0-24.041A16.922 16.922 0 0 0 27.075 7M14.81 11.982l-1.414-1.414-1.414-1.414h2.829v2.828ZM33.192 36.02l1.414 1.414 1.414 1.415h-2.828V36.02Z" }, null, -1)]), 14, fl);
  }]]);
  const hl = Object.assign(vl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + vl.name, vl);
  } }), gl = e.defineComponent({ name: "IconThumbDown", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-thumb-down`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), yl = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var zl = r(gl, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M41 31V5M5.83 26.394l5.949-18.697A1 1 0 0 1 12.732 7H34v22h-3l-9.403 12.223a1 1 0 0 1-1.386.196l-2.536-1.87a6 6 0 0 1-2.043-6.974L17 29H7.736a2 2 0 0 1-1.906-2.606Z" }, null, -1)]), 14, yl);
  }]]);
  const Cl = Object.assign(zl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + zl.name, zl);
  } }), Sl = e.defineComponent({ name: "IconThumbUp", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-thumb-up`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), bl = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var wl = r(Sl, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 17v26m35.17-21.394-5.948 18.697a1 1 0 0 1-.953.697H14V19h3l9.403-12.223a1 1 0 0 1 1.386-.196l2.535 1.87a6 6 0 0 1 2.044 6.974L31 19h9.265a2 2 0 0 1 1.906 2.606Z" }, null, -1)]), 14, bl);
  }]]);
  const jl = Object.assign(wl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + wl.name, wl);
  } }), Ll = e.defineComponent({ name: "IconTranslate", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-translate`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Nl = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var xl = r(Ll, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42 25c0 9.941-8.059 18-18 18-6.867 0-12.836-3.845-15.87-9.5M28.374 27 25 18h-2l-3.375 9m8.75 0L31 34m-2.625-7h-8.75m0 0L17 34M6 25c0-9.941 8.059-18 18-18 6.867 0 12.836 3.845 15.87 9.5M43 25h-2l1-1 1 1ZM5 25h2l-1 1-1-1Z" }, null, -1)]), 14, Nl);
  }]]);
  const Bl = Object.assign(xl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + xl.name, xl);
  } }), $l = e.defineComponent({ name: "IconUpload", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-upload`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), El = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ml = r($l, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M14.93 17.071 24.001 8l9.071 9.071m-9.07 16.071v-25M40 35v6H8v-6" }, null, -1)]), 14, El);
  }]]);
  const Vl = Object.assign(Ml, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ml.name, Ml);
  } }), Il = e.defineComponent({ name: "IconVoice", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-voice`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Wl = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Zl = r(Il, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M41 21v1c0 8.837-7.163 16-16 16h-2c-8.837 0-16-7.163-16-16v-1m17 17v6m0-14a9 9 0 0 1-9-9v-6a9 9 0 1 1 18 0v6a9 9 0 0 1-9 9Z" }, null, -1)]), 14, Wl);
  }]]);
  const Pl = Object.assign(Zl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Zl.name, Zl);
  } }), ql = e.defineComponent({ name: "IconAlignCenter", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-align-center`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ol = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Hl = r(ql, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M44 9H4m38 20H6m28-10H14m20 20H14" }, null, -1)]), 14, Ol);
  }]]);
  const Fl = Object.assign(Hl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Hl.name, Hl);
  } }), Al = e.defineComponent({ name: "IconAlignLeft", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-align-left`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Dl = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Rl = r(Al, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M44 9H4m36 20H4m21-10H4m21 20H4" }, null, -1)]), 14, Dl);
  }]]);
  const Tl = Object.assign(Rl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Rl.name, Rl);
  } }), Ul = e.defineComponent({ name: "IconAlignRight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-align-right`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ql = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Gl = r(Ul, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M4 9h40M8 29h36M23 19h21M23 39h21" }, null, -1)]), 14, Ql);
  }]]);
  const Xl = Object.assign(Gl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Gl.name, Gl);
  } }), _l = e.defineComponent({ name: "IconAttachment", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-attachment`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Jl = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Kl = r(_l, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M29.037 15.236s-9.174 9.267-11.48 11.594c-2.305 2.327-1.646 4.987-.329 6.316 1.317 1.33 3.994 1.953 6.258-.332L37.32 18.851c3.623-3.657 2.092-8.492 0-10.639-2.093-2.147-6.916-3.657-10.54 0L11.3 23.838c-3.623 3.657-3.953 10.638.329 14.96 4.282 4.322 11.115 4.105 14.821.333 3.706-3.773 8.74-8.822 11.224-11.33" }, null, -1)]), 14, Jl);
  }]]);
  const Yl = Object.assign(Kl, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Kl.name, Kl);
  } }), es = e.defineComponent({ name: "IconBgColors", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-bg-colors`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ts = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ns = r(es, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m9.442 25.25 10.351 10.765a1 1 0 0 0 1.428.014L32 25.25H9.442Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M19 5.25 22.75 9m0 0 12.043 12.043a1 1 0 0 1 0 1.414L32 25.25M22.75 9 8.693 23.057a1 1 0 0 0-.013 1.4l.762.793m0 0 10.351 10.765a1 1 0 0 0 1.428.014L32 25.25m-22.558 0H32M6 42h36" }, null, -1), e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M40.013 29.812 37.201 27l-2.812 2.812a4 4 0 1 0 5.624 0Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, ts);
  }]]);
  const os = Object.assign(ns, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ns.name, ns);
  } }), is = e.defineComponent({ name: "IconBold", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-bold`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), rs = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ls = r(is, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13 24h12a8 8 0 1 0 0-16H13.2a.2.2 0 0 0-.2.2V24Zm0 0h16a8 8 0 1 1 0 16H13.2a.2.2 0 0 1-.2-.2V24Z" }, null, -1)]), 14, rs);
  }]]);
  const ss = Object.assign(ls, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ls.name, ls);
  } }), cs = e.defineComponent({ name: "IconBrush", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-brush`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), as = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ps = r(cs, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M33 13h7a1 1 0 0 1 1 1v12.14a1 1 0 0 1-.85.99l-21.3 3.24a1 1 0 0 0-.85.99V43M33 8v10.002A.998.998 0 0 1 32 19H8a1 1 0 0 1-1-1V8c0-.552.444-1 .997-1H32.01c.552 0 .99.447.99 1Z" }, null, -1)]), 14, as);
  }]]);
  const us = Object.assign(ps, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ps.name, ps);
  } }), ms = e.defineComponent({ name: "IconCopy", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-copy`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ds = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ks = r(ms, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M20 6h18a2 2 0 0 1 2 2v22M8 16v24c0 1.105.891 2 1.996 2h20.007A1.99 1.99 0 0 0 32 40.008V15.997A1.997 1.997 0 0 0 30 14H10a2 2 0 0 0-2 2Z" }, null, -1)]), 14, ds);
  }]]);
  const fs = Object.assign(ks, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ks.name, ks);
  } }), vs = e.defineComponent({ name: "IconDelete", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-delete`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), hs = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var gs = r(vs, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M5 11h5.5m0 0v29a1 1 0 0 0 1 1h25a1 1 0 0 0 1-1V11m-27 0H16m21.5 0H43m-5.5 0H32m-16 0V7h16v4m-16 0h16M20 18v15m8-15v15" }, null, -1)]), 14, hs);
  }]]);
  const ys = Object.assign(gs, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + gs.name, gs);
  } }), zs = e.defineComponent({ name: "IconEdit", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-edit`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Cs = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ss = r(zs, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m30.48 19.038 5.733-5.734a1 1 0 0 0 0-1.414l-5.586-5.586a1 1 0 0 0-1.414 0l-5.734 5.734m7 7L15.763 33.754a1 1 0 0 1-.59.286l-6.048.708a1 1 0 0 1-1.113-1.069l.477-6.31a1 1 0 0 1 .29-.631l14.7-14.7m7 7-7-7M6 42h36" }, null, -1)]), 14, Cs);
  }]]);
  const bs = Object.assign(Ss, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ss.name, Ss);
  } }), ws = e.defineComponent({ name: "IconEraser", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-eraser`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), js = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ls = r(ws, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M25.5 40.503 14.914 40.5a1 1 0 0 1-.707-.293l-9-9a1 1 0 0 1 0-1.414L13.5 21.5m12 19.003L44 40.5m-18.5.003L29 37M13.5 21.5 26.793 8.207a1 1 0 0 1 1.414 0l14.086 14.086a1 1 0 0 1 0 1.414L29 37M13.5 21.5 29 37" }, null, -1)]), 14, js);
  }]]);
  const Ns = Object.assign(Ls, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ls.name, Ls);
  } }), xs = e.defineComponent({ name: "IconFilter", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-filter`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Bs = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var $s = r(xs, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M30 42V22.549a1 1 0 0 1 .463-.844l10.074-6.41A1 1 0 0 0 41 14.45V8a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v6.451a1 1 0 0 0 .463.844l10.074 6.41a1 1 0 0 1 .463.844V37" }, null, -1)]), 14, Bs);
  }]]);
  const Es = Object.assign($s, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + $s.name, $s);
  } }), Ms = e.defineComponent({ name: "IconFindReplace", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-find-replace`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Vs = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Is = r(Ms, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42.353 40.854 36.01 34.51m0 0a9 9 0 0 1-15.364-6.364c0-5 4-9 9-9s9 4 9 9a8.972 8.972 0 0 1-2.636 6.364Zm5.636-26.365h-36m10 16h-10m10 16h-10" }, null, -1)]), 14, Vs);
  }]]);
  const Ws = Object.assign(Is, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Is.name, Is);
  } }), Zs = e.defineComponent({ name: "IconFontColors", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-font-colors`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ps = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var qs = r(Zs, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M9 41h30M16.467 22 11.5 34m20.032-12L24.998 7h-2l-6.532 15h15.065Zm0 0H16.467h15.065Zm0 0L36.5 34l-4.968-12Z" }, null, -1)]), 14, Ps);
  }]]);
  const Os = Object.assign(qs, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + qs.name, qs);
  } }), Hs = e.defineComponent({ name: "IconFormula", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-formula`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Fs = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var As = r(Hs, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M40 8H10a1 1 0 0 0-1 1v.546a1 1 0 0 0 .341.753L24.17 23.273a1 1 0 0 1 .026 1.482l-.195.183L9.343 37.7a1 1 0 0 0-.343.754V39a1 1 0 0 0 1 1h30" }, null, -1)]), 14, Fs);
  }]]);
  const Ds = Object.assign(As, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + As.name, As);
  } }), Rs = e.defineComponent({ name: "IconH1", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-h1`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ts = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Us = r(Rs, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 6v18m0 0v18m0-18h20m0 0V6m0 18v18M40 42V21h-1l-6 3" }, null, -1)]), 14, Ts);
  }]]);
  const Qs = Object.assign(Us, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Us.name, Us);
  } }), Gs = e.defineComponent({ name: "IconH2", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-h2`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Xs = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var _s = r(Gs, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 6v18m0 0v18m0-18h20m0 0V6m0 18v18M44 40H32v-.5l7.5-9c.914-1.117 2.5-3 2.5-5 0-2.485-2.239-4.5-5-4.5s-5 2.515-5 5" }, null, -1)]), 14, Xs);
  }]]);
  const Js = Object.assign(_s, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + _s.name, _s);
  } }), Ks = e.defineComponent({ name: "IconH3", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-h3`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ys = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ec = r(Ks, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 6v18m0 0v18m0-18h20m0 0V6m0 18v18M37.001 30h-2m2 0a5 5 0 0 0 0-10h-.556a4.444 4.444 0 0 0-4.444 4.444m5 5.556a5 5 0 0 1 0 10h-.556a4.444 4.444 0 0 1-4.444-4.444" }, null, -1)]), 14, Ys);
  }]]);
  const tc = Object.assign(ec, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ec.name, ec);
  } }), nc = e.defineComponent({ name: "IconH4", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-h4`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), oc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ic = r(nc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 6v18m0 0v18m0-18h20m0 0V6m0 18v18m14.5-6H31v-1l8-15h1.5v16Zm0 0H44m-3.5 0v6" }, null, -1)]), 14, oc);
  }]]);
  const rc = Object.assign(ic, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ic.name, ic);
  } }), lc = e.defineComponent({ name: "IconH5", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-h5`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), sc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var cc = r(lc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 6v18m0 0v18m0-18h20m0 0V6m0 18v18M43 21H32.5v9h.5s1.5-1 4-1a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5c-2.05 0-4.728-1.234-5.5-3" }, null, -1)]), 14, sc);
  }]]);
  const ac = Object.assign(cc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + cc.name, cc);
  } }), pc = e.defineComponent({ name: "IconH6", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-h6`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), uc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var mc = r(pc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 6v18m0 0v18m0-18h20m0 0V6m0 18v18M32 34.5c0 3.038 2.239 5.5 5 5.5s5-2.462 5-5.5-2.239-5.5-5-5.5-5 2.462-5 5.5Zm0 0v-5.73c0-4.444 3.867-7.677 8-7.263.437.044.736.08.952.115" }, null, -1)]), 14, uc);
  }]]);
  const dc = Object.assign(mc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + mc.name, mc);
  } }), kc = e.defineComponent({ name: "IconH7", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-h7`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), fc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var vc = r(kc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 6v18m0 0v18m0-18h20m0 0V6m0 18v18m4-21h12v1l-4.4 16-1.1 3.5" }, null, -1)]), 14, fc);
  }]]);
  const hc = Object.assign(vc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + vc.name, vc);
  } }), gc = e.defineComponent({ name: "IconHighlight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-highlight`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), yc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var zc = r(gc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M19 18V9.28a1 1 0 0 1 .758-.97l8-2A1 1 0 0 1 29 7.28V18m-10 0h-4a1 1 0 0 0-1 1v8h-4a1 1 0 0 0-1 1v15m10-25h10m0 0h4a1 1 0 0 1 1 1v8h4a1 1 0 0 1 1 1v15" }, null, -1)]), 14, yc);
  }]]);
  const Cc = Object.assign(zc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + zc.name, zc);
  } }), Sc = e.defineComponent({ name: "IconItalic", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-italic`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), bc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var wc = r(Sc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M18 8h9m8 0h-8m0 0-6 32m0 0h-8m8 0h9" }, null, -1)]), 14, bc);
  }]]);
  const jc = Object.assign(wc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + wc.name, wc);
  } }), Lc = e.defineComponent({ name: "IconLineHeight", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-line-height`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Nc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var xc = r(Lc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M4 8h14.5M33 8H18.5m0 0v34" }, null, -1), e.createElementVNode("path", { d: "M39 9.5 37 13h4l-2-3.5ZM39 38.5 37 35h4l-2 3.5Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M39 13h2l-2-3.5-2 3.5h2Zm0 0v22m0 0h2l-2 3.5-2-3.5h2Z" }, null, -1)]), 14, Nc);
  }]]);
  const Bc = Object.assign(xc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + xc.name, xc);
  } }), $c = e.defineComponent({ name: "IconLink", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-link`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ec = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Mc = r($c, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m14.1 25.414-4.95 4.95a6 6 0 0 0 8.486 8.485l8.485-8.485a6 6 0 0 0 0-8.485m7.779.707 4.95-4.95a6 6 0 1 0-8.486-8.485l-8.485 8.485a6 6 0 0 0 0 8.485" }, null, -1)]), 14, Ec);
  }]]);
  const Vc = Object.assign(Mc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Mc.name, Mc);
  } }), Ic = e.defineComponent({ name: "IconObliqueLine", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-oblique-line`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Wc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Zc = r(Ic, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M29.506 6.502 18.493 41.498" }, null, -1)]), 14, Wc);
  }]]);
  const Pc = Object.assign(Zc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Zc.name, Zc);
  } }), qc = e.defineComponent({ name: "IconOrderedList", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-ordered-list`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Oc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Hc = r(qc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13 24h30M13 37h30M13 11h30" }, null, -1), e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M5.578 13.06v1.695h5.041V13.06H9.164V7.555H7.748L5.255 8.968l.763 1.513 1.114-.636v3.215H5.578ZM5.37 26.205v1.49h5.07V26H7.964l.94-.94c.454-.44.783-.86.982-1.258.199-.404.298-.826.298-1.266 0-.686-.224-1.225-.683-1.6-.45-.372-1.093-.55-1.912-.55-.473 0-.933.072-1.38.214a3.63 3.63 0 0 0-1.133.582l-.066.053.652 1.533.113-.085c.263-.199.524-.345.783-.44.266-.094.524-.141.774-.141.309 0 .52.06.652.165.128.1.198.252.198.477 0 .177-.05.356-.154.54l-.001.002c-.099.186-.274.416-.528.69L5.37 26.205ZM10.381 38.344c0-.443-.118-.826-.358-1.145a1.702 1.702 0 0 0-.713-.56 1.652 1.652 0 0 0 .586-.52 1.73 1.73 0 0 0 .307-1.022c0-.404-.108-.763-.327-1.074a2.076 2.076 0 0 0-.918-.71c-.386-.166-.833-.247-1.34-.247-.48 0-.952.071-1.417.213-.459.134-.836.318-1.127.554l-.065.053.652 1.486.11-.076c.275-.193.563-.34.863-.442h.002c.3-.109.581-.162.844-.162.266 0 .454.065.579.18l.004.002c.128.107.198.262.198.48 0 .201-.07.33-.197.412-.138.089-.376.141-.733.141h-1.01v1.626h1.188c.371 0 .614.056.75.15.127.085.2.23.2.463 0 .254-.078.412-.21.503l-.002.002c-.136.097-.386.157-.777.157-.595 0-1.194-.199-1.8-.605l-.11-.073-.65 1.483.064.053c.285.236.662.424 1.127.565h.002c.465.136.95.203 1.456.203.852 0 1.538-.178 2.045-.546.517-.377.777-.896.777-1.544Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Oc);
  }]]);
  const Fc = Object.assign(Hc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Hc.name, Hc);
  } }), Ac = e.defineComponent({ name: "IconOriginalSize", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-original-size`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Dc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Rc = r(Ac, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m5.5 11.5 5-2.5h1v32M34 11.5 39 9h1v32" }, null, -1), e.createElementVNode("path", { d: "M24 17h1v1h-1v-1ZM24 30h1v1h-1v-1Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M24 17h1v1h-1v-1ZM24 30h1v1h-1v-1Z" }, null, -1)]), 14, Dc);
  }]]);
  const Tc = Object.assign(Rc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Rc.name, Rc);
  } }), Uc = e.defineComponent({ name: "IconPaste", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-paste`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Qc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Gc = r(Uc, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("rect", { x: "8", y: "14", width: "24", height: "28", rx: "1" }, null, -1), e.createElementVNode("path", { d: "M24 6h.01v.01H24V6ZM32 6h.01v.01H32V6ZM40 6h.01v.01H40V6ZM40 13h.01v.01H40V13ZM40 21h.01v.01H40V21Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M24 6h.01v.01H24V6ZM32 6h.01v.01H32V6ZM40 6h.01v.01H40V6ZM40 13h.01v.01H40V13ZM40 21h.01v.01H40V21Z" }, null, -1)]), 14, Qc);
  }]]);
  const Xc = Object.assign(Gc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Gc.name, Gc);
  } }), _c = e.defineComponent({ name: "IconQuote", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-quote`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Jc = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Kc = r(_c, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M18.08 33.093a6 6 0 0 1-12 0c-.212-3.593 2.686-6 6-6a6 6 0 0 1 6 6ZM39.08 33.093a6 6 0 0 1-12 0c-.212-3.593 2.686-6 6-6a6 6 0 0 1 6 6Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M6.08 33.093a6 6 0 1 0 6-6c-3.314 0-6.212 2.407-6 6Zm0 0c-.5-8.5 1-25.5 15-24m6 24a6 6 0 1 0 6-6c-3.314 0-6.212 2.407-6 6Zm0 0c-.5-8.5 1-25.5 15-24" }, null, -1)]), 14, Jc);
  }]]);
  const Yc = Object.assign(Kc, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Kc.name, Kc);
  } }), ea = e.defineComponent({ name: "IconRedo", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-redo`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ta = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var na = r(ea, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m32.678 23.78 7.778-7.778-7.778-7.778M39.19 16H18.5C12.149 16 7 21.15 7 27.5 7 33.852 12.149 39 18.5 39H31" }, null, -1)]), 14, ta);
  }]]);
  const oa = Object.assign(na, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + na.name, na);
  } }), ia = e.defineComponent({ name: "IconScissor", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-scissor`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ra = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var la = r(ia, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m40.293 7.707-23.05 23.05m0 0a6 6 0 1 0-8.485 8.485 6 6 0 0 0 8.485-8.485Zm13.514 0a6 6 0 1 0 8.485 8.485 6 6 0 0 0-8.485-8.485Zm0 0L7.707 7.707" }, null, -1)]), 14, ra);
  }]]);
  const sa = Object.assign(la, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + la.name, la);
  } }), ca = e.defineComponent({ name: "IconSortAscending", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-sort-ascending`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), aa = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var pa = r(ca, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M15 6v33.759a.1.1 0 0 1-.17.07L8 33m17-6h10.4v.65L27 39.35V40h11m-1-19L31.4 8h-.8L25 21" }, null, -1)]), 14, aa);
  }]]);
  const ua = Object.assign(pa, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + pa.name, pa);
  } }), ma = e.defineComponent({ name: "IconSortDescending", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-sort-descending`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), da = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ka = r(ma, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M25 27h10.4v.65L27 39.35V40h11m-21.999 2V7.24a.1.1 0 0 0-.17-.07L9 14m28 7L31.4 8h-.8L25 21" }, null, -1)]), 14, da);
  }]]);
  const fa = Object.assign(ka, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ka.name, ka);
  } }), va = e.defineComponent({ name: "IconSort", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-sort`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ha = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ga = r(va, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M43 9H5m0 30h14m15.5-15H5" }, null, -1)]), 14, ha);
  }]]);
  const ya = Object.assign(ga, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ga.name, ga);
  } }), za = e.defineComponent({ name: "IconStrikethrough", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-strikethrough`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ca = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Sa = r(za, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13 32c0 5.246 5.149 9 11.5 9S36 36.746 36 31.5c0-1.708-.5-4.5-3.5-5.695m0 0H43m-10.5 0H5M34 14.5C34 10.358 29.523 7 24 7s-10 3.358-10 7.5c0 1.794 1.6 4.21 3 5.5" }, null, -1)]), 14, Ca);
  }]]);
  const ba = Object.assign(Sa, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Sa.name, Sa);
  } }), wa = e.defineComponent({ name: "IconUnderline", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-underline`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ja = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var La = r(wa, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13 5v17.5C13 27 15.5 33 24 33s11-5 11-10.5V5M9 41h30" }, null, -1)]), 14, ja);
  }]]);
  const Na = Object.assign(La, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + La.name, La);
  } }), xa = e.defineComponent({ name: "IconUndo", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-undo`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ba = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var $a = r(xa, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m15.322 23.78-7.778-7.778 7.778-7.778M8.81 16H29.5C35.851 16 41 21.15 41 27.5 41 33.852 35.851 39 29.5 39H17" }, null, -1)]), 14, Ba);
  }]]);
  const Ea = Object.assign($a, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + $a.name, $a);
  } }), Ma = e.defineComponent({ name: "IconUnorderedList", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-unordered-list`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Va = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ia = r(Ma, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13 24h30M5 11h4m4 26h30M13 11h30M5 24h4M5 37h4" }, null, -1)]), 14, Va);
  }]]);
  const Wa = Object.assign(Ia, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ia.name, Ia);
  } }), Za = e.defineComponent({ name: "IconZoomIn", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-zoom-in`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Pa = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var qa = r(Za, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M32.607 32.607A14.953 14.953 0 0 0 37 22c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 4.142 0 7.892-1.679 10.607-4.393Zm0 0L41.5 41.5M29 22H15m7 7V15" }, null, -1)]), 14, Pa);
  }]]);
  const Oa = Object.assign(qa, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + qa.name, qa);
  } }), Ha = e.defineComponent({ name: "IconZoomOut", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-zoom-out`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Fa = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Aa = r(Ha, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M32.607 32.607A14.953 14.953 0 0 0 37 22c0-8.284-6.716-15-15-15-8.284 0-15 6.716-15 15 0 8.284 6.716 15 15 15 4.142 0 7.892-1.679 10.607-4.393Zm0 0L41.5 41.5M29 22H15" }, null, -1)]), 14, Fa);
  }]]);
  const Da = Object.assign(Aa, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Aa.name, Aa);
  } }), Ra = e.defineComponent({ name: "IconMuteFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-mute-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ta = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ua = r(Ra, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M5.931 13.001A2 2 0 0 0 4 15v18a2 2 0 0 0 2 2h7.37l9.483 6.639A2 2 0 0 0 26 40v-6.93L5.931 13.001ZM35.27 28.199l-3.311-3.313a7.985 7.985 0 0 0-1.96-6.107.525.525 0 0 1 .011-.718l2.122-2.122a.485.485 0 0 1 .7.008c3.125 3.393 3.938 8.15 2.439 12.252ZM41.13 34.059l-2.936-2.937c3.07-5.89 2.226-13.288-2.531-18.348a.513.513 0 0 1 .004-.713l2.122-2.122a.492.492 0 0 1 .703.006c6.322 6.64 7.202 16.56 2.639 24.114ZM26 18.928l-8.688-8.688 5.541-3.878A2 2 0 0 1 26 8v10.928Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "m7.012 4.184 35.272 35.272-2.828 2.828L4.184 7.012l2.828-2.828Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Ta);
  }]]);
  const Qa = Object.assign(Ua, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ua.name, Ua);
  } }), Ga = e.defineComponent({ name: "IconPauseCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-pause-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Xa = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var _a = r(Ga, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-6-27a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V18a1 1 0 0 0-1-1h-3Zm9 0a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V18a1 1 0 0 0-1-1h-3Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Xa);
  }]]);
  const Ja = Object.assign(_a, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + _a.name, _a);
  } }), Ka = e.defineComponent({ name: "IconPlayArrowFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-play-arrow-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ya = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ep = r(Ka, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M17.533 10.974a1 1 0 0 0-1.537.844v24.356a1 1 0 0 0 1.537.844L36.67 24.84a1 1 0 0 0 0-1.688L17.533 10.974Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Ya);
  }]]);
  const tp = Object.assign(ep, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ep.name, ep);
  } }), np = e.defineComponent({ name: "IconPlayCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-play-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), op = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ip = r(np, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M44 24c0 11.046-8.954 20-20 20S4 35.046 4 24 12.954 4 24 4s20 8.954 20 20Zm-23.662-7.783C19.302 15.605 18 16.36 18 17.575v12.85c0 1.214 1.302 1.97 2.338 1.358l10.89-6.425c1.03-.607 1.03-2.11 0-2.716l-10.89-6.425Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, op);
  }]]);
  const rp = Object.assign(ip, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ip.name, ip);
  } }), lp = e.defineComponent({ name: "IconSkipNextFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-skip-next-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), sp = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var cp = r(lp, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13.585 12.145a1 1 0 0 0-1.585.81v22.09a1 1 0 0 0 1.585.81L28.878 24.81a1 1 0 0 0 0-1.622L13.585 12.145Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M33 36a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v22a1 1 0 0 1-1 1h-2Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, sp);
  }]]);
  const ap = Object.assign(cp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + cp.name, cp);
  } }), pp = e.defineComponent({ name: "IconSkipPreviousFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-skip-previous-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), up = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var mp = r(pp, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M34.414 35.855a1 1 0 0 0 1.586-.81v-22.09a1 1 0 0 0-1.586-.81L19.122 23.19a1 1 0 0 0 0 1.622l15.292 11.044Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M15 12a1 1 0 0 1 1 1v22a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1h2Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, up);
  }]]);
  const dp = Object.assign(mp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + mp.name, mp);
  } }), kp = e.defineComponent({ name: "IconSoundFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-sound-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), fp = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var vp = r(kp, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m14 15 10-7v32l-10-7H6V15h8Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M24.924 6.226A2 2 0 0 1 26 8v32a2 2 0 0 1-3.147 1.639L13.37 35H6a2 2 0 0 1-2-2V15a2 2 0 0 1 2-2h7.37l9.483-6.638a2 2 0 0 1 2.07-.136ZM35.314 35.042c6.248-6.249 6.248-16.38 0-22.628l2.828-2.828c7.81 7.81 7.81 20.474 0 28.284l-2.828-2.828Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M29.657 29.728a8 8 0 0 0 0-11.314l2.828-2.828c4.687 4.686 4.687 12.284 0 16.97l-2.828-2.828Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, fp);
  }]]);
  const hp = Object.assign(vp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + vp.name, vp);
  } }), gp = e.defineComponent({ name: "IconBackward", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-backward`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), yp = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var zp = r(gp, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M38.293 36.293 26.707 24.707a1 1 0 0 1 0-1.414l11.586-11.586c.63-.63 1.707-.184 1.707.707v23.172c0 .89-1.077 1.337-1.707.707ZM21 12.414v23.172c0 .89-1.077 1.337-1.707.707L7.707 24.707a1 1 0 0 1 0-1.414l11.586-11.586c.63-.63 1.707-.184 1.707.707Z" }, null, -1)]), 14, yp);
  }]]);
  const Cp = Object.assign(zp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + zp.name, zp);
  } }), Sp = e.defineComponent({ name: "IconForward", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-forward`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), bp = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var wp = r(Sp, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m9.707 11.707 11.586 11.586a1 1 0 0 1 0 1.414L9.707 36.293c-.63.63-1.707.184-1.707-.707V12.414c0-.89 1.077-1.337 1.707-.707ZM27 35.586V12.414c0-.89 1.077-1.337 1.707-.707l11.586 11.586a1 1 0 0 1 0 1.414L28.707 36.293c-.63.63-1.707.184-1.707-.707Z" }, null, -1)]), 14, bp);
  }]]);
  const jp = Object.assign(wp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + wp.name, wp);
  } }), Lp = e.defineComponent({ name: "IconFullscreenExit", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-fullscreen-exit`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Np = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var xp = r(Lp, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M35 6v8a1 1 0 0 0 1 1h8M13 6v8a1 1 0 0 1-1 1H4m31 27v-8a1 1 0 0 1 1-1h8m-31 9v-8a1 1 0 0 0-1-1H4" }, null, -1)]), 14, Np);
  }]]);
  const Bp = Object.assign(xp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + xp.name, xp);
  } }), $p = e.defineComponent({ name: "IconFullscreen", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-fullscreen`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ep = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Mp = r($p, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42 17V9a1 1 0 0 0-1-1h-8M6 17V9a1 1 0 0 1 1-1h8m27 23v8a1 1 0 0 1-1 1h-8M6 31v8a1 1 0 0 0 1 1h8" }, null, -1)]), 14, Ep);
  }]]);
  const Vp = Object.assign(Mp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Mp.name, Mp);
  } }), Ip = e.defineComponent({ name: "IconLiveBroadcast", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-live-broadcast`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Wp = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Zp = r(Ip, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M29 16h12a1 1 0 0 1 1 1v22a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V17a1 1 0 0 1 1-1h12m10 0 8-9m-8 9H19m0 0-8-9m17.281 21.88-6.195 4.475a1 1 0 0 1-1.586-.81v-8.262a1 1 0 0 1 1.521-.853l6.196 3.786a1 1 0 0 1 .064 1.664Z" }, null, -1)]), 14, Wp);
  }]]);
  const Pp = Object.assign(Zp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Zp.name, Zp);
  } }), qp = e.defineComponent({ name: "IconMusic", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-music`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Op = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Hp = r(qp, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M15 37a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm0 0V18.5M41 37a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm0 0V16.5m-26 2V9.926a1 1 0 0 1 .923-.997l24-1.846A1 1 0 0 1 41 8.08v8.42m-26 2 26-2" }, null, -1)]), 14, Op);
  }]]);
  const Fp = Object.assign(Hp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Hp.name, Hp);
  } }), Ap = e.defineComponent({ name: "IconMute", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-mute`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Dp = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Rp = r(Ap, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m19 11.5 4.833-4.35a.1.1 0 0 1 .167.075V17m-14-1H7.1a.1.1 0 0 0-.1.1v15.8a.1.1 0 0 0 .1.1H14l9.833 8.85a.1.1 0 0 0 .167-.075V31m6.071-14.071C32.535 19.393 34 23 32.799 26m2.929-14.728C41.508 17.052 42.5 25 39.123 32M6.5 6.5l35 35" }, null, -1)]), 14, Dp);
  }]]);
  const Tp = Object.assign(Rp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Rp.name, Rp);
  } }), Up = e.defineComponent({ name: "IconPauseCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-pause-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Qp = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Gp = r(Up, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1), e.createElementVNode("path", { d: "M19 19v10h1V19h-1ZM28 19v10h1V19h-1Z" }, null, -1)]), 14, Qp);
  }]]);
  const Xp = Object.assign(Gp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Gp.name, Gp);
  } }), _p = e.defineComponent({ name: "IconPause", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-pause`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Jp = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Kp = r(_p, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M14 12h4v24h-4zM30 12h4v24h-4z" }, null, -1), e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "M14 12h4v24h-4zM30 12h4v24h-4z" }, null, -1)]), 14, Jp);
  }]]);
  const Yp = Object.assign(Kp, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Kp.name, Kp);
  } }), eu = e.defineComponent({ name: "IconPlayArrow", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-play-arrow`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), tu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var nu = r(eu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M12.533 7.965A1 1 0 0 0 11 8.81v30.377a1 1 0 0 0 1.533.846L36.656 24.84a1 1 0 0 0 0-1.692L12.533 7.965Z" }, null, -1)]), 14, tu);
  }]]);
  const ou = Object.assign(nu, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + nu.name, nu);
  } }), iu = e.defineComponent({ name: "IconPlayCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-play-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ru = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var lu = r(iu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 42c9.941 0 18-8.059 18-18S33.941 6 24 6 6 14.059 6 24s8.059 18 18 18Z" }, null, -1), e.createElementVNode("path", { d: "M19 17v14l12-7-12-7Z" }, null, -1)]), 14, ru);
  }]]);
  const su = Object.assign(lu, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + lu.name, lu);
  } }), cu = e.defineComponent({ name: "IconRecordStop", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-record-stop`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), au = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var pu = r(cu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "clip-rule": "evenodd", d: "M24 6c9.941 0 18 8.059 18 18s-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6Z" }, null, -1), e.createElementVNode("path", { d: "M19 20a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-8Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M19 20a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-8Z" }, null, -1)]), 14, au);
  }]]);
  const uu = Object.assign(pu, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + pu.name, pu);
  } }), mu = e.defineComponent({ name: "IconRecord", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-record`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), du = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ku = r(mu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "clip-rule": "evenodd", d: "M24 6c9.941 0 18 8.059 18 18s-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6Z" }, null, -1), e.createElementVNode("path", { d: "M30 24a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M30 24a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" }, null, -1)]), 14, du);
  }]]);
  const fu = Object.assign(ku, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ku.name, ku);
  } }), vu = e.defineComponent({ name: "IconSkipNext", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-skip-next`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), hu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var gu = r(vu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M34 24 10 40V8l24 16Z" }, null, -1), e.createElementVNode("path", { d: "M38 6v36" }, null, -1)]), 14, hu);
  }]]);
  const yu = Object.assign(gu, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + gu.name, gu);
  } }), zu = e.defineComponent({ name: "IconSkipPrevious", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-skip-previous`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Cu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Su = r(zu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m14 24 24 16V8L14 24Z" }, null, -1), e.createElementVNode("path", { d: "M10 6v36" }, null, -1)]), 14, Cu);
  }]]);
  const bu = Object.assign(Su, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Su.name, Su);
  } }), wu = e.defineComponent({ name: "IconSound", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-sound`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ju = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Lu = r(wu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m14 16 10-9v34l-10-9H6V16h8Z" }, null, -1), e.createElementVNode("path", { d: "M31.071 16.929c3.905 3.905 3.905 10.237 0 14.142M36.727 11.272c7.03 7.03 7.03 18.426 0 25.456" }, null, -1)]), 14, ju);
  }]]);
  const Nu = Object.assign(Lu, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Lu.name, Lu);
  } }), xu = e.defineComponent({ name: "IconBytedanceColor", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-bytedance-color`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Bu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var $u = r(xu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M280.416 794.112 128 829.952v-636.32l152.416 35.84z", fill: "#325AB4" }, null, -1), e.createElementVNode("path", { d: "M928 828.48 800 864V160l128 35.52z", fill: "#78E6DC" }, null, -1), e.createElementVNode("path", { d: "M480 798.304 352 832V480l128 33.696z", fill: "#3C8CFF" }, null, -1), e.createElementVNode("path", { d: "M576 449.696 704 416v352l-128-33.696z", fill: "#00C8D2" }, null, -1)]), 14, Bu);
  }]]);
  const Eu = Object.assign($u, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + $u.name, $u);
  } }), Mu = e.defineComponent({ name: "IconLarkColor", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-lark-color`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Vu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Iu = r(Mu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 512 512", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { fill: "#00d6b9", d: "m273.46 264.31 1.01-1.01c.65-.65 1.36-1.36 2.06-2.01l1.41-1.36 4.17-4.12 5.73-5.58 4.88-4.83 4.57-4.52 4.78-4.73 4.37-4.32 6.13-6.03c1.16-1.16 2.36-2.26 3.57-3.37 2.21-2.01 4.52-3.97 6.84-5.88 2.16-1.71 4.37-3.37 6.64-4.98 3.17-2.26 6.43-4.32 9.75-6.33 3.27-1.91 6.64-3.72 10.05-5.43 3.22-1.56 6.54-3.02 9.9-4.32 1.86-.75 3.77-1.41 5.68-2.06.96-.3 1.91-.65 2.92-.96a241.19 241.19 0 0 0-45.6-91.5c-4.17-5.18-10.51-8.19-17.14-8.19H128.97c-1.81 0-3.32 1.46-3.32 3.32 0 1.06.5 2.01 1.36 2.66 60.13 44.09 110 100.75 146.04 166l.4-.45Z" }, null, -1), e.createElementVNode("path", { fill: "#133c9a", d: "M203.43 419.4c90.99 0 170.27-50.22 211.6-124.43 1.46-2.61 2.87-5.23 4.22-7.89a96.374 96.374 0 0 1-6.94 11.41c-.9 1.26-1.81 2.51-2.77 3.77-1.21 1.56-2.41 3.02-3.67 4.47a98.086 98.086 0 0 1-3.07 3.37 85.486 85.486 0 0 1-6.64 6.28c-1.31 1.11-2.56 2.16-3.92 3.17a76.24 76.24 0 0 1-4.78 3.42c-1.01.7-2.06 1.36-3.12 2.01-1.06.65-2.16 1.31-3.32 1.96a91.35 91.35 0 0 1-6.99 3.52c-2.06.9-4.17 1.76-6.28 2.56a82.5 82.5 0 0 1-7.04 2.26 86.613 86.613 0 0 1-10.81 2.31c-2.61.4-5.33.7-7.99.9-2.82.2-5.68.25-8.55.25-3.17-.05-6.33-.25-9.55-.6-2.36-.25-4.73-.6-7.09-1.01-2.06-.35-4.12-.8-6.18-1.31-1.11-.25-2.16-.55-3.27-.85-3.02-.8-6.03-1.66-9.05-2.51-1.51-.45-3.02-.85-4.47-1.31-2.26-.65-4.47-1.36-6.69-2.06-1.81-.55-3.62-1.16-5.43-1.76-1.71-.55-3.47-1.11-5.18-1.71l-3.52-1.21c-1.41-.5-2.87-1.01-4.27-1.51l-3.02-1.11c-2.01-.7-4.02-1.46-5.98-2.21-1.16-.45-2.31-.85-3.47-1.31-1.56-.6-3.07-1.21-4.63-1.81-1.61-.65-3.27-1.31-4.88-1.96l-3.17-1.31-3.92-1.61-3.02-1.26-3.12-1.36-2.71-1.21-2.46-1.11-2.51-1.16-2.56-1.21-3.27-1.51-3.42-1.61c-1.21-.6-2.41-1.16-3.62-1.76l-3.07-1.51A508.746 508.746 0 0 1 65.6 190.35c-1.26-1.31-3.32-1.41-4.68-.15-.65.6-1.06 1.51-1.06 2.41l.1 155.49v12.62c0 7.34 3.62 14.18 9.7 18.25 39.56 26.44 86.12 40.47 133.73 40.37" }, null, -1), e.createElementVNode("path", { fill: "#3370ff", d: "M470.83 200.21c-30.72-15.03-65.86-18.25-98.79-9-1.41.4-2.77.8-4.12 1.21-.96.3-1.91.6-2.92.96-1.91.65-3.82 1.36-5.68 2.06-3.37 1.31-6.64 2.77-9.9 4.32-3.42 1.66-6.79 3.47-10.05 5.38-3.37 1.96-6.59 4.07-9.75 6.33-2.26 1.61-4.47 3.27-6.64 4.98-2.36 1.91-4.63 3.82-6.84 5.88-1.21 1.11-2.36 2.21-3.57 3.37l-6.13 6.03-4.37 4.32-4.78 4.73-4.57 4.52-4.88 4.83-5.68 5.63-4.17 4.12-1.41 1.36c-.65.65-1.36 1.36-2.06 2.01l-1.01 1.01-1.56 1.46-1.76 1.61c-15.13 13.93-32.02 25.84-50.17 35.54l3.27 1.51 2.56 1.21 2.51 1.16 2.46 1.11 2.71 1.21 3.12 1.36 3.02 1.26 3.92 1.61 3.17 1.31c1.61.65 3.27 1.31 4.88 1.96 1.51.6 3.07 1.21 4.63 1.81 1.16.45 2.31.85 3.47 1.31 2.01.75 4.02 1.46 5.98 2.21l3.02 1.11c1.41.5 2.82 1.01 4.27 1.51l3.52 1.21c1.71.55 3.42 1.16 5.18 1.71 1.81.6 3.62 1.16 5.43 1.76 2.21.7 4.47 1.36 6.69 2.06 1.51.45 3.02.9 4.47 1.31 3.02.85 6.03 1.71 9.05 2.51 1.11.3 2.16.55 3.27.85 2.06.5 4.12.9 6.18 1.31 2.36.4 4.73.75 7.09 1.01 3.22.35 6.38.55 9.55.6 2.87.05 5.73-.05 8.55-.25 2.71-.2 5.38-.5 7.99-.9 3.62-.55 7.24-1.36 10.81-2.31 2.36-.65 4.73-1.41 7.04-2.26a75.16 75.16 0 0 0 6.28-2.56 91.35 91.35 0 0 0 6.99-3.52c1.11-.6 2.21-1.26 3.32-1.96 1.11-.65 2.11-1.36 3.12-2.01 1.61-1.11 3.22-2.21 4.78-3.42 1.36-1.01 2.66-2.06 3.92-3.17 2.26-1.96 4.47-4.07 6.59-6.28 1.06-1.11 2.06-2.21 3.07-3.37 1.26-1.46 2.51-2.97 3.67-4.47a73.33 73.33 0 0 0 2.77-3.77c2.51-3.62 4.83-7.39 6.89-11.31l2.36-4.68 21.01-41.88.25-.5c6.94-14.98 16.39-28.45 28-39.97Z" }, null, -1)]), 14, Vu);
  }]]);
  const Wu = Object.assign(Iu, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Iu.name, Iu);
  } }), Zu = e.defineComponent({ name: "IconTiktokColor", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-tiktok-color`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Pu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var qu = r(Zu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createStaticVNode('<path d="M928 310.4v148.8c-8 0-17.6 1.6-27.2 1.6-72 0-139.2-27.2-190.4-70.4v316.8c0 64-20.8 124.8-57.6 172.8-51.2 68.8-134.4 115.2-228.8 115.2-102.4 0-192-54.4-241.6-134.4 51.2 48 120 78.4 195.2 78.4 92.8 0 176-44.8 227.2-115.2 35.2-48 57.6-107.2 57.6-172.8V332.8c51.2 44.8 116.8 70.4 190.4 70.4 9.6 0 17.6 0 27.2-1.6v-96c14.4 3.2 27.2 4.8 41.6 4.8h6.4z" fill="#FF004F"></path><path d="M464 420.8v164.8c-11.2-3.2-24-4.8-35.2-4.8-70.4 0-128 59.2-128 131.2 0 16 3.2 30.4 8 44.8-32-24-54.4-62.4-54.4-105.6 0-72 57.6-131.2 128-131.2 12.8 0 24 1.6 35.2 4.8V419.2h9.6c12.8 0 25.6 0 36.8 1.6zM734.4 192c-28.8-25.6-49.6-60.8-60.8-97.6H712v22.4c3.2 25.6 11.2 51.2 22.4 75.2z" fill="#FF004F"></path><path d="M881.6 307.2v96c-8 1.6-17.6 1.6-27.2 1.6-72 0-139.2-27.2-190.4-70.4v316.8c0 64-20.8 124.8-57.6 172.8-52.8 70.4-134.4 115.2-227.2 115.2-75.2 0-144-30.4-195.2-78.4-27.2-44.8-43.2-96-43.2-152 0-155.2 123.2-281.6 276.8-286.4V528c-11.2-3.2-24-4.8-35.2-4.8-70.4 0-128 59.2-128 131.2 0 43.2 20.8 83.2 54.4 105.6 17.6 49.6 65.6 86.4 120 86.4 70.4 0 128-59.2 128-131.2V94.4h116.8c11.2 38.4 32 72 60.8 97.6 28.8 57.6 83.2 100.8 147.2 115.2z"></path><path d="M417.6 364.8v54.4C264 424 140.8 550.4 140.8 705.6c0 56 16 107.2 43.2 152-54.4-52.8-88-126.4-88-209.6 0-158.4 128-286.4 284.8-286.4 12.8 0 25.6 1.6 36.8 3.2z" fill="#00F7EF"></path><path d="M673.6 94.4H556.8V712c0 72-57.6 131.2-128 131.2-56 0-102.4-35.2-120-86.4 20.8 14.4 46.4 24 73.6 24 70.4 0 128-57.6 128-129.6V32h155.2v3.2c0 6.4 0 12.8 1.6 19.2 0 12.8 3.2 27.2 6.4 40zm208 153.6v57.6c-64-12.8-118.4-56-148.8-113.6 40 36.8 91.2 57.6 148.8 56z" fill="#00F7EF"></path>', 5)]), 14, Pu);
  }]]);
  const Ou = Object.assign(qu, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + qu.name, qu);
  } }), Hu = e.defineComponent({ name: "IconXiguaColor", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-xigua-color`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Fu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Au = r(Hu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M381.968 38.684c-202.85 54.614-351.085 232.757-371.89 446.01C-.326 590.018 28.281 630.328 140.108 668.037c104.026 33.808 176.843 101.425 209.351 189.846 40.31 115.729 44.211 122.23 91.023 144.336 40.31 19.504 58.514 19.504 131.332 7.802 211.951-36.41 362.788-171.642 416.101-374.492C1059.434 368.965 882.59 90.697 605.623 32.183 517.2 13.978 470.39 15.279 381.968 38.684zm176.843 322.48c158.64 74.117 201.55 158.638 119.63 237.957-102.725 97.524-240.56 136.534-291.271 80.62-20.806-23.406-24.707-48.112-24.707-161.24s3.901-137.833 24.707-161.239c32.507-36.409 88.421-35.108 171.641 3.901z", fill: "#FE163E" }, null, -1)]), 14, Fu);
  }]]);
  const Du = Object.assign(Au, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Au.name, Au);
  } }), Ru = e.defineComponent({ name: "IconFaceBookCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-faceBook-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Tu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Uu = r(Ru, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 1C11.29 1 1 11.29 1 24s10.29 23 23 23 23-10.29 23-23S36.71 1 24 1Zm6.172 22.88H26.18v14.404h-5.931V23.88H17.22v-4.962h3.027V15.89c0-3.993 1.695-6.414 6.414-6.414h3.993v4.962h-2.421c-1.815 0-1.936.727-1.936 1.936v2.421h4.478l-.605 5.084h.001Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Tu);
  }]]);
  const Qu = Object.assign(Uu, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Uu.name, Uu);
  } }), Gu = e.defineComponent({ name: "IconFacebookSquareFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-facebook-square-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Xu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var _u = r(Gu, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M43.125 2.475c.6 0 1.2.225 1.688.713.524.487.75 1.012.75 1.612v38.363c0 .6-.263 1.2-.75 1.612-.526.488-1.088.713-1.688.713H32.138V28.913h5.625l.825-6.563h-6.45v-4.275c0-2.137 1.087-3.225 3.3-3.225h3.374V9.263c-1.2-.225-2.85-.338-5.024-.338-2.513 0-4.5.75-6.038 2.25-1.538 1.5-2.288 3.675-2.288 6.375v4.8h-5.625v6.563h5.625v16.575h-20.7c-.6 0-1.2-.225-1.612-.713-.487-.487-.712-1.012-.712-1.612V4.8c0-.6.224-1.2.712-1.612.488-.488 1.012-.713 1.613-.713h38.362Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Xu);
  }]]);
  const Ju = Object.assign(_u, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + _u.name, _u);
  } }), Ku = e.defineComponent({ name: "IconGoogleCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-google-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Yu = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var em = r(Ku, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M32.571 33.526c-2.084 1.92-4.927 3.05-8.322 3.05a12.568 12.568 0 0 1-12.572-12.577A12.58 12.58 0 0 1 24.25 11.416a12.103 12.103 0 0 1 8.414 3.277L29.061 18.3a6.787 6.787 0 0 0-4.807-1.88c-3.277 0-6.045 2.213-7.037 5.186a7.567 7.567 0 0 0-.394 2.392c0 .833.144 1.638.394 2.391.992 2.973 3.763 5.187 7.032 5.187 1.696 0 3.133-.449 4.254-1.202a5.778 5.778 0 0 0 2.513-3.8h-6.767V21.71h11.844c.15.825.227 1.682.227 2.57 0 3.835-1.371 7.055-3.749 9.246ZM24 1A23 23 0 1 0 24 47 23 23 0 0 0 24 1Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Yu);
  }]]);
  const tm = Object.assign(em, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + em.name, em);
  } }), nm = e.defineComponent({ name: "IconQqCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-qq-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), om = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var im = r(nm, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24.007 1C11.281 1 1 11.281 1 24.007c0 13.23 11.216 23.87 24.733 22.936 11.288-.791 20.49-9.994 21.21-21.354C47.877 12.144 37.237 1 24.007 1Zm11.36 29.262s-.79 2.23-2.3 4.242c0 0 2.66.935 2.444 3.236 0 0 .072 2.66-5.68 2.444 0 0-4.026-.287-5.248-2.013h-1.079c-1.222 1.726-5.248 2.013-5.248 2.013-5.752.216-5.68-2.444-5.68-2.444-.216-2.373 2.444-3.236 2.444-3.236-1.51-2.013-2.3-4.241-2.3-4.241-3.596 5.895-3.236-.791-3.236-.791.647-3.955 3.523-6.543 3.523-6.543-.431-3.595 1.078-4.242 1.078-4.242.216-11.072 9.707-10.929 9.922-10.929.216 0 9.707-.215 9.994 10.929 0 0 1.51.647 1.079 4.242 0 0 2.876 2.588 3.523 6.543 0 0 .36 6.686-3.236.79Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, om);
  }]]);
  const rm = Object.assign(im, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + im.name, im);
  } }), lm = e.defineComponent({ name: "IconTwitterCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-twitter-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), sm = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var cm = r(lm, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 1C11.296 1 1 11.297 1 24s10.296 23 23 23c12.703 0 23-10.297 23-23S36.703 1 24 1Zm11.698 18.592c-.13 9.818-6.408 16.542-15.78 16.965-3.864.176-6.664-1.072-9.1-2.62 2.855.456 6.397-.686 8.292-2.307-2.8-.273-4.458-1.698-5.233-3.991.808.14 1.66.103 2.43-.06-2.527-.846-4.331-2.407-4.424-5.68.709.323 1.448.626 2.43.686-1.891-1.075-3.29-5.007-1.688-7.607 2.806 3.076 6.182 5.586 11.724 5.926-1.391-5.949 6.492-9.175 9.791-5.177 1.395-.27 2.53-.799 3.622-1.374-.45 1.381-1.315 2.347-2.37 3.119 1.158-.157 2.184-.44 3.06-.872-.544 1.128-1.732 2.14-2.754 2.992Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, sm);
  }]]);
  const am = Object.assign(cm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + cm.name, cm);
  } }), pm = e.defineComponent({ name: "IconWeiboCircleFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-weibo-circle-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), um = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var mm = r(pm, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 47a23 23 0 1 1 23-23 22.988 22.988 0 0 1-23 23Zm1.276-26.994c-.544.063-2.259 1.171-1.297-1.108C25 15 20.235 15.293 17.874 16.16A23.776 23.776 0 0 0 7.649 27.283c-2.007 6.419 5.018 10.329 10.246 11.123 5.227.795 13.068-.502 16.622-4.85 2.635-3.179 3.137-7.507-1.84-8.761-1.651-.398-.69-1.088-.271-2.259a2.775 2.775 0 0 0-2.175-3.24 2.092 2.092 0 0 0-.335-.042 12.468 12.468 0 0 0-4.62.752Zm7.004-3.889a2.326 2.326 0 0 0-1.903.544c-.377.339-.418 1.338.962 1.652.458.021.913.084 1.36.188a1.836 1.836 0 0 1 1.233 2.07c-.21 1.924.878 2.237 1.652 1.714a1.647 1.647 0 0 0 .627-1.338 4.117 4.117 0 0 0-3.325-4.767c-.042-.008-.61-.063-.606-.063Zm7.423.084a8.408 8.408 0 0 0-6.838-4.6c-1.129-.126-3.512-.397-3.784 1.15a1.17 1.17 0 0 0 .857 1.4c.042 0 .084.022.126.022.523.02 1.048 0 1.568-.063a6.481 6.481 0 0 1 6.524 6.44c0 .3-.02.601-.063.9-.063.355-.105.71-.147 1.066A1.277 1.277 0 0 0 38.93 24a1.255 1.255 0 0 0 1.338-.648c.71-2.373.501-4.926-.585-7.151h.02ZM21.616 36.44c-5.457.69-10.245-1.673-10.684-5.27-.44-3.595 3.575-7.066 9.033-7.756 5.457-.69 10.245 1.672 10.705 5.269.46 3.596-3.617 7.088-9.075 7.757h.021Zm-1.484-10.266a5.181 5.181 0 0 0-5.353 4.913 4.662 4.662 0 0 0 4.935 4.391c.14-.004.28-.017.418-.042a5.503 5.503 0 0 0 5.185-5.143 4.472 4.472 0 0 0-4.746-4.182l-.44.063Zm1.003 4.244a.669.669 0 0 1-.773-.544v-.083a.76.76 0 0 1 .774-.711.642.642 0 0 1 .731.544.076.076 0 0 1 .021.062.807.807 0 0 1-.753.732Zm-2.78 2.781a1.65 1.65 0 0 1-1.861-1.422.266.266 0 0 1-.021-.125 1.844 1.844 0 0 1 1.882-1.736 1.562 1.562 0 0 1 1.819 1.297.46.46 0 0 1 .02.167 1.96 1.96 0 0 1-1.84 1.819Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, um);
  }]]);
  const dm = Object.assign(mm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + mm.name, mm);
  } }), km = e.defineComponent({ name: "IconAlipayCircle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-alipay-circle`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), fm = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var vm = r(km, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M10.8 27.025c-.566.456-1.174 1.122-1.35 1.968-.24 1.156-.05 2.604 1.065 3.739 1.352 1.376 3.405 1.753 4.292 1.818 2.41.174 4.978-1.02 6.913-2.384.759-.535 2.058-1.61 3.3-3.268-2.783-1.437-6.257-3.026-9.97-2.87-1.898.079-3.256.472-4.25.997Zm35.29 6.354A23.872 23.872 0 0 0 48 24C48 10.767 37.234 0 24 0S0 10.767 0 24c0 13.234 10.766 24 24 24 7.987 0 15.07-3.925 19.436-9.943a2688.801 2688.801 0 0 0-15.11-7.467c-1.999 2.277-4.953 4.56-8.29 5.554-2.097.623-3.986.86-5.963.457-1.956-.4-3.397-1.317-4.237-2.235-.428-.469-.92-1.064-1.275-1.773.033.09.056.143.056.143s-.204-.353-.361-.914a4.03 4.03 0 0 1-.157-.85 4.383 4.383 0 0 1-.009-.612 4.409 4.409 0 0 1 .078-1.128c.197-.948.601-2.054 1.649-3.08 2.3-2.251 5.38-2.372 6.976-2.363 2.363.014 6.47 1.048 9.928 2.27.958-2.04 1.573-4.221 1.97-5.676H14.31v-1.555h7.384V15.72h-8.938v-1.555h8.938v-3.108c0-.427.084-.778.777-.778h3.498v3.886h9.717v1.555H25.97v3.11h7.773s-.78 4.35-3.221 8.64c5.416 1.934 13.037 4.914 15.568 5.91Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, fm);
  }]]);
  const hm = Object.assign(vm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + vm.name, vm);
  } }), gm = e.defineComponent({ name: "IconCodeSandbox", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-code-sandbox`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ym = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var zm = r(gm, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m25.002 1.6 17.9 10.3c.6.4 1 1 1 1.7v20.7c0 .7-.4 1.4-1 1.7l-17.9 10.4c-.6.4-1.4.4-2 0l-17.9-10.3c-.6-.4-1-1-1-1.7V13.7c0-.7.4-1.4 1-1.7l17.9-10.4c.6-.4 1.4-.4 2 0Zm13.5 12.4-7.9-4.5-6.6 4.5-6.5-4-7.3 4.3 13.8 8.7 14.5-9Zm-16.5 26.4V26.3l-14-8.9v7.9l8 5.5V37l6 3.4Zm4 0 6-3.5v-5.2l8-5.5v-8.9l-14 8.9v14.2Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, ym);
  }]]);
  const Cm = Object.assign(zm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + zm.name, zm);
  } }), Sm = e.defineComponent({ name: "IconCodepen", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-codepen`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), bm = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var wm = r(Sm, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M45 15.7v17.1L24.5 44.7c-.3.2-.7.2-1 0l-20-11.5c-.3-.2-.5-.5-.5-.9V15.7c0-.4.2-.7.5-.9l20-11.6c.3-.2.7-.2 1 0l20 11.6c.3.2.5.5.5.9ZM26 9v9.8l5.5 3.2 8.5-4.9L26 9Zm-4 0L8 17.1l8.4 4.9 5.6-3.2V9Zm0 21.2L16.5 27 9 31.4 22 39v-8.8Zm17 1.2L31.4 27 26 30.2V39l13-7.6Zm2-3.4v-6l-5 3 5 3Zm-29-3-5-3v6l5-3Zm8 0 4 2 4-2-4-2-4 2Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, bm);
  }]]);
  const jm = Object.assign(wm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + wm.name, wm);
  } }), Lm = e.defineComponent({ name: "IconFacebook", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-facebook`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Nm = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var xm = r(Lm, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M35.184 15.727 34.312 24h-6.613v24h-9.933V24h-4.95v-8.273h4.95v-4.98C17.766 4.016 20.564 0 28.518 0h6.61v8.273H30.99c-3.086 0-3.292 1.166-3.292 3.32v4.134h7.485Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Nm);
  }]]);
  const Bm = Object.assign(xm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + xm.name, xm);
  } }), $m = e.defineComponent({ name: "IconGithub", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-github`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Em = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Mm = r($m, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M.056 24.618c0 10.454 6.7 19.344 16.038 22.608 1.259.32 1.067-.582 1.067-1.19v-4.148c-7.265.853-7.553-3.957-8.043-4.758-.987-1.686-3.312-2.112-2.62-2.912 1.654-.853 3.34.213 5.291 3.1 1.413 2.09 4.166 1.738 5.562 1.385a6.777 6.777 0 0 1 1.856-3.253C11.687 34.112 8.55 29.519 8.55 24.057c0-2.646.874-5.082 2.586-7.045-1.088-3.243.102-6.01.26-6.422 3.11-.282 6.337 2.225 6.587 2.421 1.766-.474 3.782-.73 6.038-.73 2.266 0 4.293.26 6.069.74.603-.458 3.6-2.608 6.49-2.345.155.41 1.317 3.12.294 6.315 1.734 1.968 2.62 4.422 2.62 7.077 0 5.472-3.158 10.07-10.699 11.397a6.82 6.82 0 0 1 2.037 4.875v6.02c.042.48 0 .96.806.96 9.477-3.194 16.299-12.15 16.299-22.697C47.938 11.396 37.218.68 23.996.68 10.77.675.055 11.391.055 24.617l.001.001Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Em);
  }]]);
  const Vm = Object.assign(Mm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Mm.name, Mm);
  } }), Im = e.defineComponent({ name: "IconGitlab", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-gitlab`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Wm = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Zm = r(Im, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M45.53 26.154 39.694 6.289v-.005c-.407-1.227-1.377-1.955-2.587-1.955-1.254 0-2.277.723-2.663 1.885L30.62 17.625H17.4l-3.825-11.41c-.386-1.163-1.41-1.886-2.663-1.886-1.237 0-2.276.792-2.592 1.96l-5.83 19.865a2.047 2.047 0 0 0 .724 2.18l19.741 14.807c.14.193.332.338.557.418l.461.343.455-.343c.263-.091.483-.252.638-.477L44.8 28.33a2.03 2.03 0 0 0 .728-2.175ZM36.84 6.932c.053-.096.155-.102.187-.102.06 0 .134.016.182.161l3.183 10.704H33.24l3.6-10.763Zm-26.11.054c.047-.14.122-.156.181-.156.145 0 .156.006.183.091L14.699 17.7H7.633l3.096-10.714ZM5.076 26.502l1.511-5.213 10.843 14.475-12.354-9.262Zm3.96-6.236h6.54l4.865 15.23-11.406-15.23Zm15.01 17.877-5.743-17.877h11.48l-5.737 17.877Zm8.459-17.877h6.402L27.642 35.31l4.864-15.043Zm-2.18 15.745L41.43 21.187l1.58 5.315-12.685 9.509Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Wm);
  }]]);
  const Pm = Object.assign(Zm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Zm.name, Zm);
  } }), qm = e.defineComponent({ name: "IconGoogle", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-google`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Om = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Hm = r(qm, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M23.997 21.054h19.42a19.46 19.46 0 0 1 .321 3.428c0 3.875-.812 7.335-2.437 10.38-1.625 3.044-3.942 5.424-6.951 7.138-3.01 1.714-6.46 2.572-10.353 2.572-2.803 0-5.473-.54-8.009-1.621-2.535-1.08-4.723-2.54-6.562-4.38-1.84-1.839-3.3-4.026-4.38-6.562A20.223 20.223 0 0 1 3.426 24c0-2.803.54-5.473 1.62-8.009 1.08-2.535 2.54-4.723 4.38-6.562 1.84-1.84 4.027-3.3 6.562-4.38a20.223 20.223 0 0 1 8.01-1.62c5.356 0 9.955 1.794 13.794 5.384l-5.598 5.384c-2.197-2.125-4.929-3.188-8.197-3.188-2.303 0-4.433.58-6.388 1.741a12.83 12.83 0 0 0-4.648 4.728c-1.142 1.99-1.714 4.165-1.714 6.522s.572 4.531 1.714 6.523a12.83 12.83 0 0 0 4.648 4.727c1.955 1.16 4.085 1.741 6.388 1.741 1.554 0 2.982-.214 4.286-.643 1.303-.428 2.375-.964 3.214-1.607a11.63 11.63 0 0 0 2.197-2.196c.625-.822 1.084-1.598 1.38-2.33a9.84 9.84 0 0 0 .602-2.09H23.997v-7.071Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Om);
  }]]);
  const Fm = Object.assign(Hm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Hm.name, Hm);
  } }), Am = e.defineComponent({ name: "IconQqZone", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-qq-zone`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Dm = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Rm = r(Am, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M25.1 3.9c.2.1.4.3.5.5l6.8 10L44 17.8c1.1.3 1.7 1.4 1.4 2.5-.1.2-.2.5-.3.7l-7.4 9.5.4 12c0 1.1-.8 2-1.9 2.1-.2 0-.5 0-.7-.1L24 40.4l-11.3 4.1c-1 .4-2.2-.2-2.6-1.2-.1-.3-.1-.6-.1-.8l.4-12L3 20.9c-.7-.9-.5-2.1.4-2.8.2-.2.4-.3.7-.3l11.6-3.4 6.8-10c.5-.9 1.7-1.1 2.6-.5ZM24 9.1l-5.9 8.7-10.1 3 6.5 8.3-.3 10.5 9.9-3.6 9.9 3.6-.3-10.5 6.5-8.3-10.1-3L24 9.1Zm5 11.5c.8 0 1.5.5 1.8 1.2.3.7.1 1.6-.5 2.1L24 29.6h5c1 0 1.9.9 1.9 1.9 0 1-.9 1.9-1.9 1.9H19c-.8 0-1.5-.5-1.8-1.2-.3-.7-.1-1.6.5-2.1l6.3-5.7h-5c-1 0-1.9-.9-1.9-1.9 0-1 .9-1.9 1.9-1.9h10Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Dm);
  }]]);
  const Tm = Object.assign(Rm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Rm.name, Rm);
  } }), Um = e.defineComponent({ name: "IconQq", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-qq`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Qm = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Gm = r(Um, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7.85 32.825s1.153 3.136 3.264 5.955c0 0-3.779 1.281-3.458 4.61 0 0-.128 3.714 8.069 3.458 0 0 5.764-.45 7.494-2.88h1.52c1.73 2.432 7.494 2.88 7.494 2.88 8.193.256 8.068-3.457 8.068-3.457.318-3.33-3.458-4.611-3.458-4.611 2.11-2.82 3.264-5.955 3.264-5.955 5.122 8.259 4.611-1.154 4.611-1.154-.96-5.57-4.995-9.221-4.995-9.221.576-5.058-1.537-5.955-1.537-5.955C37.742.844 24.26 1.12 23.978 1.126 23.694 1.12 10.21.846 9.767 16.495c0 0-2.113.897-1.537 5.955 0 0-4.034 3.65-4.995 9.221.005 0-.51 9.413 4.615 1.154Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Qm);
  }]]);
  const Xm = Object.assign(Gm, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Gm.name, Gm);
  } }), _m = e.defineComponent({ name: "IconTwitter", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-twitter`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Jm = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Km = r(_m, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M43.277 13.575c0 16.613-10.912 28.575-26.962 29.1-6.788.525-11.438-1.537-15.6-4.65 4.65.525 10.912-1.012 13.987-4.163-4.65 0-7.275-2.625-8.812-6.187h4.162C5.89 26.1 2.74 22.987 2.74 17.812c1.012.525 2.062 1.013 4.162 1.013-3.637-2.063-5.7-8.813-3.112-12.975 4.65 5.175 10.35 9.863 19.762 10.35C20.927 5.85 34.465.6 40.165 7.388c2.625-.525 4.162-1.538 6.187-2.625-.525 2.625-2.062 4.162-4.162 5.175 2.062 0 3.637-.525 5.175-1.538-.488 2.063-2.55 4.162-4.088 5.175Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Jm);
  }]]);
  const Ym = Object.assign(Km, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Km.name, Km);
  } }), ed = e.defineComponent({ name: "IconWechat", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-wechat`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), td = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var nd = r(ed, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M32.09 16.362a14.39 14.39 0 0 0-6.927 1.716 13.087 13.087 0 0 0-5.008 4.676 11.936 11.936 0 0 0-1.856 6.473c.01 1.137.185 2.273.517 3.36h-1.505a26.653 26.653 0 0 1-4.766-.593l-.925-.166-5.665 2.93 1.55-4.848C3.179 26.783 1.018 23.077 1 18.792a11.951 11.951 0 0 1 2.188-6.927 14.943 14.943 0 0 1 5.938-5.027 18.579 18.579 0 0 1 8.248-1.837A18.82 18.82 0 0 1 24.8 6.506a16.863 16.863 0 0 1 5.893 4.128 11.963 11.963 0 0 1 2.992 5.817 17.922 17.922 0 0 0-1.595-.09Zm-20.152-.414a2.167 2.167 0 0 0 1.505-.471c.405-.378.62-.908.593-1.46a1.881 1.881 0 0 0-.592-1.46 2.025 2.025 0 0 0-1.506-.535 2.778 2.778 0 0 0-1.67.535c-.454.323-.728.849-.728 1.401a1.708 1.708 0 0 0 .727 1.523 2.925 2.925 0 0 0 1.671.467ZM47 28.99a9.573 9.573 0 0 1-1.59 5.193c-1.128 1.6-2.52 3-4.129 4.128l1.258 4.129-4.51-2.413h-.243a20.758 20.758 0 0 1-4.6.76 15.538 15.538 0 0 1-7.03-1.59 13.089 13.089 0 0 1-5.008-4.313 10.501 10.501 0 0 1-1.838-5.939 10.29 10.29 0 0 1 1.838-5.92c1.266-1.847 3-3.334 5.008-4.313a15.579 15.579 0 0 1 7.03-1.59 14.919 14.919 0 0 1 6.761 1.59 13.286 13.286 0 0 1 5.09 4.312 10.004 10.004 0 0 1 1.94 5.966H47ZM23.407 11.955a2.77 2.77 0 0 0-1.747.534 1.65 1.65 0 0 0-.76 1.46c-.017.584.27 1.146.76 1.46.498.36 1.1.544 1.716.535a2.083 2.083 0 0 0 1.505-.472c.368-.404.561-.925.534-1.46a1.834 1.834 0 0 0-.534-1.532 1.887 1.887 0 0 0-1.532-.534h.063v.009h-.005Zm5.256 15.03a2.016 2.016 0 0 0 1.46-.498c.332-.288.525-.7.534-1.137a1.612 1.612 0 0 0-.534-1.136 2.062 2.062 0 0 0-1.46-.499 1.58 1.58 0 0 0-1.092.499c-.305.296-.49.71-.498 1.136.009.427.184.84.498 1.137.288.305.679.48 1.092.499Zm8.953 0a2.016 2.016 0 0 0 1.46-.498c.332-.288.525-.7.534-1.137a1.558 1.558 0 0 0-.593-1.136 2.12 2.12 0 0 0-1.401-.499 1.493 1.493 0 0 0-1.092.499c-.305.296-.49.71-.498 1.136.009.427.184.84.498 1.137.279.305.674.49 1.092.499Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, td);
  }]]);
  const od = Object.assign(nd, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + nd.name, nd);
  } }), id = e.defineComponent({ name: "IconWechatpay", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-wechatpay`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), rd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ld = r(id, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M17.514 29.52a1.502 1.502 0 0 1-.715.165c-.608 0-1.104-.33-1.38-.826l-.113-.219-4.357-9.493c-.054-.112-.054-.219-.054-.33 0-.444.331-.774.774-.774.165 0 .33.053.496.165l5.13 3.643c.384.218.827.384 1.323.384.277 0 .55-.054.827-.166l24.058-10.704C39.2 6.288 32.085 2.976 24.026 2.976 10.896 2.976.191 11.861.191 22.837c0 5.958 3.2 11.366 8.22 15.008.383.278.66.774.66 1.27 0 .165-.053.33-.112.496-.384 1.488-1.05 3.92-1.05 4.026a2.025 2.025 0 0 0-.112.608c0 .443.33.774.773.774.165 0 .33-.054.443-.166l5.184-3.034c.384-.219.826-.384 1.27-.384.218 0 .495.053.714.112a27.712 27.712 0 0 0 7.781 1.104c13.13 0 23.835-8.886 23.835-19.862 0-3.312-.992-6.453-2.704-9.216L17.679 29.408l-.165.112Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, rd);
  }]]);
  const sd = Object.assign(ld, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ld.name, ld);
  } }), cd = e.defineComponent({ name: "IconWeibo", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-weibo`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ad = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var pd = r(cd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M31.82 5.6c-1.445.635-1.776 2.144-.727 3.192.515.516.993.608 3.11.608 2.952 0 4.94.781 6.448 2.53 1.84 2.079 2.052 2.714 2.052 6.513 0 3.377 0 3.441.782 3.892 1.812 1.021 3.017-.24 3.44-3.616.544-4.397-2.078-9.531-6.025-11.877-2.595-1.509-7.029-2.116-9.08-1.242Zm-14.831 5.612c-3.376 1.205-6.633 3.524-10.13 7.268-8.288 8.804-7.746 17.186 1.39 21.648 9.494 4.636 22.282 3.1 29.247-3.533 5.216-4.94 4.581-11.16-1.353-13.267-1.058-.358-1.389-.634-1.232-.966.542-1.324.726-2.86.423-3.772-.939-2.86-4.343-3.523-9.403-1.812l-2.024.69.184-2.024c.212-2.383-.303-3.68-1.72-4.398-1.187-.588-3.45-.524-5.382.166Zm8.381 11.666c4.49 1.232 7.231 3.946 7.231 7.176 0 3.588-3.192 6.817-8.38 8.528-2.77.902-7.931 1.086-10.461.396-4.793-1.353-7.507-4.012-7.507-7.416 0-1.867.81-3.496 2.594-5.152 1.656-1.564 2.926-2.318 5.364-3.137 3.689-1.242 7.636-1.389 11.16-.395Zm-9.494 2.925c-3.045 1.417-4.674 3.588-4.674 6.302 0 2.475 1.086 4.159 3.469 5.428 1.84.994 5.216.902 7.268-.147 2.622-1.39 4.342-3.947 4.342-6.45-.028-2.05-1.84-4.489-3.984-5.363-1.72-.736-4.609-.616-6.421.23Zm2.199 5.667c.211.212.358.727.358 1.178 0 1.509-2.53 2.742-3.56 1.72-.57-.57-.423-1.987.24-2.65.662-.662 2.391-.818 2.962-.248Zm14.26-19.688c-1.39 1.39-.451 3.046 1.748 3.046 1.895 0 2.741.966 2.741 3.137 0 1.352.12 1.748.663 2.107 1.628 1.15 2.953-.12 2.953-2.806 0-3.285-2.355-5.76-5.695-5.999-1.509-.12-1.868-.027-2.41.515Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, ad);
  }]]);
  const ud = Object.assign(pd, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + pd.name, pd);
  } }), md = e.defineComponent({ name: "IconChineseFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-chinese-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), dd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var kd = r(md, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M22 21h-5v4.094h5V21ZM26 25.094V21h5v4.094h-5Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4Zm2 13v-5h-4v5h-6.5a2.5 2.5 0 0 0-2.5 2.5v7.094a2.5 2.5 0 0 0 2.5 2.5H22V36h4v-6.906h6.5a2.5 2.5 0 0 0 2.5-2.5V19.5a2.5 2.5 0 0 0-2.5-2.5H26Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, dd);
  }]]);
  const fd = Object.assign(kd, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + kd.name, kd);
  } }), vd = e.defineComponent({ name: "IconEnglishFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-english-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), hd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var gd = r(vd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M23.2 4C12.596 4 4 12.596 4 23.2v1.6C4 35.404 12.596 44 23.2 44h1.6C35.404 44 44 35.404 44 24.8v-1.6C44 12.596 35.404 4 24.8 4h-1.6Zm-9.086 10A2.114 2.114 0 0 0 12 16.114v15.772c0 1.167.947 2.114 2.114 2.114H25v-4h-9v-4h7.778v-4H16v-4h9v-4H14.114ZM32.4 22a5.4 5.4 0 0 0-5.4 5.4V34h4v-6.6a1.4 1.4 0 0 1 2.801 0V34h4v-6.6a5.4 5.4 0 0 0-5.4-5.4Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, hd);
  }]]);
  const yd = Object.assign(gd, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + gd.name, gd);
  } }), zd = e.defineComponent({ name: "IconFaceFrownFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-face-frown-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Cd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Sd = r(zd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm7.322-26.873a2.625 2.625 0 1 1 0 5.25 2.625 2.625 0 0 1 0-5.25Zm-14.646 0a2.625 2.625 0 1 1 0 5.25 2.625 2.625 0 0 1 0-5.25ZM31.68 32.88a1.91 1.91 0 0 1-2.694-.176 6.66 6.66 0 0 0-5.026-2.28c-1.918 0-3.701.81-4.962 2.207a1.91 1.91 0 0 1-2.834-2.559 10.476 10.476 0 0 1 7.796-3.465c3.063 0 5.916 1.321 7.896 3.58a1.909 1.909 0 0 1-.176 2.693Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Cd);
  }]]);
  const bd = Object.assign(Sd, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Sd.name, Sd);
  } }), wd = e.defineComponent({ name: "IconFaceMehFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-face-meh-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), jd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ld = r(wd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm7.321-26.873a2.625 2.625 0 1 1 0 5.25 2.625 2.625 0 0 1 0-5.25Zm-14.646 0a2.625 2.625 0 1 1 0 5.25 2.625 2.625 0 0 1 0-5.25ZM15.999 30a2 2 0 0 1 2-2h12a2 2 0 1 1 0 4H18a2 2 0 0 1-2-2Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, jd);
  }]]);
  const Nd = Object.assign(Ld, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ld.name, Ld);
  } }), xd = e.defineComponent({ name: "IconFaceSmileFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-face-smile-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Bd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var $d = r(xd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm7.321-26.873a2.625 2.625 0 1 1 0 5.25 2.625 2.625 0 0 1 0-5.25Zm-14.646 0a2.625 2.625 0 1 1 0 5.25 2.625 2.625 0 0 1 0-5.25Zm-.355 9.953a1.91 1.91 0 0 1 2.694.177 6.66 6.66 0 0 0 5.026 2.279c1.918 0 3.7-.81 4.961-2.206a1.91 1.91 0 0 1 2.834 2.558 10.476 10.476 0 0 1-7.795 3.466 10.477 10.477 0 0 1-7.897-3.58 1.91 1.91 0 0 1 .177-2.694Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Bd);
  }]]);
  const Ed = Object.assign($d, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + $d.name, $d);
  } }), Md = e.defineComponent({ name: "IconMoonFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-moon-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Vd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Id = r(Md, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42.108 29.769c.124-.387-.258-.736-.645-.613A17.99 17.99 0 0 1 36 30c-9.941 0-18-8.059-18-18 0-1.904.296-3.74.844-5.463.123-.387-.226-.768-.613-.645C10.558 8.334 5 15.518 5 24c0 10.493 8.507 19 19 19 8.482 0 15.666-5.558 18.108-13.231Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Vd);
  }]]);
  const Wd = Object.assign(Id, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Id.name, Id);
  } }), Zd = e.defineComponent({ name: "IconPenFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-pen-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Pd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var qd = r(Zd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "m31.07 8.444 8.485 8.485L19.05 37.435l-8.485-8.485zM33.9 5.615a2 2 0 0 1 2.829 0l5.657 5.657a2 2 0 0 1 0 2.829l-1.415 1.414-8.485-8.486L33.9 5.615ZM17.636 38.85 9.15 30.363l-3.61 10.83a1 1 0 0 0 1.265 1.265l10.83-3.61Z" }, null, -1)]), 14, Pd);
  }]]);
  const Od = Object.assign(qd, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + qd.name, qd);
  } }), Hd = e.defineComponent({ name: "IconSunFill", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-sun-fill`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Fd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ad = r(Hd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "24", cy: "24", r: "9", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M21 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5ZM21 37.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5ZM42.5 21a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5ZM10.5 21a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-5a.5.5 0 0 1 .5-.5h5ZM39.203 34.96a.5.5 0 0 1 0 .707l-3.536 3.536a.5.5 0 0 1-.707 0l-3.535-3.536a.5.5 0 0 1 0-.707l3.535-3.535a.5.5 0 0 1 .707 0l3.536 3.535ZM16.575 12.333a.5.5 0 0 1 0 .707l-3.535 3.535a.5.5 0 0 1-.707 0L8.797 13.04a.5.5 0 0 1 0-.707l3.536-3.536a.5.5 0 0 1 .707 0l3.535 3.536ZM13.04 39.203a.5.5 0 0 1-.707 0l-3.536-3.536a.5.5 0 0 1 0-.707l3.536-3.535a.5.5 0 0 1 .707 0l3.536 3.535a.5.5 0 0 1 0 .707l-3.536 3.536ZM35.668 16.575a.5.5 0 0 1-.708 0l-3.535-3.535a.5.5 0 0 1 0-.707l3.535-3.536a.5.5 0 0 1 .708 0l3.535 3.536a.5.5 0 0 1 0 .707l-3.535 3.535Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Fd);
  }]]);
  const Dd = Object.assign(Ad, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ad.name, Ad);
  } }), Rd = e.defineComponent({ name: "IconApps", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-apps`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Td = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ud = r(Rd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 7h13v13H7zM28 7h13v13H28zM7 28h13v13H7zM28 28h13v13H28z" }, null, -1)]), 14, Td);
  }]]);
  const Qd = Object.assign(Ud, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ud.name, Ud);
  } }), Gd = e.defineComponent({ name: "IconArchive", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-archive`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Xd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var _d = r(Gd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("rect", { x: "9", y: "18", width: "30", height: "22", rx: "1" }, null, -1), e.createElementVNode("path", { d: "M6 9a1 1 0 0 1 1-1h34a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9ZM19 27h10" }, null, -1)]), 14, Xd);
  }]]);
  const Jd = Object.assign(_d, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + _d.name, _d);
  } }), Kd = e.defineComponent({ name: "IconBarChart", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-bar-chart`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Yd = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ek = r(Kd, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", stroke: "currentColor", fill: "none", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M41 7H29v34h12V7ZM29 18H18v23h11V18ZM18 29H7v12h11V29Z" }, null, -1)]), 14, Yd);
  }]]);
  const tk = Object.assign(ek, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ek.name, ek);
  } }), nk = e.defineComponent({ name: "IconBook", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-book`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ok = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ik = r(nk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 13 7 7v28l17 6 17-6V7l-17 6Zm0 0v27.5M29 18l7-2.5M29 25l7-2.5M29 32l7-2.5M19 18l-7-2.5m7 9.5-7-2.5m7 9.5-7-2.5" }, null, -1)]), 14, ok);
  }]]);
  const rk = Object.assign(ik, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ik.name, ik);
  } }), lk = e.defineComponent({ name: "IconBookmark", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-bookmark`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), sk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ck = r(lk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M16 16h16M16 24h8" }, null, -1), e.createElementVNode("path", { d: "M24 41H8V6h32v17" }, null, -1), e.createElementVNode("path", { d: "M30 29h11v13l-5.5-3.5L30 42V29Z" }, null, -1)]), 14, sk);
  }]]);
  const ak = Object.assign(ck, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ck.name, ck);
  } }), pk = e.defineComponent({ name: "IconBranch", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-branch`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), uk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var mk = r(pk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M19 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM38 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM19 38a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM15 15v15m0 3.5V30m0 0c0-5 19-7 19-15" }, null, -1)]), 14, uk);
  }]]);
  const dk = Object.assign(mk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + mk.name, mk);
  } }), kk = e.defineComponent({ name: "IconBug", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-bug`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), fk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var vk = r(kk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 42c-6.075 0-11-4.925-11-11V18h22v13c0 6.075-4.925 11-11 11Zm0 0V23m11 4h8M5 27h8M7 14a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4m0 28v-.5a6.5 6.5 0 0 0-6.5-6.5M7 42v-.5a6.5 6.5 0 0 1 6.5-6.5M17 14a7 7 0 1 1 14 0" }, null, -1)]), 14, fk);
  }]]);
  const hk = Object.assign(vk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + vk.name, vk);
  } }), gk = e.defineComponent({ name: "IconBulb", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-bulb`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), yk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var zk = r(gk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M17 42h14m6-24c0 2.823-.9 5.437-2.43 7.568-1.539 2.147-3.185 4.32-3.77 6.897l-.623 2.756A1 1 0 0 1 29.2 36H18.8a1 1 0 0 1-.976-.779l-.624-2.756c-.584-2.576-2.23-4.75-3.77-6.897A12.94 12.94 0 0 1 11 18c0-7.18 5.82-13 13-13s13 5.82 13 13Z" }, null, -1)]), 14, yk);
  }]]);
  const Ck = Object.assign(zk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + zk.name, zk);
  } }), Sk = e.defineComponent({ name: "IconCalendarClock", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-calendar-clock`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), bk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var wk = r(Sk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 22h34V10a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v30a1 1 0 0 0 1 1h18M34 5v8M14 5v8" }, null, -1), e.createElementVNode("path", { "fill-rule": "evenodd", "clip-rule": "evenodd", d: "M36 44a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm1.5-9.75V29h-3v8.25H42v-3h-4.5Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, bk);
  }]]);
  const jk = Object.assign(wk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + wk.name, wk);
  } }), Lk = e.defineComponent({ name: "IconCalendar", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-calendar`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Nk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var xk = r(Lk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 22h34M14 5v8m20-8v8M8 41h32a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v30a1 1 0 0 0 1 1Z" }, null, -1)]), 14, Nk);
  }]]);
  const Bk = Object.assign(xk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + xk.name, xk);
  } }), $k = e.defineComponent({ name: "IconCamera", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-camera`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ek = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Mk = r($k, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m33 12-1.862-3.724A.5.5 0 0 0 30.691 8H17.309a.5.5 0 0 0-.447.276L15 12m16 14a7 7 0 1 1-14 0 7 7 0 0 1 14 0ZM7 40h34a1 1 0 0 0 1-1V13a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v26a1 1 0 0 0 1 1Z" }, null, -1)]), 14, Ek);
  }]]);
  const Vk = Object.assign(Mk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Mk.name, Mk);
  } }), Ik = e.defineComponent({ name: "IconCloud", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-cloud`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Wk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Zk = r(Ik, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M5 29a9 9 0 0 0 9 9h19c5.523 0 10-4.477 10-10 0-5.312-4.142-9.657-9.373-9.98C32.3 12.833 27.598 9 22 9c-6.606 0-11.965 5.338-12 11.935A9 9 0 0 0 5 29Z" }, null, -1)]), 14, Wk);
  }]]);
  const Pk = Object.assign(Zk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Zk.name, Zk);
  } }), qk = e.defineComponent({ name: "IconCommand", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-command`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ok = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Hk = r(qk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M29 19v-6a6 6 0 1 1 6 6h-6Zm0 0v10m0-10H19m10 10v6a6 6 0 1 0 6-6h-6Zm0 0H19m0-10v10m0-10v-6a6 6 0 1 0-6 6h6Zm0 10v6a6 6 0 1 1-6-6h6Z" }, null, -1)]), 14, Ok);
  }]]);
  const Fk = Object.assign(Hk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Hk.name, Hk);
  } }), Ak = e.defineComponent({ name: "IconCommon", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-common`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Dk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Rk = r(Ak, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 23 7.652 14.345M24 23l16.366-8.664M24 23v19.438M7 14v20l17 9 17-9V14L24 5 7 14Z" }, null, -1)]), 14, Dk);
  }]]);
  const Tk = Object.assign(Rk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Rk.name, Rk);
  } }), Uk = e.defineComponent({ name: "IconCompass", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-compass`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Qk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Gk = r(Uk, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1), e.createElementVNode("path", { d: "m21.177 21.183 10.108-4.717a.2.2 0 0 1 .266.265L26.834 26.84l-10.109 4.717a.2.2 0 0 1-.266-.266l4.718-10.108Z" }, null, -1)]), 14, Qk);
  }]]);
  const Xk = Object.assign(Gk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Gk.name, Gk);
  } }), _k = e.defineComponent({ name: "IconComputer", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-computer`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Jk = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Kk = r(_k, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M41 7H7v22h34V7Z" }, null, -1), e.createElementVNode("path", { d: "M23.778 29v10" }, null, -1), e.createElementVNode("path", { d: "M16 39h16" }, null, -1), e.createElementVNode("path", { d: "m20.243 14.657 5.657 5.657M15.414 22.314l7.071-7.071M24.485 21.728l7.071-7.071" }, null, -1)]), 14, Jk);
  }]]);
  const Yk = Object.assign(Kk, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Kk.name, Kk);
  } }), ef = e.defineComponent({ name: "IconCopyright", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-copyright`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), tf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var nf = r(ef, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M29.292 18a8 8 0 1 0 0 12M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1)]), 14, tf);
  }]]);
  const of = Object.assign(nf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + nf.name, nf);
  } }), rf = e.defineComponent({ name: "IconDashboard", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-dashboard`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), lf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var sf = r(rf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M41.808 24c.118 4.63-1.486 9.333-5.21 13m5.21-13h-8.309m8.309 0c-.112-4.38-1.767-8.694-4.627-12M24 6c5.531 0 10.07 2.404 13.18 6M24 6c-5.724 0-10.384 2.574-13.5 6.38M24 6v7.5M37.18 12 31 17.5m-20.5-5.12L17 17.5m-6.5-5.12C6.99 16.662 5.44 22.508 6.53 28m4.872 9c-2.65-2.609-4.226-5.742-4.873-9m0 0 8.97-3.5" }, null, -1), e.createElementVNode("path", { d: "M24 32a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 0V19" }, null, -1)]), 14, lf);
  }]]);
  const cf = Object.assign(sf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + sf.name, sf);
  } }), af = e.defineComponent({ name: "IconDesktop", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-desktop`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), pf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var uf = r(af, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 32v8m0 0h-9m9 0h9M7 32h34a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v22a1 1 0 0 0 1 1Z" }, null, -1)]), 14, pf);
  }]]);
  const mf = Object.assign(uf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + uf.name, uf);
  } }), df = e.defineComponent({ name: "IconDice", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-dice`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), kf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ff = r(df, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createStaticVNode('<rect x="6.998" y="7" width="34" height="34" rx="1.5"></rect><circle cx="16" cy="16" r="2"></circle><circle cx="24" cy="24" r="2"></circle><circle cx="16" cy="32" r="2"></circle><circle cx="32" cy="16" r="2"></circle><circle cx="32" cy="32" r="2"></circle><circle cx="16" cy="16" r="2" fill="currentColor" stroke="none"></circle><circle cx="24" cy="24" r="2" fill="currentColor" stroke="none"></circle><circle cx="16" cy="32" r="2" fill="currentColor" stroke="none"></circle><circle cx="32" cy="16" r="2" fill="currentColor" stroke="none"></circle><circle cx="32" cy="32" r="2" fill="currentColor" stroke="none"></circle>', 11)]), 14, kf);
  }]]);
  const vf = Object.assign(ff, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ff.name, ff);
  } }), hf = e.defineComponent({ name: "IconDragDotVertical", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-drag-dot-vertical`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), gf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var yf = r(hf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M17 8h2v2h-2V8ZM17 23h2v2h-2v-2ZM17 38h2v2h-2v-2ZM29 8h2v2h-2V8ZM29 23h2v2h-2v-2ZM29 38h2v2h-2v-2Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M17 8h2v2h-2V8ZM17 23h2v2h-2v-2ZM17 38h2v2h-2v-2ZM29 8h2v2h-2V8ZM29 23h2v2h-2v-2ZM29 38h2v2h-2v-2Z" }, null, -1)]), 14, gf);
  }]]);
  const zf = Object.assign(yf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + yf.name, yf);
  } }), Cf = e.defineComponent({ name: "IconDragDot", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-drag-dot`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Sf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var bf = r(Cf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M40 17v2h-2v-2h2ZM25 17v2h-2v-2h2ZM10 17v2H8v-2h2ZM40 29v2h-2v-2h2ZM25 29v2h-2v-2h2ZM10 29v2H8v-2h2Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M40 17v2h-2v-2h2ZM25 17v2h-2v-2h2ZM10 17v2H8v-2h2ZM40 29v2h-2v-2h2ZM25 29v2h-2v-2h2ZM10 29v2H8v-2h2Z" }, null, -1)]), 14, Sf);
  }]]);
  const wf = Object.assign(bf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + bf.name, bf);
  } }), jf = e.defineComponent({ name: "IconDriveFile", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-drive-file`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Lf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Nf = r(jf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M38.5 17H29a1 1 0 0 1-1-1V6.5m0-.5H10a1 1 0 0 0-1 1v34a1 1 0 0 0 1 1h28a1 1 0 0 0 1-1V17L28 6Z" }, null, -1)]), 14, Lf);
  }]]);
  const xf = Object.assign(Nf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Nf.name, Nf);
  } }), Bf = e.defineComponent({ name: "IconEar", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-ear`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), $f = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ef = r(Bf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13 15.528C14.32 12.386 18.403 6.977 23.556 7c7.944.036 14.514 8.528 10.116 15.71-4.399 7.181-5.718 10.323-6.598 14.363-.82 3.766-9.288 7.143-11.498-1.515M20 18.5c1-3.083 4.5-4.5 6.5-2 2.85 3.562-3.503 8.312-5.5 12.5" }, null, -1)]), 14, $f);
  }]]);
  const Mf = Object.assign(Ef, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ef.name, Ef);
  } }), Vf = e.defineComponent({ name: "IconEmail", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-email`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), If = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Wf = r(Vf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("rect", { x: "6", y: "8", width: "36", height: "32", rx: "1" }, null, -1), e.createElementVNode("path", { d: "m37 17-12.43 8.606a1 1 0 0 1-1.14 0L11 17" }, null, -1)]), 14, If);
  }]]);
  const Zf = Object.assign(Wf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Wf.name, Wf);
  } }), Pf = e.defineComponent({ name: "IconEmpty", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-empty`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), qf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Of = r(Pf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 5v6m7 1 4-4m-18 4-4-4m28.5 22H28s-1 3-4 3-4-3-4-3H6.5M40 41H8a2 2 0 0 1-2-2v-8.46a2 2 0 0 1 .272-1.007l6.15-10.54A2 2 0 0 1 14.148 18H33.85a2 2 0 0 1 1.728.992l6.149 10.541A2 2 0 0 1 42 30.541V39a2 2 0 0 1-2 2Z" }, null, -1)]), 14, qf);
  }]]);
  const Hf = Object.assign(Of, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Of.name, Of);
  } }), Ff = e.defineComponent({ name: "IconExperiment", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-experiment`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Af = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Df = r(Ff, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M10.5 7h6m0 0v10.5l-5.25 14M16.5 7h15m0 0h6m-6 0v10.5L37 32.167M11.25 31.5l-2.344 6.853A2 2 0 0 0 10.8 41h26.758a2 2 0 0 0 1.86-2.737L37 32.167M11.25 31.5c1.916 1.833 7.05 4.4 12.25 0s11.166-1.389 13.5.667M26 22.5v.01" }, null, -1)]), 14, Af);
  }]]);
  const Rf = Object.assign(Df, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Df.name, Df);
  } }), Tf = e.defineComponent({ name: "IconFileAudio", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-file-audio`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Uf = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Qf = r(Tf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M37 42H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2Z" }, null, -1), e.createElementVNode("path", { d: "M25 30a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M25 30a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm0 0-.951-12.363a.5.5 0 0 1 .58-.532L30 18" }, null, -1)]), 14, Uf);
  }]]);
  const Gf = Object.assign(Qf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Qf.name, Qf);
  } }), Xf = e.defineComponent({ name: "IconFileImage", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-file-image`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), _f = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Jf = r(Xf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m26 33 5-6v6h-5Zm0 0-3-4-4 4h7Zm11 9H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2ZM17 19h1v1h-1v-1Z" }, null, -1)]), 14, _f);
  }]]);
  const Kf = Object.assign(Jf, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Jf.name, Jf);
  } }), Yf = e.defineComponent({ name: "IconFilePdf", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-file-pdf`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ev = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var tv = r(Yf, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M11 42h26a2 2 0 0 0 2-2V13.828a2 2 0 0 0-.586-1.414l-5.828-5.828A2 2 0 0 0 31.172 6H11a2 2 0 0 0-2 2v32a2 2 0 0 0 2 2Z" }, null, -1), e.createElementVNode("path", { d: "M22.305 21.028c.874 1.939 3.506 6.265 4.903 8.055 1.747 2.237 3.494 2.685 4.368 2.237.873-.447 1.21-4.548-7.425-2.685-7.523 1.623-7.424 3.58-6.988 4.476.728 1.193 2.522 2.627 5.678-6.266C25.699 18.79 24.489 17 23.277 17c-1.409 0-2.538.805-.972 4.028Z" }, null, -1)]), 14, ev);
  }]]);
  const nv = Object.assign(tv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + tv.name, tv);
  } }), ov = e.defineComponent({ name: "IconFileVideo", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-file-video`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), iv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var rv = r(ov, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M37 42H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2Z" }, null, -1), e.createElementVNode("path", { d: "M22 27.796v-6l5 3-5 3Z" }, null, -1)]), 14, iv);
  }]]);
  const lv = Object.assign(rv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + rv.name, rv);
  } }), sv = e.defineComponent({ name: "IconFile", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-file`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), cv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var av = r(sv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M16 21h16m-16 8h10m11 13H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2Z" }, null, -1)]), 14, cv);
  }]]);
  const pv = Object.assign(av, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + av.name, av);
  } }), uv = e.defineComponent({ name: "IconFire", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-fire`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), mv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var dv = r(uv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M17.577 27.477C20.022 22.579 17.041 12.98 24.546 6c0 0-1.156 15.55 5.36 17.181 2.145.537 2.68-5.369 4.289-8.59 0 0 .536 4.832 2.68 8.59 3.217 7.517-1 14.117-5.896 17.182-4.289 2.684-14.587 2.807-19.835-5.37-4.824-7.516 0-15.57 0-15.57s4.289 12.35 6.433 8.054Z" }, null, -1)]), 14, mv);
  }]]);
  const kv = Object.assign(dv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + dv.name, dv);
  } }), fv = e.defineComponent({ name: "IconFolderAdd", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-folder-add`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), vv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var hv = r(fv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 19v14m-7-7h14M6 13h18l-2.527-3.557a1.077 1.077 0 0 0-.88-.443H7.06C6.474 9 6 9.448 6 10v3Zm0 0h33.882c1.17 0 2.118.895 2.118 2v21c0 1.105-.948 3-2.118 3H8.118C6.948 39 6 38.105 6 37V13Z" }, null, -1)]), 14, vv);
  }]]);
  const gv = Object.assign(hv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + hv.name, hv);
  } }), yv = e.defineComponent({ name: "IconFolderDelete", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-folder-delete`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), zv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Cv = r(yv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M17 26h14M6 13h18l-2.527-3.557a1.077 1.077 0 0 0-.88-.443H7.06C6.474 9 6 9.448 6 10v3Zm0 0h33.882c1.17 0 2.118.895 2.118 2v21c0 1.105-.948 3-2.118 3H8.118C6.948 39 6 38.105 6 37V13Z" }, null, -1)]), 14, zv);
  }]]);
  const Sv = Object.assign(Cv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Cv.name, Cv);
  } }), bv = e.defineComponent({ name: "IconFolder", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-folder`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), wv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var jv = r(bv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 13h18l-2.527-3.557a1.077 1.077 0 0 0-.88-.443H7.06C6.474 9 6 9.448 6 10v3Zm0 0h33.882c1.17 0 2.118.895 2.118 2v21c0 1.105-.948 3-2.118 3H8.118C6.948 39 6 38.105 6 37V13Z" }, null, -1)]), 14, wv);
  }]]);
  const Lv = Object.assign(jv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + jv.name, jv);
  } }), Nv = e.defineComponent({ name: "IconGift", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-gift`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), xv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Bv = r(Nv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M13.45 14.043H8a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h32a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-4.893m-21.657 0c-1.036-2.833-.615-5.6 1.182-6.637 2.152-1.243 5.464.464 7.397 3.812.539.933.914 1.896 1.127 2.825m-9.706 0h9.706m0 0H25.4m0 0a10.31 10.31 0 0 1 1.128-2.825c1.933-3.348 5.244-5.055 7.397-3.812 1.797 1.037 2.217 3.804 1.182 6.637m-9.707 0h9.707M10 26.043a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2v-13Z" }, null, -1)]), 14, xv);
  }]]);
  const $v = Object.assign(Bv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Bv.name, Bv);
  } }), Ev = e.defineComponent({ name: "IconIdcard", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-idcard`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Mv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Vv = r(Ev, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M11 17h9m-9 7h9m-9 7h5m-8 9h32a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v28a2 2 0 0 0 2 2Z" }, null, -1), e.createElementVNode("path", { d: "M36 33a7 7 0 1 0-14 0" }, null, -1), e.createElementVNode("circle", { cx: "29", cy: "20", r: "4" }, null, -1)]), 14, Mv);
  }]]);
  const Iv = Object.assign(Vv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Vv.name, Vv);
  } }), Wv = e.defineComponent({ name: "IconImageClose", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-image-close`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Zv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Pv = r(Wv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createStaticVNode('<path d="M41 26V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v30a2 2 0 0 0 2 2h17"></path><path d="m24 33 9-8.5V27s-2 1-3.5 2.5C27.841 31.159 27 33 27 33h-3Zm0 0-3.5-4.5L17 33h7Z"></path><path d="M20.5 28.5 17 33h7l-3.5-4.5ZM33 24.5 24 33h3s.841-1.841 2.5-3.5C31 28 33 27 33 27v-2.5Z" fill="currentColor" stroke="none"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M46 38a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-4.95-4.782 1.74 1.74-3.045 3.046 3.046 3.046-1.74 1.74-3.047-3.045-3.046 3.046-1.74-1.74 3.046-3.047-3.046-3.046 1.74-1.74 3.046 3.046 3.046-3.046Z" fill="currentColor" stroke="none"></path><path d="M17 15h-2v2h2v-2Z"></path>', 5)]), 14, Zv);
  }]]);
  const qv = Object.assign(Pv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Pv.name, Pv);
  } }), Ov = e.defineComponent({ name: "IconImage", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-image`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Hv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Fv = r(Ov, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m24 33 9-9v9h-9Zm0 0-3.5-4.5L17 33h7Zm15 8H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h30a2 2 0 0 1 2 2v30a2 2 0 0 1-2 2ZM15 15h2v2h-2v-2Z" }, null, -1), e.createElementVNode("path", { d: "M33 33v-9l-9 9h9ZM23.5 33l-3-4-3 4h6ZM15 15h2v2h-2z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Hv);
  }]]);
  const Av = Object.assign(Fv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Fv.name, Fv);
  } }), Dv = e.defineComponent({ name: "IconInteraction", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-interaction`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Rv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Tv = r(Dv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M8 19h16m16 0H24m0 0v23m14 0H10a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v32a2 2 0 0 1-2 2Z" }, null, -1)]), 14, Rv);
  }]]);
  const Uv = Object.assign(Tv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Tv.name, Tv);
  } }), Qv = e.defineComponent({ name: "IconLanguage", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-language`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Gv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Xv = r(Qv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m42 43-2.385-6M26 43l2.384-6m11.231 0-.795-2-4.18-10h-1.28l-4.181 10-.795 2m11.231 0h-11.23M17 5l1 5M5 11h26M11 11s1.889 7.826 6.611 12.174C22.333 27.522 30 31 30 31" }, null, -1), e.createElementVNode("path", { d: "M25 11s-1.889 7.826-6.611 12.174C13.667 27.522 6 31 6 31" }, null, -1)]), 14, Gv);
  }]]);
  const _v = Object.assign(Xv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Xv.name, Xv);
  } }), Jv = e.defineComponent({ name: "IconLayers", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-layers`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Kv = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Yv = r(Jv, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24.015 7.017 41 14.62l-16.985 7.605L7.03 14.62l16.985-7.604Z" }, null, -1), e.createElementVNode("path", { d: "m41 23.255-16.985 7.604L7.03 23.255M40.97 33.412l-16.985 7.605L7 33.412" }, null, -1)]), 14, Kv);
  }]]);
  const eh = Object.assign(Yv, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Yv.name, Yv);
  } }), th = e.defineComponent({ name: "IconLayout", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-layout`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), nh = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var oh = r(th, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M19 40V8m23 2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v28a2 2 0 0 0 2 2h32a2 2 0 0 0 2-2V10Z" }, null, -1)]), 14, nh);
  }]]);
  const ih = Object.assign(oh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + oh.name, oh);
  } }), rh = e.defineComponent({ name: "IconLoading", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-loading`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), lh = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var sh = r(rh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6" }, null, -1)]), 14, lh);
  }]]);
  const ch = Object.assign(sh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + sh.name, sh);
  } }), ah = e.defineComponent({ name: "IconLocation", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-location`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ph = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var uh = r(ah, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "24", cy: "19", r: "5" }, null, -1), e.createElementVNode("path", { d: "M39 20.405C39 28.914 24 43 24 43S9 28.914 9 20.405C9 11.897 15.716 5 24 5c8.284 0 15 6.897 15 15.405Z" }, null, -1)]), 14, ph);
  }]]);
  const mh = Object.assign(uh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + uh.name, uh);
  } }), dh = e.defineComponent({ name: "IconLock", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-lock`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), kh = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var fh = r(dh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("rect", { x: "7", y: "21", width: "34", height: "20", rx: "1" }, null, -1), e.createElementVNode("path", { d: "M15 21v-6a9 9 0 1 1 18 0v6M24 35v-8" }, null, -1)]), 14, kh);
  }]]);
  const vh = Object.assign(fh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + fh.name, fh);
  } }), hh = e.defineComponent({ name: "IconLoop", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-loop`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), gh = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var yh = r(hh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 38c-7.732 0-14-6.268-14-14 0-3.815 1.526-7.273 4-9.798M24 10c7.732 0 14 6.268 14 14 0 3.815-1.526 7.273-4 9.798M24 7v6l-4-3 4-3Zm0 33v-6l4 3-4 3Z" }, null, -1)]), 14, gh);
  }]]);
  const zh = Object.assign(yh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + yh.name, yh);
  } }), Ch = e.defineComponent({ name: "IconMan", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-man`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Sh = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var bh = r(Ch, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M40 8 29.68 18.321M31 8h9v9m-7 10c0 7.18-5.82 13-13 13S7 34.18 7 27s5.82-13 13-13 13 5.82 13 13Z" }, null, -1)]), 14, Sh);
  }]]);
  const wh = Object.assign(bh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + bh.name, bh);
  } }), jh = e.defineComponent({ name: "IconMenu", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-menu`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Lh = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Nh = r(jh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M5 10h38M5 24h38M5 38h38" }, null, -1)]), 14, Lh);
  }]]);
  const xh = Object.assign(Nh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Nh.name, Nh);
  } }), Bh = e.defineComponent({ name: "IconMindMapping", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-mind-mapping`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), $h = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Eh = r(Bh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M20 10h23M20 24h23M20 38h23M9 12v28m0-28a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 26h7M9 24h7" }, null, -1)]), 14, $h);
  }]]);
  const Mh = Object.assign(Eh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Eh.name, Eh);
  } }), Vh = e.defineComponent({ name: "IconMobile", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-mobile`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ih = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Wh = r(Vh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M17 14h14m6.125 28h-26.25C9.839 42 9 41.105 9 40V8c0-1.105.84-2 1.875-2h26.25C38.16 6 39 6.895 39 8v32c0 1.105-.84 2-1.875 2ZM22 33a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" }, null, -1), e.createElementVNode("circle", { cx: "24", cy: "33", r: "2", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Ih);
  }]]);
  const Zh = Object.assign(Wh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Wh.name, Wh);
  } }), Ph = e.defineComponent({ name: "IconMoon", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-moon`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), qh = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Oh = r(Ph, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M39.979 29.241c.11-.344-.23-.654-.574-.544-1.53.487-3.162.75-4.855.75-8.834 0-15.997-7.163-15.997-15.997 0-1.693.263-3.324.75-4.855.11-.344-.2-.684-.544-.574C11.939 10.19 7 16.576 7 24.114 7 33.44 14.56 41 23.886 41c7.538 0 13.923-4.94 16.093-11.759Z" }, null, -1)]), 14, qh);
  }]]);
  const Hh = Object.assign(Oh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Oh.name, Oh);
  } }), Fh = e.defineComponent({ name: "IconMosaic", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-mosaic`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ah = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Dh = r(Fh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 7h4v4H6V7ZM6 23h4v4H6v-4ZM6 38h4v4H6v-4ZM14 15h4v4h-4v-4ZM14 31h4v4h-4v-4ZM22 7h4v4h-4V7ZM22 23h4v4h-4v-4ZM22 38h4v4h-4v-4ZM30 15h4v4h-4v-4ZM30 31h4v4h-4v-4ZM38 7h4v4h-4V7ZM38 23h4v4h-4v-4ZM38 38h4v4h-4v-4Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M6 7h4v4H6V7ZM6 23h4v4H6v-4ZM6 38h4v4H6v-4ZM14 15h4v4h-4v-4ZM14 31h4v4h-4v-4ZM22 7h4v4h-4V7ZM22 23h4v4h-4v-4ZM22 38h4v4h-4v-4ZM30 15h4v4h-4v-4ZM30 31h4v4h-4v-4ZM38 7h4v4h-4V7ZM38 23h4v4h-4v-4ZM38 38h4v4h-4v-4Z" }, null, -1)]), 14, Ah);
  }]]);
  const Rh = Object.assign(Dh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Dh.name, Dh);
  } }), Th = e.defineComponent({ name: "IconNav", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-nav`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Uh = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Qh = r(Th, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6 19h10m0 0h26m-26 0V9m0 10v10m0 0v10m0-10H6m10 0h26M6 9h36v30H6V9Z" }, null, -1)]), 14, Uh);
  }]]);
  const Gh = Object.assign(Qh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Qh.name, Qh);
  } }), Xh = e.defineComponent({ name: "IconNotificationClose", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-notification-close`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), _h = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Jh = r(Xh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M11 35V22c0-1.835.38-3.58 1.066-5.163M11 35H6m5 0h15.5M24 9c7.18 0 13 5.82 13 13v7.5M24 9V4m0 5a12.94 12.94 0 0 0-6.5 1.74M17 42h14M6 4l36 40" }, null, -1)]), 14, _h);
  }]]);
  const Kh = Object.assign(Jh, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Jh.name, Jh);
  } }), Yh = e.defineComponent({ name: "IconNotification", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-notification`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), eg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var tg = r(Yh, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 9c7.18 0 13 5.82 13 13v13H11V22c0-7.18 5.82-13 13-13Zm0 0V4M6 35h36m-25 7h14" }, null, -1)]), 14, eg);
  }]]);
  const ng = Object.assign(tg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + tg.name, tg);
  } }), og = e.defineComponent({ name: "IconPalette", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-palette`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ig = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var rg = r(og, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createStaticVNode('<path d="M31.813 12.02C29.73 10.459 27.013 10 24 10c-9.78 0-17.708 6.987-17.708 15.042 0 8.054 8.97 14.583 18.75 14.583 5.277 0 2.485-5.318 5.73-8.333 2.767-2.574 10.937-1.563 10.937-6.25 0-2.792-.521-5.209-2.605-7.617"></path><path d="M25.042 25.563 42.23 8.375"></path><circle cx="22.5" cy="17.5" r="2.5" fill="currentColor" stroke="none"></circle><circle cx="15.5" cy="20.5" r="2.5" fill="currentColor" stroke="none"></circle><circle cx="14.5" cy="28.5" r="2.5" fill="currentColor" stroke="none"></circle>', 5)]), 14, ig);
  }]]);
  const lg = Object.assign(rg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + rg.name, rg);
  } }), sg = e.defineComponent({ name: "IconPen", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-pen`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), cg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var ag = r(sg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m28.364 11.565 7.07 7.071M7.15 32.778 33.313 6.615l7.071 7.071L14.221 39.85h-7.07v-7.07Z" }, null, -1)]), 14, cg);
  }]]);
  const pg = Object.assign(ag, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + ag.name, ag);
  } }), ug = e.defineComponent({ name: "IconPhone", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-phone`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), mg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var dg = r(ug, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M6.707 34.284a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 0 1 1.414 0l4.95 4.95s3.535-1.414 7.778-5.657c4.243-4.243 5.657-7.778 5.657-7.778l-4.95-4.95a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 0 1 1.414 0l6.01 6.01s3.183 7.425-8.485 19.092c-11.667 11.668-19.092 8.485-19.092 8.485l-6.01-6.01Z" }, null, -1)]), 14, mg);
  }]]);
  const kg = Object.assign(dg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + dg.name, dg);
  } }), fg = e.defineComponent({ name: "IconPrinter", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-printer`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), vg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var hg = r(fg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M14 15V8a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v7m-20 0H7a1 1 0 0 0-1 1v17a1 1 0 0 0 1 1h6m1-19h20m0 0h7a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1h-6m-22 0v6a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-6m-22 0v-5a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v5" }, null, -1)]), 14, vg);
  }]]);
  const gg = Object.assign(hg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + hg.name, hg);
  } }), yg = e.defineComponent({ name: "IconPublic", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-public`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), zg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Cg = r(yg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M15 21.5 6.704 19M15 21.5l4.683 5.152a1 1 0 0 1 .25.814L18 40.976l10.918-16.117a1 1 0 0 0-.298-1.409L21.5 19 15 21.5Zm0 0 6.062-6.995a1 1 0 0 0 .138-1.103L18 7.024M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z" }, null, -1)]), 14, zg);
  }]]);
  const Sg = Object.assign(Cg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Cg.name, Cg);
  } }), bg = e.defineComponent({ name: "IconPushpin", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-pushpin`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), wg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var jg = r(bg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M19.921 28.163 7.193 40.89m12.728-12.728 8.884 8.883c.17.17.447.17.617 0l5.12-5.12a7.862 7.862 0 0 0 1.667-8.655.093.093 0 0 1 .02-.102l4.906-4.906a2 2 0 0 0 0-2.828L32.648 6.95a2 2 0 0 0-2.828 0l-4.89 4.889a.126.126 0 0 1-.139.027 7.828 7.828 0 0 0-8.618 1.66l-5.027 5.026a.591.591 0 0 0 0 .836l8.774 8.775Z" }, null, -1)]), 14, wg);
  }]]);
  const Lg = Object.assign(jg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + jg.name, jg);
  } }), Ng = e.defineComponent({ name: "IconQrcode", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-qrcode`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), xg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Bg = r(Ng, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 30v4m0 3v6m19-19h-6m-3 0h-4M7 7h17v17H7V7Zm0 25h9v9H7v-9Zm25 0h9v9h-9v-9Zm0-25h9v9h-9V7Zm-18 7h3v3h-3v-3Z" }, null, -1)]), 14, xg);
  }]]);
  const $g = Object.assign(Bg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Bg.name, Bg);
  } }), Eg = e.defineComponent({ name: "IconRelation", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-relation`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Mg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Vg = r(Eg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", xmlns: "http://www.w3.org/2000/svg", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M19.714 14C15.204 15.784 12 20.302 12 25.593c0 1.142.15 2.247.429 3.298m16.285-14.712C32.998 16.073 36 20.471 36 25.593c0 1.07-.131 2.11-.378 3.102m-18.32 7.194a11.676 11.676 0 0 0 13.556-.112" }, null, -1), e.createElementVNode("path", { d: "M24 19a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM36 40a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 40a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" }, null, -1)]), 14, Mg);
  }]]);
  const Ig = Object.assign(Vg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Vg.name, Vg);
  } }), Wg = e.defineComponent({ name: "IconRobotAdd", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-robot-add`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Zg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Pg = r(Wg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 7v6m0-6h5m-5 0h-5M3 21v11m25 8H9V13h30v11m-7 11h14m-7-7v14M18 26h1v1h-1v-1Zm11 0h1v1h-1v-1Z" }, null, -1)]), 14, Zg);
  }]]);
  const qg = Object.assign(Pg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Pg.name, Pg);
  } }), Og = e.defineComponent({ name: "IconRobot", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-robot`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Hg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Fg = r(Og, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M18 26h1v1h-1v-1ZM29 26h1v1h-1v-1Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M24 7v6m0-6h5m-5 0h-5M3 21v11m36 8H9V13h30v29m6-21v11m-27-6h1v1h-1v-1Zm11 0h1v1h-1v-1Z" }, null, -1)]), 14, Hg);
  }]]);
  const Ag = Object.assign(Fg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Fg.name, Fg);
  } }), Dg = e.defineComponent({ name: "IconSafe", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-safe`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Rg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Tg = r(Dg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m16.825 22.165 6 6 10-10M24 6c7 4 16 5 16 5v15s-2 12-16 16.027C10 38 8 26 8 26V11s9-1 16-5Z" }, null, -1)]), 14, Rg);
  }]]);
  const Ug = Object.assign(Tg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Tg.name, Tg);
  } }), Qg = e.defineComponent({ name: "IconSchedule", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-schedule`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Gg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Xg = r(Qg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "24", cy: "24", r: "18" }, null, -1), e.createElementVNode("path", { d: "M24 13v10l6.5 7" }, null, -1)]), 14, Gg);
  }]]);
  const _g = Object.assign(Xg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Xg.name, Xg);
  } }), Jg = e.defineComponent({ name: "IconShake", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-shake`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Kg = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Yg = r(Jg, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M43.092 27.536 31.778 38.849M20.465 4.91 9.15 16.221m9.192 14.85a1 1 0 1 1-1.414-1.415 1 1 0 0 1 1.414 1.414ZM6.323 28.95 19.05 41.678a1 1 0 0 0 1.415 0l21.213-21.213a1 1 0 0 0 0-1.415L28.95 6.322a1 1 0 0 0-1.415 0L6.322 27.536a1 1 0 0 0 0 1.414Z" }, null, -1), e.createElementVNode("circle", { cx: "17.637", cy: "30.364", r: "1", transform: "rotate(45 17.637 30.364)", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Kg);
  }]]);
  const ey = Object.assign(Yg, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Yg.name, Yg);
  } }), ty = e.defineComponent({ name: "IconSkin", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-skin`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ny = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var oy = r(ty, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M17.936 6H7a1 1 0 0 0-1 1v17.559a1 1 0 0 0 1 1h4V40a1 1 0 0 0 1 1h24a1 1 0 0 0 1-1V25.559h4a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H30.064C28.854 7.23 26.59 9.059 24 9.059S19.147 7.23 17.936 6Z" }, null, -1)]), 14, ny);
  }]]);
  const iy = Object.assign(oy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + oy.name, oy);
  } }), ry = e.defineComponent({ name: "IconStamp", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-stamp`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ly = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var sy = r(ry, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 33a1 1 0 0 1 1-1h32a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-7ZM29.081 21.18a8 8 0 1 0-10.163 0L14 32h20l-4.919-10.82Z" }, null, -1)]), 14, ly);
  }]]);
  const cy = Object.assign(sy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + sy.name, sy);
  } }), ay = e.defineComponent({ name: "IconStorage", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-storage`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), py = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var uy = r(ay, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 18h34v12H7V18ZM40 6H8a1 1 0 0 0-1 1v11h34V7a1 1 0 0 0-1-1ZM7 30h34v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V30Z" }, null, -1), e.createElementVNode("path", { d: "M13.02 36H13v.02h.02V36Z" }, null, -1), e.createElementVNode("path", { d: "M13 12v-2h-2v2h2Zm.02 0h2v-2h-2v2Zm0 .02v2h2v-2h-2Zm-.02 0h-2v2h2v-2ZM13 14h.02v-4H13v4Zm-1.98-2v.02h4V12h-4Zm2-1.98H13v4h.02v-4Zm1.98 2V12h-4v.02h4Z", fill: "currentColor", stroke: "none" }, null, -1), e.createElementVNode("path", { d: "M13.02 24H13v.02h.02V24Z" }, null, -1)]), 14, py);
  }]]);
  const my = Object.assign(uy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + uy.name, uy);
  } }), dy = e.defineComponent({ name: "IconSubscribeAdd", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-subscribe-add`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ky = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var fy = r(dy, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24.53 6.007H9.97c-.535 0-.97.449-.97 1.003V41.8c0 .148.152.245.28.179l15.25-7.881 14.248 7.88c.129.067.28-.03.28-.179V22.06M27.413 11.023h6.794m0 0H41m-6.794 0V4m0 7.023v7.023" }, null, -1)]), 14, ky);
  }]]);
  const vy = Object.assign(fy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + fy.name, fy);
  } }), hy = e.defineComponent({ name: "IconSubscribe", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-subscribe`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), gy = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var yy = r(hy, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M9 7v34.667a.2.2 0 0 0 .294.176L24 34l14.706 7.843a.2.2 0 0 0 .294-.176V7a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1Z" }, null, -1)]), 14, gy);
  }]]);
  const zy = Object.assign(yy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + yy.name, yy);
  } }), Cy = e.defineComponent({ name: "IconSubscribed", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-subscribed`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Sy = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var by = r(Cy, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m31.289 15.596-9.193 9.193-4.95-4.95M24 34l14.706 7.843a.2.2 0 0 0 .294-.176V7a1 1 0 0 0-1-1H10a1 1 0 0 0-1 1v34.667a.2.2 0 0 0 .294.176L24 34Z" }, null, -1)]), 14, Sy);
  }]]);
  const wy = Object.assign(by, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + by.name, by);
  } }), jy = e.defineComponent({ name: "IconSun", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-sun`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ly = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ny = r(jy, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "24", cy: "24", r: "7" }, null, -1), e.createElementVNode("path", { d: "M23 7h2v2h-2zM23 39h2v2h-2zM41 23v2h-2v-2zM9 23v2H7v-2zM36.73 35.313l-1.415 1.415-1.414-1.415 1.414-1.414zM14.099 12.686l-1.414 1.415-1.414-1.415 1.414-1.414zM12.687 36.728l-1.414-1.415 1.414-1.414 1.414 1.414zM35.314 14.1 33.9 12.686l1.414-1.414 1.415 1.414z" }, null, -1), e.createElementVNode("path", { fill: "currentColor", stroke: "none", d: "M23 7h2v2h-2zM23 39h2v2h-2zM41 23v2h-2v-2zM9 23v2H7v-2zM36.73 35.313l-1.415 1.415-1.414-1.415 1.414-1.414zM14.099 12.686l-1.414 1.415-1.414-1.415 1.414-1.414zM12.687 36.728l-1.414-1.415 1.414-1.414 1.414 1.414zM35.314 14.1 33.9 12.686l1.414-1.414 1.415 1.414z" }, null, -1)]), 14, Ly);
  }]]);
  const xy = Object.assign(Ny, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ny.name, Ny);
  } }), By = e.defineComponent({ name: "IconTag", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-tag`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), $y = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Ey = r(By, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24.835 6.035a1 1 0 0 1 .903-.273l12.964 2.592a1 1 0 0 1 .784.785l2.593 12.963a1 1 0 0 1-.274.904L21.678 43.133a1 1 0 0 1-1.415 0L4.708 27.577a1 1 0 0 1 0-1.414L24.835 6.035Z" }, null, -1), e.createElementVNode("path", { d: "M31.577 17.346a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" }, null, -1), e.createElementVNode("path", { d: "M31.582 17.349a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, $y);
  }]]);
  const My = Object.assign(Ey, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Ey.name, Ey);
  } }), Vy = e.defineComponent({ name: "IconTags", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-tags`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Iy = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Wy = r(Vy, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "m37.581 28.123-14.849 14.85a1 1 0 0 1-1.414 0L8.59 30.243m25.982-22.68-10.685-.628a1 1 0 0 0-.766.291L9.297 21.052a1 1 0 0 0 0 1.414L20.61 33.78a1 1 0 0 0 1.415 0l13.824-13.825a1 1 0 0 0 .291-.765l-.628-10.686a1 1 0 0 0-.94-.94Zm-6.874 7.729a1 1 0 1 1 1.414-1.414 1 1 0 0 1-1.414 1.414Z" }, null, -1), e.createElementVNode("path", { d: "M27.697 15.292a1 1 0 1 1 1.414-1.414 1 1 0 0 1-1.414 1.414Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, Iy);
  }]]);
  const Zy = Object.assign(Wy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Wy.name, Wy);
  } }), Py = e.defineComponent({ name: "IconThunderbolt", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-thunderbolt`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), qy = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Oy = r(Py, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M27.824 5.203A.1.1 0 0 1 28 5.27V21h10.782a.1.1 0 0 1 .075.165L20.176 42.797A.1.1 0 0 1 20 42.73V27H9.219a.1.1 0 0 1-.076-.165L27.824 5.203Z" }, null, -1)]), 14, qy);
  }]]);
  const Hy = Object.assign(Oy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Oy.name, Oy);
  } }), Fy = e.defineComponent({ name: "IconTool", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-tool`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Ay = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Dy = r(Fy, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M19.994 11.035c3.66-3.659 9.094-4.46 13.531-2.405a.1.1 0 0 1 .028.16l-6.488 6.488a1 1 0 0 0 0 1.414l4.243 4.243a1 1 0 0 0 1.414 0l6.488-6.488a.1.1 0 0 1 .16.028c2.056 4.437 1.254 9.872-2.405 13.53-3.695 3.696-9.2 4.477-13.66 2.347L12.923 40.733a1 1 0 0 1-1.414 0L7.266 36.49a1 1 0 0 1 0-1.414l10.382-10.382c-2.13-4.46-1.349-9.965 2.346-13.66Z" }, null, -1)]), 14, Ay);
  }]]);
  const Ry = Object.assign(Dy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Dy.name, Dy);
  } }), Ty = e.defineComponent({ name: "IconTrophy", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-trophy`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), Uy = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Qy = r(Ty, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 33c-6.075 0-11-4.925-11-11m11 11c6.075 0 11-4.925 11-11M24 33v8M13 22V7h22v15m-22 0V9H7v7a6 6 0 0 0 6 6Zm22 0V9h6v7a6 6 0 0 1-6 6ZM12 41h24" }, null, -1)]), 14, Uy);
  }]]);
  const Gy = Object.assign(Qy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Qy.name, Qy);
  } }), Xy = e.defineComponent({ name: "IconUnlock", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-unlock`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), _y = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Jy = r(Xy, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("rect", { x: "7", y: "21", width: "34", height: "20", rx: "1" }, null, -1), e.createElementVNode("path", { d: "M44 15a9 9 0 1 0-18 0v6M24 35v-8" }, null, -1)]), 14, _y);
  }]]);
  const Ky = Object.assign(Jy, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Jy.name, Jy);
  } }), Yy = e.defineComponent({ name: "IconUserAdd", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-user-add`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), ez = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var tz = r(Yy, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M25 27h-8c-5.523 0-10 4.477-10 10v4h18m11-14v8m0 0v8m0-8h8m-8 0h-8m3-21a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" }, null, -1)]), 14, ez);
  }]]);
  const nz = Object.assign(tz, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + tz.name, tz);
  } }), oz = e.defineComponent({ name: "IconUserGroup", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-user-group`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), iz = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var rz = r(oz, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("circle", { cx: "18", cy: "15", r: "7" }, null, -1), e.createElementVNode("circle", { cx: "34", cy: "19", r: "4" }, null, -1), e.createElementVNode("path", { d: "M6 34a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v6H6v-6ZM34 30h4a4 4 0 0 1 4 4v4h-8" }, null, -1)]), 14, iz);
  }]]);
  const lz = Object.assign(rz, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + rz.name, rz);
  } }), sz = e.defineComponent({ name: "IconUser", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-user`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), cz = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var az = r(sz, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M7 37c0-4.97 4.03-8 9-8h16c4.97 0 9 3.03 9 8v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3Z" }, null, -1), e.createElementVNode("circle", { cx: "24", cy: "15", r: "8" }, null, -1)]), 14, cz);
  }]]);
  const pz = Object.assign(az, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + az.name, az);
  } }), uz = e.defineComponent({ name: "IconVideoCamera", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-video-camera`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), mz = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var dz = r(uz, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M33 18v12m0-12v-6a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v24a1 1 0 0 0 1 1h25a1 1 0 0 0 1-1v-6m0-12 8.713-2.614a1 1 0 0 1 1.287.958v15.312a1 1 0 0 1-1.287.958L33 30M11 19h6" }, null, -1)]), 14, mz);
  }]]);
  const kz = Object.assign(dz, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + dz.name, dz);
  } }), fz = e.defineComponent({ name: "IconWifi", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-wifi`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), vz = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var hz = r(fz, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M31.587 31.485A9.978 9.978 0 0 0 24 28a9.977 9.977 0 0 0-7.586 3.485M37.255 25.822A17.953 17.953 0 0 0 24 20a17.953 17.953 0 0 0-13.256 5.822M43.618 19.449C38.696 14.246 31.728 11 24 11c-7.727 0-14.696 3.246-19.617 8.449" }, null, -1), e.createElementVNode("path", { d: "M27.535 35.465a5 5 0 0 0-7.07 0L24 39l3.535-3.535Z", fill: "currentColor", stroke: "none" }, null, -1)]), 14, vz);
  }]]);
  const gz = Object.assign(hz, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + hz.name, hz);
  } }), yz = e.defineComponent({ name: "IconWoman", props: { size: { type: [Number, String] }, strokeWidth: { type: Number, default: 4 }, strokeLinecap: { type: String, default: "butt", validator: (e2) => ["butt", "round", "square"].includes(e2) }, strokeLinejoin: { type: String, default: "miter", validator: (e2) => ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e2) }, rotate: Number, spin: Boolean }, emits: { click: (e2) => true }, setup(t2, { emit: o2 }) {
    const r2 = n("icon");
    return { cls: e.computed(() => [r2, `${r2}-woman`, { [`${r2}-spin`]: t2.spin }]), innerStyle: e.computed(() => {
      const e2 = {};
      return t2.size && (e2.fontSize = i(t2.size) ? `${t2.size}px` : t2.size), t2.rotate && (e2.transform = `rotate(${t2.rotate}deg)`), e2;
    }), onClick: (e2) => {
      o2("click", e2);
    } };
  } }), zz = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
  var Cz = r(yz, [["render", function(t2, n2, o2, i2, r2, l2) {
    return e.openBlock(), e.createElementBlock("svg", { viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg", stroke: "currentColor", class: e.normalizeClass(t2.cls), style: e.normalizeStyle(t2.innerStyle), "stroke-width": t2.strokeWidth, "stroke-linecap": t2.strokeLinecap, "stroke-linejoin": t2.strokeLinejoin, onClick: n2[0] || (n2[0] = (...e2) => t2.onClick && t2.onClick(...e2)) }, n2[1] || (n2[1] = [e.createElementVNode("path", { d: "M24 29c6.075 0 11-4.925 11-11S30.075 7 24 7s-11 4.925-11 11 4.925 11 11 11Zm0 0v15M15 36h18" }, null, -1)]), 14, zz);
  }]]);
  const Sz = { IconArrowDown: a, IconArrowFall: d, IconArrowLeft: h, IconArrowRight: C, IconArrowRise: j, IconArrowUp: B, IconCaretDown: V, IconCaretLeft: P, IconCaretRight: F, IconCaretUp: T, IconDoubleDown: X, IconDoubleLeft: Y, IconDoubleRight: oe, IconDoubleUp: se, IconDownCircle: ue, IconDown: fe, IconDragArrow: ye, IconExpand: be, IconLeftCircle: Ne, IconLeft: Ee, IconMenuFold: We, IconMenuUnfold: Oe, IconRightCircle: De, IconRight: Qe, IconRotateLeft: Je, IconRotateRight: tt, IconShrink: rt, IconSwap: at, IconToBottom: dt, IconToLeft: ht, IconToRight: Ct, IconToTop: jt, IconUpCircle: Bt, IconUp: Vt, IconCheckCircleFill: Pt, IconCloseCircleFill: Ft, IconExclamationCircleFill: Tt, IconExclamationPolygonFill: Xt, IconInfoCircleFill: Yt, IconMinusCircleFill: on, IconPlusCircleFill: cn, IconQuestionCircleFill: mn, IconCheckCircle: vn, IconCheckSquare: zn, IconCheck: wn, IconClockCircle: xn, IconCloseCircle: Mn, IconClose: Zn, IconExclamationCircle: Hn, IconExclamation: Rn, IconInfoCircle: Gn, IconInfo: Kn, IconMinusCircle: no, IconMinus: lo, IconPlusCircle: po, IconPlus: fo, IconQuestionCircle: yo, IconQuestion: bo, IconStop: No, IconHeartFill: Eo, IconStarFill: Wo, IconThumbDownFill: Oo, IconThumbUpFill: Do, IconAt: Qo, IconCloudDownload: Jo, IconCodeBlock: ti, IconCodeSquare: ri, IconCode: ai, IconCustomerService: di, IconDownload: hi, IconExport: Ci, IconEyeInvisible: ji, IconEye: Bi, IconHeart: Vi, IconHistory: Pi, IconHome: Fi, IconImport: Ti, IconLaunch: Xi, IconList: Yi, IconMessageBanned: or, IconMessage: sr, IconMoreVertical: ur, IconMore: fr, IconPoweroff: yr, IconRefresh: br, IconReply: Nr, IconSave: Er, IconScan: Wr, IconSearch: Or, IconSelectAll: Dr, IconSend: Qr, IconSettings: Jr, IconShareAlt: tl, IconShareExternal: rl, IconShareInternal: al, IconStar: dl, IconSync: hl, IconThumbDown: Cl, IconThumbUp: jl, IconTranslate: Bl, IconUpload: Vl, IconVoice: Pl, IconAlignCenter: Fl, IconAlignLeft: Tl, IconAlignRight: Xl, IconAttachment: Yl, IconBgColors: os, IconBold: ss, IconBrush: us, IconCopy: fs, IconDelete: ys, IconEdit: bs, IconEraser: Ns, IconFilter: Es, IconFindReplace: Ws, IconFontColors: Os, IconFormula: Ds, IconH1: Qs, IconH2: Js, IconH3: tc, IconH4: rc, IconH5: ac, IconH6: dc, IconH7: hc, IconHighlight: Cc, IconItalic: jc, IconLineHeight: Bc, IconLink: Vc, IconObliqueLine: Pc, IconOrderedList: Fc, IconOriginalSize: Tc, IconPaste: Xc, IconQuote: Yc, IconRedo: oa, IconScissor: sa, IconSortAscending: ua, IconSortDescending: fa, IconSort: ya, IconStrikethrough: ba, IconUnderline: Na, IconUndo: Ea, IconUnorderedList: Wa, IconZoomIn: Oa, IconZoomOut: Da, IconMuteFill: Qa, IconPauseCircleFill: Ja, IconPlayArrowFill: tp, IconPlayCircleFill: rp, IconSkipNextFill: ap, IconSkipPreviousFill: dp, IconSoundFill: hp, IconBackward: Cp, IconForward: jp, IconFullscreenExit: Bp, IconFullscreen: Vp, IconLiveBroadcast: Pp, IconMusic: Fp, IconMute: Tp, IconPauseCircle: Xp, IconPause: Yp, IconPlayArrow: ou, IconPlayCircle: su, IconRecordStop: uu, IconRecord: fu, IconSkipNext: yu, IconSkipPrevious: bu, IconSound: Nu, IconBytedanceColor: Eu, IconLarkColor: Wu, IconTiktokColor: Ou, IconXiguaColor: Du, IconFaceBookCircleFill: Qu, IconFacebookSquareFill: Ju, IconGoogleCircleFill: tm, IconQqCircleFill: rm, IconTwitterCircleFill: am, IconWeiboCircleFill: dm, IconAlipayCircle: hm, IconCodeSandbox: Cm, IconCodepen: jm, IconFacebook: Bm, IconGithub: Vm, IconGitlab: Pm, IconGoogle: Fm, IconQqZone: Tm, IconQq: Xm, IconTwitter: Ym, IconWechat: od, IconWechatpay: sd, IconWeibo: ud, IconChineseFill: fd, IconEnglishFill: yd, IconFaceFrownFill: bd, IconFaceMehFill: Nd, IconFaceSmileFill: Ed, IconMoonFill: Wd, IconPenFill: Od, IconSunFill: Dd, IconApps: Qd, IconArchive: Jd, IconBarChart: tk, IconBook: rk, IconBookmark: ak, IconBranch: dk, IconBug: hk, IconBulb: Ck, IconCalendarClock: jk, IconCalendar: Bk, IconCamera: Vk, IconCloud: Pk, IconCommand: Fk, IconCommon: Tk, IconCompass: Xk, IconComputer: Yk, IconCopyright: of, IconDashboard: cf, IconDesktop: mf, IconDice: vf, IconDragDotVertical: zf, IconDragDot: wf, IconDriveFile: xf, IconEar: Mf, IconEmail: Zf, IconEmpty: Hf, IconExperiment: Rf, IconFileAudio: Gf, IconFileImage: Kf, IconFilePdf: nv, IconFileVideo: lv, IconFile: pv, IconFire: kv, IconFolderAdd: gv, IconFolderDelete: Sv, IconFolder: Lv, IconGift: $v, IconIdcard: Iv, IconImageClose: qv, IconImage: Av, IconInteraction: Uv, IconLanguage: _v, IconLayers: eh, IconLayout: ih, IconLoading: ch, IconLocation: mh, IconLock: vh, IconLoop: zh, IconMan: wh, IconMenu: xh, IconMindMapping: Mh, IconMobile: Zh, IconMoon: Hh, IconMosaic: Rh, IconNav: Gh, IconNotificationClose: Kh, IconNotification: ng, IconPalette: lg, IconPen: pg, IconPhone: kg, IconPrinter: gg, IconPublic: Sg, IconPushpin: Lg, IconQrcode: $g, IconRelation: Ig, IconRobotAdd: qg, IconRobot: Ag, IconSafe: Ug, IconSchedule: _g, IconShake: ey, IconSkin: iy, IconStamp: cy, IconStorage: my, IconSubscribeAdd: vy, IconSubscribe: zy, IconSubscribed: wy, IconSun: xy, IconTag: My, IconTags: Zy, IconThunderbolt: Hy, IconTool: Ry, IconTrophy: Gy, IconUnlock: Ky, IconUserAdd: nz, IconUserGroup: lz, IconUser: pz, IconVideoCamera: kz, IconWifi: gz, IconWoman: Object.assign(Cz, { install: (e2, t2) => {
    var _a2;
    const n2 = (_a2 = t2 == null ? void 0 : t2.iconPrefix) != null ? _a2 : "";
    e2.component(n2 + Cz.name, Cz);
  } }) };
  return { ...Sz, install: (e2, t2) => {
    for (const n2 of Object.keys(Sz))
      e2.use(Sz[n2], t2);
  } };
});
//# sourceMappingURL=arco-vue-icon.min.js.map
