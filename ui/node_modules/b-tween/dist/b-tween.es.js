// https://github.com/LiikeJS/Liike/blob/master/src/ease.js
var easeInBy = function (power) { return function (t) { return Math.pow(t, power); }; };
var easeOutBy = function (power) { return function (t) { return 1 - Math.abs(Math.pow(t - 1, power)); }; };
var easeInOutBy = function (power) { return function (t) { return t < 0.5 ? easeInBy(power)(t * 2) / 2 : easeOutBy(power)(t * 2 - 1) / 2 + 0.5; }; };

var linear = function (t) { return t; };
var quadIn = easeInBy(2);
var quadOut = easeOutBy(2);
var quadInOut = easeInOutBy(2);
var cubicIn = easeInBy(3);
var cubicOut = easeOutBy(3);
var cubicInOut = easeInOutBy(3);
var quartIn = easeInBy(4);
var quartOut = easeOutBy(4);
var quartInOut = easeInOutBy(4);
var quintIn = easeInBy(5);
var quintOut = easeOutBy(5);
var quintInOut = easeInOutBy(5);
var sineIn = function (t) { return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2); };
var sineOut = function (t) { return Math.sin(Math.PI / 2 * t); };
var sineInOut = function (t) { return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2; };
var bounceOut = function (t) {
  var s = 7.5625;
  var p = 2.75;

  if (t < 1 / p) {
    return s * t * t;
  }
  if (t < 2 / p) {
    t -= 1.5 / p;
    return s * t * t + 0.75;
  }
  if (t < 2.5 / p) {
    t -= 2.25 / p;
    return s * t * t + 0.9375;
  }
  t -= 2.625 / p;
  return s * t * t + 0.984375;
};
var bounceIn = function (t) { return 1 - bounceOut(1 - t); };
var bounceInOut = function (t) { return t < 0.5 ? bounceIn(t * 2) * 0.5 : bounceOut(t * 2 - 1) * 0.5 + 0.5; };

var easing = /*#__PURE__*/Object.freeze({
  linear: linear,
  quadIn: quadIn,
  quadOut: quadOut,
  quadInOut: quadInOut,
  cubicIn: cubicIn,
  cubicOut: cubicOut,
  cubicInOut: cubicInOut,
  quartIn: quartIn,
  quartOut: quartOut,
  quartInOut: quartInOut,
  quintIn: quintIn,
  quintOut: quintOut,
  quintInOut: quintInOut,
  sineIn: sineIn,
  sineOut: sineOut,
  sineInOut: sineInOut,
  bounceOut: bounceOut,
  bounceIn: bounceIn,
  bounceInOut: bounceInOut
});

var Tween = function Tween(settings) {
  var from = settings.from;
  var to = settings.to;
  var duration = settings.duration;
  var delay = settings.delay;
  var easing = settings.easing;
  var onStart = settings.onStart;
  var onUpdate = settings.onUpdate;
  var onFinish = settings.onFinish;

  for (var key in from) {
    if (to[key] === undefined) {
      to[key] = from[key];
    }
  }
  for (var key$1 in to) {
    if (from[key$1] === undefined) {
      from[key$1] = to[key$1];
    }
  }

  this.from = from;
  this.to = to;
  this.duration = duration || 500;
  this.delay = delay || 0;
  this.easing = easing || 'linear';
  this.onStart = onStart;
  this.onUpdate = onUpdate || function () { };
  this.onFinish = onFinish;
  this.startTime = Date.now() + this.delay;
  this.started = false;
  this.finished = false;
  this.timer = null;
  this.keys = {};
};

Tween.prototype.update = function update () {
  this.time = Date.now();
  // delay some time
  if (this.time < this.startTime) {
    return;
  }
  if (this.finished) {
    return;
  }
  // finish animation
  if (this.elapsed === this.duration) {
    if (!this.finished) {
      this.finished = true;
      this.onFinish && this.onFinish(this.keys);
    }
    return;
  }
  this.elapsed = this.time - this.startTime;
  this.elapsed = this.elapsed > this.duration ? this.duration : this.elapsed;
  for (var key in this.to) {
    this.keys[key] = this.from[key] + (this.to[key] - this.from[key]) * easing[this.easing](this.elapsed / this.duration);
  }
  if (!this.started) {
    this.onStart && this.onStart(this.keys);
    this.started = true;
  }
  this.onUpdate(this.keys);
};

Tween.prototype.start = function start () {
    var this$1 = this;

  this.startTime = Date.now() + this.delay;
  var tick = function () {
    this$1.update();
    this$1.timer = requestAnimationFrame(tick);
    if (this$1.finished) {
      cancelAnimationFrame(this$1.timer);
      this$1.timer = null;
    }
  };
  tick();
};

Tween.prototype.stop = function stop () {
  cancelAnimationFrame(this.timer);
  this.timer = null;
};

export default Tween;
