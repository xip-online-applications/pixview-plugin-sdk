var p = { exports: {} }, u = typeof Reflect == "object" ? Reflect : null, v = u && typeof u.apply == "function" ? u.apply : function(e, t, r) {
  return Function.prototype.apply.call(e, t, r);
}, c;
u && typeof u.ownKeys == "function" ? c = u.ownKeys : Object.getOwnPropertySymbols ? c = function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : c = function(e) {
  return Object.getOwnPropertyNames(e);
};
function O(n) {
  console && console.warn && console.warn(n);
}
var g = Number.isNaN || function(e) {
  return e !== e;
};
function o() {
  o.init.call(this);
}
p.exports = o;
p.exports.once = A;
o.EventEmitter = o;
o.prototype._events = void 0;
o.prototype._eventsCount = 0;
o.prototype._maxListeners = void 0;
var m = 10;
function d(n) {
  if (typeof n != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof n);
}
Object.defineProperty(o, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return m;
  },
  set: function(n) {
    if (typeof n != "number" || n < 0 || g(n))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + n + ".");
    m = n;
  }
});
o.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
o.prototype.setMaxListeners = function(e) {
  if (typeof e != "number" || e < 0 || g(e))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
  return this._maxListeners = e, this;
};
function L(n) {
  return n._maxListeners === void 0 ? o.defaultMaxListeners : n._maxListeners;
}
o.prototype.getMaxListeners = function() {
  return L(this);
};
o.prototype.emit = function(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t.push(arguments[r]);
  var i = e === "error", a = this._events;
  if (a !== void 0)
    i = i && a.error === void 0;
  else if (!i)
    return !1;
  if (i) {
    var s;
    if (t.length > 0 && (s = t[0]), s instanceof Error)
      throw s;
    var f = new Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
    throw f.context = s, f;
  }
  var l = a[e];
  if (l === void 0)
    return !1;
  if (typeof l == "function")
    v(l, this, t);
  else
    for (var h = l.length, x = E(l, h), r = 0; r < h; ++r)
      v(x[r], this, t);
  return !0;
};
function w(n, e, t, r) {
  var i, a, s;
  if (d(t), a = n._events, a === void 0 ? (a = n._events = /* @__PURE__ */ Object.create(null), n._eventsCount = 0) : (a.newListener !== void 0 && (n.emit(
    "newListener",
    e,
    t.listener ? t.listener : t
  ), a = n._events), s = a[e]), s === void 0)
    s = a[e] = t, ++n._eventsCount;
  else if (typeof s == "function" ? s = a[e] = r ? [t, s] : [s, t] : r ? s.unshift(t) : s.push(t), i = L(n), i > 0 && s.length > i && !s.warned) {
    s.warned = !0;
    var f = new Error("Possible EventEmitter memory leak detected. " + s.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    f.name = "MaxListenersExceededWarning", f.emitter = n, f.type = e, f.count = s.length, O(f);
  }
  return n;
}
o.prototype.addListener = function(e, t) {
  return w(this, e, t, !1);
};
o.prototype.on = o.prototype.addListener;
o.prototype.prependListener = function(e, t) {
  return w(this, e, t, !0);
};
function C() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function y(n, e, t) {
  var r = { fired: !1, wrapFn: void 0, target: n, type: e, listener: t }, i = C.bind(r);
  return i.listener = t, r.wrapFn = i, i;
}
o.prototype.once = function(e, t) {
  return d(t), this.on(e, y(this, e, t)), this;
};
o.prototype.prependOnceListener = function(e, t) {
  return d(t), this.prependListener(e, y(this, e, t)), this;
};
o.prototype.removeListener = function(e, t) {
  var r, i, a, s, f;
  if (d(t), i = this._events, i === void 0)
    return this;
  if (r = i[e], r === void 0)
    return this;
  if (r === t || r.listener === t)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, r.listener || t));
  else if (typeof r != "function") {
    for (a = -1, s = r.length - 1; s >= 0; s--)
      if (r[s] === t || r[s].listener === t) {
        f = r[s].listener, a = s;
        break;
      }
    if (a < 0)
      return this;
    a === 0 ? r.shift() : T(r, a), r.length === 1 && (i[e] = r[0]), i.removeListener !== void 0 && this.emit("removeListener", e, f || t);
  }
  return this;
};
o.prototype.off = o.prototype.removeListener;
o.prototype.removeAllListeners = function(e) {
  var t, r, i;
  if (r = this._events, r === void 0)
    return this;
  if (r.removeListener === void 0)
    return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : r[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete r[e]), this;
  if (arguments.length === 0) {
    var a = Object.keys(r), s;
    for (i = 0; i < a.length; ++i)
      s = a[i], s !== "removeListener" && this.removeAllListeners(s);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (t = r[e], typeof t == "function")
    this.removeListener(e, t);
  else if (t !== void 0)
    for (i = t.length - 1; i >= 0; i--)
      this.removeListener(e, t[i]);
  return this;
};
function b(n, e, t) {
  var r = n._events;
  if (r === void 0)
    return [];
  var i = r[e];
  return i === void 0 ? [] : typeof i == "function" ? t ? [i.listener || i] : [i] : t ? M(i) : E(i, i.length);
}
o.prototype.listeners = function(e) {
  return b(this, e, !0);
};
o.prototype.rawListeners = function(e) {
  return b(this, e, !1);
};
o.listenerCount = function(n, e) {
  return typeof n.listenerCount == "function" ? n.listenerCount(e) : _.call(n, e);
};
o.prototype.listenerCount = _;
function _(n) {
  var e = this._events;
  if (e !== void 0) {
    var t = e[n];
    if (typeof t == "function")
      return 1;
    if (t !== void 0)
      return t.length;
  }
  return 0;
}
o.prototype.eventNames = function() {
  return this._eventsCount > 0 ? c(this._events) : [];
};
function E(n, e) {
  for (var t = new Array(e), r = 0; r < e; ++r)
    t[r] = n[r];
  return t;
}
function T(n, e) {
  for (; e + 1 < n.length; e++)
    n[e] = n[e + 1];
  n.pop();
}
function M(n) {
  for (var e = new Array(n.length), t = 0; t < e.length; ++t)
    e[t] = n[t].listener || n[t];
  return e;
}
function A(n, e) {
  return new Promise(function(t, r) {
    function i(s) {
      n.removeListener(e, a), r(s);
    }
    function a() {
      typeof n.removeListener == "function" && n.removeListener("error", i), t([].slice.call(arguments));
    }
    P(n, e, a, { once: !0 }), e !== "error" && j(n, i, { once: !0 });
  });
}
function j(n, e, t) {
  typeof n.on == "function" && P(n, "error", e, t);
}
function P(n, e, t, r) {
  if (typeof n.on == "function")
    r.once ? n.once(e, t) : n.on(e, t);
  else if (typeof n.addEventListener == "function")
    n.addEventListener(e, function i(a) {
      r.once && n.removeEventListener(e, i), t(a);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof n);
}
var R = p.exports;
function S() {
  let n = new N();
  return n.init(), n;
}
class N extends R.EventEmitter {
  constructor() {
    super();
    let e = this;
    window.addEventListener("message", function(t) {
      switch (t.data[0]) {
        case "init":
          e.port = t.ports[0], e.port.start();
          break;
        case "slideChange":
          e.active = t.data[1], e.emit("active", e.active);
          break;
      }
    });
  }
  init() {
    parent.postMessage("initialize", "*");
  }
  getParams() {
    return new Promise((e) => {
      (async () => {
        for (; this.port === void 0; )
          await new Promise((r) => setTimeout(r, 250));
        const t = new AbortController();
        this.port.addEventListener("message", (r) => {
          r.data[0] === "reqParams" && (e(r.data[1]), t.abort());
        }, { signal: t.signal }), this.port.postMessage(["reqParams"]);
      })();
    });
  }
  request(e) {
    return new Promise((t) => {
      (async () => {
        for (; this.port === void 0; )
          await new Promise((i) => setTimeout(i, 250));
        const r = new AbortController();
        this.port.addEventListener("message", (i) => {
          i.data[0] === "fetch" && (t(i.data[1]), r.abort());
        }, { signal: r.signal }), this.port.postMessage(["fetch", e]);
      })();
    });
  }
  requestWithToken(e) {
    return new Promise((t) => {
      (async () => {
        for (; this.port === void 0; )
          await new Promise((i) => setTimeout(i, 250));
        const r = new AbortController();
        this.port.addEventListener("message", (i) => {
          i.data[0] === "fetchWithToken" && (t(i.data[1]), r.abort());
        }, { signal: r.signal }), this.port.postMessage(["fetchWithToken", e]);
      })();
    });
  }
  saveToLocalStorage(e) {
    return new Promise((t) => {
      (async () => {
        for (; this.port === void 0; )
          await new Promise((i) => setTimeout(i, 250));
        const r = new AbortController();
        this.port.addEventListener("message", (i) => {
          i.data[0] === "saveToLocalStorage" && (t(i.data[1]), r.abort());
        }, { signal: r.signal }), this.port.postMessage(["saveToLocalStorage", e]);
      })();
    });
  }
  getLocalStorage() {
    return new Promise((e) => {
      (async () => {
        for (; this.port === void 0; )
          await new Promise((r) => setTimeout(r, 250));
        const t = new AbortController();
        this.port.addEventListener("message", (r) => {
          r.data[0] === "getLocalStorage" && (e(r.data[1]), t.abort());
        }, { signal: t.signal }), this.port.postMessage(["getLocalStorage"]);
      })();
    });
  }
  getPlayer() {
    return new Promise((e) => {
      (async () => {
        for (; this.port === void 0; )
          await new Promise((r) => setTimeout(r, 250));
        const t = new AbortController();
        this.port.addEventListener("message", (r) => {
          r.data[0] === "getPlayer" && (e(r.data[1]), t.abort());
        }, { signal: t.signal }), this.port.postMessage(["getPlayer"]);
      })();
    });
  }
}
export {
  N as default,
  S as init
};
