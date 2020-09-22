/*!
 * Copyright TradingLite 2020
 * See /client.dependencies.txt for license info
 */
var commonjsGlobal =
  "undefined" != typeof globalThis
    ? globalThis
    : "undefined" != typeof window
    ? window
    : "undefined" != typeof global
    ? global
    : "undefined" != typeof self
    ? self
    : {};
function createCommonjsModule(e, t, r) {
  return (
    e(
      (r = {
        path: t,
        exports: {},
        require: function (e, t) {
          return commonjsRequire(e, null == t ? r.path : t);
        },
      }),
      r.exports
    ),
    r.exports
  );
}
function commonjsRequire() {
  throw new Error(
    "Dynamic requires are not currently supported by @rollup/plugin-commonjs"
  );
}
var global$1 =
    "undefined" != typeof global
      ? global
      : "undefined" != typeof self
      ? self
      : "undefined" != typeof window
      ? window
      : {},
  lookup = [],
  revLookup = [],
  Arr = "undefined" != typeof Uint8Array ? Uint8Array : Array,
  inited = !1;
function init() {
  inited = !0;
  for (
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      t = 0,
      r = e.length;
    t < r;
    ++t
  )
    (lookup[t] = e[t]), (revLookup[e.charCodeAt(t)] = t);
  (revLookup["-".charCodeAt(0)] = 62), (revLookup["_".charCodeAt(0)] = 63);
}
function toByteArray(e) {
  var t, r, n, o, a, i;
  inited || init();
  var s = e.length;
  if (s % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  (a = "=" === e[s - 2] ? 2 : "=" === e[s - 1] ? 1 : 0),
    (i = new Arr((3 * s) / 4 - a)),
    (n = a > 0 ? s - 4 : s);
  var u = 0;
  for (t = 0, r = 0; t < n; t += 4, r += 3)
    (o =
      (revLookup[e.charCodeAt(t)] << 18) |
      (revLookup[e.charCodeAt(t + 1)] << 12) |
      (revLookup[e.charCodeAt(t + 2)] << 6) |
      revLookup[e.charCodeAt(t + 3)]),
      (i[u++] = (o >> 16) & 255),
      (i[u++] = (o >> 8) & 255),
      (i[u++] = 255 & o);
  return (
    2 === a
      ? ((o =
          (revLookup[e.charCodeAt(t)] << 2) |
          (revLookup[e.charCodeAt(t + 1)] >> 4)),
        (i[u++] = 255 & o))
      : 1 === a &&
        ((o =
          (revLookup[e.charCodeAt(t)] << 10) |
          (revLookup[e.charCodeAt(t + 1)] << 4) |
          (revLookup[e.charCodeAt(t + 2)] >> 2)),
        (i[u++] = (o >> 8) & 255),
        (i[u++] = 255 & o)),
    i
  );
}
function tripletToBase64(e) {
  return (
    lookup[(e >> 18) & 63] +
    lookup[(e >> 12) & 63] +
    lookup[(e >> 6) & 63] +
    lookup[63 & e]
  );
}
function encodeChunk(e, t, r) {
  for (var n, o = [], a = t; a < r; a += 3)
    (n = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2]), o.push(tripletToBase64(n));
  return o.join("");
}
function fromByteArray(e) {
  var t;
  inited || init();
  for (
    var r = e.length, n = r % 3, o = "", a = [], i = 0, s = r - n;
    i < s;
    i += 16383
  )
    a.push(encodeChunk(e, i, i + 16383 > s ? s : i + 16383));
  return (
    1 === n
      ? ((t = e[r - 1]),
        (o += lookup[t >> 2]),
        (o += lookup[(t << 4) & 63]),
        (o += "=="))
      : 2 === n &&
        ((t = (e[r - 2] << 8) + e[r - 1]),
        (o += lookup[t >> 10]),
        (o += lookup[(t >> 4) & 63]),
        (o += lookup[(t << 2) & 63]),
        (o += "=")),
    a.push(o),
    a.join("")
  );
}
function read(e, t, r, n, o) {
  var a,
    i,
    s = 8 * o - n - 1,
    u = (1 << s) - 1,
    c = u >> 1,
    l = -7,
    f = r ? o - 1 : 0,
    p = r ? -1 : 1,
    d = e[t + f];
  for (
    f += p, a = d & ((1 << -l) - 1), d >>= -l, l += s;
    l > 0;
    a = 256 * a + e[t + f], f += p, l -= 8
  );
  for (
    i = a & ((1 << -l) - 1), a >>= -l, l += n;
    l > 0;
    i = 256 * i + e[t + f], f += p, l -= 8
  );
  if (0 === a) a = 1 - c;
  else {
    if (a === u) return i ? NaN : (1 / 0) * (d ? -1 : 1);
    (i += Math.pow(2, n)), (a -= c);
  }
  return (d ? -1 : 1) * i * Math.pow(2, a - n);
}
function write(e, t, r, n, o, a) {
  var i,
    s,
    u,
    c = 8 * a - o - 1,
    l = (1 << c) - 1,
    f = l >> 1,
    p = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
    d = n ? 0 : a - 1,
    h = n ? 1 : -1,
    g = t < 0 || (0 === t && 1 / t < 0) ? 1 : 0;
  for (
    t = Math.abs(t),
      isNaN(t) || t === 1 / 0
        ? ((s = isNaN(t) ? 1 : 0), (i = l))
        : ((i = Math.floor(Math.log(t) / Math.LN2)),
          t * (u = Math.pow(2, -i)) < 1 && (i--, (u *= 2)),
          (t += i + f >= 1 ? p / u : p * Math.pow(2, 1 - f)) * u >= 2 &&
            (i++, (u /= 2)),
          i + f >= l
            ? ((s = 0), (i = l))
            : i + f >= 1
            ? ((s = (t * u - 1) * Math.pow(2, o)), (i += f))
            : ((s = t * Math.pow(2, f - 1) * Math.pow(2, o)), (i = 0)));
    o >= 8;
    e[r + d] = 255 & s, d += h, s /= 256, o -= 8
  );
  for (
    i = (i << o) | s, c += o;
    c > 0;
    e[r + d] = 255 & i, d += h, i /= 256, c -= 8
  );
  e[r + d - h] |= 128 * g;
}
var toString = {}.toString,
  isArray =
    Array.isArray ||
    function (e) {
      return "[object Array]" == toString.call(e);
    },
  INSPECT_MAX_BYTES = 50;
Buffer.TYPED_ARRAY_SUPPORT =
  void 0 === global$1.TYPED_ARRAY_SUPPORT || global$1.TYPED_ARRAY_SUPPORT;
var _kMaxLength = kMaxLength();
function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function createBuffer(e, t) {
  if (kMaxLength() < t) throw new RangeError("Invalid typed array length");
  return (
    Buffer.TYPED_ARRAY_SUPPORT
      ? ((e = new Uint8Array(t)).__proto__ = Buffer.prototype)
      : (null === e && (e = new Buffer(t)), (e.length = t)),
    e
  );
}
function Buffer(e, t, r) {
  if (!(Buffer.TYPED_ARRAY_SUPPORT || this instanceof Buffer))
    return new Buffer(e, t, r);
  if ("number" == typeof e) {
    if ("string" == typeof t)
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    return allocUnsafe(this, e);
  }
  return from(this, e, t, r);
}
function from(e, t, r, n) {
  if ("number" == typeof t)
    throw new TypeError('"value" argument must not be a number');
  return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer
    ? fromArrayBuffer(e, t, r, n)
    : "string" == typeof t
    ? fromString(e, t, r)
    : fromObject(e, t);
}
function assertSize(e) {
  if ("number" != typeof e)
    throw new TypeError('"size" argument must be a number');
  if (e < 0) throw new RangeError('"size" argument must not be negative');
}
function alloc(e, t, r, n) {
  return (
    assertSize(t),
    t <= 0
      ? createBuffer(e, t)
      : void 0 !== r
      ? "string" == typeof n
        ? createBuffer(e, t).fill(r, n)
        : createBuffer(e, t).fill(r)
      : createBuffer(e, t)
  );
}
function allocUnsafe(e, t) {
  if (
    (assertSize(t),
    (e = createBuffer(e, t < 0 ? 0 : 0 | checked(t))),
    !Buffer.TYPED_ARRAY_SUPPORT)
  )
    for (var r = 0; r < t; ++r) e[r] = 0;
  return e;
}
function fromString(e, t, r) {
  if (
    (("string" == typeof r && "" !== r) || (r = "utf8"), !Buffer.isEncoding(r))
  )
    throw new TypeError('"encoding" must be a valid string encoding');
  var n = 0 | byteLength(t, r),
    o = (e = createBuffer(e, n)).write(t, r);
  return o !== n && (e = e.slice(0, o)), e;
}
function fromArrayLike(e, t) {
  var r = t.length < 0 ? 0 : 0 | checked(t.length);
  e = createBuffer(e, r);
  for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
  return e;
}
function fromArrayBuffer(e, t, r, n) {
  if ((t.byteLength, r < 0 || t.byteLength < r))
    throw new RangeError("'offset' is out of bounds");
  if (t.byteLength < r + (n || 0))
    throw new RangeError("'length' is out of bounds");
  return (
    (t =
      void 0 === r && void 0 === n
        ? new Uint8Array(t)
        : void 0 === n
        ? new Uint8Array(t, r)
        : new Uint8Array(t, r, n)),
    Buffer.TYPED_ARRAY_SUPPORT
      ? ((e = t).__proto__ = Buffer.prototype)
      : (e = fromArrayLike(e, t)),
    e
  );
}
function fromObject(e, t) {
  if (internalIsBuffer(t)) {
    var r = 0 | checked(t.length);
    return 0 === (e = createBuffer(e, r)).length || t.copy(e, 0, 0, r), e;
  }
  if (t) {
    if (
      ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer) ||
      "length" in t
    )
      return "number" != typeof t.length || isnan(t.length)
        ? createBuffer(e, 0)
        : fromArrayLike(e, t);
    if ("Buffer" === t.type && isArray(t.data)) return fromArrayLike(e, t.data);
  }
  throw new TypeError(
    "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
  );
}
function checked(e) {
  if (e >= kMaxLength())
    throw new RangeError(
      "Attempt to allocate Buffer larger than maximum size: 0x" +
        kMaxLength().toString(16) +
        " bytes"
    );
  return 0 | e;
}
function SlowBuffer(e) {
  return +e != e && (e = 0), Buffer.alloc(+e);
}
function internalIsBuffer(e) {
  return !(null == e || !e._isBuffer);
}
function byteLength(e, t) {
  if (internalIsBuffer(e)) return e.length;
  if (
    "undefined" != typeof ArrayBuffer &&
    "function" == typeof ArrayBuffer.isView &&
    (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)
  )
    return e.byteLength;
  "string" != typeof e && (e = "" + e);
  var r = e.length;
  if (0 === r) return 0;
  for (var n = !1; ; )
    switch (t) {
      case "ascii":
      case "latin1":
      case "binary":
        return r;
      case "utf8":
      case "utf-8":
      case void 0:
        return utf8ToBytes(e).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return 2 * r;
      case "hex":
        return r >>> 1;
      case "base64":
        return base64ToBytes(e).length;
      default:
        if (n) return utf8ToBytes(e).length;
        (t = ("" + t).toLowerCase()), (n = !0);
    }
}
function slowToString(e, t, r) {
  var n = !1;
  if (((void 0 === t || t < 0) && (t = 0), t > this.length)) return "";
  if (((void 0 === r || r > this.length) && (r = this.length), r <= 0))
    return "";
  if ((r >>>= 0) <= (t >>>= 0)) return "";
  for (e || (e = "utf8"); ; )
    switch (e) {
      case "hex":
        return hexSlice(this, t, r);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, t, r);
      case "ascii":
        return asciiSlice(this, t, r);
      case "latin1":
      case "binary":
        return latin1Slice(this, t, r);
      case "base64":
        return base64Slice(this, t, r);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, t, r);
      default:
        if (n) throw new TypeError("Unknown encoding: " + e);
        (e = (e + "").toLowerCase()), (n = !0);
    }
}
function swap(e, t, r) {
  var n = e[t];
  (e[t] = e[r]), (e[r] = n);
}
function bidirectionalIndexOf(e, t, r, n, o) {
  if (0 === e.length) return -1;
  if (
    ("string" == typeof r
      ? ((n = r), (r = 0))
      : r > 2147483647
      ? (r = 2147483647)
      : r < -2147483648 && (r = -2147483648),
    (r = +r),
    isNaN(r) && (r = o ? 0 : e.length - 1),
    r < 0 && (r = e.length + r),
    r >= e.length)
  ) {
    if (o) return -1;
    r = e.length - 1;
  } else if (r < 0) {
    if (!o) return -1;
    r = 0;
  }
  if (("string" == typeof t && (t = Buffer.from(t, n)), internalIsBuffer(t)))
    return 0 === t.length ? -1 : arrayIndexOf(e, t, r, n, o);
  if ("number" == typeof t)
    return (
      (t &= 255),
      Buffer.TYPED_ARRAY_SUPPORT &&
      "function" == typeof Uint8Array.prototype.indexOf
        ? o
          ? Uint8Array.prototype.indexOf.call(e, t, r)
          : Uint8Array.prototype.lastIndexOf.call(e, t, r)
        : arrayIndexOf(e, [t], r, n, o)
    );
  throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(e, t, r, n, o) {
  var a,
    i = 1,
    s = e.length,
    u = t.length;
  if (
    void 0 !== n &&
    ("ucs2" === (n = String(n).toLowerCase()) ||
      "ucs-2" === n ||
      "utf16le" === n ||
      "utf-16le" === n)
  ) {
    if (e.length < 2 || t.length < 2) return -1;
    (i = 2), (s /= 2), (u /= 2), (r /= 2);
  }
  function c(e, t) {
    return 1 === i ? e[t] : e.readUInt16BE(t * i);
  }
  if (o) {
    var l = -1;
    for (a = r; a < s; a++)
      if (c(e, a) === c(t, -1 === l ? 0 : a - l)) {
        if ((-1 === l && (l = a), a - l + 1 === u)) return l * i;
      } else -1 !== l && (a -= a - l), (l = -1);
  } else
    for (r + u > s && (r = s - u), a = r; a >= 0; a--) {
      for (var f = !0, p = 0; p < u; p++)
        if (c(e, a + p) !== c(t, p)) {
          f = !1;
          break;
        }
      if (f) return a;
    }
  return -1;
}
function hexWrite(e, t, r, n) {
  r = Number(r) || 0;
  var o = e.length - r;
  n ? (n = Number(n)) > o && (n = o) : (n = o);
  var a = t.length;
  if (a % 2 != 0) throw new TypeError("Invalid hex string");
  n > a / 2 && (n = a / 2);
  for (var i = 0; i < n; ++i) {
    var s = parseInt(t.substr(2 * i, 2), 16);
    if (isNaN(s)) return i;
    e[r + i] = s;
  }
  return i;
}
function utf8Write(e, t, r, n) {
  return blitBuffer(utf8ToBytes(t, e.length - r), e, r, n);
}
function asciiWrite(e, t, r, n) {
  return blitBuffer(asciiToBytes(t), e, r, n);
}
function latin1Write(e, t, r, n) {
  return asciiWrite(e, t, r, n);
}
function base64Write(e, t, r, n) {
  return blitBuffer(base64ToBytes(t), e, r, n);
}
function ucs2Write(e, t, r, n) {
  return blitBuffer(utf16leToBytes(t, e.length - r), e, r, n);
}
function base64Slice(e, t, r) {
  return 0 === t && r === e.length
    ? fromByteArray(e)
    : fromByteArray(e.slice(t, r));
}
function utf8Slice(e, t, r) {
  r = Math.min(e.length, r);
  for (var n = [], o = t; o < r; ) {
    var a,
      i,
      s,
      u,
      c = e[o],
      l = null,
      f = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
    if (o + f <= r)
      switch (f) {
        case 1:
          c < 128 && (l = c);
          break;
        case 2:
          128 == (192 & (a = e[o + 1])) &&
            (u = ((31 & c) << 6) | (63 & a)) > 127 &&
            (l = u);
          break;
        case 3:
          (a = e[o + 1]),
            (i = e[o + 2]),
            128 == (192 & a) &&
              128 == (192 & i) &&
              (u = ((15 & c) << 12) | ((63 & a) << 6) | (63 & i)) > 2047 &&
              (u < 55296 || u > 57343) &&
              (l = u);
          break;
        case 4:
          (a = e[o + 1]),
            (i = e[o + 2]),
            (s = e[o + 3]),
            128 == (192 & a) &&
              128 == (192 & i) &&
              128 == (192 & s) &&
              (u =
                ((15 & c) << 18) |
                ((63 & a) << 12) |
                ((63 & i) << 6) |
                (63 & s)) > 65535 &&
              u < 1114112 &&
              (l = u);
      }
    null === l
      ? ((l = 65533), (f = 1))
      : l > 65535 &&
        ((l -= 65536),
        n.push(((l >>> 10) & 1023) | 55296),
        (l = 56320 | (1023 & l))),
      n.push(l),
      (o += f);
  }
  return decodeCodePointsArray(n);
}
(Buffer.poolSize = 8192),
  (Buffer._augment = function (e) {
    return (e.__proto__ = Buffer.prototype), e;
  }),
  (Buffer.from = function (e, t, r) {
    return from(null, e, t, r);
  }),
  Buffer.TYPED_ARRAY_SUPPORT &&
    ((Buffer.prototype.__proto__ = Uint8Array.prototype),
    (Buffer.__proto__ = Uint8Array)),
  (Buffer.alloc = function (e, t, r) {
    return alloc(null, e, t, r);
  }),
  (Buffer.allocUnsafe = function (e) {
    return allocUnsafe(null, e);
  }),
  (Buffer.allocUnsafeSlow = function (e) {
    return allocUnsafe(null, e);
  }),
  (Buffer.isBuffer = isBuffer),
  (Buffer.compare = function (e, t) {
    if (!internalIsBuffer(e) || !internalIsBuffer(t))
      throw new TypeError("Arguments must be Buffers");
    if (e === t) return 0;
    for (var r = e.length, n = t.length, o = 0, a = Math.min(r, n); o < a; ++o)
      if (e[o] !== t[o]) {
        (r = e[o]), (n = t[o]);
        break;
      }
    return r < n ? -1 : n < r ? 1 : 0;
  }),
  (Buffer.isEncoding = function (e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  }),
  (Buffer.concat = function (e, t) {
    if (!isArray(e))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (0 === e.length) return Buffer.alloc(0);
    var r;
    if (void 0 === t) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
    var n = Buffer.allocUnsafe(t),
      o = 0;
    for (r = 0; r < e.length; ++r) {
      var a = e[r];
      if (!internalIsBuffer(a))
        throw new TypeError('"list" argument must be an Array of Buffers');
      a.copy(n, o), (o += a.length);
    }
    return n;
  }),
  (Buffer.byteLength = byteLength),
  (Buffer.prototype._isBuffer = !0),
  (Buffer.prototype.swap16 = function () {
    var e = this.length;
    if (e % 2 != 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (var t = 0; t < e; t += 2) swap(this, t, t + 1);
    return this;
  }),
  (Buffer.prototype.swap32 = function () {
    var e = this.length;
    if (e % 4 != 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (var t = 0; t < e; t += 4)
      swap(this, t, t + 3), swap(this, t + 1, t + 2);
    return this;
  }),
  (Buffer.prototype.swap64 = function () {
    var e = this.length;
    if (e % 8 != 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (var t = 0; t < e; t += 8)
      swap(this, t, t + 7),
        swap(this, t + 1, t + 6),
        swap(this, t + 2, t + 5),
        swap(this, t + 3, t + 4);
    return this;
  }),
  (Buffer.prototype.toString = function () {
    var e = 0 | this.length;
    return 0 === e
      ? ""
      : 0 === arguments.length
      ? utf8Slice(this, 0, e)
      : slowToString.apply(this, arguments);
  }),
  (Buffer.prototype.equals = function (e) {
    if (!internalIsBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e || 0 === Buffer.compare(this, e);
  }),
  (Buffer.prototype.inspect = function () {
    var e = "",
      t = INSPECT_MAX_BYTES;
    return (
      this.length > 0 &&
        ((e = this.toString("hex", 0, t).match(/.{2}/g).join(" ")),
        this.length > t && (e += " ... ")),
      "<Buffer " + e + ">"
    );
  }),
  (Buffer.prototype.compare = function (e, t, r, n, o) {
    if (!internalIsBuffer(e)) throw new TypeError("Argument must be a Buffer");
    if (
      (void 0 === t && (t = 0),
      void 0 === r && (r = e ? e.length : 0),
      void 0 === n && (n = 0),
      void 0 === o && (o = this.length),
      t < 0 || r > e.length || n < 0 || o > this.length)
    )
      throw new RangeError("out of range index");
    if (n >= o && t >= r) return 0;
    if (n >= o) return -1;
    if (t >= r) return 1;
    if (this === e) return 0;
    for (
      var a = (o >>>= 0) - (n >>>= 0),
        i = (r >>>= 0) - (t >>>= 0),
        s = Math.min(a, i),
        u = this.slice(n, o),
        c = e.slice(t, r),
        l = 0;
      l < s;
      ++l
    )
      if (u[l] !== c[l]) {
        (a = u[l]), (i = c[l]);
        break;
      }
    return a < i ? -1 : i < a ? 1 : 0;
  }),
  (Buffer.prototype.includes = function (e, t, r) {
    return -1 !== this.indexOf(e, t, r);
  }),
  (Buffer.prototype.indexOf = function (e, t, r) {
    return bidirectionalIndexOf(this, e, t, r, !0);
  }),
  (Buffer.prototype.lastIndexOf = function (e, t, r) {
    return bidirectionalIndexOf(this, e, t, r, !1);
  }),
  (Buffer.prototype.write = function (e, t, r, n) {
    if (void 0 === t) (n = "utf8"), (r = this.length), (t = 0);
    else if (void 0 === r && "string" == typeof t)
      (n = t), (r = this.length), (t = 0);
    else {
      if (!isFinite(t))
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      (t |= 0),
        isFinite(r)
          ? ((r |= 0), void 0 === n && (n = "utf8"))
          : ((n = r), (r = void 0));
    }
    var o = this.length - t;
    if (
      ((void 0 === r || r > o) && (r = o),
      (e.length > 0 && (r < 0 || t < 0)) || t > this.length)
    )
      throw new RangeError("Attempt to write outside buffer bounds");
    n || (n = "utf8");
    for (var a = !1; ; )
      switch (n) {
        case "hex":
          return hexWrite(this, e, t, r);
        case "utf8":
        case "utf-8":
          return utf8Write(this, e, t, r);
        case "ascii":
          return asciiWrite(this, e, t, r);
        case "latin1":
        case "binary":
          return latin1Write(this, e, t, r);
        case "base64":
          return base64Write(this, e, t, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return ucs2Write(this, e, t, r);
        default:
          if (a) throw new TypeError("Unknown encoding: " + n);
          (n = ("" + n).toLowerCase()), (a = !0);
      }
  }),
  (Buffer.prototype.toJSON = function () {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0),
    };
  });
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(e) {
  var t = e.length;
  if (t <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, e);
  for (var r = "", n = 0; n < t; )
    r += String.fromCharCode.apply(
      String,
      e.slice(n, (n += MAX_ARGUMENTS_LENGTH))
    );
  return r;
}
function asciiSlice(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);
  for (var o = t; o < r; ++o) n += String.fromCharCode(127 & e[o]);
  return n;
}
function latin1Slice(e, t, r) {
  var n = "";
  r = Math.min(e.length, r);
  for (var o = t; o < r; ++o) n += String.fromCharCode(e[o]);
  return n;
}
function hexSlice(e, t, r) {
  var n = e.length;
  (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
  for (var o = "", a = t; a < r; ++a) o += toHex(e[a]);
  return o;
}
function utf16leSlice(e, t, r) {
  for (var n = e.slice(t, r), o = "", a = 0; a < n.length; a += 2)
    o += String.fromCharCode(n[a] + 256 * n[a + 1]);
  return o;
}
function checkOffset(e, t, r) {
  if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
  if (e + t > r) throw new RangeError("Trying to access beyond buffer length");
}
function checkInt(e, t, r, n, o, a) {
  if (!internalIsBuffer(e))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (t > o || t < a) throw new RangeError('"value" argument is out of bounds');
  if (r + n > e.length) throw new RangeError("Index out of range");
}
function objectWriteUInt16(e, t, r, n) {
  t < 0 && (t = 65535 + t + 1);
  for (var o = 0, a = Math.min(e.length - r, 2); o < a; ++o)
    e[r + o] = (t & (255 << (8 * (n ? o : 1 - o)))) >>> (8 * (n ? o : 1 - o));
}
function objectWriteUInt32(e, t, r, n) {
  t < 0 && (t = 4294967295 + t + 1);
  for (var o = 0, a = Math.min(e.length - r, 4); o < a; ++o)
    e[r + o] = (t >>> (8 * (n ? o : 3 - o))) & 255;
}
function checkIEEE754(e, t, r, n, o, a) {
  if (r + n > e.length) throw new RangeError("Index out of range");
  if (r < 0) throw new RangeError("Index out of range");
}
function writeFloat(e, t, r, n, o) {
  return o || checkIEEE754(e, t, r, 4), write(e, t, r, n, 23, 4), r + 4;
}
function writeDouble(e, t, r, n, o) {
  return o || checkIEEE754(e, t, r, 8), write(e, t, r, n, 52, 8), r + 8;
}
(Buffer.prototype.slice = function (e, t) {
  var r,
    n = this.length;
  if (
    ((e = ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
    (t = void 0 === t ? n : ~~t) < 0
      ? (t += n) < 0 && (t = 0)
      : t > n && (t = n),
    t < e && (t = e),
    Buffer.TYPED_ARRAY_SUPPORT)
  )
    (r = this.subarray(e, t)).__proto__ = Buffer.prototype;
  else {
    var o = t - e;
    r = new Buffer(o, void 0);
    for (var a = 0; a < o; ++a) r[a] = this[a + e];
  }
  return r;
}),
  (Buffer.prototype.readUIntLE = function (e, t, r) {
    (e |= 0), (t |= 0), r || checkOffset(e, t, this.length);
    for (var n = this[e], o = 1, a = 0; ++a < t && (o *= 256); )
      n += this[e + a] * o;
    return n;
  }),
  (Buffer.prototype.readUIntBE = function (e, t, r) {
    (e |= 0), (t |= 0), r || checkOffset(e, t, this.length);
    for (var n = this[e + --t], o = 1; t > 0 && (o *= 256); )
      n += this[e + --t] * o;
    return n;
  }),
  (Buffer.prototype.readUInt8 = function (e, t) {
    return t || checkOffset(e, 1, this.length), this[e];
  }),
  (Buffer.prototype.readUInt16LE = function (e, t) {
    return t || checkOffset(e, 2, this.length), this[e] | (this[e + 1] << 8);
  }),
  (Buffer.prototype.readUInt16BE = function (e, t) {
    return t || checkOffset(e, 2, this.length), (this[e] << 8) | this[e + 1];
  }),
  (Buffer.prototype.readUInt32LE = function (e, t) {
    return (
      t || checkOffset(e, 4, this.length),
      (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) +
        16777216 * this[e + 3]
    );
  }),
  (Buffer.prototype.readUInt32BE = function (e, t) {
    return (
      t || checkOffset(e, 4, this.length),
      16777216 * this[e] +
        ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
    );
  }),
  (Buffer.prototype.readIntLE = function (e, t, r) {
    (e |= 0), (t |= 0), r || checkOffset(e, t, this.length);
    for (var n = this[e], o = 1, a = 0; ++a < t && (o *= 256); )
      n += this[e + a] * o;
    return n >= (o *= 128) && (n -= Math.pow(2, 8 * t)), n;
  }),
  (Buffer.prototype.readIntBE = function (e, t, r) {
    (e |= 0), (t |= 0), r || checkOffset(e, t, this.length);
    for (var n = t, o = 1, a = this[e + --n]; n > 0 && (o *= 256); )
      a += this[e + --n] * o;
    return a >= (o *= 128) && (a -= Math.pow(2, 8 * t)), a;
  }),
  (Buffer.prototype.readInt8 = function (e, t) {
    return (
      t || checkOffset(e, 1, this.length),
      128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
    );
  }),
  (Buffer.prototype.readInt16LE = function (e, t) {
    t || checkOffset(e, 2, this.length);
    var r = this[e] | (this[e + 1] << 8);
    return 32768 & r ? 4294901760 | r : r;
  }),
  (Buffer.prototype.readInt16BE = function (e, t) {
    t || checkOffset(e, 2, this.length);
    var r = this[e + 1] | (this[e] << 8);
    return 32768 & r ? 4294901760 | r : r;
  }),
  (Buffer.prototype.readInt32LE = function (e, t) {
    return (
      t || checkOffset(e, 4, this.length),
      this[e] | (this[e + 1] << 8) | (this[e + 2] << 16) | (this[e + 3] << 24)
    );
  }),
  (Buffer.prototype.readInt32BE = function (e, t) {
    return (
      t || checkOffset(e, 4, this.length),
      (this[e] << 24) | (this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3]
    );
  }),
  (Buffer.prototype.readFloatLE = function (e, t) {
    return t || checkOffset(e, 4, this.length), read(this, e, !0, 23, 4);
  }),
  (Buffer.prototype.readFloatBE = function (e, t) {
    return t || checkOffset(e, 4, this.length), read(this, e, !1, 23, 4);
  }),
  (Buffer.prototype.readDoubleLE = function (e, t) {
    return t || checkOffset(e, 8, this.length), read(this, e, !0, 52, 8);
  }),
  (Buffer.prototype.readDoubleBE = function (e, t) {
    return t || checkOffset(e, 8, this.length), read(this, e, !1, 52, 8);
  }),
  (Buffer.prototype.writeUIntLE = function (e, t, r, n) {
    (e = +e),
      (t |= 0),
      (r |= 0),
      n || checkInt(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
    var o = 1,
      a = 0;
    for (this[t] = 255 & e; ++a < r && (o *= 256); )
      this[t + a] = (e / o) & 255;
    return t + r;
  }),
  (Buffer.prototype.writeUIntBE = function (e, t, r, n) {
    (e = +e),
      (t |= 0),
      (r |= 0),
      n || checkInt(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
    var o = r - 1,
      a = 1;
    for (this[t + o] = 255 & e; --o >= 0 && (a *= 256); )
      this[t + o] = (e / a) & 255;
    return t + r;
  }),
  (Buffer.prototype.writeUInt8 = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 1, 255, 0),
      Buffer.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
      (this[t] = 255 & e),
      t + 1
    );
  }),
  (Buffer.prototype.writeUInt16LE = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 2, 65535, 0),
      Buffer.TYPED_ARRAY_SUPPORT
        ? ((this[t] = 255 & e), (this[t + 1] = e >>> 8))
        : objectWriteUInt16(this, e, t, !0),
      t + 2
    );
  }),
  (Buffer.prototype.writeUInt16BE = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 2, 65535, 0),
      Buffer.TYPED_ARRAY_SUPPORT
        ? ((this[t] = e >>> 8), (this[t + 1] = 255 & e))
        : objectWriteUInt16(this, e, t, !1),
      t + 2
    );
  }),
  (Buffer.prototype.writeUInt32LE = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 4, 4294967295, 0),
      Buffer.TYPED_ARRAY_SUPPORT
        ? ((this[t + 3] = e >>> 24),
          (this[t + 2] = e >>> 16),
          (this[t + 1] = e >>> 8),
          (this[t] = 255 & e))
        : objectWriteUInt32(this, e, t, !0),
      t + 4
    );
  }),
  (Buffer.prototype.writeUInt32BE = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 4, 4294967295, 0),
      Buffer.TYPED_ARRAY_SUPPORT
        ? ((this[t] = e >>> 24),
          (this[t + 1] = e >>> 16),
          (this[t + 2] = e >>> 8),
          (this[t + 3] = 255 & e))
        : objectWriteUInt32(this, e, t, !1),
      t + 4
    );
  }),
  (Buffer.prototype.writeIntLE = function (e, t, r, n) {
    if (((e = +e), (t |= 0), !n)) {
      var o = Math.pow(2, 8 * r - 1);
      checkInt(this, e, t, r, o - 1, -o);
    }
    var a = 0,
      i = 1,
      s = 0;
    for (this[t] = 255 & e; ++a < r && (i *= 256); )
      e < 0 && 0 === s && 0 !== this[t + a - 1] && (s = 1),
        (this[t + a] = (((e / i) >> 0) - s) & 255);
    return t + r;
  }),
  (Buffer.prototype.writeIntBE = function (e, t, r, n) {
    if (((e = +e), (t |= 0), !n)) {
      var o = Math.pow(2, 8 * r - 1);
      checkInt(this, e, t, r, o - 1, -o);
    }
    var a = r - 1,
      i = 1,
      s = 0;
    for (this[t + a] = 255 & e; --a >= 0 && (i *= 256); )
      e < 0 && 0 === s && 0 !== this[t + a + 1] && (s = 1),
        (this[t + a] = (((e / i) >> 0) - s) & 255);
    return t + r;
  }),
  (Buffer.prototype.writeInt8 = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 1, 127, -128),
      Buffer.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)),
      e < 0 && (e = 255 + e + 1),
      (this[t] = 255 & e),
      t + 1
    );
  }),
  (Buffer.prototype.writeInt16LE = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 2, 32767, -32768),
      Buffer.TYPED_ARRAY_SUPPORT
        ? ((this[t] = 255 & e), (this[t + 1] = e >>> 8))
        : objectWriteUInt16(this, e, t, !0),
      t + 2
    );
  }),
  (Buffer.prototype.writeInt16BE = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 2, 32767, -32768),
      Buffer.TYPED_ARRAY_SUPPORT
        ? ((this[t] = e >>> 8), (this[t + 1] = 255 & e))
        : objectWriteUInt16(this, e, t, !1),
      t + 2
    );
  }),
  (Buffer.prototype.writeInt32LE = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 4, 2147483647, -2147483648),
      Buffer.TYPED_ARRAY_SUPPORT
        ? ((this[t] = 255 & e),
          (this[t + 1] = e >>> 8),
          (this[t + 2] = e >>> 16),
          (this[t + 3] = e >>> 24))
        : objectWriteUInt32(this, e, t, !0),
      t + 4
    );
  }),
  (Buffer.prototype.writeInt32BE = function (e, t, r) {
    return (
      (e = +e),
      (t |= 0),
      r || checkInt(this, e, t, 4, 2147483647, -2147483648),
      e < 0 && (e = 4294967295 + e + 1),
      Buffer.TYPED_ARRAY_SUPPORT
        ? ((this[t] = e >>> 24),
          (this[t + 1] = e >>> 16),
          (this[t + 2] = e >>> 8),
          (this[t + 3] = 255 & e))
        : objectWriteUInt32(this, e, t, !1),
      t + 4
    );
  }),
  (Buffer.prototype.writeFloatLE = function (e, t, r) {
    return writeFloat(this, e, t, !0, r);
  }),
  (Buffer.prototype.writeFloatBE = function (e, t, r) {
    return writeFloat(this, e, t, !1, r);
  }),
  (Buffer.prototype.writeDoubleLE = function (e, t, r) {
    return writeDouble(this, e, t, !0, r);
  }),
  (Buffer.prototype.writeDoubleBE = function (e, t, r) {
    return writeDouble(this, e, t, !1, r);
  }),
  (Buffer.prototype.copy = function (e, t, r, n) {
    if (
      (r || (r = 0),
      n || 0 === n || (n = this.length),
      t >= e.length && (t = e.length),
      t || (t = 0),
      n > 0 && n < r && (n = r),
      n === r)
    )
      return 0;
    if (0 === e.length || 0 === this.length) return 0;
    if (t < 0) throw new RangeError("targetStart out of bounds");
    if (r < 0 || r >= this.length)
      throw new RangeError("sourceStart out of bounds");
    if (n < 0) throw new RangeError("sourceEnd out of bounds");
    n > this.length && (n = this.length),
      e.length - t < n - r && (n = e.length - t + r);
    var o,
      a = n - r;
    if (this === e && r < t && t < n)
      for (o = a - 1; o >= 0; --o) e[o + t] = this[o + r];
    else if (a < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT)
      for (o = 0; o < a; ++o) e[o + t] = this[o + r];
    else Uint8Array.prototype.set.call(e, this.subarray(r, r + a), t);
    return a;
  }),
  (Buffer.prototype.fill = function (e, t, r, n) {
    if ("string" == typeof e) {
      if (
        ("string" == typeof t
          ? ((n = t), (t = 0), (r = this.length))
          : "string" == typeof r && ((n = r), (r = this.length)),
        1 === e.length)
      ) {
        var o = e.charCodeAt(0);
        o < 256 && (e = o);
      }
      if (void 0 !== n && "string" != typeof n)
        throw new TypeError("encoding must be a string");
      if ("string" == typeof n && !Buffer.isEncoding(n))
        throw new TypeError("Unknown encoding: " + n);
    } else "number" == typeof e && (e &= 255);
    if (t < 0 || this.length < t || this.length < r)
      throw new RangeError("Out of range index");
    if (r <= t) return this;
    var a;
    if (
      ((t >>>= 0),
      (r = void 0 === r ? this.length : r >>> 0),
      e || (e = 0),
      "number" == typeof e)
    )
      for (a = t; a < r; ++a) this[a] = e;
    else {
      var i = internalIsBuffer(e)
          ? e
          : utf8ToBytes(new Buffer(e, n).toString()),
        s = i.length;
      for (a = 0; a < r - t; ++a) this[a + t] = i[a % s];
    }
    return this;
  });
var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
function base64clean(e) {
  if ((e = stringtrim(e).replace(INVALID_BASE64_RE, "")).length < 2) return "";
  for (; e.length % 4 != 0; ) e += "=";
  return e;
}
function stringtrim(e) {
  return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "");
}
function toHex(e) {
  return e < 16 ? "0" + e.toString(16) : e.toString(16);
}
function utf8ToBytes(e, t) {
  var r;
  t = t || 1 / 0;
  for (var n = e.length, o = null, a = [], i = 0; i < n; ++i) {
    if ((r = e.charCodeAt(i)) > 55295 && r < 57344) {
      if (!o) {
        if (r > 56319) {
          (t -= 3) > -1 && a.push(239, 191, 189);
          continue;
        }
        if (i + 1 === n) {
          (t -= 3) > -1 && a.push(239, 191, 189);
          continue;
        }
        o = r;
        continue;
      }
      if (r < 56320) {
        (t -= 3) > -1 && a.push(239, 191, 189), (o = r);
        continue;
      }
      r = 65536 + (((o - 55296) << 10) | (r - 56320));
    } else o && (t -= 3) > -1 && a.push(239, 191, 189);
    if (((o = null), r < 128)) {
      if ((t -= 1) < 0) break;
      a.push(r);
    } else if (r < 2048) {
      if ((t -= 2) < 0) break;
      a.push((r >> 6) | 192, (63 & r) | 128);
    } else if (r < 65536) {
      if ((t -= 3) < 0) break;
      a.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
    } else {
      if (!(r < 1114112)) throw new Error("Invalid code point");
      if ((t -= 4) < 0) break;
      a.push(
        (r >> 18) | 240,
        ((r >> 12) & 63) | 128,
        ((r >> 6) & 63) | 128,
        (63 & r) | 128
      );
    }
  }
  return a;
}
function asciiToBytes(e) {
  for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
  return t;
}
function utf16leToBytes(e, t) {
  for (var r, n, o, a = [], i = 0; i < e.length && !((t -= 2) < 0); ++i)
    (n = (r = e.charCodeAt(i)) >> 8), (o = r % 256), a.push(o), a.push(n);
  return a;
}
function base64ToBytes(e) {
  return toByteArray(base64clean(e));
}
function blitBuffer(e, t, r, n) {
  for (var o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o)
    t[o + r] = e[o];
  return o;
}
function isnan(e) {
  return e != e;
}
function isBuffer(e) {
  return null != e && (!!e._isBuffer || isFastBuffer(e) || isSlowBuffer(e));
}
function isFastBuffer(e) {
  return (
    !!e.constructor &&
    "function" == typeof e.constructor.isBuffer &&
    e.constructor.isBuffer(e)
  );
}
function isSlowBuffer(e) {
  return (
    "function" == typeof e.readFloatLE &&
    "function" == typeof e.slice &&
    isFastBuffer(e.slice(0, 0))
  );
}
var bufferEs6 = Object.freeze({
    __proto__: null,
    INSPECT_MAX_BYTES,
    kMaxLength: _kMaxLength,
    Buffer,
    SlowBuffer,
    isBuffer,
  }),
  global$2 =
    ("undefined" != typeof globalThis && globalThis) ||
    ("undefined" != typeof self && self) ||
    (void 0 !== global$2 && global$2),
  support = {
    searchParams: "URLSearchParams" in global$2,
    iterable: "Symbol" in global$2 && "iterator" in Symbol,
    blob:
      "FileReader" in global$2 &&
      "Blob" in global$2 &&
      (function () {
        try {
          return new Blob(), !0;
        } catch (e) {
          return !1;
        }
      })(),
    formData: "FormData" in global$2,
    arrayBuffer: "ArrayBuffer" in global$2,
  };
function isDataView(e) {
  return e && DataView.prototype.isPrototypeOf(e);
}
if (support.arrayBuffer)
  var viewClasses = [
      "[object Int8Array]",
      "[object Uint8Array]",
      "[object Uint8ClampedArray]",
      "[object Int16Array]",
      "[object Uint16Array]",
      "[object Int32Array]",
      "[object Uint32Array]",
      "[object Float32Array]",
      "[object Float64Array]",
    ],
    isArrayBufferView =
      ArrayBuffer.isView ||
      function (e) {
        return e && viewClasses.indexOf(Object.prototype.toString.call(e)) > -1;
      };
function normalizeName(e) {
  if (
    ("string" != typeof e && (e = String(e)),
    /[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(e) || "" === e)
  )
    throw new TypeError("Invalid character in header field name");
  return e.toLowerCase();
}
function normalizeValue(e) {
  return "string" != typeof e && (e = String(e)), e;
}
function iteratorFor(e) {
  var t = {
    next: function () {
      var t = e.shift();
      return {
        done: void 0 === t,
        value: t,
      };
    },
  };
  return (
    support.iterable &&
      (t[Symbol.iterator] = function () {
        return t;
      }),
    t
  );
}
function Headers(e) {
  (this.map = {}),
    e instanceof Headers
      ? e.forEach(function (e, t) {
          this.append(t, e);
        }, this)
      : Array.isArray(e)
      ? e.forEach(function (e) {
          this.append(e[0], e[1]);
        }, this)
      : e &&
        Object.getOwnPropertyNames(e).forEach(function (t) {
          this.append(t, e[t]);
        }, this);
}
function consumed(e) {
  if (e.bodyUsed) return Promise.reject(new TypeError("Already read"));
  e.bodyUsed = !0;
}
function fileReaderReady(e) {
  return new Promise(function (t, r) {
    (e.onload = function () {
      t(e.result);
    }),
      (e.onerror = function () {
        r(e.error);
      });
  });
}
function readBlobAsArrayBuffer(e) {
  var t = new FileReader(),
    r = fileReaderReady(t);
  return t.readAsArrayBuffer(e), r;
}
function readBlobAsText(e) {
  var t = new FileReader(),
    r = fileReaderReady(t);
  return t.readAsText(e), r;
}
function readArrayBufferAsText(e) {
  for (
    var t = new Uint8Array(e), r = new Array(t.length), n = 0;
    n < t.length;
    n++
  )
    r[n] = String.fromCharCode(t[n]);
  return r.join("");
}
function bufferClone(e) {
  if (e.slice) return e.slice(0);
  var t = new Uint8Array(e.byteLength);
  return t.set(new Uint8Array(e)), t.buffer;
}
function Body() {
  return (
    (this.bodyUsed = !1),
    (this._initBody = function (e) {
      (this.bodyUsed = this.bodyUsed),
        (this._bodyInit = e),
        e
          ? "string" == typeof e
            ? (this._bodyText = e)
            : support.blob && Blob.prototype.isPrototypeOf(e)
            ? (this._bodyBlob = e)
            : support.formData && FormData.prototype.isPrototypeOf(e)
            ? (this._bodyFormData = e)
            : support.searchParams && URLSearchParams.prototype.isPrototypeOf(e)
            ? (this._bodyText = e.toString())
            : support.arrayBuffer && support.blob && isDataView(e)
            ? ((this._bodyArrayBuffer = bufferClone(e.buffer)),
              (this._bodyInit = new Blob([this._bodyArrayBuffer])))
            : support.arrayBuffer &&
              (ArrayBuffer.prototype.isPrototypeOf(e) || isArrayBufferView(e))
            ? (this._bodyArrayBuffer = bufferClone(e))
            : (this._bodyText = e = Object.prototype.toString.call(e))
          : (this._bodyText = ""),
        this.headers.get("content-type") ||
          ("string" == typeof e
            ? this.headers.set("content-type", "text/plain;charset=UTF-8")
            : this._bodyBlob && this._bodyBlob.type
            ? this.headers.set("content-type", this._bodyBlob.type)
            : support.searchParams &&
              URLSearchParams.prototype.isPrototypeOf(e) &&
              this.headers.set(
                "content-type",
                "application/x-www-form-urlencoded;charset=UTF-8"
              ));
    }),
    support.blob &&
      ((this.blob = function () {
        var e = consumed(this);
        if (e) return e;
        if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
        if (this._bodyArrayBuffer)
          return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        if (this._bodyFormData)
          throw new Error("could not read FormData body as blob");
        return Promise.resolve(new Blob([this._bodyText]));
      }),
      (this.arrayBuffer = function () {
        return this._bodyArrayBuffer
          ? consumed(this) ||
              (ArrayBuffer.isView(this._bodyArrayBuffer)
                ? Promise.resolve(
                    this._bodyArrayBuffer.buffer.slice(
                      this._bodyArrayBuffer.byteOffset,
                      this._bodyArrayBuffer.byteOffset +
                        this._bodyArrayBuffer.byteLength
                    )
                  )
                : Promise.resolve(this._bodyArrayBuffer))
          : this.blob().then(readBlobAsArrayBuffer);
      })),
    (this.text = function () {
      var e = consumed(this);
      if (e) return e;
      if (this._bodyBlob) return readBlobAsText(this._bodyBlob);
      if (this._bodyArrayBuffer)
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
      if (this._bodyFormData)
        throw new Error("could not read FormData body as text");
      return Promise.resolve(this._bodyText);
    }),
    support.formData &&
      (this.formData = function () {
        return this.text().then(decode);
      }),
    (this.json = function () {
      return this.text().then(JSON.parse);
    }),
    this
  );
}
(Headers.prototype.append = function (e, t) {
  (e = normalizeName(e)), (t = normalizeValue(t));
  var r = this.map[e];
  this.map[e] = r ? r + ", " + t : t;
}),
  (Headers.prototype.delete = function (e) {
    delete this.map[normalizeName(e)];
  }),
  (Headers.prototype.get = function (e) {
    return (e = normalizeName(e)), this.has(e) ? this.map[e] : null;
  }),
  (Headers.prototype.has = function (e) {
    return this.map.hasOwnProperty(normalizeName(e));
  }),
  (Headers.prototype.set = function (e, t) {
    this.map[normalizeName(e)] = normalizeValue(t);
  }),
  (Headers.prototype.forEach = function (e, t) {
    for (var r in this.map)
      this.map.hasOwnProperty(r) && e.call(t, this.map[r], r, this);
  }),
  (Headers.prototype.keys = function () {
    var e = [];
    return (
      this.forEach(function (t, r) {
        e.push(r);
      }),
      iteratorFor(e)
    );
  }),
  (Headers.prototype.values = function () {
    var e = [];
    return (
      this.forEach(function (t) {
        e.push(t);
      }),
      iteratorFor(e)
    );
  }),
  (Headers.prototype.entries = function () {
    var e = [];
    return (
      this.forEach(function (t, r) {
        e.push([r, t]);
      }),
      iteratorFor(e)
    );
  }),
  support.iterable &&
    (Headers.prototype[Symbol.iterator] = Headers.prototype.entries);
var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
function normalizeMethod(e) {
  var t = e.toUpperCase();
  return methods.indexOf(t) > -1 ? t : e;
}
function Request(e, t) {
  if (!(this instanceof Request))
    throw new TypeError(
      'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
    );
  var r = (t = t || {}).body;
  if (e instanceof Request) {
    if (e.bodyUsed) throw new TypeError("Already read");
    (this.url = e.url),
      (this.credentials = e.credentials),
      t.headers || (this.headers = new Headers(e.headers)),
      (this.method = e.method),
      (this.mode = e.mode),
      (this.signal = e.signal),
      r || null == e._bodyInit || ((r = e._bodyInit), (e.bodyUsed = !0));
  } else this.url = String(e);
  if (
    ((this.credentials = t.credentials || this.credentials || "same-origin"),
    (!t.headers && this.headers) || (this.headers = new Headers(t.headers)),
    (this.method = normalizeMethod(t.method || this.method || "GET")),
    (this.mode = t.mode || this.mode || null),
    (this.signal = t.signal || this.signal),
    (this.referrer = null),
    ("GET" === this.method || "HEAD" === this.method) && r)
  )
    throw new TypeError("Body not allowed for GET or HEAD requests");
  if (
    (this._initBody(r),
    !(
      ("GET" !== this.method && "HEAD" !== this.method) ||
      ("no-store" !== t.cache && "no-cache" !== t.cache)
    ))
  ) {
    var n = /([?&])_=[^&]*/;
    n.test(this.url)
      ? (this.url = this.url.replace(n, "$1_=" + new Date().getTime()))
      : (this.url +=
          (/\?/.test(this.url) ? "&" : "?") + "_=" + new Date().getTime());
  }
}
function decode(e) {
  var t = new FormData();
  return (
    e
      .trim()
      .split("&")
      .forEach(function (e) {
        if (e) {
          var r = e.split("="),
            n = r.shift().replace(/\+/g, " "),
            o = r.join("=").replace(/\+/g, " ");
          t.append(decodeURIComponent(n), decodeURIComponent(o));
        }
      }),
    t
  );
}
function parseHeaders(e) {
  var t = new Headers();
  return (
    e
      .replace(/\r?\n[\t ]+/g, " ")
      .split(/\r?\n/)
      .forEach(function (e) {
        var r = e.split(":"),
          n = r.shift().trim();
        if (n) {
          var o = r.join(":").trim();
          t.append(n, o);
        }
      }),
    t
  );
}
function Response(e, t) {
  if (!(this instanceof Response))
    throw new TypeError(
      'Please use the "new" operator, this DOM object constructor cannot be called as a function.'
    );
  t || (t = {}),
    (this.type = "default"),
    (this.status = void 0 === t.status ? 200 : t.status),
    (this.ok = this.status >= 200 && this.status < 300),
    (this.statusText = "statusText" in t ? t.statusText : ""),
    (this.headers = new Headers(t.headers)),
    (this.url = t.url || ""),
    this._initBody(e);
}
(Request.prototype.clone = function () {
  return new Request(this, {
    body: this._bodyInit,
  });
}),
  Body.call(Request.prototype),
  Body.call(Response.prototype),
  (Response.prototype.clone = function () {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url,
    });
  }),
  (Response.error = function () {
    var e = new Response(null, {
      status: 0,
      statusText: "",
    });
    return (e.type = "error"), e;
  });
var redirectStatuses = [301, 302, 303, 307, 308];
Response.redirect = function (e, t) {
  if (-1 === redirectStatuses.indexOf(t))
    throw new RangeError("Invalid status code");
  return new Response(null, {
    status: t,
    headers: {
      location: e,
    },
  });
};
var DOMException = global$2.DOMException;
try {
  new DOMException();
} catch (e) {
  (DOMException = function (e, t) {
    (this.message = e), (this.name = t);
    var r = Error(e);
    this.stack = r.stack;
  }),
    (DOMException.prototype = Object.create(Error.prototype)),
    (DOMException.prototype.constructor = DOMException);
}
function fetch(e, t) {
  return new Promise(function (r, n) {
    var o = new Request(e, t);
    if (o.signal && o.signal.aborted)
      return n(new DOMException("Aborted", "AbortError"));
    var a = new XMLHttpRequest();
    function i() {
      a.abort();
    }
    (a.onload = function () {
      var e = {
        status: a.status,
        statusText: a.statusText,
        headers: parseHeaders(a.getAllResponseHeaders() || ""),
      };
      e.url =
        "responseURL" in a ? a.responseURL : e.headers.get("X-Request-URL");
      var t = "response" in a ? a.response : a.responseText;
      setTimeout(function () {
        r(new Response(t, e));
      }, 0);
    }),
      (a.onerror = function () {
        setTimeout(function () {
          n(new TypeError("Network request failed"));
        }, 0);
      }),
      (a.ontimeout = function () {
        setTimeout(function () {
          n(new TypeError("Network request failed"));
        }, 0);
      }),
      (a.onabort = function () {
        setTimeout(function () {
          n(new DOMException("Aborted", "AbortError"));
        }, 0);
      }),
      a.open(
        o.method,
        (function (e) {
          try {
            return "" === e && global$2.location.href
              ? global$2.location.href
              : e;
          } catch (t) {
            return e;
          }
        })(o.url),
        !0
      ),
      "include" === o.credentials
        ? (a.withCredentials = !0)
        : "omit" === o.credentials && (a.withCredentials = !1),
      "responseType" in a &&
        (support.blob
          ? (a.responseType = "blob")
          : support.arrayBuffer &&
            o.headers.get("Content-Type") &&
            -1 !==
              o.headers
                .get("Content-Type")
                .indexOf("application/octet-stream") &&
            (a.responseType = "arraybuffer")),
      !t || "object" != typeof t.headers || t.headers instanceof Headers
        ? o.headers.forEach(function (e, t) {
            a.setRequestHeader(t, e);
          })
        : Object.getOwnPropertyNames(t.headers).forEach(function (e) {
            a.setRequestHeader(e, normalizeValue(t.headers[e]));
          }),
      o.signal &&
        (o.signal.addEventListener("abort", i),
        (a.onreadystatechange = function () {
          4 === a.readyState && o.signal.removeEventListener("abort", i);
        })),
      a.send(void 0 === o._bodyInit ? null : o._bodyInit);
  });
}
(fetch.polyfill = !0),
  global$2.fetch ||
    ((global$2.fetch = fetch),
    (global$2.Headers = Headers),
    (global$2.Request = Request),
    (global$2.Response = Response));

(compactQueue = function (e) {
  for (; e.length > 1; ) {
    var t = e.pop(),
      r = t.obj[t.prop];
    if (isArray$1(r)) {
      for (var n = [], o = 0; o < r.length; ++o)
        void 0 !== r[o] && n.push(r[o]);
      t.obj[t.prop] = n;
    }
  }
}),
  (arrayToObject = function (e, t) {
    for (
      var r = t && t.plainObjects ? Object.create(null) : {}, n = 0;
      n < e.length;
      ++n
    )
      void 0 !== e[n] && (r[n] = e[n]);
    return r;
  }),
  (merge = function e(t, r, n) {
    if (!r) return t;
    if ("object" != typeof r) {
      if (isArray$1(t)) t.push(r);
      else {
        if (!t || "object" != typeof t) return [t, r];
        ((n && (n.plainObjects || n.allowPrototypes)) ||
          !has.call(Object.prototype, r)) &&
          (t[r] = !0);
      }
      return t;
    }
    if (!t || "object" != typeof t) return [t].concat(r);
    var o = t;
    return (
      isArray$1(t) && !isArray$1(r) && (o = arrayToObject(t, n)),
      isArray$1(t) && isArray$1(r)
        ? (r.forEach(function (r, o) {
            if (has.call(t, o)) {
              var a = t[o];
              a && "object" == typeof a && r && "object" == typeof r
                ? (t[o] = e(a, r, n))
                : t.push(r);
            } else t[o] = r;
          }),
          t)
        : Object.keys(r).reduce(function (t, o) {
            var a = r[o];
            return has.call(t, o) ? (t[o] = e(t[o], a, n)) : (t[o] = a), t;
          }, o)
    );
  }),
  (assign = function (e, t) {
    return Object.keys(t).reduce(function (e, r) {
      return (e[r] = t[r]), e;
    }, e);
  }),
  (decode$1 = function (e, t, r) {
    var n = e.replace(/\+/g, " ");
    if ("iso-8859-1" === r) return n.replace(/%[0-9a-f]{2}/gi, unescape);
    try {
      return decodeURIComponent(n);
    } catch (e) {
      return n;
    }
  }),
  (encode = function (e, t, r) {
    if (0 === e.length) return e;
    var n = e;
    if (
      ("symbol" == typeof e
        ? (n = Symbol.prototype.toString.call(e))
        : "string" != typeof e && (n = String(e)),
      "iso-8859-1" === r)
    )
      return escape(n).replace(/%u[0-9a-f]{4}/gi, function (e) {
        return "%26%23" + parseInt(e.slice(2), 16) + "%3B";
      });
    for (var o = "", a = 0; a < n.length; ++a) {
      var i = n.charCodeAt(a);
      45 === i ||
      46 === i ||
      95 === i ||
      126 === i ||
      (i >= 48 && i <= 57) ||
      (i >= 65 && i <= 90) ||
      (i >= 97 && i <= 122)
        ? (o += n.charAt(a))
        : i < 128
        ? (o += hexTable[i])
        : i < 2048
        ? (o += hexTable[192 | (i >> 6)] + hexTable[128 | (63 & i)])
        : i < 55296 || i >= 57344
        ? (o +=
            hexTable[224 | (i >> 12)] +
            hexTable[128 | ((i >> 6) & 63)] +
            hexTable[128 | (63 & i)])
        : ((a += 1),
          (i = 65536 + (((1023 & i) << 10) | (1023 & n.charCodeAt(a)))),
          (o +=
            hexTable[240 | (i >> 18)] +
            hexTable[128 | ((i >> 12) & 63)] +
            hexTable[128 | ((i >> 6) & 63)] +
            hexTable[128 | (63 & i)]));
    }
    return o;
  }),
  (compact = function (e) {
    for (
      var t = [
          {
            obj: {
              o: e,
            },
            prop: "o",
          },
        ],
        r = [],
        n = 0;
      n < t.length;
      ++n
    )
      for (
        var o = t[n], a = o.obj[o.prop], i = Object.keys(a), s = 0;
        s < i.length;
        ++s
      ) {
        var u = i[s],
          c = a[u];
        "object" == typeof c &&
          null !== c &&
          -1 === r.indexOf(c) &&
          (t.push({
            obj: a,
            prop: u,
          }),
          r.push(c));
      }
    return compactQueue(t), e;
  }),
  (isRegExp = function (e) {
    return "[object RegExp]" === Object.prototype.toString.call(e);
  }),
  (isBuffer$1 = function (e) {
    return !(
      !e ||
      "object" != typeof e ||
      !(e.constructor && e.constructor.isBuffer && e.constructor.isBuffer(e))
    );
  }),
  (combine = function (e, t) {
    return [].concat(e, t);
  }),
  (maybeMap = function (e, t) {
    if (isArray$1(e)) {
      for (var r = [], n = 0; n < e.length; n += 1) r.push(t(e[n]));
      return r;
    }
    return t(e);
  }),
  (utils = {
    arrayToObject,
    assign,
    combine,
    compact,
    decode: decode$1,
    encode,
    isBuffer: isBuffer$1,
    isRegExp,
    maybeMap,
    merge,
  }),
  (replace = String.prototype.replace),
  (percentTwenties = /%20/g),
  (Format = {
    RFC1738: "RFC1738",
    RFC3986: "RFC3986",
  }),
  (formats = utils.assign(
    {
      default: Format.RFC3986,
      formatters: {
        RFC1738: function (e) {
          return replace.call(e, percentTwenties, "+");
        },
        RFC3986: function (e) {
          return String(e);
        },
      },
    },
    Format
  )),
  (has$1 = Object.prototype.hasOwnProperty),
  (arrayPrefixGenerators = {
    brackets: function (e) {
      return e + "[]";
    },
    comma: "comma",
    indices: function (e, t) {
      return e + "[" + t + "]";
    },
    repeat: function (e) {
      return e;
    },
  }),
  (isArray$2 = Array.isArray),
  (push = Array.prototype.push),
  (pushToArray = function (e, t) {
    push.apply(e, isArray$2(t) ? t : [t]);
  }),
  (toISO = Date.prototype.toISOString),
  (defaultFormat = formats.default),
  (defaults = {
    addQueryPrefix: !1,
    allowDots: !1,
    charset: "utf-8",
    charsetSentinel: !1,
    delimiter: "&",
    encode: !0,
    encoder: utils.encode,
    encodeValuesOnly: !1,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    indices: !1,
    serializeDate: function (e) {
      return toISO.call(e);
    },
    skipNulls: !1,
    strictNullHandling: !1,
  }),
  (isNonNullishPrimitive = function (e) {
    return (
      "string" == typeof e ||
      "number" == typeof e ||
      "boolean" == typeof e ||
      "symbol" == typeof e ||
      "bigint" == typeof e
    );
  }),
  (stringify = function e(t, r, n, o, a, i, s, u, c, l, f, p, d) {
    var h = t;
    if (
      ("function" == typeof s
        ? (h = s(r, h))
        : h instanceof Date
        ? (h = l(h))
        : "comma" === n &&
          isArray$2(h) &&
          (h = utils
            .maybeMap(h, function (e) {
              return e instanceof Date ? l(e) : e;
            })
            .join(",")),
      null === h)
    ) {
      if (o) return i && !p ? i(r, defaults.encoder, d, "key") : r;
      h = "";
    }
    if (isNonNullishPrimitive(h) || utils.isBuffer(h))
      return i
        ? [
            f(p ? r : i(r, defaults.encoder, d, "key")) +
              "=" +
              f(i(h, defaults.encoder, d, "value")),
          ]
        : [f(r) + "=" + f(String(h))];
    var g,
      m = [];
    if (void 0 === h) return m;
    if (isArray$2(s)) g = s;
    else {
      var y = Object.keys(h);
      g = u ? y.sort(u) : y;
    }
    for (var b = 0; b < g.length; ++b) {
      var v = g[b],
        _ = h[v];
      if (!a || null !== _) {
        var w = isArray$2(h)
          ? "function" == typeof n
            ? n(r, v)
            : r
          : r + (c ? "." + v : "[" + v + "]");
        pushToArray(m, e(_, w, n, o, a, i, s, u, c, l, f, p, d));
      }
    }
    return m;
  }),
  (normalizeStringifyOptions = function (e) {
    if (!e) return defaults;
    if (
      null !== e.encoder &&
      void 0 !== e.encoder &&
      "function" != typeof e.encoder
    )
      throw new TypeError("Encoder has to be a function.");
    var t = e.charset || defaults.charset;
    if (
      void 0 !== e.charset &&
      "utf-8" !== e.charset &&
      "iso-8859-1" !== e.charset
    )
      throw new TypeError(
        "The charset option must be either utf-8, iso-8859-1, or undefined"
      );
    var r = formats.default;
    if (void 0 !== e.format) {
      if (!has$1.call(formats.formatters, e.format))
        throw new TypeError("Unknown format option provided.");
      r = e.format;
    }
    var n = formats.formatters[r],
      o = defaults.filter;
    return (
      ("function" == typeof e.filter || isArray$2(e.filter)) && (o = e.filter),
      {
        addQueryPrefix:
          "boolean" == typeof e.addQueryPrefix
            ? e.addQueryPrefix
            : defaults.addQueryPrefix,
        allowDots: void 0 === e.allowDots ? defaults.allowDots : !!e.allowDots,
        charset: t,
        charsetSentinel:
          "boolean" == typeof e.charsetSentinel
            ? e.charsetSentinel
            : defaults.charsetSentinel,
        delimiter: void 0 === e.delimiter ? defaults.delimiter : e.delimiter,
        encode: "boolean" == typeof e.encode ? e.encode : defaults.encode,
        encoder: "function" == typeof e.encoder ? e.encoder : defaults.encoder,
        encodeValuesOnly:
          "boolean" == typeof e.encodeValuesOnly
            ? e.encodeValuesOnly
            : defaults.encodeValuesOnly,
        filter: o,
        formatter: n,
        serializeDate:
          "function" == typeof e.serializeDate
            ? e.serializeDate
            : defaults.serializeDate,
        skipNulls:
          "boolean" == typeof e.skipNulls ? e.skipNulls : defaults.skipNulls,
        sort: "function" == typeof e.sort ? e.sort : null,
        strictNullHandling:
          "boolean" == typeof e.strictNullHandling
            ? e.strictNullHandling
            : defaults.strictNullHandling,
      }
    );
  }),
  (stringify_1 = function (e, t) {
    var r,
      n = e,
      o = normalizeStringifyOptions(t);
    "function" == typeof o.filter
      ? (n = (0, o.filter)("", n))
      : isArray$2(o.filter) && (r = o.filter);
    var a,
      i = [];
    if ("object" != typeof n || null === n) return "";
    a =
      t && t.arrayFormat in arrayPrefixGenerators
        ? t.arrayFormat
        : t && "indices" in t
        ? t.indices
          ? "indices"
          : "repeat"
        : "indices";
    var s = arrayPrefixGenerators[a];
    r || (r = Object.keys(n)), o.sort && r.sort(o.sort);
    for (var u = 0; u < r.length; ++u) {
      var c = r[u];
      (o.skipNulls && null === n[c]) ||
        pushToArray(
          i,
          stringify(
            n[c],
            c,
            s,
            o.strictNullHandling,
            o.skipNulls,
            o.encode ? o.encoder : null,
            o.filter,
            o.sort,
            o.allowDots,
            o.serializeDate,
            o.formatter,
            o.encodeValuesOnly,
            o.charset
          )
        );
    }
    var l = i.join(o.delimiter),
      f = !0 === o.addQueryPrefix ? "?" : "";
    return (
      o.charsetSentinel &&
        ("iso-8859-1" === o.charset
          ? (f += "utf8=%26%2310003%3B&")
          : (f += "utf8=%E2%9C%93&")),
      l.length > 0 ? f + l : ""
    );
  }),
  (has$2 = Object.prototype.hasOwnProperty),
  (isArray$3 = Array.isArray),
  (defaults$1 = {
    allowDots: !1,
    allowPrototypes: !1,
    arrayLimit: 20,
    charset: "utf-8",
    charsetSentinel: !1,
    comma: !1,
    decoder: utils.decode,
    delimiter: "&",
    depth: 5,
    ignoreQueryPrefix: !1,
    interpretNumericEntities: !1,
    parameterLimit: 1e3,
    parseArrays: !0,
    plainObjects: !1,
    strictNullHandling: !1,
  }),
  (interpretNumericEntities = function (e) {
    return e.replace(/&#(\d+);/g, function (e, t) {
      return String.fromCharCode(parseInt(t, 10));
    });
  }),
  (parseArrayValue = function (e, t) {
    return e && "string" == typeof e && t.comma && e.indexOf(",") > -1
      ? e.split(",")
      : e;
  }),
  (isoSentinel = "utf8=%26%2310003%3B"),
  (charsetSentinel = "utf8=%E2%9C%93"),
  (parseValues = function (e, t) {
    var r,
      n = {},
      o = t.ignoreQueryPrefix ? e.replace(/^\?/, "") : e,
      a = t.parameterLimit === 1 / 0 ? void 0 : t.parameterLimit,
      i = o.split(t.delimiter, a),
      s = -1,
      u = t.charset;
    if (t.charsetSentinel)
      for (r = 0; r < i.length; ++r)
        0 === i[r].indexOf("utf8=") &&
          (i[r] === charsetSentinel
            ? (u = "utf-8")
            : i[r] === isoSentinel && (u = "iso-8859-1"),
          (s = r),
          (r = i.length));
    for (r = 0; r < i.length; ++r)
      if (r !== s) {
        var c,
          l,
          f = i[r],
          p = f.indexOf("]="),
          d = -1 === p ? f.indexOf("=") : p + 1;
        -1 === d
          ? ((c = t.decoder(f, defaults$1.decoder, u, "key")),
            (l = t.strictNullHandling ? null : ""))
          : ((c = t.decoder(f.slice(0, d), defaults$1.decoder, u, "key")),
            (l = utils.maybeMap(parseArrayValue(f.slice(d + 1), t), function (
              e
            ) {
              return t.decoder(e, defaults$1.decoder, u, "value");
            }))),
          l &&
            t.interpretNumericEntities &&
            "iso-8859-1" === u &&
            (l = interpretNumericEntities(l)),
          f.indexOf("[]=") > -1 && (l = isArray$3(l) ? [l] : l),
          has$2.call(n, c) ? (n[c] = utils.combine(n[c], l)) : (n[c] = l);
      }
    return n;
  }),
  (parseObject = function (e, t, r, n) {
    for (var o = n ? t : parseArrayValue(t, r), a = e.length - 1; a >= 0; --a) {
      var i,
        s = e[a];
      if ("[]" === s && r.parseArrays) i = [].concat(o);
      else {
        i = r.plainObjects ? Object.create(null) : {};
        var u =
            "[" === s.charAt(0) && "]" === s.charAt(s.length - 1)
              ? s.slice(1, -1)
              : s,
          c = parseInt(u, 10);
        r.parseArrays || "" !== u
          ? !isNaN(c) &&
            s !== u &&
            String(c) === u &&
            c >= 0 &&
            r.parseArrays &&
            c <= r.arrayLimit
            ? ((i = [])[c] = o)
            : (i[u] = o)
          : (i = {
              0: o,
            });
      }
      o = i;
    }
    return o;
  }),
  (parseKeys = function (e, t, r, n) {
    if (e) {
      var o = r.allowDots ? e.replace(/\.([^.[]+)/g, "[$1]") : e,
        a = /(\[[^[\]]*])/g,
        i = r.depth > 0 && /(\[[^[\]]*])/.exec(o),
        s = i ? o.slice(0, i.index) : o,
        u = [];
      if (s) {
        if (
          !r.plainObjects &&
          has$2.call(Object.prototype, s) &&
          !r.allowPrototypes
        )
          return;
        u.push(s);
      }
      for (
        var c = 0;
        r.depth > 0 && null !== (i = a.exec(o)) && c < r.depth;

      ) {
        if (
          ((c += 1),
          !r.plainObjects &&
            has$2.call(Object.prototype, i[1].slice(1, -1)) &&
            !r.allowPrototypes)
        )
          return;
        u.push(i[1]);
      }
      return i && u.push("[" + o.slice(i.index) + "]"), parseObject(u, t, r, n);
    }
  }),
  (normalizeParseOptions = function (e) {
    if (!e) return defaults$1;
    if (
      null !== e.decoder &&
      void 0 !== e.decoder &&
      "function" != typeof e.decoder
    )
      throw new TypeError("Decoder has to be a function.");
    if (
      void 0 !== e.charset &&
      "utf-8" !== e.charset &&
      "iso-8859-1" !== e.charset
    )
      throw new TypeError(
        "The charset option must be either utf-8, iso-8859-1, or undefined"
      );
    var t = void 0 === e.charset ? defaults$1.charset : e.charset;
    return {
      allowDots: void 0 === e.allowDots ? defaults$1.allowDots : !!e.allowDots,
      allowPrototypes:
        "boolean" == typeof e.allowPrototypes
          ? e.allowPrototypes
          : defaults$1.allowPrototypes,
      arrayLimit:
        "number" == typeof e.arrayLimit ? e.arrayLimit : defaults$1.arrayLimit,
      charset: t,
      charsetSentinel:
        "boolean" == typeof e.charsetSentinel
          ? e.charsetSentinel
          : defaults$1.charsetSentinel,
      comma: "boolean" == typeof e.comma ? e.comma : defaults$1.comma,
      decoder: "function" == typeof e.decoder ? e.decoder : defaults$1.decoder,
      delimiter:
        "string" == typeof e.delimiter || utils.isRegExp(e.delimiter)
          ? e.delimiter
          : defaults$1.delimiter,
      depth:
        "number" == typeof e.depth || !1 === e.depth
          ? +e.depth
          : defaults$1.depth,
      ignoreQueryPrefix: !0 === e.ignoreQueryPrefix,
      interpretNumericEntities:
        "boolean" == typeof e.interpretNumericEntities
          ? e.interpretNumericEntities
          : defaults$1.interpretNumericEntities,
      parameterLimit:
        "number" == typeof e.parameterLimit
          ? e.parameterLimit
          : defaults$1.parameterLimit,
      parseArrays: !1 !== e.parseArrays,
      plainObjects:
        "boolean" == typeof e.plainObjects
          ? e.plainObjects
          : defaults$1.plainObjects,
      strictNullHandling:
        "boolean" == typeof e.strictNullHandling
          ? e.strictNullHandling
          : defaults$1.strictNullHandling,
    };
  }),
  (parse = function (e, t) {
    var r = normalizeParseOptions(t);
    if ("" === e || null == e) return r.plainObjects ? Object.create(null) : {};
    for (
      var n = "string" == typeof e ? parseValues(e, r) : e,
        o = r.plainObjects ? Object.create(null) : {},
        a = Object.keys(n),
        i = 0;
      i < a.length;
      ++i
    ) {
      var s = a[i],
        u = parseKeys(s, n[s], r, "string" == typeof e);
      o = utils.merge(o, u, r);
    }
    return utils.compact(o);
  }),
  (lib = {
    formats,
    parse,
    stringify: stringify_1,
  });
function noop() {}
const identity = (e) => e;
function assign$1(e, t) {
  for (const r in t) e[r] = t[r];
  return e;
}
function is_promise(e) {
  return e && "object" == typeof e && "function" == typeof e.then;
}
function run(e) {
  return e();
}
function blank_object() {
  return Object.create(null);
}
function run_all(e) {
  e.forEach(run);
}
function is_function(e) {
  return "function" == typeof e;
}
function safe_not_equal(e, t) {
  return e != e
    ? t == t
    : e !== t || (e && "object" == typeof e) || "function" == typeof e;
}
function subscribe(e, ...t) {
  if (null == e) return noop;
  const r = e.subscribe(...t);
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
function get_store_value(e) {
  let t;
  return subscribe(e, (e) => (t = e))(), t;
}
function component_subscribe(e, t, r) {
  e.$$.on_destroy.push(subscribe(t, r));
}
function create_slot(e, t, r, n) {
  if (e) {
    const o = get_slot_context(e, t, r, n);
    return e[0](o);
  }
}
function get_slot_context(e, t, r, n) {
  return e[1] && n ? assign$1(r.ctx.slice(), e[1](n(t))) : r.ctx;
}
function get_slot_changes(e, t, r, n) {
  if (e[2] && n) {
    const o = e[2](n(r));
    if (void 0 === t.dirty) return o;
    if ("object" == typeof o) {
      const e = [],
        r = Math.max(t.dirty.length, o.length);
      for (let n = 0; n < r; n += 1) e[n] = t.dirty[n] | o[n];
      return e;
    }
    return t.dirty | o;
  }
  return t.dirty;
}
function update_slot(e, t, r, n, o, a, i) {
  const s = get_slot_changes(t, n, o, a);
  if (s) {
    const o = get_slot_context(t, r, n, i);
    e.p(o, s);
  }
}
function exclude_internal_props(e) {
  const t = {};
  for (const r in e) "$" !== r[0] && (t[r] = e[r]);
  return t;
}
function null_to_empty(e) {
  return null == e ? "" : e;
}
function set_store_value(e, t, r = t) {
  return e.set(r), t;
}
function action_destroyer(e) {
  return e && is_function(e.destroy) ? e.destroy : noop;
}
const is_client = "undefined" != typeof window;
let now = is_client ? () => window.performance.now() : () => Date.now(),
  raf = is_client ? (e) => requestAnimationFrame(e) : noop;
const tasks = new Set();
function run_tasks(e) {
  tasks.forEach((t) => {
    t.c(e) || (tasks.delete(t), t.f());
  }),
    0 !== tasks.size && raf(run_tasks);
}
function loop(e) {
  let t;
  return (
    0 === tasks.size && raf(run_tasks),
    {
      promise: new Promise((r) => {
        tasks.add(
          (t = {
            c: e,
            f: r,
          })
        );
      }),
      abort() {
        tasks.delete(t);
      },
    }
  );
}
function append(e, t) {
  e.appendChild(t);
}
function insert(e, t, r) {
  e.insertBefore(t, r || null);
}
function detach(e) {
  e.parentNode.removeChild(e);
}
function destroy_each(e, t) {
  for (let r = 0; r < e.length; r += 1) e[r] && e[r].d(t);
}
function element(e) {
  return document.createElement(e);
}
function svg_element(e) {
  return document.createElementNS("http://www.w3.org/2000/svg", e);
}
function text(e) {
  return document.createTextNode(e);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(e, t, r, n) {
  return e.addEventListener(t, r, n), () => e.removeEventListener(t, r, n);
}
function prevent_default(e) {
  return function (t) {
    return t.preventDefault(), e.call(this, t);
  };
}
function stop_propagation(e) {
  return function (t) {
    return t.stopPropagation(), e.call(this, t);
  };
}
function attr(e, t, r) {
  null == r
    ? e.removeAttribute(t)
    : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
function to_number(e) {
  return "" === e ? void 0 : +e;
}
function children(e) {
  return Array.from(e.childNodes);
}
function set_data(e, t) {
  (t = "" + t), e.wholeText !== t && (e.data = t);
}
function set_input_value(e, t) {
  e.value = null == t ? "" : t;
}
function set_style(e, t, r, n) {
  e.style.setProperty(t, r, n ? "important" : "");
}
function select_option(e, t) {
  for (let r = 0; r < e.options.length; r += 1) {
    const n = e.options[r];
    if (n.__value === t) return void (n.selected = !0);
  }
}
function select_value(e) {
  const t = e.querySelector(":checked") || e.options[0];
  return t && t.__value;
}
let crossorigin;
function is_crossorigin() {
  if (void 0 === crossorigin) {
    crossorigin = !1;
    try {
      "undefined" != typeof window && window.parent && window.parent.document;
    } catch (e) {
      crossorigin = !0;
    }
  }
  return crossorigin;
}
function add_resize_listener(e, t) {
  const r = getComputedStyle(e),
    n = (parseInt(r.zIndex) || 0) - 1;
  "static" === r.position && (e.style.position = "relative");
  const o = element("iframe");
  o.setAttribute(
    "style",
    `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${n};`
  ),
    o.setAttribute("aria-hidden", "true"),
    (o.tabIndex = -1);
  const a = is_crossorigin();
  let i;
  return (
    a
      ? ((o.src =
          "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>"),
        (i = listen(window, "message", (e) => {
          e.source === o.contentWindow && t();
        })))
      : ((o.src = "about:blank"),
        (o.onload = () => {
          i = listen(o.contentWindow, "resize", t);
        })),
    append(e, o),
    () => {
      (a || (i && o.contentWindow)) && i(), detach(o);
    }
  );
}
function toggle_class(e, t, r) {
  e.classList[r ? "add" : "remove"](t);
}
function custom_event(e, t) {
  const r = document.createEvent("CustomEvent");
  return r.initCustomEvent(e, !1, !1, t), r;
}
class HtmlTag {
  constructor(e = null) {
    (this.a = e), (this.e = this.n = null);
  }
  m(e, t, r = null) {
    this.e || ((this.e = element(t.nodeName)), (this.t = t), this.h(e)),
      this.i(r);
  }
  h(e) {
    (this.e.innerHTML = e), (this.n = Array.from(this.e.childNodes));
  }
  i(e) {
    for (let t = 0; t < this.n.length; t += 1) insert(this.t, this.n[t], e);
  }
  p(e) {
    this.d(), this.h(e), this.i(this.a);
  }
  d() {
    this.n.forEach(detach);
  }
}
const active_docs = new Set();
let active = 0,
  current_component;
function hash(e) {
  let t = 5381,
    r = e.length;
  for (; r--; ) t = ((t << 5) - t) ^ e.charCodeAt(r);
  return t >>> 0;
}
function create_rule(e, t, r, n, o, a, i, s = 0) {
  const u = 16.666 / n;
  let c = "{\n";
  for (let e = 0; e <= 1; e += u) {
    const n = t + (r - t) * a(e);
    c += 100 * e + `%{${i(n, 1 - n)}}\n`;
  }
  const l = c + `100% {${i(r, 1 - r)}}\n}`,
    f = `__svelte_${hash(l)}_${s}`,
    p = e.ownerDocument;
  active_docs.add(p);
  const d =
      p.__svelte_stylesheet ||
      (p.__svelte_stylesheet = p.head.appendChild(element("style")).sheet),
    h = p.__svelte_rules || (p.__svelte_rules = {});
  h[f] ||
    ((h[f] = !0), d.insertRule(`@keyframes ${f} ${l}`, d.cssRules.length));
  const g = e.style.animation || "";
  return (
    (e.style.animation = `${
      g ? g + ", " : ""
    }${f} ${n}ms linear ${o}ms 1 both`),
    (active += 1),
    f
  );
}
function delete_rule(e, t) {
  const r = (e.style.animation || "").split(", "),
    n = r.filter(
      t ? (e) => e.indexOf(t) < 0 : (e) => -1 === e.indexOf("__svelte")
    ),
    o = r.length - n.length;
  o &&
    ((e.style.animation = n.join(", ")),
    (active -= o),
    active || clear_rules());
}
function clear_rules() {
  raf(() => {
    active ||
      (active_docs.forEach((e) => {
        const t = e.__svelte_stylesheet;
        let r = t.cssRules.length;
        for (; r--; ) t.deleteRule(r);
        e.__svelte_rules = {};
      }),
      active_docs.clear());
  });
}
function set_current_component(e) {
  current_component = e;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function beforeUpdate(e) {
  get_current_component().$$.before_update.push(e);
}
function onMount(e) {
  get_current_component().$$.on_mount.push(e);
}
function afterUpdate(e) {
  get_current_component().$$.after_update.push(e);
}
function onDestroy(e) {
  get_current_component().$$.on_destroy.push(e);
}
function createEventDispatcher() {
  const e = get_current_component();
  return (t, r) => {
    const n = e.$$.callbacks[t];
    if (n) {
      const o = custom_event(t, r);
      n.slice().forEach((t) => {
        t.call(e, o);
      });
    }
  };
}
function setContext(e, t) {
  get_current_component().$$.context.set(e, t);
}
function getContext(e) {
  return get_current_component().$$.context.get(e);
}
function bubble(e, t) {
  const r = e.$$.callbacks[t.type];
  r && r.slice().forEach((e) => e(t));
}
const dirty_components = [],
  binding_callbacks = [],
  render_callbacks = [],
  flush_callbacks = [],
  resolved_promise = Promise.resolve();
let update_scheduled = !1;
function schedule_update() {
  update_scheduled || ((update_scheduled = !0), resolved_promise.then(flush));
}
function tick() {
  return schedule_update(), resolved_promise;
}
function add_render_callback(e) {
  render_callbacks.push(e);
}
function add_flush_callback(e) {
  flush_callbacks.push(e);
}
let flushing = !1;
const seen_callbacks = new Set();
function flush() {
  if (!flushing) {
    flushing = !0;
    do {
      for (let e = 0; e < dirty_components.length; e += 1) {
        const t = dirty_components[e];
        set_current_component(t), update(t.$$);
      }
      for (dirty_components.length = 0; binding_callbacks.length; )
        binding_callbacks.pop()();
      for (let e = 0; e < render_callbacks.length; e += 1) {
        const t = render_callbacks[e];
        seen_callbacks.has(t) || (seen_callbacks.add(t), t());
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    for (; flush_callbacks.length; ) flush_callbacks.pop()();
    (update_scheduled = !1), (flushing = !1), seen_callbacks.clear();
  }
}
function update(e) {
  if (null !== e.fragment) {
    e.update(), run_all(e.before_update);
    const t = e.dirty;
    (e.dirty = [-1]),
      e.fragment && e.fragment.p(e.ctx, t),
      e.after_update.forEach(add_render_callback);
  }
}
let promise;
function wait() {
  return (
    promise ||
      ((promise = Promise.resolve()),
      promise.then(() => {
        promise = null;
      })),
    promise
  );
}
function dispatch(e, t, r) {
  e.dispatchEvent(custom_event(`${t ? "intro" : "outro"}${r}`));
}
const outroing = new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros,
  };
}
function check_outros() {
  outros.r || run_all(outros.c), (outros = outros.p);
}
function transition_in(e, t) {
  e && e.i && (outroing.delete(e), e.i(t));
}
function transition_out(e, t, r, n) {
  if (e && e.o) {
    if (outroing.has(e)) return;
    outroing.add(e),
      outros.c.push(() => {
        outroing.delete(e), n && (r && e.d(1), n());
      }),
      e.o(t);
  }
}
const null_transition = {
  duration: 0,
};
function create_in_transition(e, t, r) {
  let n,
    o,
    a = t(e, r),
    i = !1,
    s = 0;
  function u() {
    n && delete_rule(e, n);
  }
  function c() {
    const {
      delay: t = 0,
      duration: r = 300,
      easing: c = identity,
      tick: l = noop,
      css: f,
    } = a || null_transition;
    f && (n = create_rule(e, 0, 1, r, t, c, f, s++)), l(0, 1);
    const p = now() + t,
      d = p + r;
    o && o.abort(),
      (i = !0),
      add_render_callback(() => dispatch(e, !0, "start")),
      (o = loop((t) => {
        if (i) {
          if (t >= d) return l(1, 0), dispatch(e, !0, "end"), u(), (i = !1);
          if (t >= p) {
            const e = c((t - p) / r);
            l(e, 1 - e);
          }
        }
        return i;
      }));
  }
  let l = !1;
  return {
    start() {
      l || (delete_rule(e), is_function(a) ? ((a = a()), wait().then(c)) : c());
    },
    invalidate() {
      l = !1;
    },
    end() {
      i && (u(), (i = !1));
    },
  };
}
function create_out_transition(e, t, r) {
  let n,
    o = t(e, r),
    a = !0;
  const i = outros;
  function s() {
    const {
      delay: t = 0,
      duration: r = 300,
      easing: s = identity,
      tick: u = noop,
      css: c,
    } = o || null_transition;
    c && (n = create_rule(e, 1, 0, r, t, s, c));
    const l = now() + t,
      f = l + r;
    add_render_callback(() => dispatch(e, !1, "start")),
      loop((t) => {
        if (a) {
          if (t >= f)
            return u(0, 1), dispatch(e, !1, "end"), --i.r || run_all(i.c), !1;
          if (t >= l) {
            const e = s((t - l) / r);
            u(1 - e, e);
          }
        }
        return a;
      });
  }
  return (
    (i.r += 1),
    is_function(o)
      ? wait().then(() => {
          (o = o()), s();
        })
      : s(),
    {
      end(t) {
        t && o.tick && o.tick(1, 0), a && (n && delete_rule(e, n), (a = !1));
      },
    }
  );
}
function create_bidirectional_transition(e, t, r, n) {
  let o = t(e, r),
    a = n ? 0 : 1,
    i = null,
    s = null,
    u = null;
  function c() {
    u && delete_rule(e, u);
  }
  function l(e, t) {
    const r = e.b - a;
    return (
      (t *= Math.abs(r)),
      {
        a,
        b: e.b,
        d: r,
        duration: t,
        start: e.start,
        end: e.start + t,
        group: e.group,
      }
    );
  }
  function f(t) {
    const {
        delay: r = 0,
        duration: n = 300,
        easing: f = identity,
        tick: p = noop,
        css: d,
      } = o || null_transition,
      h = {
        start: now() + r,
        b: t,
      };
    t || ((h.group = outros), (outros.r += 1)),
      i
        ? (s = h)
        : (d && (c(), (u = create_rule(e, a, t, n, r, f, d))),
          t && p(0, 1),
          (i = l(h, n)),
          add_render_callback(() => dispatch(e, t, "start")),
          loop((t) => {
            if (
              (s &&
                t > s.start &&
                ((i = l(s, n)),
                (s = null),
                dispatch(e, i.b, "start"),
                d &&
                  (c(), (u = create_rule(e, a, i.b, i.duration, 0, f, o.css)))),
              i)
            )
              if (t >= i.end)
                p((a = i.b), 1 - a),
                  dispatch(e, i.b, "end"),
                  s || (i.b ? c() : --i.group.r || run_all(i.group.c)),
                  (i = null);
              else if (t >= i.start) {
                const e = t - i.start;
                (a = i.a + i.d * f(e / i.duration)), p(a, 1 - a);
              }
            return !(!i && !s);
          }));
  }
  return {
    run(e) {
      is_function(o)
        ? wait().then(() => {
            (o = o()), f(e);
          })
        : f(e);
    },
    end() {
      c(), (i = s = null);
    },
  };
}
function handle_promise(e, t) {
  const r = (t.token = {});
  function n(e, n, o, a) {
    if (t.token !== r) return;
    t.resolved = a;
    let i = t.ctx;
    void 0 !== o && ((i = i.slice()), (i[o] = a));
    const s = e && (t.current = e)(i);
    let u = !1;
    t.block &&
      (t.blocks
        ? t.blocks.forEach((e, r) => {
            r !== n &&
              e &&
              (group_outros(),
              transition_out(e, 1, 1, () => {
                t.blocks[r] = null;
              }),
              check_outros());
          })
        : t.block.d(1),
      s.c(),
      transition_in(s, 1),
      s.m(t.mount(), t.anchor),
      (u = !0)),
      (t.block = s),
      t.blocks && (t.blocks[n] = s),
      u && flush();
  }
  if (is_promise(e)) {
    const r = get_current_component();
    if (
      (e.then(
        (e) => {
          set_current_component(r),
            n(t.then, 1, t.value, e),
            set_current_component(null);
        },
        (e) => {
          set_current_component(r),
            n(t.catch, 2, t.error, e),
            set_current_component(null);
        }
      ),
      t.current !== t.pending)
    )
      return n(t.pending, 0), !0;
  } else {
    if (t.current !== t.then) return n(t.then, 1, t.value, e), !0;
    t.resolved = e;
  }
}
const globals =
  "undefined" != typeof window
    ? window
    : "undefined" != typeof globalThis
    ? globalThis
    : global;
function outro_and_destroy_block(e, t) {
  transition_out(e, 1, 1, () => {
    t.delete(e.key);
  });
}
function update_keyed_each(e, t, r, n, o, a, i, s, u, c, l, f) {
  let p = e.length,
    d = a.length,
    h = p;
  const g = {};
  for (; h--; ) g[e[h].key] = h;
  const m = [],
    y = new Map(),
    b = new Map();
  for (h = d; h--; ) {
    const e = f(o, a, h),
      s = r(e);
    let u = i.get(s);
    u ? n && u.p(e, t) : ((u = c(s, e)), u.c()),
      y.set(s, (m[h] = u)),
      s in g && b.set(s, Math.abs(h - g[s]));
  }
  const v = new Set(),
    _ = new Set();
  function w(e) {
    transition_in(e, 1), e.m(s, l), i.set(e.key, e), (l = e.first), d--;
  }
  for (; p && d; ) {
    const t = m[d - 1],
      r = e[p - 1],
      n = t.key,
      o = r.key;
    t === r
      ? ((l = t.first), p--, d--)
      : y.has(o)
      ? !i.has(n) || v.has(n)
        ? w(t)
        : _.has(o)
        ? p--
        : b.get(n) > b.get(o)
        ? (_.add(n), w(t))
        : (v.add(o), p--)
      : (u(r, i), p--);
  }
  for (; p--; ) {
    const t = e[p];
    y.has(t.key) || u(t, i);
  }
  for (; d; ) w(m[d - 1]);
  return m;
}
function get_spread_update(e, t) {
  const r = {},
    n = {},
    o = {
      $$scope: 1,
    };
  let a = e.length;
  for (; a--; ) {
    const i = e[a],
      s = t[a];
    if (s) {
      for (const e in i) e in s || (n[e] = 1);
      for (const e in s) o[e] || ((r[e] = s[e]), (o[e] = 1));
      e[a] = s;
    } else for (const e in i) o[e] = 1;
  }
  for (const e in n) e in r || (r[e] = void 0);
  return r;
}
function get_spread_object(e) {
  return "object" == typeof e && null !== e ? e : {};
}
function bind(e, t, r) {
  const n = e.$$.props[t];
  void 0 !== n && ((e.$$.bound[n] = r), r(e.$$.ctx[n]));
}
function create_component(e) {
  e && e.c();
}
function mount_component(e, t, r) {
  const { fragment: n, on_mount: o, on_destroy: a, after_update: i } = e.$$;
  n && n.m(t, r),
    add_render_callback(() => {
      const t = o.map(run).filter(is_function);
      a ? a.push(...t) : run_all(t), (e.$$.on_mount = []);
    }),
    i.forEach(add_render_callback);
}
function destroy_component(e, t) {
  const r = e.$$;
  null !== r.fragment &&
    (run_all(r.on_destroy),
    r.fragment && r.fragment.d(t),
    (r.on_destroy = r.fragment = null),
    (r.ctx = []));
}
function make_dirty(e, t) {
  -1 === e.$$.dirty[0] &&
    (dirty_components.push(e), schedule_update(), e.$$.dirty.fill(0)),
    (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
}
function init$1(e, t, r, n, o, a, i = [-1]) {
  const s = current_component;
  set_current_component(e);
  const u = t.props || {},
    c = (e.$$ = {
      fragment: null,
      ctx: null,
      props: a,
      update: noop,
      not_equal: o,
      bound: blank_object(),
      on_mount: [],
      on_destroy: [],
      before_update: [],
      after_update: [],
      context: new Map(s ? s.$$.context : []),
      callbacks: blank_object(),
      dirty: i,
    });
  let l = !1;
  if (
    ((c.ctx = r
      ? r(e, u, (t, r, ...n) => {
          const a = n.length ? n[0] : r;
          return (
            c.ctx &&
              o(c.ctx[t], (c.ctx[t] = a)) &&
              (c.bound[t] && c.bound[t](a), l && make_dirty(e, t)),
            r
          );
        })
      : []),
    c.update(),
    (l = !0),
    run_all(c.before_update),
    (c.fragment = !!n && n(c.ctx)),
    t.target)
  ) {
    if (t.hydrate) {
      const e = children(t.target);
      c.fragment && c.fragment.l(e), e.forEach(detach);
    } else c.fragment && c.fragment.c();
    t.intro && transition_in(e.$$.fragment),
      mount_component(e, t.target, t.anchor),
      flush();
  }
  set_current_component(s);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1), (this.$destroy = noop);
  }
  $on(e, t) {
    const r = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return (
      r.push(t),
      () => {
        const e = r.indexOf(t);
        -1 !== e && r.splice(e, 1);
      }
    );
  }
  $set() {}
}
const subscriber_queue = [];
function readable(e, t) {
  return {
    subscribe: writable(e, t).subscribe,
  };
}
function writable(e, t = noop) {
  let r;
  const n = [];
  function o(t) {
    if (safe_not_equal(e, t) && ((e = t), r)) {
      const t = !subscriber_queue.length;
      for (let t = 0; t < n.length; t += 1) {
        const r = n[t];
        r[1](), subscriber_queue.push(r, e);
      }
      if (t) {
        for (let e = 0; e < subscriber_queue.length; e += 2)
          subscriber_queue[e][0](subscriber_queue[e + 1]);
        subscriber_queue.length = 0;
      }
    }
  }
  return {
    set: o,
    update: function (t) {
      o(t(e));
    },
    subscribe: function (a, i = noop) {
      const s = [a, i];
      return (
        n.push(s),
        1 === n.length && (r = t(o) || noop),
        a(e),
        () => {
          const e = n.indexOf(s);
          -1 !== e && n.splice(e, 1), 0 === n.length && (r(), (r = null));
        }
      );
    },
  };
}
function derived(e, t, r) {
  const n = !Array.isArray(e),
    o = n ? [e] : e,
    a = t.length < 2;
  return readable(r, (e) => {
    let r = !1;
    const i = [];
    let s = 0,
      u = noop;
    const c = () => {
        if (s) return;
        u();
        const r = t(n ? i[0] : i, e);
        a ? e(r) : (u = is_function(r) ? r : noop);
      },
      l = o.map((e, t) =>
        subscribe(
          e,
          (e) => {
            (i[t] = e), (s &= ~(1 << t)), r && c();
          },
          () => {
            s |= 1 << t;
          }
        )
      );
    return (
      (r = !0),
      c(),
      function () {
        run_all(l), u();
      }
    );
  });
}
var TYPE, e;
function isLiteralElement(e) {
  return e.type === TYPE.literal;
}
function isArgumentElement(e) {
  return e.type === TYPE.argument;
}
function isNumberElement(e) {
  return e.type === TYPE.number;
}
function isDateElement(e) {
  return e.type === TYPE.date;
}
function isTimeElement(e) {
  return e.type === TYPE.time;
}
function isSelectElement(e) {
  return e.type === TYPE.select;
}
function isPluralElement(e) {
  return e.type === TYPE.plural;
}
function isPoundElement(e) {
  return e.type === TYPE.pound;
}
function isNumberSkeleton(e) {
  return !(!e || "object" != typeof e || 0 !== e.type);
}
function isDateTimeSkeleton(e) {
  return !(!e || "object" != typeof e || 1 !== e.type);
}
(e = TYPE || (TYPE = {})),
  (e[(e.literal = 0)] = "literal"),
  (e[(e.argument = 1)] = "argument"),
  (e[(e.number = 2)] = "number"),
  (e[(e.date = 3)] = "date"),
  (e[(e.time = 4)] = "time"),
  (e[(e.select = 5)] = "select"),
  (e[(e.plural = 6)] = "plural"),
  (e[(e.pound = 7)] = "pound");
var __extends =
    ((extendStatics = function (e, t) {
      return (extendStatics =
        Object.setPrototypeOf ||
        ({
          __proto__: [],
        } instanceof Array &&
          function (e, t) {
            e.__proto__ = t;
          }) ||
        function (e, t) {
          for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
        })(e, t);
    }),
    function (e, t) {
      function r() {
        this.constructor = e;
      }
      extendStatics(e, t),
        (e.prototype =
          null === t
            ? Object.create(t)
            : ((r.prototype = t.prototype), new r()));
    }),
  extendStatics,
  __assign = function () {
    return (__assign =
      Object.assign ||
      function (e) {
        for (var t, r = 1, n = arguments.length; r < n; r++)
          for (var o in (t = arguments[r]))
            Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        return e;
      }).apply(this, arguments);
  },
  SyntaxError = (function (e) {
    function t(r, n, o, a) {
      var i = e.call(this) || this;
      return (
        (i.message = r),
        (i.expected = n),
        (i.found = o),
        (i.location = a),
        (i.name = "SyntaxError"),
        "function" == typeof Error.captureStackTrace &&
          Error.captureStackTrace(i, t),
        i
      );
    }
    return (
      __extends(t, e),
      (t.buildMessage = function (e, t) {
        function r(e) {
          return e.charCodeAt(0).toString(16).toUpperCase();
        }
        function n(e) {
          return e
            .replace(/\\/g, "\\\\")
            .replace(/"/g, '\\"')
            .replace(/\0/g, "\\0")
            .replace(/\t/g, "\\t")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/[\x00-\x0F]/g, function (e) {
              return "\\x0" + r(e);
            })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (e) {
              return "\\x" + r(e);
            });
        }
        function o(e) {
          return e
            .replace(/\\/g, "\\\\")
            .replace(/\]/g, "\\]")
            .replace(/\^/g, "\\^")
            .replace(/-/g, "\\-")
            .replace(/\0/g, "\\0")
            .replace(/\t/g, "\\t")
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/[\x00-\x0F]/g, function (e) {
              return "\\x0" + r(e);
            })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function (e) {
              return "\\x" + r(e);
            });
        }
        function a(e) {
          switch (e.type) {
            case "literal":
              return '"' + n(e.text) + '"';
            case "class":
              var t = e.parts.map(function (e) {
                return Array.isArray(e) ? o(e[0]) + "-" + o(e[1]) : o(e);
              });
              return "[" + (e.inverted ? "^" : "") + t + "]";
            case "any":
              return "any character";
            case "end":
              return "end of input";
            case "other":
              return e.description;
          }
        }
        return (
          "Expected " +
          (function (e) {
            var t,
              r,
              n = e.map(a);
            if ((n.sort(), n.length > 0)) {
              for (t = 1, r = 1; t < n.length; t++)
                n[t - 1] !== n[t] && ((n[r] = n[t]), r++);
              n.length = r;
            }
            switch (n.length) {
              case 1:
                return n[0];
              case 2:
                return n[0] + " or " + n[1];
              default:
                return n.slice(0, -1).join(", ") + ", or " + n[n.length - 1];
            }
          })(e) +
          " but " +
          ((i = t) ? '"' + n(i) + '"' : "end of input") +
          " found."
        );
        var i;
      }),
      t
    );
  })(Error);
function peg$parse(e, t) {
  t = void 0 !== t ? t : {};
  var r,
    n = {},
    o = {
      start: ye,
    },
    a = ye,
    i = fe("#", !1),
    s = de("argumentElement"),
    u = fe("{", !1),
    c = fe("}", !1),
    l = de("numberSkeletonId"),
    f = /^['\/{}]/,
    p = pe(["'", "/", "{", "}"], !1, !1),
    d = {
      type: "any",
    },
    h = de("numberSkeletonTokenOption"),
    g = fe("/", !1),
    m = de("numberSkeletonToken"),
    y = fe("::", !1),
    b = function (e) {
      return Fe.pop(), e.replace(/\s*$/, "");
    },
    v = fe(",", !1),
    _ = fe("number", !1),
    w = function (e, t, r) {
      return __assign(
        {
          type:
            "number" === t ? TYPE.number : "date" === t ? TYPE.date : TYPE.time,
          style: r && r[2],
          value: e,
        },
        ze()
      );
    },
    T = fe("'", !1),
    O = /^[^']/,
    A = pe(["'"], !0, !1),
    M = /^[^a-zA-Z'{}]/,
    S = pe([["a", "z"], ["A", "Z"], "'", "{", "}"], !0, !1),
    k = /^[a-zA-Z]/,
    x = pe(
      [
        ["a", "z"],
        ["A", "Z"],
      ],
      !1,
      !1
    ),
    E = fe("date", !1),
    C = fe("time", !1),
    $ = fe("plural", !1),
    P = fe("selectordinal", !1),
    I = fe("offset:", !1),
    R = fe("select", !1),
    D = fe("=", !1),
    L = de("whitespace"),
    N = /^[\t-\r \x85\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/,
    j = pe(
      [
        ["\t", "\r"],
        " ",
        "",
        " ",
        " ",
        [" ", " "],
        "\u2028",
        "\u2029",
        " ",
        " ",
        "　",
      ],
      !1,
      !1
    ),
    B = de("syntax pattern"),
    U = /^[!-\/:-@[-\^`{-~\xA1-\xA7\xA9\xAB\xAC\xAE\xB0\xB1\xB6\xBB\xBF\xD7\xF7\u2010-\u2027\u2030-\u203E\u2041-\u2053\u2055-\u205E\u2190-\u245F\u2500-\u2775\u2794-\u2BFF\u2E00-\u2E7F\u3001-\u3003\u3008-\u3020\u3030\uFD3E\uFD3F\uFE45\uFE46]/,
    F = pe(
      [
        ["!", "/"],
        [":", "@"],
        ["[", "^"],
        "`",
        ["{", "~"],
        ["¡", "§"],
        "©",
        "«",
        "¬",
        "®",
        "°",
        "±",
        "¶",
        "»",
        "¿",
        "×",
        "÷",
        ["‐", "‧"],
        ["‰", "‾"],
        ["⁁", "⁓"],
        ["⁕", "⁞"],
        ["←", "⑟"],
        ["─", "❵"],
        ["➔", "⯿"],
        ["⸀", "⹿"],
        ["、", "〃"],
        ["〈", "〠"],
        "〰",
        "﴾",
        "﴿",
        "﹅",
        "﹆",
      ],
      !1,
      !1
    ),
    H = de("optional whitespace"),
    z = de("number"),
    W = fe("-", !1),
    Y = de("double apostrophes"),
    q = fe("''", !1),
    V = fe("\n", !1),
    G = de("argNameOrNumber"),
    Z = de("argNumber"),
    X = fe("0", !1),
    K = /^[1-9]/,
    Q = pe([["1", "9"]], !1, !1),
    J = /^[0-9]/,
    ee = pe([["0", "9"]], !1, !1),
    te = de("argName"),
    re = 0,
    ne = 0,
    oe = [
      {
        line: 1,
        column: 1,
      },
    ],
    ae = 0,
    ie = [],
    se = 0;
  if (void 0 !== t.startRule) {
    if (!(t.startRule in o))
      throw new Error("Can't start parsing from rule \"" + t.startRule + '".');
    a = o[t.startRule];
  }
  function ue() {
    return e.substring(ne, re);
  }
  function ce() {
    return ge(ne, re);
  }
  function le(e, t) {
    throw (function (e, t) {
      return new SyntaxError(e, [], "", t);
    })(e, (t = void 0 !== t ? t : ge(ne, re)));
  }
  function fe(e, t) {
    return {
      type: "literal",
      text: e,
      ignoreCase: t,
    };
  }
  function pe(e, t, r) {
    return {
      type: "class",
      parts: e,
      inverted: t,
      ignoreCase: r,
    };
  }
  function de(e) {
    return {
      type: "other",
      description: e,
    };
  }
  function he(t) {
    var r,
      n = oe[t];
    if (n) return n;
    for (r = t - 1; !oe[r]; ) r--;
    for (
      n = {
        line: (n = oe[r]).line,
        column: n.column,
      };
      r < t;

    )
      10 === e.charCodeAt(r) ? (n.line++, (n.column = 1)) : n.column++, r++;
    return (oe[t] = n), n;
  }
  function ge(e, t) {
    var r = he(e),
      n = he(t);
    return {
      start: {
        offset: e,
        line: r.line,
        column: r.column,
      },
      end: {
        offset: t,
        line: n.line,
        column: n.column,
      },
    };
  }
  function me(e) {
    re < ae || (re > ae && ((ae = re), (ie = [])), ie.push(e));
  }
  function ye() {
    return be();
  }
  function be() {
    var e, t;
    for (e = [], t = ve(); t !== n; ) e.push(t), (t = ve());
    return e;
  }
  function ve() {
    var t;
    return (
      (t = (function () {
        var e, t, r;
        return (
          (e = re),
          (t = _e()) !== n &&
            ((ne = e),
            (r = t),
            (t = __assign(
              {
                type: TYPE.literal,
                value: r,
              },
              ze()
            ))),
          t
        );
      })()) === n &&
        (t = (function () {
          var t, r, o, a, i;
          return (
            se++,
            (t = re),
            123 === e.charCodeAt(re)
              ? ((r = "{"), re++)
              : ((r = n), 0 === se && me(u)),
            r !== n && Ce() !== n && (o = De()) !== n && Ce() !== n
              ? (125 === e.charCodeAt(re)
                  ? ((a = "}"), re++)
                  : ((a = n), 0 === se && me(c)),
                a !== n
                  ? ((ne = t),
                    (i = o),
                    (t = r = __assign(
                      {
                        type: TYPE.argument,
                        value: i,
                      },
                      ze()
                    )))
                  : ((re = t), (t = n)))
              : ((re = t), (t = n)),
            se--,
            t === n && ((r = n), 0 === se && me(s)),
            t
          );
        })()) === n &&
        (t = (function () {
          var t;
          return (
            (t = (function () {
              var t, r, o, a, i, s, l, f, p;
              return (
                (t = re),
                123 === e.charCodeAt(re)
                  ? ((r = "{"), re++)
                  : ((r = n), 0 === se && me(u)),
                r !== n && Ce() !== n && (o = De()) !== n && Ce() !== n
                  ? (44 === e.charCodeAt(re)
                      ? ((a = ","), re++)
                      : ((a = n), 0 === se && me(v)),
                    a !== n && Ce() !== n
                      ? ("number" === e.substr(re, 6)
                          ? ((i = "number"), (re += 6))
                          : ((i = n), 0 === se && me(_)),
                        i !== n && Ce() !== n
                          ? ((s = re),
                            44 === e.charCodeAt(re)
                              ? ((l = ","), re++)
                              : ((l = n), 0 === se && me(v)),
                            l !== n &&
                            (f = Ce()) !== n &&
                            (p = (function () {
                              var t, r, o;
                              return (
                                (t = re),
                                "::" === e.substr(re, 2)
                                  ? ((r = "::"), (re += 2))
                                  : ((r = n), 0 === se && me(y)),
                                r !== n &&
                                (o = (function () {
                                  var e, t, r;
                                  if (((e = re), (t = []), (r = Oe()) !== n))
                                    for (; r !== n; ) t.push(r), (r = Oe());
                                  else t = n;
                                  return (
                                    t !== n &&
                                      ((ne = e),
                                      (t = __assign(
                                        {
                                          type: 0,
                                          tokens: t,
                                        },
                                        ze()
                                      ))),
                                    t
                                  );
                                })()) !== n
                                  ? ((ne = t), (t = r = o))
                                  : ((re = t), (t = n)),
                                t === n &&
                                  ((t = re),
                                  (ne = re),
                                  Fe.push("numberArgStyle"),
                                  (r = (r = !0) ? void 0 : n) !== n &&
                                  (o = _e()) !== n
                                    ? ((ne = t), (t = r = b(o)))
                                    : ((re = t), (t = n))),
                                t
                              );
                            })()) !== n
                              ? (s = l = [l, f, p])
                              : ((re = s), (s = n)),
                            s === n && (s = null),
                            s !== n && (l = Ce()) !== n
                              ? (125 === e.charCodeAt(re)
                                  ? ((f = "}"), re++)
                                  : ((f = n), 0 === se && me(c)),
                                f !== n
                                  ? ((ne = t), (t = r = w(o, i, s)))
                                  : ((re = t), (t = n)))
                              : ((re = t), (t = n)))
                          : ((re = t), (t = n)))
                      : ((re = t), (t = n)))
                  : ((re = t), (t = n)),
                t
              );
            })()) === n &&
              (t = (function () {
                var t, r, o, a, i, s, l, f, p;
                return (
                  (t = re),
                  123 === e.charCodeAt(re)
                    ? ((r = "{"), re++)
                    : ((r = n), 0 === se && me(u)),
                  r !== n && Ce() !== n && (o = De()) !== n && Ce() !== n
                    ? (44 === e.charCodeAt(re)
                        ? ((a = ","), re++)
                        : ((a = n), 0 === se && me(v)),
                      a !== n && Ce() !== n
                        ? ("date" === e.substr(re, 4)
                            ? ((i = "date"), (re += 4))
                            : ((i = n), 0 === se && me(E)),
                          i === n &&
                            ("time" === e.substr(re, 4)
                              ? ((i = "time"), (re += 4))
                              : ((i = n), 0 === se && me(C))),
                          i !== n && Ce() !== n
                            ? ((s = re),
                              44 === e.charCodeAt(re)
                                ? ((l = ","), re++)
                                : ((l = n), 0 === se && me(v)),
                              l !== n &&
                              (f = Ce()) !== n &&
                              (p = (function () {
                                var t, r, o;
                                return (
                                  (t = re),
                                  "::" === e.substr(re, 2)
                                    ? ((r = "::"), (re += 2))
                                    : ((r = n), 0 === se && me(y)),
                                  r !== n &&
                                  (o = (function () {
                                    var t, r, o, a;
                                    if (
                                      ((t = re),
                                      (r = re),
                                      (o = []),
                                      (a = Ae()) === n && (a = Me()),
                                      a !== n)
                                    )
                                      for (; a !== n; )
                                        o.push(a),
                                          (a = Ae()) === n && (a = Me());
                                    else o = n;
                                    return (
                                      (r = o !== n ? e.substring(r, re) : o) !==
                                        n &&
                                        ((ne = t),
                                        (r = __assign(
                                          {
                                            type: 1,
                                            pattern: r,
                                          },
                                          ze()
                                        ))),
                                      r
                                    );
                                  })()) !== n
                                    ? ((ne = t), (t = r = o))
                                    : ((re = t), (t = n)),
                                  t === n &&
                                    ((t = re),
                                    (ne = re),
                                    Fe.push("dateOrTimeArgStyle"),
                                    (r = (r = !0) ? void 0 : n) !== n &&
                                    (o = _e()) !== n
                                      ? ((ne = t), (t = r = b(o)))
                                      : ((re = t), (t = n))),
                                  t
                                );
                              })()) !== n
                                ? (s = l = [l, f, p])
                                : ((re = s), (s = n)),
                              s === n && (s = null),
                              s !== n && (l = Ce()) !== n
                                ? (125 === e.charCodeAt(re)
                                    ? ((f = "}"), re++)
                                    : ((f = n), 0 === se && me(c)),
                                  f !== n
                                    ? ((ne = t), (t = r = w(o, i, s)))
                                    : ((re = t), (t = n)))
                                : ((re = t), (t = n)))
                            : ((re = t), (t = n)))
                        : ((re = t), (t = n)))
                    : ((re = t), (t = n)),
                  t
                );
              })()),
            t
          );
        })()) === n &&
        (t = (function () {
          var t, r, o, a, i, s, l, f, p, d, h;
          if (
            ((t = re),
            123 === e.charCodeAt(re)
              ? ((r = "{"), re++)
              : ((r = n), 0 === se && me(u)),
            r !== n)
          )
            if (Ce() !== n)
              if ((o = De()) !== n)
                if (Ce() !== n)
                  if (
                    (44 === e.charCodeAt(re)
                      ? ((a = ","), re++)
                      : ((a = n), 0 === se && me(v)),
                    a !== n)
                  )
                    if (Ce() !== n)
                      if (
                        ("plural" === e.substr(re, 6)
                          ? ((i = "plural"), (re += 6))
                          : ((i = n), 0 === se && me($)),
                        i === n &&
                          ("selectordinal" === e.substr(re, 13)
                            ? ((i = "selectordinal"), (re += 13))
                            : ((i = n), 0 === se && me(P))),
                        i !== n)
                      )
                        if (Ce() !== n)
                          if (
                            (44 === e.charCodeAt(re)
                              ? ((s = ","), re++)
                              : ((s = n), 0 === se && me(v)),
                            s !== n)
                          )
                            if (Ce() !== n)
                              if (
                                ((l = re),
                                "offset:" === e.substr(re, 7)
                                  ? ((f = "offset:"), (re += 7))
                                  : ((f = n), 0 === se && me(I)),
                                f !== n && (p = Ce()) !== n && (d = $e()) !== n
                                  ? (l = f = [f, p, d])
                                  : ((re = l), (l = n)),
                                l === n && (l = null),
                                l !== n)
                              )
                                if ((f = Ce()) !== n) {
                                  if (((p = []), (d = ke()) !== n))
                                    for (; d !== n; ) p.push(d), (d = ke());
                                  else p = n;
                                  p !== n && (d = Ce()) !== n
                                    ? (125 === e.charCodeAt(re)
                                        ? ((h = "}"), re++)
                                        : ((h = n), 0 === se && me(c)),
                                      h !== n
                                        ? ((ne = t),
                                          (t = r = (function (e, t, r, n) {
                                            return __assign(
                                              {
                                                type: TYPE.plural,
                                                pluralType:
                                                  "plural" === t
                                                    ? "cardinal"
                                                    : "ordinal",
                                                value: e,
                                                offset: r ? r[2] : 0,
                                                options: n.reduce(function (
                                                  e,
                                                  t
                                                ) {
                                                  var r = t.id,
                                                    n = t.value,
                                                    o = t.location;
                                                  return (
                                                    r in e &&
                                                      le(
                                                        'Duplicate option "' +
                                                          r +
                                                          '" in plural element: "' +
                                                          ue() +
                                                          '"',
                                                        ce()
                                                      ),
                                                    (e[r] = {
                                                      value: n,
                                                      location: o,
                                                    }),
                                                    e
                                                  );
                                                },
                                                {}),
                                              },
                                              ze()
                                            );
                                          })(o, i, l, p)))
                                        : ((re = t), (t = n)))
                                    : ((re = t), (t = n));
                                } else (re = t), (t = n);
                              else (re = t), (t = n);
                            else (re = t), (t = n);
                          else (re = t), (t = n);
                        else (re = t), (t = n);
                      else (re = t), (t = n);
                    else (re = t), (t = n);
                  else (re = t), (t = n);
                else (re = t), (t = n);
              else (re = t), (t = n);
            else (re = t), (t = n);
          else (re = t), (t = n);
          return t;
        })()) === n &&
        (t = (function () {
          var t, r, o, a, i, s, l, f, p;
          if (
            ((t = re),
            123 === e.charCodeAt(re)
              ? ((r = "{"), re++)
              : ((r = n), 0 === se && me(u)),
            r !== n)
          )
            if (Ce() !== n)
              if ((o = De()) !== n)
                if (Ce() !== n)
                  if (
                    (44 === e.charCodeAt(re)
                      ? ((a = ","), re++)
                      : ((a = n), 0 === se && me(v)),
                    a !== n)
                  )
                    if (Ce() !== n)
                      if (
                        ("select" === e.substr(re, 6)
                          ? ((i = "select"), (re += 6))
                          : ((i = n), 0 === se && me(R)),
                        i !== n)
                      )
                        if (Ce() !== n)
                          if (
                            (44 === e.charCodeAt(re)
                              ? ((s = ","), re++)
                              : ((s = n), 0 === se && me(v)),
                            s !== n)
                          )
                            if (Ce() !== n) {
                              if (((l = []), (f = Se()) !== n))
                                for (; f !== n; ) l.push(f), (f = Se());
                              else l = n;
                              l !== n && (f = Ce()) !== n
                                ? (125 === e.charCodeAt(re)
                                    ? ((p = "}"), re++)
                                    : ((p = n), 0 === se && me(c)),
                                  p !== n
                                    ? ((ne = t),
                                      (r = (function (e, t) {
                                        return __assign(
                                          {
                                            type: TYPE.select,
                                            value: e,
                                            options: t.reduce(function (e, t) {
                                              var r = t.id,
                                                n = t.value,
                                                o = t.location;
                                              return (
                                                r in e &&
                                                  le(
                                                    'Duplicate option "' +
                                                      r +
                                                      '" in select element: "' +
                                                      ue() +
                                                      '"',
                                                    ce()
                                                  ),
                                                (e[r] = {
                                                  value: n,
                                                  location: o,
                                                }),
                                                e
                                              );
                                            }, {}),
                                          },
                                          ze()
                                        );
                                      })(o, l)),
                                      (t = r))
                                    : ((re = t), (t = n)))
                                : ((re = t), (t = n));
                            } else (re = t), (t = n);
                          else (re = t), (t = n);
                        else (re = t), (t = n);
                      else (re = t), (t = n);
                    else (re = t), (t = n);
                  else (re = t), (t = n);
                else (re = t), (t = n);
              else (re = t), (t = n);
            else (re = t), (t = n);
          else (re = t), (t = n);
          return t;
        })()) === n &&
        (t = (function () {
          var t, r;
          return (
            (t = re),
            35 === e.charCodeAt(re)
              ? ((r = "#"), re++)
              : ((r = n), 0 === se && me(i)),
            r !== n &&
              ((ne = t),
              (r = __assign(
                {
                  type: TYPE.pound,
                },
                ze()
              ))),
            r
          );
        })()),
      t
    );
  }
  function _e() {
    var e, t, r;
    if (
      ((e = re),
      (t = []),
      (r = Pe()) === n && (r = Ie()) === n && (r = Re()),
      r !== n)
    )
      for (; r !== n; )
        t.push(r), (r = Pe()) === n && (r = Ie()) === n && (r = Re());
    else t = n;
    return t !== n && ((ne = e), (t = t.join(""))), t;
  }
  function we() {
    var t, r, o, a, i;
    if (
      (se++,
      (t = re),
      (r = []),
      (o = re),
      (a = re),
      se++,
      (i = xe()) === n &&
        (f.test(e.charAt(re))
          ? ((i = e.charAt(re)), re++)
          : ((i = n), 0 === se && me(p))),
      se--,
      i === n ? (a = void 0) : ((re = a), (a = n)),
      a !== n
        ? (e.length > re
            ? ((i = e.charAt(re)), re++)
            : ((i = n), 0 === se && me(d)),
          i !== n ? (o = a = [a, i]) : ((re = o), (o = n)))
        : ((re = o), (o = n)),
      o !== n)
    )
      for (; o !== n; )
        r.push(o),
          (o = re),
          (a = re),
          se++,
          (i = xe()) === n &&
            (f.test(e.charAt(re))
              ? ((i = e.charAt(re)), re++)
              : ((i = n), 0 === se && me(p))),
          se--,
          i === n ? (a = void 0) : ((re = a), (a = n)),
          a !== n
            ? (e.length > re
                ? ((i = e.charAt(re)), re++)
                : ((i = n), 0 === se && me(d)),
              i !== n ? (o = a = [a, i]) : ((re = o), (o = n)))
            : ((re = o), (o = n));
    else r = n;
    return (
      (t = r !== n ? e.substring(t, re) : r),
      se--,
      t === n && ((r = n), 0 === se && me(l)),
      t
    );
  }
  function Te() {
    var t, r, o;
    return (
      se++,
      (t = re),
      47 === e.charCodeAt(re)
        ? ((r = "/"), re++)
        : ((r = n), 0 === se && me(g)),
      r !== n && (o = we()) !== n
        ? ((ne = t), (t = r = o))
        : ((re = t), (t = n)),
      se--,
      t === n && ((r = n), 0 === se && me(h)),
      t
    );
  }
  function Oe() {
    var e, t, r, o;
    if ((se++, (e = re), Ce() !== n))
      if ((t = we()) !== n) {
        for (r = [], o = Te(); o !== n; ) r.push(o), (o = Te());
        r !== n
          ? ((ne = e),
            (e = (function (e, t) {
              return {
                stem: e,
                options: t,
              };
            })(t, r)))
          : ((re = e), (e = n));
      } else (re = e), (e = n);
    else (re = e), (e = n);
    return se--, e === n && 0 === se && me(m), e;
  }
  function Ae() {
    var t, r, o, a;
    if (
      ((t = re),
      39 === e.charCodeAt(re)
        ? ((r = "'"), re++)
        : ((r = n), 0 === se && me(T)),
      r !== n)
    ) {
      if (
        ((o = []),
        (a = Pe()) === n &&
          (O.test(e.charAt(re))
            ? ((a = e.charAt(re)), re++)
            : ((a = n), 0 === se && me(A))),
        a !== n)
      )
        for (; a !== n; )
          o.push(a),
            (a = Pe()) === n &&
              (O.test(e.charAt(re))
                ? ((a = e.charAt(re)), re++)
                : ((a = n), 0 === se && me(A)));
      else o = n;
      o !== n
        ? (39 === e.charCodeAt(re)
            ? ((a = "'"), re++)
            : ((a = n), 0 === se && me(T)),
          a !== n ? (t = r = [r, o, a]) : ((re = t), (t = n)))
        : ((re = t), (t = n));
    } else (re = t), (t = n);
    if (t === n)
      if (
        ((t = []),
        (r = Pe()) === n &&
          (M.test(e.charAt(re))
            ? ((r = e.charAt(re)), re++)
            : ((r = n), 0 === se && me(S))),
        r !== n)
      )
        for (; r !== n; )
          t.push(r),
            (r = Pe()) === n &&
              (M.test(e.charAt(re))
                ? ((r = e.charAt(re)), re++)
                : ((r = n), 0 === se && me(S)));
      else t = n;
    return t;
  }
  function Me() {
    var t, r;
    if (
      ((t = []),
      k.test(e.charAt(re))
        ? ((r = e.charAt(re)), re++)
        : ((r = n), 0 === se && me(x)),
      r !== n)
    )
      for (; r !== n; )
        t.push(r),
          k.test(e.charAt(re))
            ? ((r = e.charAt(re)), re++)
            : ((r = n), 0 === se && me(x));
    else t = n;
    return t;
  }
  function Se() {
    var t, r, o, a, i, s, l;
    return (
      (t = re),
      Ce() !== n && (r = Ne()) !== n && Ce() !== n
        ? (123 === e.charCodeAt(re)
            ? ((o = "{"), re++)
            : ((o = n), 0 === se && me(u)),
          o !== n
            ? ((ne = re),
              Fe.push("select"),
              void 0 !== n && (a = be()) !== n
                ? (125 === e.charCodeAt(re)
                    ? ((i = "}"), re++)
                    : ((i = n), 0 === se && me(c)),
                  i !== n
                    ? ((ne = t),
                      (s = r),
                      (l = a),
                      Fe.pop(),
                      (t = __assign(
                        {
                          id: s,
                          value: l,
                        },
                        ze()
                      )))
                    : ((re = t), (t = n)))
                : ((re = t), (t = n)))
            : ((re = t), (t = n)))
        : ((re = t), (t = n)),
      t
    );
  }
  function ke() {
    var t, r, o, a, i, s, l;
    return (
      (t = re),
      Ce() !== n &&
      (r = (function () {
        var t, r, o, a;
        return (
          (t = re),
          (r = re),
          61 === e.charCodeAt(re)
            ? ((o = "="), re++)
            : ((o = n), 0 === se && me(D)),
          o !== n && (a = $e()) !== n ? (r = o = [o, a]) : ((re = r), (r = n)),
          (t = r !== n ? e.substring(t, re) : r) === n && (t = Ne()),
          t
        );
      })()) !== n &&
      Ce() !== n
        ? (123 === e.charCodeAt(re)
            ? ((o = "{"), re++)
            : ((o = n), 0 === se && me(u)),
          o !== n
            ? ((ne = re),
              Fe.push("plural"),
              void 0 !== n && (a = be()) !== n
                ? (125 === e.charCodeAt(re)
                    ? ((i = "}"), re++)
                    : ((i = n), 0 === se && me(c)),
                  i !== n
                    ? ((ne = t),
                      (s = r),
                      (l = a),
                      Fe.pop(),
                      (t = __assign(
                        {
                          id: s,
                          value: l,
                        },
                        ze()
                      )))
                    : ((re = t), (t = n)))
                : ((re = t), (t = n)))
            : ((re = t), (t = n)))
        : ((re = t), (t = n)),
      t
    );
  }
  function xe() {
    var t;
    return (
      se++,
      N.test(e.charAt(re))
        ? ((t = e.charAt(re)), re++)
        : ((t = n), 0 === se && me(j)),
      se--,
      t === n && 0 === se && me(L),
      t
    );
  }
  function Ee() {
    var t;
    return (
      se++,
      U.test(e.charAt(re))
        ? ((t = e.charAt(re)), re++)
        : ((t = n), 0 === se && me(F)),
      se--,
      t === n && 0 === se && me(B),
      t
    );
  }
  function Ce() {
    var t, r, o;
    for (se++, t = re, r = [], o = xe(); o !== n; ) r.push(o), (o = xe());
    return (
      (t = r !== n ? e.substring(t, re) : r),
      se--,
      t === n && ((r = n), 0 === se && me(H)),
      t
    );
  }
  function $e() {
    var t, r, o, a;
    return (
      se++,
      (t = re),
      45 === e.charCodeAt(re)
        ? ((r = "-"), re++)
        : ((r = n), 0 === se && me(W)),
      r === n && (r = null),
      r !== n && (o = Le()) !== n
        ? ((ne = t), (t = r = (a = o) ? (r ? -a : a) : 0))
        : ((re = t), (t = n)),
      se--,
      t === n && ((r = n), 0 === se && me(z)),
      t
    );
  }
  function Pe() {
    var t, r;
    return (
      se++,
      (t = re),
      "''" === e.substr(re, 2)
        ? ((r = "''"), (re += 2))
        : ((r = n), 0 === se && me(q)),
      r !== n && ((ne = t), (r = "'")),
      se--,
      (t = r) === n && ((r = n), 0 === se && me(Y)),
      t
    );
  }
  function Ie() {
    var t, r, o, a, i, s;
    if (
      ((t = re),
      39 === e.charCodeAt(re)
        ? ((r = "'"), re++)
        : ((r = n), 0 === se && me(T)),
      r !== n)
    )
      if (
        (o = (function () {
          var t, r, o, a, i;
          return (
            (t = re),
            (r = re),
            e.length > re
              ? ((o = e.charAt(re)), re++)
              : ((o = n), 0 === se && me(d)),
            o !== n
              ? ((ne = re),
                (a = (a = "{" === (i = o) || "}" === i || (He() && "#" === i))
                  ? void 0
                  : n) !== n
                  ? (r = o = [o, a])
                  : ((re = r), (r = n)))
              : ((re = r), (r = n)),
            (t = r !== n ? e.substring(t, re) : r)
          );
        })()) !== n
      ) {
        for (
          a = re,
            i = [],
            "''" === e.substr(re, 2)
              ? ((s = "''"), (re += 2))
              : ((s = n), 0 === se && me(q)),
            s === n &&
              (O.test(e.charAt(re))
                ? ((s = e.charAt(re)), re++)
                : ((s = n), 0 === se && me(A)));
          s !== n;

        )
          i.push(s),
            "''" === e.substr(re, 2)
              ? ((s = "''"), (re += 2))
              : ((s = n), 0 === se && me(q)),
            s === n &&
              (O.test(e.charAt(re))
                ? ((s = e.charAt(re)), re++)
                : ((s = n), 0 === se && me(A)));
        (a = i !== n ? e.substring(a, re) : i) !== n
          ? (39 === e.charCodeAt(re)
              ? ((i = "'"), re++)
              : ((i = n), 0 === se && me(T)),
            i === n && (i = null),
            i !== n
              ? ((ne = t), (t = r = o + a.replace("''", "'")))
              : ((re = t), (t = n)))
          : ((re = t), (t = n));
      } else (re = t), (t = n);
    else (re = t), (t = n);
    return t;
  }
  function Re() {
    var t, r, o, a;
    return (
      (t = re),
      (r = re),
      e.length > re ? ((o = e.charAt(re)), re++) : ((o = n), 0 === se && me(d)),
      o !== n
        ? ((ne = re),
          (a = (a = (function (e) {
            return !(
              "{" === e ||
              (He() && "#" === e) ||
              (Fe.length > 1 && "}" === e)
            );
          })(o))
            ? void 0
            : n) !== n
            ? (r = o = [o, a])
            : ((re = r), (r = n)))
        : ((re = r), (r = n)),
      r === n &&
        (10 === e.charCodeAt(re)
          ? ((r = "\n"), re++)
          : ((r = n), 0 === se && me(V))),
      r !== n ? e.substring(t, re) : r
    );
  }
  function De() {
    var t, r;
    return (
      se++,
      (t = re),
      (r = Le()) === n && (r = Ne()),
      (t = r !== n ? e.substring(t, re) : r),
      se--,
      t === n && ((r = n), 0 === se && me(G)),
      t
    );
  }
  function Le() {
    var t, r, o, a, i;
    if (
      (se++,
      (t = re),
      48 === e.charCodeAt(re)
        ? ((r = "0"), re++)
        : ((r = n), 0 === se && me(X)),
      r !== n && ((ne = t), (r = 0)),
      (t = r) === n)
    ) {
      if (
        ((t = re),
        (r = re),
        K.test(e.charAt(re))
          ? ((o = e.charAt(re)), re++)
          : ((o = n), 0 === se && me(Q)),
        o !== n)
      ) {
        for (
          a = [],
            J.test(e.charAt(re))
              ? ((i = e.charAt(re)), re++)
              : ((i = n), 0 === se && me(ee));
          i !== n;

        )
          a.push(i),
            J.test(e.charAt(re))
              ? ((i = e.charAt(re)), re++)
              : ((i = n), 0 === se && me(ee));
        a !== n ? (r = o = [o, a]) : ((re = r), (r = n));
      } else (re = r), (r = n);
      r !== n && ((ne = t), (r = parseInt(r.join(""), 10))), (t = r);
    }
    return se--, t === n && ((r = n), 0 === se && me(Z)), t;
  }
  function Ne() {
    var t, r, o, a, i;
    if (
      (se++,
      (t = re),
      (r = []),
      (o = re),
      (a = re),
      se++,
      (i = xe()) === n && (i = Ee()),
      se--,
      i === n ? (a = void 0) : ((re = a), (a = n)),
      a !== n
        ? (e.length > re
            ? ((i = e.charAt(re)), re++)
            : ((i = n), 0 === se && me(d)),
          i !== n ? (o = a = [a, i]) : ((re = o), (o = n)))
        : ((re = o), (o = n)),
      o !== n)
    )
      for (; o !== n; )
        r.push(o),
          (o = re),
          (a = re),
          se++,
          (i = xe()) === n && (i = Ee()),
          se--,
          i === n ? (a = void 0) : ((re = a), (a = n)),
          a !== n
            ? (e.length > re
                ? ((i = e.charAt(re)), re++)
                : ((i = n), 0 === se && me(d)),
              i !== n ? (o = a = [a, i]) : ((re = o), (o = n)))
            : ((re = o), (o = n));
    else r = n;
    return (
      (t = r !== n ? e.substring(t, re) : r),
      se--,
      t === n && ((r = n), 0 === se && me(te)),
      t
    );
  }
  var je,
    Be,
    Ue,
    Fe = ["root"];
  function He() {
    return "plural" === Fe[Fe.length - 1];
  }
  function ze() {
    return t && t.captureLocation
      ? {
          location: ce(),
        }
      : {};
  }
  if ((r = a()) !== n && re === e.length) return r;
  throw (
    (r !== n &&
      re < e.length &&
      me({
        type: "end",
      }),
    (je = ie),
    (Be = ae < e.length ? e.charAt(ae) : null),
    (Ue = ae < e.length ? ge(ae, ae + 1) : ge(ae, ae)),
    new SyntaxError(SyntaxError.buildMessage(je, Be), je, Be, Ue))
  );
}
var pegParse = peg$parse,
  __spreadArrays = function () {
    for (var e = 0, t = 0, r = arguments.length; t < r; t++)
      e += arguments[t].length;
    var n = Array(e),
      o = 0;
    for (t = 0; t < r; t++)
      for (var a = arguments[t], i = 0, s = a.length; i < s; i++, o++)
        n[o] = a[i];
    return n;
  },
  PLURAL_HASHTAG_REGEX = /(^|[^\\])#/g;
function normalizeHashtagInPlural(e) {
  e.forEach(function (e) {
    (isPluralElement(e) || isSelectElement(e)) &&
      Object.keys(e.options).forEach(function (t) {
        for (
          var r, n = e.options[t], o = -1, a = void 0, i = 0;
          i < n.value.length;
          i++
        ) {
          var s = n.value[i];
          if (isLiteralElement(s) && PLURAL_HASHTAG_REGEX.test(s.value)) {
            (o = i), (a = s);
            break;
          }
        }
        if (a) {
          var u = a.value.replace(
              PLURAL_HASHTAG_REGEX,
              "$1{" + e.value + ", number}"
            ),
            c = pegParse(u);
          (r = n.value).splice.apply(r, __spreadArrays([o, 1], c));
        }
        normalizeHashtagInPlural(n.value);
      });
  });
}
var __assign$1 = function () {
    return (__assign$1 =
      Object.assign ||
      function (e) {
        for (var t, r = 1, n = arguments.length; r < n; r++)
          for (var o in (t = arguments[r]))
            Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        return e;
      }).apply(this, arguments);
  },
  DATE_TIME_REGEX = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;
function parseDateTimeSkeleton(e) {
  var t = {};
  return (
    e.replace(DATE_TIME_REGEX, function (e) {
      var r = e.length;
      switch (e[0]) {
        case "G":
          t.era = 4 === r ? "long" : 5 === r ? "narrow" : "short";
          break;
        case "y":
          t.year = 2 === r ? "2-digit" : "numeric";
          break;
        case "Y":
        case "u":
        case "U":
        case "r":
          throw new RangeError(
            "`Y/u/U/r` (year) patterns are not supported, use `y` instead"
          );
        case "q":
        case "Q":
          throw new RangeError("`q/Q` (quarter) patterns are not supported");
        case "M":
        case "L":
          t.month = ["numeric", "2-digit", "short", "long", "narrow"][r - 1];
          break;
        case "w":
        case "W":
          throw new RangeError("`w/W` (week) patterns are not supported");
        case "d":
          t.day = ["numeric", "2-digit"][r - 1];
          break;
        case "D":
        case "F":
        case "g":
          throw new RangeError(
            "`D/F/g` (day) patterns are not supported, use `d` instead"
          );
        case "E":
          t.weekday = 4 === r ? "short" : 5 === r ? "narrow" : "short";
          break;
        case "e":
          if (r < 4)
            throw new RangeError(
              "`e..eee` (weekday) patterns are not supported"
            );
          t.weekday = ["short", "long", "narrow", "short"][r - 4];
          break;
        case "c":
          if (r < 4)
            throw new RangeError(
              "`c..ccc` (weekday) patterns are not supported"
            );
          t.weekday = ["short", "long", "narrow", "short"][r - 4];
          break;
        case "a":
          t.hour12 = !0;
          break;
        case "b":
        case "B":
          throw new RangeError(
            "`b/B` (period) patterns are not supported, use `a` instead"
          );
        case "h":
          (t.hourCycle = "h12"), (t.hour = ["numeric", "2-digit"][r - 1]);
          break;
        case "H":
          (t.hourCycle = "h23"), (t.hour = ["numeric", "2-digit"][r - 1]);
          break;
        case "K":
          (t.hourCycle = "h11"), (t.hour = ["numeric", "2-digit"][r - 1]);
          break;
        case "k":
          (t.hourCycle = "h24"), (t.hour = ["numeric", "2-digit"][r - 1]);
          break;
        case "j":
        case "J":
        case "C":
          throw new RangeError(
            "`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead"
          );
        case "m":
          t.minute = ["numeric", "2-digit"][r - 1];
          break;
        case "s":
          t.second = ["numeric", "2-digit"][r - 1];
          break;
        case "S":
        case "A":
          throw new RangeError(
            "`S/A` (second) pattenrs are not supported, use `s` instead"
          );
        case "z":
          t.timeZoneName = r < 4 ? "short" : "long";
          break;
        case "Z":
        case "O":
        case "v":
        case "V":
        case "X":
        case "x":
          throw new RangeError(
            "`Z/O/v/V/X/x` (timeZone) pattenrs are not supported, use `z` instead"
          );
      }
      return "";
    }),
    t
  );
}
function icuUnitToEcma(e) {
  return e.replace(/^(.*?)-/, "");
}
var FRACTION_PRECISION_REGEX = /^\.(?:(0+)(\+|#+)?)?$/g,
  SIGNIFICANT_PRECISION_REGEX = /^(@+)?(\+|#+)?$/g;
function parseSignificantPrecision(e) {
  var t = {};
  return (
    e.replace(SIGNIFICANT_PRECISION_REGEX, function (e, r, n) {
      return (
        "string" != typeof n
          ? ((t.minimumSignificantDigits = r.length),
            (t.maximumSignificantDigits = r.length))
          : "+" === n
          ? (t.minimumSignificantDigits = r.length)
          : "#" === r[0]
          ? (t.maximumSignificantDigits = r.length)
          : ((t.minimumSignificantDigits = r.length),
            (t.maximumSignificantDigits =
              r.length + ("string" == typeof n ? n.length : 0))),
        ""
      );
    }),
    t
  );
}
function parseSign(e) {
  switch (e) {
    case "sign-auto":
      return {
        signDisplay: "auto",
      };
    case "sign-accounting":
      return {
        currencySign: "accounting",
      };
    case "sign-always":
      return {
        signDisplay: "always",
      };
    case "sign-accounting-always":
      return {
        signDisplay: "always",
        currencySign: "accounting",
      };
    case "sign-except-zero":
      return {
        signDisplay: "exceptZero",
      };
    case "sign-accounting-except-zero":
      return {
        signDisplay: "exceptZero",
        currencySign: "accounting",
      };
    case "sign-never":
      return {
        signDisplay: "never",
      };
  }
}
function parseNotationOptions(e) {
  return parseSign(e) || {};
}
function convertNumberSkeletonToNumberFormatOptions(e) {
  for (var t = {}, r = 0, n = e; r < n.length; r++) {
    var o = n[r];
    switch (o.stem) {
      case "percent":
        t.style = "percent";
        continue;
      case "currency":
        (t.style = "currency"), (t.currency = o.options[0]);
        continue;
      case "group-off":
        t.useGrouping = !1;
        continue;
      case "precision-integer":
        t.maximumFractionDigits = 0;
        continue;
      case "measure-unit":
        (t.style = "unit"), (t.unit = icuUnitToEcma(o.options[0]));
        continue;
      case "compact-short":
        (t.notation = "compact"), (t.compactDisplay = "short");
        continue;
      case "compact-long":
        (t.notation = "compact"), (t.compactDisplay = "long");
        continue;
      case "scientific":
        t = __assign$1(
          __assign$1(__assign$1({}, t), {
            notation: "scientific",
          }),
          o.options.reduce(function (e, t) {
            return __assign$1(__assign$1({}, e), parseNotationOptions(t));
          }, {})
        );
        continue;
      case "engineering":
        t = __assign$1(
          __assign$1(__assign$1({}, t), {
            notation: "engineering",
          }),
          o.options.reduce(function (e, t) {
            return __assign$1(__assign$1({}, e), parseNotationOptions(t));
          }, {})
        );
        continue;
      case "notation-simple":
        t.notation = "standard";
        continue;
      case "unit-width-narrow":
        (t.currencyDisplay = "narrowSymbol"), (t.unitDisplay = "narrow");
        continue;
      case "unit-width-short":
        (t.currencyDisplay = "code"), (t.unitDisplay = "short");
        continue;
      case "unit-width-full-name":
        (t.currencyDisplay = "name"), (t.unitDisplay = "long");
        continue;
      case "unit-width-iso-code":
        t.currencyDisplay = "symbol";
        continue;
    }
    if (FRACTION_PRECISION_REGEX.test(o.stem)) {
      if (o.options.length > 1)
        throw new RangeError(
          "Fraction-precision stems only accept a single optional option"
        );
      o.stem.replace(FRACTION_PRECISION_REGEX, function (e, r, n) {
        return (
          "." === e
            ? (t.maximumFractionDigits = 0)
            : "+" === n
            ? (t.minimumFractionDigits = n.length)
            : "#" === r[0]
            ? (t.maximumFractionDigits = r.length)
            : ((t.minimumFractionDigits = r.length),
              (t.maximumFractionDigits =
                r.length + ("string" == typeof n ? n.length : 0))),
          ""
        );
      }),
        o.options.length &&
          (t = __assign$1(
            __assign$1({}, t),
            parseSignificantPrecision(o.options[0])
          ));
    } else if (SIGNIFICANT_PRECISION_REGEX.test(o.stem))
      t = __assign$1(__assign$1({}, t), parseSignificantPrecision(o.stem));
    else {
      var a = parseSign(o.stem);
      a && (t = __assign$1(__assign$1({}, t), a));
    }
  }
  return t;
}
function parse$1(e, t) {
  var r = pegParse(e, t);
  return (
    (t && !1 === t.normalizeHashtagInPlural) || normalizeHashtagInPlural(r), r
  );
}
var __spreadArrays$1 = function () {
  for (var e = 0, t = 0, r = arguments.length; t < r; t++)
    e += arguments[t].length;
  var n = Array(e),
    o = 0;
  for (t = 0; t < r; t++)
    for (var a = arguments[t], i = 0, s = a.length; i < s; i++, o++)
      n[o] = a[i];
  return n;
};
function getCacheId(e) {
  return JSON.stringify(
    e.map(function (e) {
      return e && "object" == typeof e ? orderedProps(e) : e;
    })
  );
}
function orderedProps(e) {
  return Object.keys(e)
    .sort()
    .map(function (t) {
      var r;
      return ((r = {})[t] = e[t]), r;
    });
}
var memoizeFormatConstructor = function (e, t) {
    return (
      void 0 === t && (t = {}),
      function () {
        for (var r, n = [], o = 0; o < arguments.length; o++)
          n[o] = arguments[o];
        var a = getCacheId(n),
          i = a && t[a];
        return (
          i ||
            ((i = new ((r = e).bind.apply(r, __spreadArrays$1([void 0], n)))()),
            a && (t[a] = i)),
          i
        );
      }
    );
  },
  __extends$1 = (function () {
    var e = function (t, r) {
      return (e =
        Object.setPrototypeOf ||
        ({
          __proto__: [],
        } instanceof Array &&
          function (e, t) {
            e.__proto__ = t;
          }) ||
        function (e, t) {
          for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
        })(t, r);
    };
    return function (t, r) {
      function n() {
        this.constructor = t;
      }
      e(t, r),
        (t.prototype =
          null === r
            ? Object.create(r)
            : ((n.prototype = r.prototype), new n()));
    };
  })(),
  __spreadArrays$2 = function () {
    for (var e = 0, t = 0, r = arguments.length; t < r; t++)
      e += arguments[t].length;
    var n = Array(e),
      o = 0;
    for (t = 0; t < r; t++)
      for (var a = arguments[t], i = 0, s = a.length; i < s; i++, o++)
        n[o] = a[i];
    return n;
  },
  FormatError = (function (e) {
    function t(t, r) {
      var n = e.call(this, t) || this;
      return (n.variableId = r), n;
    }
    return __extends$1(t, e), t;
  })(Error),
  domParser;
function mergeLiteral(e) {
  return e.length < 2
    ? e
    : e.reduce(function (e, t) {
        var r = e[e.length - 1];
        return (
          r && 0 === r.type && 0 === t.type ? (r.value += t.value) : e.push(t),
          e
        );
      }, []);
}
function formatToParts(e, t, r, n, o, a, i) {
  if (1 === e.length && isLiteralElement(e[0]))
    return [
      {
        type: 0,
        value: e[0].value,
      },
    ];
  for (var s = [], u = 0, c = e; u < c.length; u++) {
    var l = c[u];
    if (isLiteralElement(l))
      s.push({
        type: 0,
        value: l.value,
      });
    else if (isPoundElement(l))
      "number" == typeof a &&
        s.push({
          type: 0,
          value: r.getNumberFormat(t).format(a),
        });
    else {
      var f = l.value;
      if (!o || !(f in o))
        throw new FormatError(
          'The intl string context variable "' +
            f +
            '" was not provided to the string "' +
            i +
            '"'
        );
      var p = o[f];
      if (isArgumentElement(l))
        (p && "string" != typeof p && "number" != typeof p) ||
          (p = "string" == typeof p || "number" == typeof p ? String(p) : ""),
          s.push({
            type: 1,
            value: p,
          });
      else if (isDateElement(l)) {
        var d = "string" == typeof l.style ? n.date[l.style] : void 0;
        s.push({
          type: 0,
          value: r.getDateTimeFormat(t, d).format(p),
        });
      } else if (isTimeElement(l))
        (d =
          "string" == typeof l.style
            ? n.time[l.style]
            : isDateTimeSkeleton(l.style)
            ? parseDateTimeSkeleton(l.style.pattern)
            : void 0),
          s.push({
            type: 0,
            value: r.getDateTimeFormat(t, d).format(p),
          });
      else if (isNumberElement(l))
        (d =
          "string" == typeof l.style
            ? n.number[l.style]
            : isNumberSkeleton(l.style)
            ? convertNumberSkeletonToNumberFormatOptions(l.style.tokens)
            : void 0),
          s.push({
            type: 0,
            value: r.getNumberFormat(t, d).format(p),
          });
      else if (isSelectElement(l)) {
        if (!(h = l.options[p] || l.options.other))
          throw new RangeError(
            'Invalid values for "' +
              l.value +
              '": "' +
              p +
              '". Options are "' +
              Object.keys(l.options).join('", "') +
              '"'
          );
        s.push.apply(s, formatToParts(h.value, t, r, n, o));
      } else if (isPluralElement(l)) {
        var h;
        if (!(h = l.options["=" + p])) {
          if (!Intl.PluralRules)
            throw new FormatError(
              'Intl.PluralRules is not available in this environment.\nTry polyfilling it using "@formatjs/intl-pluralrules"\n'
            );
          var g = r
            .getPluralRules(t, {
              type: l.pluralType,
            })
            .select(p - (l.offset || 0));
          h = l.options[g] || l.options.other;
        }
        if (!h)
          throw new RangeError(
            'Invalid values for "' +
              l.value +
              '": "' +
              p +
              '". Options are "' +
              Object.keys(l.options).join('", "') +
              '"'
          );
        s.push.apply(
          s,
          formatToParts(h.value, t, r, n, o, p - (l.offset || 0))
        );
      }
    }
  }
  return mergeLiteral(s);
}
function formatToString(e, t, r, n, o, a) {
  var i = formatToParts(e, t, r, n, o, void 0, a);
  return 1 === i.length
    ? i[0].value
    : i.reduce(function (e, t) {
        return e + t.value;
      }, "");
}
var TOKEN_DELIMITER = "@@",
  TOKEN_REGEX = /@@(\d+_\d+)@@/g,
  counter = 0;
function generateId() {
  return Date.now() + "_" + ++counter;
}
function restoreRichPlaceholderMessage(e, t) {
  return e
    .split(TOKEN_REGEX)
    .filter(Boolean)
    .map(function (e) {
      return null != t[e] ? t[e] : e;
    })
    .reduce(function (e, t) {
      return (
        e.length && "string" == typeof t && "string" == typeof e[e.length - 1]
          ? (e[e.length - 1] += t)
          : e.push(t),
        e
      );
    }, []);
}
var SIMPLE_XML_REGEX = /(<([0-9a-zA-Z-_]*?)>(.*?)<\/([0-9a-zA-Z-_]*?)>)|(<[0-9a-zA-Z-_]*?\/>)/,
  TEMPLATE_ID = Date.now() + "@@",
  VOID_ELEMENTS = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ];
function formatHTMLElement(e, t, r) {
  var n = e.tagName,
    o = e.outerHTML,
    a = e.textContent,
    i = e.childNodes;
  if (!n) return restoreRichPlaceholderMessage(a || "", t);
  n = n.toLowerCase();
  var s = ~VOID_ELEMENTS.indexOf(n),
    u = r[n];
  if (u && s)
    throw new FormatError(
      n +
        " is a self-closing tag and can not be used, please use another tag name."
    );
  if (!i.length) return [o];
  var c = Array.prototype.slice.call(i).reduce(function (e, n) {
    return e.concat(formatHTMLElement(n, t, r));
  }, []);
  return u
    ? "function" == typeof u
      ? [u.apply(void 0, c)]
      : [u]
    : __spreadArrays$2(["<" + n + ">"], c, ["</" + n + ">"]);
}
function formatHTMLMessage(e, t, r, n, o, a) {
  var i = formatToParts(e, t, r, n, o, void 0, a),
    s = {},
    u = i.reduce(function (e, t) {
      if (0 === t.type) return e + t.value;
      var r = generateId();
      return (s[r] = t.value), e + "" + TOKEN_DELIMITER + r + TOKEN_DELIMITER;
    }, "");
  if (!SIMPLE_XML_REGEX.test(u)) return restoreRichPlaceholderMessage(u, s);
  if (!o)
    throw new FormatError("Message has placeholders but no values was given");
  if ("undefined" == typeof DOMParser)
    throw new FormatError("Cannot format XML message without DOMParser");
  domParser || (domParser = new DOMParser());
  var c = domParser
    .parseFromString(
      '<formatted-message id="' +
        TEMPLATE_ID +
        '">' +
        u +
        "</formatted-message>",
      "text/html"
    )
    .getElementById(TEMPLATE_ID);
  if (!c) throw new FormatError("Malformed HTML message " + u);
  var l = Object.keys(o).filter(function (e) {
    return !!c.getElementsByTagName(e).length;
  });
  if (!l.length) return restoreRichPlaceholderMessage(u, s);
  var f = l.filter(function (e) {
    return e !== e.toLowerCase();
  });
  if (f.length)
    throw new FormatError(
      "HTML tag must be lowercased but the following tags are not: " +
        f.join(", ")
    );
  return Array.prototype.slice.call(c.childNodes).reduce(function (e, t) {
    return e.concat(formatHTMLElement(t, s, o));
  }, []);
}
var __assign$2 = function () {
  return (__assign$2 =
    Object.assign ||
    function (e) {
      for (var t, r = 1, n = arguments.length; r < n; r++)
        for (var o in (t = arguments[r]))
          Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      return e;
    }).apply(this, arguments);
};
function mergeConfig(e, t) {
  return t
    ? __assign$2(
        __assign$2(__assign$2({}, e || {}), t || {}),
        Object.keys(e).reduce(function (r, n) {
          return (r[n] = __assign$2(__assign$2({}, e[n]), t[n] || {})), r;
        }, {})
      )
    : e;
}
function mergeConfigs(e, t) {
  return t
    ? Object.keys(e).reduce(function (r, n) {
        return (r[n] = mergeConfig(e[n], t[n])), r;
      }, __assign$2({}, e))
    : e;
}
function createDefaultFormatters(e) {
  return (
    void 0 === e &&
      (e = {
        number: {},
        dateTime: {},
        pluralRules: {},
      }),
    {
      getNumberFormat: memoizeFormatConstructor(Intl.NumberFormat, e.number),
      getDateTimeFormat: memoizeFormatConstructor(
        Intl.DateTimeFormat,
        e.dateTime
      ),
      getPluralRules: memoizeFormatConstructor(Intl.PluralRules, e.pluralRules),
    }
  );
}
var IntlMessageFormat = (function () {
    function e(t, r, n, o) {
      var a = this;
      if (
        (void 0 === r && (r = e.defaultLocale),
        (this.formatterCache = {
          number: {},
          dateTime: {},
          pluralRules: {},
        }),
        (this.format = function (e) {
          return formatToString(
            a.ast,
            a.locales,
            a.formatters,
            a.formats,
            e,
            a.message
          );
        }),
        (this.formatToParts = function (e) {
          return formatToParts(
            a.ast,
            a.locales,
            a.formatters,
            a.formats,
            e,
            void 0,
            a.message
          );
        }),
        (this.formatHTMLMessage = function (e) {
          return formatHTMLMessage(
            a.ast,
            a.locales,
            a.formatters,
            a.formats,
            e,
            a.message
          );
        }),
        (this.resolvedOptions = function () {
          return {
            locale: Intl.NumberFormat.supportedLocalesOf(a.locales)[0],
          };
        }),
        (this.getAst = function () {
          return a.ast;
        }),
        "string" == typeof t)
      ) {
        if (((this.message = t), !e.__parse))
          throw new TypeError(
            "IntlMessageFormat.__parse must be set to process `message` of type `string`"
          );
        this.ast = e.__parse(t, {
          normalizeHashtagInPlural: !1,
        });
      } else this.ast = t;
      if (!Array.isArray(this.ast))
        throw new TypeError("A message must be provided as a String or AST.");
      (this.formats = mergeConfigs(e.formats, n)),
        (this.locales = r),
        (this.formatters =
          (o && o.formatters) || createDefaultFormatters(this.formatterCache));
    }
    return (
      (e.defaultLocale = new Intl.NumberFormat().resolvedOptions().locale),
      (e.__parse = parse$1),
      (e.formats = {
        number: {
          currency: {
            style: "currency",
          },
          percent: {
            style: "percent",
          },
        },
        date: {
          short: {
            month: "numeric",
            day: "numeric",
            year: "2-digit",
          },
          medium: {
            month: "short",
            day: "numeric",
            year: "numeric",
          },
          long: {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
          full: {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        },
        time: {
          short: {
            hour: "numeric",
            minute: "numeric",
          },
          medium: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          },
          long: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          },
          full: {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
          },
        },
      }),
      e
    );
  })(),
  aspromise = asPromise;
function asPromise(e, t) {
  for (
    var r = new Array(arguments.length - 1), n = 0, o = 2, a = !0;
    o < arguments.length;

  )
    r[n++] = arguments[o++];
  return new Promise(function (o, i) {
    r[n] = function (e) {
      if (a)
        if (((a = !1), e)) i(e);
        else {
          for (var t = new Array(arguments.length - 1), r = 0; r < t.length; )
            t[r++] = arguments[r];
          o.apply(null, t);
        }
    };
    try {
      e.apply(t || null, r);
    } catch (e) {
      a && ((a = !1), i(e));
    }
  });
}
var base64_1 = createCommonjsModule(function (e, t) {
    var r = t;
    r.length = function (e) {
      var t = e.length;
      if (!t) return 0;
      for (var r = 0; --t % 4 > 1 && "=" === e.charAt(t); ) ++r;
      return Math.ceil(3 * e.length) / 4 - r;
    };
    for (var n = new Array(64), o = new Array(123), a = 0; a < 64; )
      o[
        (n[a] =
          a < 26 ? a + 65 : a < 52 ? a + 71 : a < 62 ? a - 4 : (a - 59) | 43)
      ] = a++;
    (r.encode = function (e, t, r) {
      for (var o, a = null, i = [], s = 0, u = 0; t < r; ) {
        var c = e[t++];
        switch (u) {
          case 0:
            (i[s++] = n[c >> 2]), (o = (3 & c) << 4), (u = 1);
            break;
          case 1:
            (i[s++] = n[o | (c >> 4)]), (o = (15 & c) << 2), (u = 2);
            break;
          case 2:
            (i[s++] = n[o | (c >> 6)]), (i[s++] = n[63 & c]), (u = 0);
        }
        s > 8191 &&
          ((a || (a = [])).push(String.fromCharCode.apply(String, i)), (s = 0));
      }
      return (
        u && ((i[s++] = n[o]), (i[s++] = 61), 1 === u && (i[s++] = 61)),
        a
          ? (s && a.push(String.fromCharCode.apply(String, i.slice(0, s))),
            a.join(""))
          : String.fromCharCode.apply(String, i.slice(0, s))
      );
    }),
      (r.decode = function (e, t, r) {
        for (var n, a = r, i = 0, s = 0; s < e.length; ) {
          var u = e.charCodeAt(s++);
          if (61 === u && i > 1) break;
          if (void 0 === (u = o[u])) throw Error("invalid encoding");
          switch (i) {
            case 0:
              (n = u), (i = 1);
              break;
            case 1:
              (t[r++] = (n << 2) | ((48 & u) >> 4)), (n = u), (i = 2);
              break;
            case 2:
              (t[r++] = ((15 & n) << 4) | ((60 & u) >> 2)), (n = u), (i = 3);
              break;
            case 3:
              (t[r++] = ((3 & n) << 6) | u), (i = 0);
          }
        }
        if (1 === i) throw Error("invalid encoding");
        return r - a;
      }),
      (r.test = function (e) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
          e
        );
      });
  }),
  eventemitter = EventEmitter;
function EventEmitter() {
  this._listeners = {};
}
(EventEmitter.prototype.on = function (e, t, r) {
  return (
    (this._listeners[e] || (this._listeners[e] = [])).push({
      fn: t,
      ctx: r || this,
    }),
    this
  );
}),
  (EventEmitter.prototype.off = function (e, t) {
    if (void 0 === e) this._listeners = {};
    else if (void 0 === t) this._listeners[e] = [];
    else
      for (var r = this._listeners[e], n = 0; n < r.length; )
        r[n].fn === t ? r.splice(n, 1) : ++n;
    return this;
  }),
  (EventEmitter.prototype.emit = function (e) {
    var t = this._listeners[e];
    if (t) {
      for (var r = [], n = 1; n < arguments.length; ) r.push(arguments[n++]);
      for (n = 0; n < t.length; ) t[n].fn.apply(t[n++].ctx, r);
    }
    return this;
  });
var float_1 = factory(factory);
function factory(e) {
  return (
    "undefined" != typeof Float32Array
      ? (function () {
          var t = new Float32Array([-0]),
            r = new Uint8Array(t.buffer),
            n = 128 === r[3];
          function o(e, n, o) {
            (t[0] = e),
              (n[o] = r[0]),
              (n[o + 1] = r[1]),
              (n[o + 2] = r[2]),
              (n[o + 3] = r[3]);
          }
          function a(e, n, o) {
            (t[0] = e),
              (n[o] = r[3]),
              (n[o + 1] = r[2]),
              (n[o + 2] = r[1]),
              (n[o + 3] = r[0]);
          }
          function i(e, n) {
            return (
              (r[0] = e[n]),
              (r[1] = e[n + 1]),
              (r[2] = e[n + 2]),
              (r[3] = e[n + 3]),
              t[0]
            );
          }
          function s(e, n) {
            return (
              (r[3] = e[n]),
              (r[2] = e[n + 1]),
              (r[1] = e[n + 2]),
              (r[0] = e[n + 3]),
              t[0]
            );
          }
          (e.writeFloatLE = n ? o : a),
            (e.writeFloatBE = n ? a : o),
            (e.readFloatLE = n ? i : s),
            (e.readFloatBE = n ? s : i);
        })()
      : (function () {
          function t(e, t, r, n) {
            var o = t < 0 ? 1 : 0;
            if ((o && (t = -t), 0 === t)) e(1 / t > 0 ? 0 : 2147483648, r, n);
            else if (isNaN(t)) e(2143289344, r, n);
            else if (t > 34028234663852886e22)
              e(((o << 31) | 2139095040) >>> 0, r, n);
            else if (t < 11754943508222875e-54)
              e(((o << 31) | Math.round(t / 1401298464324817e-60)) >>> 0, r, n);
            else {
              var a = Math.floor(Math.log(t) / Math.LN2);
              e(
                ((o << 31) |
                  ((a + 127) << 23) |
                  (8388607 & Math.round(t * Math.pow(2, -a) * 8388608))) >>>
                  0,
                r,
                n
              );
            }
          }
          function r(e, t, r) {
            var n = e(t, r),
              o = 2 * (n >> 31) + 1,
              a = (n >>> 23) & 255,
              i = 8388607 & n;
            return 255 === a
              ? i
                ? NaN
                : o * (1 / 0)
              : 0 === a
              ? 1401298464324817e-60 * o * i
              : o * Math.pow(2, a - 150) * (i + 8388608);
          }
          (e.writeFloatLE = t.bind(null, writeUintLE)),
            (e.writeFloatBE = t.bind(null, writeUintBE)),
            (e.readFloatLE = r.bind(null, readUintLE)),
            (e.readFloatBE = r.bind(null, readUintBE));
        })(),
    "undefined" != typeof Float64Array
      ? (function () {
          var t = new Float64Array([-0]),
            r = new Uint8Array(t.buffer),
            n = 128 === r[7];
          function o(e, n, o) {
            (t[0] = e),
              (n[o] = r[0]),
              (n[o + 1] = r[1]),
              (n[o + 2] = r[2]),
              (n[o + 3] = r[3]),
              (n[o + 4] = r[4]),
              (n[o + 5] = r[5]),
              (n[o + 6] = r[6]),
              (n[o + 7] = r[7]);
          }
          function a(e, n, o) {
            (t[0] = e),
              (n[o] = r[7]),
              (n[o + 1] = r[6]),
              (n[o + 2] = r[5]),
              (n[o + 3] = r[4]),
              (n[o + 4] = r[3]),
              (n[o + 5] = r[2]),
              (n[o + 6] = r[1]),
              (n[o + 7] = r[0]);
          }
          function i(e, n) {
            return (
              (r[0] = e[n]),
              (r[1] = e[n + 1]),
              (r[2] = e[n + 2]),
              (r[3] = e[n + 3]),
              (r[4] = e[n + 4]),
              (r[5] = e[n + 5]),
              (r[6] = e[n + 6]),
              (r[7] = e[n + 7]),
              t[0]
            );
          }
          function s(e, n) {
            return (
              (r[7] = e[n]),
              (r[6] = e[n + 1]),
              (r[5] = e[n + 2]),
              (r[4] = e[n + 3]),
              (r[3] = e[n + 4]),
              (r[2] = e[n + 5]),
              (r[1] = e[n + 6]),
              (r[0] = e[n + 7]),
              t[0]
            );
          }
          (e.writeDoubleLE = n ? o : a),
            (e.writeDoubleBE = n ? a : o),
            (e.readDoubleLE = n ? i : s),
            (e.readDoubleBE = n ? s : i);
        })()
      : (function () {
          function t(e, t, r, n, o, a) {
            var i = n < 0 ? 1 : 0;
            if ((i && (n = -n), 0 === n))
              e(0, o, a + t), e(1 / n > 0 ? 0 : 2147483648, o, a + r);
            else if (isNaN(n)) e(0, o, a + t), e(2146959360, o, a + r);
            else if (n > 17976931348623157e292)
              e(0, o, a + t), e(((i << 31) | 2146435072) >>> 0, o, a + r);
            else {
              var s;
              if (n < 22250738585072014e-324)
                e((s = n / 5e-324) >>> 0, o, a + t),
                  e(((i << 31) | (s / 4294967296)) >>> 0, o, a + r);
              else {
                var u = Math.floor(Math.log(n) / Math.LN2);
                1024 === u && (u = 1023),
                  e(
                    (4503599627370496 * (s = n * Math.pow(2, -u))) >>> 0,
                    o,
                    a + t
                  ),
                  e(
                    ((i << 31) |
                      ((u + 1023) << 20) |
                      ((1048576 * s) & 1048575)) >>>
                      0,
                    o,
                    a + r
                  );
              }
            }
          }
          function r(e, t, r, n, o) {
            var a = e(n, o + t),
              i = e(n, o + r),
              s = 2 * (i >> 31) + 1,
              u = (i >>> 20) & 2047,
              c = 4294967296 * (1048575 & i) + a;
            return 2047 === u
              ? c
                ? NaN
                : s * (1 / 0)
              : 0 === u
              ? 5e-324 * s * c
              : s * Math.pow(2, u - 1075) * (c + 4503599627370496);
          }
          (e.writeDoubleLE = t.bind(null, writeUintLE, 0, 4)),
            (e.writeDoubleBE = t.bind(null, writeUintBE, 4, 0)),
            (e.readDoubleLE = r.bind(null, readUintLE, 0, 4)),
            (e.readDoubleBE = r.bind(null, readUintBE, 4, 0));
        })(),
    e
  );
}
function writeUintLE(e, t, r) {
  (t[r] = 255 & e),
    (t[r + 1] = (e >>> 8) & 255),
    (t[r + 2] = (e >>> 16) & 255),
    (t[r + 3] = e >>> 24);
}
function writeUintBE(e, t, r) {
  (t[r] = e >>> 24),
    (t[r + 1] = (e >>> 16) & 255),
    (t[r + 2] = (e >>> 8) & 255),
    (t[r + 3] = 255 & e);
}
function readUintLE(e, t) {
  return (e[t] | (e[t + 1] << 8) | (e[t + 2] << 16) | (e[t + 3] << 24)) >>> 0;
}
function readUintBE(e, t) {
  return ((e[t] << 24) | (e[t + 1] << 16) | (e[t + 2] << 8) | e[t + 3]) >>> 0;
}
var inquire_1 = inquire;
function inquire(moduleName) {
  try {
    var mod = eval("quire".replace(/^/, "re"))(moduleName);
    if (mod && (mod.length || Object.keys(mod).length)) return mod;
  } catch (e) {}
  return null;
}
var utf8_1 = createCommonjsModule(function (e, t) {
    var r = t;
    (r.length = function (e) {
      for (var t = 0, r = 0, n = 0; n < e.length; ++n)
        (r = e.charCodeAt(n)) < 128
          ? (t += 1)
          : r < 2048
          ? (t += 2)
          : 55296 == (64512 & r) && 56320 == (64512 & e.charCodeAt(n + 1))
          ? (++n, (t += 4))
          : (t += 3);
      return t;
    }),
      (r.read = function (e, t, r) {
        if (r - t < 1) return "";
        for (var n, o = null, a = [], i = 0; t < r; )
          (n = e[t++]) < 128
            ? (a[i++] = n)
            : n > 191 && n < 224
            ? (a[i++] = ((31 & n) << 6) | (63 & e[t++]))
            : n > 239 && n < 365
            ? ((n =
                (((7 & n) << 18) |
                  ((63 & e[t++]) << 12) |
                  ((63 & e[t++]) << 6) |
                  (63 & e[t++])) -
                65536),
              (a[i++] = 55296 + (n >> 10)),
              (a[i++] = 56320 + (1023 & n)))
            : (a[i++] =
                ((15 & n) << 12) | ((63 & e[t++]) << 6) | (63 & e[t++])),
            i > 8191 &&
              ((o || (o = [])).push(String.fromCharCode.apply(String, a)),
              (i = 0));
        return o
          ? (i && o.push(String.fromCharCode.apply(String, a.slice(0, i))),
            o.join(""))
          : String.fromCharCode.apply(String, a.slice(0, i));
      }),
      (r.write = function (e, t, r) {
        for (var n, o, a = r, i = 0; i < e.length; ++i)
          (n = e.charCodeAt(i)) < 128
            ? (t[r++] = n)
            : n < 2048
            ? ((t[r++] = (n >> 6) | 192), (t[r++] = (63 & n) | 128))
            : 55296 == (64512 & n) &&
              56320 == (64512 & (o = e.charCodeAt(i + 1)))
            ? ((n = 65536 + ((1023 & n) << 10) + (1023 & o)),
              ++i,
              (t[r++] = (n >> 18) | 240),
              (t[r++] = ((n >> 12) & 63) | 128),
              (t[r++] = ((n >> 6) & 63) | 128),
              (t[r++] = (63 & n) | 128))
            : ((t[r++] = (n >> 12) | 224),
              (t[r++] = ((n >> 6) & 63) | 128),
              (t[r++] = (63 & n) | 128));
        return r - a;
      });
  }),
  pool_1 = pool;
function pool(e, t, r) {
  var n = r || 8192,
    o = n >>> 1,
    a = null,
    i = n;
  return function (r) {
    if (r < 1 || r > o) return e(r);
    i + r > n && ((a = e(n)), (i = 0));
    var s = t.call(a, i, (i += r));
    return 7 & i && (i = 1 + (7 | i)), s;
  };
}
var longbits = LongBits;
function LongBits(e, t) {
  (this.lo = e >>> 0), (this.hi = t >>> 0);
}
var zero = (LongBits.zero = new LongBits(0, 0));
(zero.toNumber = function () {
  return 0;
}),
  (zero.zzEncode = zero.zzDecode = function () {
    return this;
  }),
  (zero.length = function () {
    return 1;
  });
var zeroHash = (LongBits.zeroHash = "\0\0\0\0\0\0\0\0");
(LongBits.fromNumber = function (e) {
  if (0 === e) return zero;
  var t = e < 0;
  t && (e = -e);
  var r = e >>> 0,
    n = ((e - r) / 4294967296) >>> 0;
  return (
    t &&
      ((n = ~n >>> 0),
      (r = ~r >>> 0),
      ++r > 4294967295 && ((r = 0), ++n > 4294967295 && (n = 0))),
    new LongBits(r, n)
  );
}),
  (LongBits.from = function (e) {
    if ("number" == typeof e) return LongBits.fromNumber(e);
    if (minimal.isString(e)) {
      if (!minimal.Long) return LongBits.fromNumber(parseInt(e, 10));
      e = minimal.Long.fromString(e);
    }
    return e.low || e.high ? new LongBits(e.low >>> 0, e.high >>> 0) : zero;
  }),
  (LongBits.prototype.toNumber = function (e) {
    if (!e && this.hi >>> 31) {
      var t = (1 + ~this.lo) >>> 0,
        r = ~this.hi >>> 0;
      return t || (r = (r + 1) >>> 0), -(t + 4294967296 * r);
    }
    return this.lo + 4294967296 * this.hi;
  }),
  (LongBits.prototype.toLong = function (e) {
    return minimal.Long
      ? new minimal.Long(0 | this.lo, 0 | this.hi, Boolean(e))
      : {
          low: 0 | this.lo,
          high: 0 | this.hi,
          unsigned: Boolean(e),
        };
  });
var charCodeAt = String.prototype.charCodeAt;
(LongBits.fromHash = function (e) {
  return e === zeroHash
    ? zero
    : new LongBits(
        (charCodeAt.call(e, 0) |
          (charCodeAt.call(e, 1) << 8) |
          (charCodeAt.call(e, 2) << 16) |
          (charCodeAt.call(e, 3) << 24)) >>>
          0,
        (charCodeAt.call(e, 4) |
          (charCodeAt.call(e, 5) << 8) |
          (charCodeAt.call(e, 6) << 16) |
          (charCodeAt.call(e, 7) << 24)) >>>
          0
      );
}),
  (LongBits.prototype.toHash = function () {
    return String.fromCharCode(
      255 & this.lo,
      (this.lo >>> 8) & 255,
      (this.lo >>> 16) & 255,
      this.lo >>> 24,
      255 & this.hi,
      (this.hi >>> 8) & 255,
      (this.hi >>> 16) & 255,
      this.hi >>> 24
    );
  }),
  (LongBits.prototype.zzEncode = function () {
    var e = this.hi >> 31;
    return (
      (this.hi = (((this.hi << 1) | (this.lo >>> 31)) ^ e) >>> 0),
      (this.lo = ((this.lo << 1) ^ e) >>> 0),
      this
    );
  }),
  (LongBits.prototype.zzDecode = function () {
    var e = -(1 & this.lo);
    return (
      (this.lo = (((this.lo >>> 1) | (this.hi << 31)) ^ e) >>> 0),
      (this.hi = ((this.hi >>> 1) ^ e) >>> 0),
      this
    );
  }),
  (LongBits.prototype.length = function () {
    var e = this.lo,
      t = ((this.lo >>> 28) | (this.hi << 4)) >>> 0,
      r = this.hi >>> 24;
    return 0 === r
      ? 0 === t
        ? e < 16384
          ? e < 128
            ? 1
            : 2
          : e < 2097152
          ? 3
          : 4
        : t < 16384
        ? t < 128
          ? 5
          : 6
        : t < 2097152
        ? 7
        : 8
      : r < 128
      ? 9
      : 10;
  });
var minimal = createCommonjsModule(function (e, t) {
    var r = t;
    function n(e, t, r) {
      for (var n = Object.keys(t), o = 0; o < n.length; ++o)
        (void 0 !== e[n[o]] && r) || (e[n[o]] = t[n[o]]);
      return e;
    }
    function o(e) {
      function t(e, r) {
        if (!(this instanceof t)) return new t(e, r);
        Object.defineProperty(this, "message", {
          get: function () {
            return e;
          },
        }),
          Error.captureStackTrace
            ? Error.captureStackTrace(this, t)
            : Object.defineProperty(this, "stack", {
                value: new Error().stack || "",
              }),
          r && n(this, r);
      }
      return (
        ((t.prototype = Object.create(Error.prototype)).constructor = t),
        Object.defineProperty(t.prototype, "name", {
          get: function () {
            return e;
          },
        }),
        (t.prototype.toString = function () {
          return this.name + ": " + this.message;
        }),
        t
      );
    }
    (r.asPromise = aspromise),
      (r.base64 = base64_1),
      (r.EventEmitter = eventemitter),
      (r.float = float_1),
      (r.inquire = inquire_1),
      (r.utf8 = utf8_1),
      (r.pool = pool_1),
      (r.LongBits = longbits),
      (r.isNode = Boolean(
        void 0 !== commonjsGlobal &&
          commonjsGlobal &&
          commonjsGlobal.process &&
          commonjsGlobal.process.C &&
          commonjsGlobal.process.C.node
      )),
      (r.global =
        (r.isNode && commonjsGlobal) ||
        ("undefined" != typeof window && window) ||
        ("undefined" != typeof self && self) ||
        commonjsGlobal),
      (r.emptyArray = Object.freeze ? Object.freeze([]) : []),
      (r.emptyObject = Object.freeze ? Object.freeze({}) : {}),
      (r.isInteger =
        Number.isInteger ||
        function (e) {
          return "number" == typeof e && isFinite(e) && Math.floor(e) === e;
        }),
      (r.isString = function (e) {
        return "string" == typeof e || e instanceof String;
      }),
      (r.isObject = function (e) {
        return e && "object" == typeof e;
      }),
      (r.isset = r.isSet = function (e, t) {
        var r = e[t];
        return (
          !(null == r || !e.hasOwnProperty(t)) &&
          ("object" != typeof r ||
            (Array.isArray(r) ? r.length : Object.keys(r).length) > 0)
        );
      }),
      (r.Buffer = (function () {
        try {
          var e = r.inquire("buffer").Buffer;
          return e.prototype.utf8Write ? e : null;
        } catch (e) {
          return null;
        }
      })()),
      (r._Buffer_from = null),
      (r._Buffer_allocUnsafe = null),
      (r.newBuffer = function (e) {
        return "number" == typeof e
          ? r.Buffer
            ? r._Buffer_allocUnsafe(e)
            : new r.Array(e)
          : r.Buffer
          ? r._Buffer_from(e)
          : "undefined" == typeof Uint8Array
          ? e
          : new Uint8Array(e);
      }),
      (r.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array),
      (r.Long =
        (r.global.dcodeIO && r.global.dcodeIO.Long) ||
        r.global.Long ||
        r.inquire("long")),
      (r.key2Re = /^true|false|0|1$/),
      (r.key32Re = /^-?(?:0|[1-9][0-9]*)$/),
      (r.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/),
      (r.longToHash = function (e) {
        return e ? r.LongBits.from(e).toHash() : r.LongBits.zeroHash;
      }),
      (r.longFromHash = function (e, t) {
        var n = r.LongBits.fromHash(e);
        return r.Long ? r.Long.fromBits(n.lo, n.hi, t) : n.toNumber(Boolean(t));
      }),
      (r.merge = n),
      (r.lcFirst = function (e) {
        return e.charAt(0).toLowerCase() + e.substring(1);
      }),
      (r.newError = o),
      (r.ProtocolError = o("ProtocolError")),
      (r.oneOfGetter = function (e) {
        for (var t = {}, r = 0; r < e.length; ++r) t[e[r]] = 1;
        return function () {
          for (var e = Object.keys(this), r = e.length - 1; r > -1; --r)
            if (1 === t[e[r]] && void 0 !== this[e[r]] && null !== this[e[r]])
              return e[r];
        };
      }),
      (r.oneOfSetter = function (e) {
        return function (t) {
          for (var r = 0; r < e.length; ++r) e[r] !== t && delete this[e[r]];
        };
      }),
      (r.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: !0,
      }),
      (r._configure = function () {
        var e = r.Buffer;
        e
          ? ((r._Buffer_from =
              (e.from !== Uint8Array.from && e.from) ||
              function (t, r) {
                return new e(t, r);
              }),
            (r._Buffer_allocUnsafe =
              e.allocUnsafe ||
              function (t) {
                return new e(t);
              }))
          : (r._Buffer_from = r._Buffer_allocUnsafe = null);
      });
  }),
  writer = Writer,
  BufferWriter,
  LongBits$1 = minimal.LongBits,
  base64 = minimal.base64,
  utf8 = minimal.utf8;
function Op(e, t, r) {
  (this.fn = e), (this.len = t), (this.next = void 0), (this.val = r);
}
function noop$1() {}
function State(e) {
  (this.head = e.head),
    (this.tail = e.tail),
    (this.len = e.len),
    (this.next = e.states);
}
function Writer() {
  (this.len = 0),
    (this.head = new Op(noop$1, 0, 0)),
    (this.tail = this.head),
    (this.states = null);
}
var create = function () {
  return minimal.Buffer
    ? function () {
        return (Writer.create = function () {
          return new BufferWriter();
        })();
      }
    : function () {
        return new Writer();
      };
};
function writeByte(e, t, r) {
  t[r] = 255 & e;
}
function writeVarint32(e, t, r) {
  for (; e > 127; ) (t[r++] = (127 & e) | 128), (e >>>= 7);
  t[r] = e;
}
function VarintOp(e, t) {
  (this.len = e), (this.next = void 0), (this.val = t);
}
function writeVarint64(e, t, r) {
  for (; e.hi; )
    (t[r++] = (127 & e.lo) | 128),
      (e.lo = ((e.lo >>> 7) | (e.hi << 25)) >>> 0),
      (e.hi >>>= 7);
  for (; e.lo > 127; ) (t[r++] = (127 & e.lo) | 128), (e.lo = e.lo >>> 7);
  t[r++] = e.lo;
}
function writeFixed32(e, t, r) {
  (t[r] = 255 & e),
    (t[r + 1] = (e >>> 8) & 255),
    (t[r + 2] = (e >>> 16) & 255),
    (t[r + 3] = e >>> 24);
}
(Writer.create = create()),
  (Writer.alloc = function (e) {
    return new minimal.Array(e);
  }),
  minimal.Array !== Array &&
    (Writer.alloc = minimal.pool(
      Writer.alloc,
      minimal.Array.prototype.subarray
    )),
  (Writer.prototype._push = function (e, t, r) {
    return (
      (this.tail = this.tail.next = new Op(e, t, r)), (this.len += t), this
    );
  }),
  (VarintOp.prototype = Object.create(Op.prototype)),
  (VarintOp.prototype.fn = writeVarint32),
  (Writer.prototype.uint32 = function (e) {
    return (
      (this.len += (this.tail = this.tail.next = new VarintOp(
        (e >>>= 0) < 128
          ? 1
          : e < 16384
          ? 2
          : e < 2097152
          ? 3
          : e < 268435456
          ? 4
          : 5,
        e
      )).len),
      this
    );
  }),
  (Writer.prototype.int32 = function (e) {
    return e < 0
      ? this._push(writeVarint64, 10, LongBits$1.fromNumber(e))
      : this.uint32(e);
  }),
  (Writer.prototype.sint32 = function (e) {
    return this.uint32(((e << 1) ^ (e >> 31)) >>> 0);
  }),
  (Writer.prototype.uint64 = function (e) {
    var t = LongBits$1.from(e);
    return this._push(writeVarint64, t.length(), t);
  }),
  (Writer.prototype.int64 = Writer.prototype.uint64),
  (Writer.prototype.sint64 = function (e) {
    var t = LongBits$1.from(e).zzEncode();
    return this._push(writeVarint64, t.length(), t);
  }),
  (Writer.prototype.bool = function (e) {
    return this._push(writeByte, 1, e ? 1 : 0);
  }),
  (Writer.prototype.fixed32 = function (e) {
    return this._push(writeFixed32, 4, e >>> 0);
  }),
  (Writer.prototype.sfixed32 = Writer.prototype.fixed32),
  (Writer.prototype.fixed64 = function (e) {
    var t = LongBits$1.from(e);
    return this._push(writeFixed32, 4, t.lo)._push(writeFixed32, 4, t.hi);
  }),
  (Writer.prototype.sfixed64 = Writer.prototype.fixed64),
  (Writer.prototype.float = function (e) {
    return this._push(minimal.float.writeFloatLE, 4, e);
  }),
  (Writer.prototype.double = function (e) {
    return this._push(minimal.float.writeDoubleLE, 8, e);
  });
var writeBytes = minimal.Array.prototype.set
  ? function (e, t, r) {
      t.set(e, r);
    }
  : function (e, t, r) {
      for (var n = 0; n < e.length; ++n) t[r + n] = e[n];
    };
(Writer.prototype.bytes = function (e) {
  var t = e.length >>> 0;
  if (!t) return this._push(writeByte, 1, 0);
  if (minimal.isString(e)) {
    var r = Writer.alloc((t = base64.length(e)));
    base64.decode(e, r, 0), (e = r);
  }
  return this.uint32(t)._push(writeBytes, t, e);
}),
  (Writer.prototype.string = function (e) {
    var t = utf8.length(e);
    return t
      ? this.uint32(t)._push(utf8.write, t, e)
      : this._push(writeByte, 1, 0);
  }),
  (Writer.prototype.fork = function () {
    return (
      (this.states = new State(this)),
      (this.head = this.tail = new Op(noop$1, 0, 0)),
      (this.len = 0),
      this
    );
  }),
  (Writer.prototype.reset = function () {
    return (
      this.states
        ? ((this.head = this.states.head),
          (this.tail = this.states.tail),
          (this.len = this.states.len),
          (this.states = this.states.next))
        : ((this.head = this.tail = new Op(noop$1, 0, 0)), (this.len = 0)),
      this
    );
  }),
  (Writer.prototype.ldelim = function () {
    var e = this.head,
      t = this.tail,
      r = this.len;
    return (
      this.reset().uint32(r),
      r && ((this.tail.next = e.next), (this.tail = t), (this.len += r)),
      this
    );
  }),
  (Writer.prototype.finish = function () {
    for (
      var e = this.head.next, t = this.constructor.alloc(this.len), r = 0;
      e;

    )
      e.fn(e.val, t, r), (r += e.len), (e = e.next);
    return t;
  }),
  (Writer._configure = function (e) {
    (BufferWriter = e), (Writer.create = create()), BufferWriter._configure();
  });
var writer_buffer = BufferWriter$1;
function BufferWriter$1() {
  writer.call(this);
}
function writeStringBuffer(e, t, r) {
  e.length < 40
    ? minimal.utf8.write(e, t, r)
    : t.utf8Write
    ? t.utf8Write(e, r)
    : t.write(e, r);
}
((BufferWriter$1.prototype = Object.create(
  writer.prototype
)).constructor = BufferWriter$1),
  (BufferWriter$1._configure = function () {
    (BufferWriter$1.alloc = minimal._Buffer_allocUnsafe),
      (BufferWriter$1.writeBytesBuffer =
        minimal.Buffer &&
        minimal.Buffer.prototype instanceof Uint8Array &&
        "set" === minimal.Buffer.prototype.set.name
          ? function (e, t, r) {
              t.set(e, r);
            }
          : function (e, t, r) {
              if (e.copy) e.copy(t, r, 0, e.length);
              else for (var n = 0; n < e.length; ) t[r++] = e[n++];
            });
  }),
  (BufferWriter$1.prototype.bytes = function (e) {
    minimal.isString(e) && (e = minimal._Buffer_from(e, "base64"));
    var t = e.length >>> 0;
    return (
      this.uint32(t),
      t && this._push(BufferWriter$1.writeBytesBuffer, t, e),
      this
    );
  }),
  (BufferWriter$1.prototype.string = function (e) {
    var t = minimal.Buffer.byteLength(e);
    return this.uint32(t), t && this._push(writeStringBuffer, t, e), this;
  }),
  BufferWriter$1._configure();
var reader = Reader,
  BufferReader,
  LongBits$2 = minimal.LongBits,
  utf8$1 = minimal.utf8;
function indexOutOfRange(e, t) {
  return RangeError(
    "index out of range: " + e.pos + " + " + (t || 1) + " > " + e.len
  );
}
function Reader(e) {
  (this.buf = e), (this.pos = 0), (this.len = e.length);
}
var create_array =
    "undefined" != typeof Uint8Array
      ? function (e) {
          if (e instanceof Uint8Array || Array.isArray(e)) return new Reader(e);
          throw Error("illegal buffer");
        }
      : function (e) {
          if (Array.isArray(e)) return new Reader(e);
          throw Error("illegal buffer");
        },
  create$1 = function () {
    return minimal.Buffer
      ? function (e) {
          return (Reader.create = function (e) {
            return minimal.Buffer.isBuffer(e)
              ? new BufferReader(e)
              : create_array(e);
          })(e);
        }
      : create_array;
  },
  value;
function readLongVarint() {
  var e = new LongBits$2(0, 0),
    t = 0;
  if (!(this.len - this.pos > 4)) {
    for (; t < 3; ++t) {
      if (this.pos >= this.len) throw indexOutOfRange(this);
      if (
        ((e.lo = (e.lo | ((127 & this.buf[this.pos]) << (7 * t))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return e;
    }
    return (e.lo = (e.lo | ((127 & this.buf[this.pos++]) << (7 * t))) >>> 0), e;
  }
  for (; t < 4; ++t)
    if (
      ((e.lo = (e.lo | ((127 & this.buf[this.pos]) << (7 * t))) >>> 0),
      this.buf[this.pos++] < 128)
    )
      return e;
  if (
    ((e.lo = (e.lo | ((127 & this.buf[this.pos]) << 28)) >>> 0),
    (e.hi = (e.hi | ((127 & this.buf[this.pos]) >> 4)) >>> 0),
    this.buf[this.pos++] < 128)
  )
    return e;
  if (((t = 0), this.len - this.pos > 4)) {
    for (; t < 5; ++t)
      if (
        ((e.hi = (e.hi | ((127 & this.buf[this.pos]) << (7 * t + 3))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return e;
  } else
    for (; t < 5; ++t) {
      if (this.pos >= this.len) throw indexOutOfRange(this);
      if (
        ((e.hi = (e.hi | ((127 & this.buf[this.pos]) << (7 * t + 3))) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return e;
    }
  throw Error("invalid varint encoding");
}
function readFixed32_end(e, t) {
  return (
    (e[t - 4] | (e[t - 3] << 8) | (e[t - 2] << 16) | (e[t - 1] << 24)) >>> 0
  );
}
function readFixed64() {
  if (this.pos + 8 > this.len) throw indexOutOfRange(this, 8);
  return new LongBits$2(
    readFixed32_end(this.buf, (this.pos += 4)),
    readFixed32_end(this.buf, (this.pos += 4))
  );
}
(Reader.create = create$1()),
  (Reader.prototype._slice =
    minimal.Array.prototype.subarray || minimal.Array.prototype.slice),
  (Reader.prototype.uint32 =
    ((value = 4294967295),
    function () {
      if (
        ((value = (127 & this.buf[this.pos]) >>> 0), this.buf[this.pos++] < 128)
      )
        return value;
      if (
        ((value = (value | ((127 & this.buf[this.pos]) << 7)) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return value;
      if (
        ((value = (value | ((127 & this.buf[this.pos]) << 14)) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return value;
      if (
        ((value = (value | ((127 & this.buf[this.pos]) << 21)) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return value;
      if (
        ((value = (value | ((15 & this.buf[this.pos]) << 28)) >>> 0),
        this.buf[this.pos++] < 128)
      )
        return value;
      if ((this.pos += 5) > this.len)
        throw ((this.pos = this.len), indexOutOfRange(this, 10));
      return value;
    })),
  (Reader.prototype.int32 = function () {
    return 0 | this.uint32();
  }),
  (Reader.prototype.sint32 = function () {
    var e = this.uint32();
    return ((e >>> 1) ^ -(1 & e)) | 0;
  }),
  (Reader.prototype.bool = function () {
    return 0 !== this.uint32();
  }),
  (Reader.prototype.fixed32 = function () {
    if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
    return readFixed32_end(this.buf, (this.pos += 4));
  }),
  (Reader.prototype.sfixed32 = function () {
    if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
    return 0 | readFixed32_end(this.buf, (this.pos += 4));
  }),
  (Reader.prototype.float = function () {
    if (this.pos + 4 > this.len) throw indexOutOfRange(this, 4);
    var e = minimal.float.readFloatLE(this.buf, this.pos);
    return (this.pos += 4), e;
  }),
  (Reader.prototype.double = function () {
    if (this.pos + 8 > this.len) throw indexOutOfRange(this, 4);
    var e = minimal.float.readDoubleLE(this.buf, this.pos);
    return (this.pos += 8), e;
  }),
  (Reader.prototype.bytes = function () {
    var e = this.uint32(),
      t = this.pos,
      r = this.pos + e;
    if (r > this.len) throw indexOutOfRange(this, e);
    return (
      (this.pos += e),
      Array.isArray(this.buf)
        ? this.buf.slice(t, r)
        : t === r
        ? new this.buf.constructor(0)
        : this._slice.call(this.buf, t, r)
    );
  }),
  (Reader.prototype.string = function () {
    var e = this.bytes();
    return utf8$1.read(e, 0, e.length);
  }),
  (Reader.prototype.skip = function (e) {
    if ("number" == typeof e) {
      if (this.pos + e > this.len) throw indexOutOfRange(this, e);
      this.pos += e;
    } else
      do {
        if (this.pos >= this.len) throw indexOutOfRange(this);
      } while (128 & this.buf[this.pos++]);
    return this;
  }),
  (Reader.prototype.skipType = function (e) {
    switch (e) {
      case 0:
        this.skip();
        break;
      case 1:
        this.skip(8);
        break;
      case 2:
        this.skip(this.uint32());
        break;
      case 3:
        for (; 4 != (e = 7 & this.uint32()); ) this.skipType(e);
        break;
      case 5:
        this.skip(4);
        break;
      default:
        throw Error("invalid wire type " + e + " at offset " + this.pos);
    }
    return this;
  }),
  (Reader._configure = function (e) {
    (BufferReader = e), (Reader.create = create$1()), BufferReader._configure();
    var t = minimal.Long ? "toLong" : "toNumber";
    minimal.merge(Reader.prototype, {
      int64: function () {
        return readLongVarint.call(this)[t](!1);
      },
      uint64: function () {
        return readLongVarint.call(this)[t](!0);
      },
      sint64: function () {
        return readLongVarint.call(this).zzDecode()[t](!1);
      },
      fixed64: function () {
        return readFixed64.call(this)[t](!0);
      },
      sfixed64: function () {
        return readFixed64.call(this)[t](!1);
      },
    });
  });
var reader_buffer = BufferReader$1;
function BufferReader$1(e) {
  reader.call(this, e);
}
((BufferReader$1.prototype = Object.create(
  reader.prototype
)).constructor = BufferReader$1),
  (BufferReader$1._configure = function () {
    minimal.Buffer &&
      (BufferReader$1.prototype._slice = minimal.Buffer.prototype.slice);
  }),
  (BufferReader$1.prototype.string = function () {
    var e = this.uint32();
    return this.buf.utf8Slice
      ? this.buf.utf8Slice(
          this.pos,
          (this.pos = Math.min(this.pos + e, this.len))
        )
      : this.buf.toString(
          "utf-8",
          this.pos,
          (this.pos = Math.min(this.pos + e, this.len))
        );
  }),
  BufferReader$1._configure();
var service = Service;
function Service(e, t, r) {
  if ("function" != typeof e) throw TypeError("rpcImpl must be a function");
  minimal.EventEmitter.call(this),
    (this.rpcImpl = e),
    (this.requestDelimited = Boolean(t)),
    (this.responseDelimited = Boolean(r));
}
((Service.prototype = Object.create(
  minimal.EventEmitter.prototype
)).constructor = Service),
  (Service.prototype.rpcCall = function e(t, r, n, o, a) {
    if (!o) throw TypeError("request must be specified");
    var i = this;
    if (!a) return minimal.asPromise(e, i, t, r, n, o);
    if (i.rpcImpl)
      try {
        return i.rpcImpl(
          t,
          r[i.requestDelimited ? "encodeDelimited" : "encode"](o).finish(),
          function (e, r) {
            if (e) return i.emit("error", e, t), a(e);
            if (null !== r) {
              if (!(r instanceof n))
                try {
                  r = n[i.responseDelimited ? "decodeDelimited" : "decode"](r);
                } catch (e) {
                  return i.emit("error", e, t), a(e);
                }
              return i.emit("data", r, t), a(null, r);
            }
            i.end(!0);
          }
        );
      } catch (e) {
        return (
          i.emit("error", e, t),
          void setTimeout(function () {
            a(e);
          }, 0)
        );
      }
    else
      setTimeout(function () {
        a(Error("already ended"));
      }, 0);
  }),
  (Service.prototype.end = function (e) {
    return (
      this.rpcImpl &&
        (e || this.rpcImpl(null, null, null),
        (this.rpcImpl = null),
        this.emit("end").off()),
      this
    );
  });
var rpc_1 = createCommonjsModule(function (e, t) {
    t.Service = service;
  }),
  roots = {},
  indexMinimal = createCommonjsModule(function (e, t) {
    var r = t;
    function n() {
      r.util._configure(),
        r.Writer._configure(r.BufferWriter),
        r.Reader._configure(r.BufferReader);
    }
    (r.build = "minimal"),
      (r.Writer = writer),
      (r.BufferWriter = writer_buffer),
      (r.Reader = reader),
      (r.BufferReader = reader_buffer),
      (r.util = minimal),
      (r.rpc = rpc_1),
      (r.roots = roots),
      (r.configure = n),
      n();
  });
const $Reader = indexMinimal.Reader,
  $Writer = indexMinimal.Writer,
  $util = indexMinimal.util,
  NanoMessage = (indexMinimal.NanoMessage = (() => {
    function e(e) {
      if (e)
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.type = 0),
      (e.prototype.symbol = ""),
      (e.prototype.data = $util.newBuffer([])),
      (e.encode = function (e, t) {
        return (
          t || (t = $Writer.create()),
          null != e.type &&
            Object.hasOwnProperty.call(e, "type") &&
            t.uint32(8).int32(e.type),
          null != e.symbol &&
            Object.hasOwnProperty.call(e, "symbol") &&
            t.uint32(18).string(e.symbol),
          null != e.data &&
            Object.hasOwnProperty.call(e, "data") &&
            t.uint32(26).bytes(e.data),
          t
        );
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.NanoMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.type = e.int32();
              break;
            case 2:
              n.symbol = e.string();
              break;
            case 3:
              n.data = e.bytes();
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      (e.Type = (function () {
        const e = {},
          t = Object.create(e);
        return (
          (t[(e[0] = "UNKNOWN")] = 0),
          (t[(e[1] = "TRADE")] = 1),
          (t[(e[2] = "ORDERBOOK")] = 2),
          t
        );
      })()),
      e
    );
  })()),
  NanoBook = (indexMinimal.NanoBook = (() => {
    function e(e) {
      if (e)
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.side = !1),
      (e.prototype.price = 0),
      (e.prototype.amount = 0),
      (e.prototype.timestamp = 0),
      (e.encode = function (e, t) {
        return (
          t || (t = $Writer.create()),
          null != e.side &&
            Object.hasOwnProperty.call(e, "side") &&
            t.uint32(8).bool(e.side),
          null != e.price &&
            Object.hasOwnProperty.call(e, "price") &&
            t.uint32(21).float(e.price),
          null != e.amount &&
            Object.hasOwnProperty.call(e, "amount") &&
            t.uint32(29).float(e.amount),
          null != e.timestamp &&
            Object.hasOwnProperty.call(e, "timestamp") &&
            t.uint32(32).int32(e.timestamp),
          t
        );
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.NanoBook();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.side = e.bool();
              break;
            case 2:
              n.price = e.float();
              break;
            case 3:
              n.amount = e.float();
              break;
            case 4:
              n.timestamp = e.int32();
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  DoubleMatrix = (indexMinimal.DoubleMatrix = (() => {
    function e(e) {
      if (((this.data = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.rows = 0),
      (e.prototype.cols = 0),
      (e.prototype.data = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()),
          null != e.rows &&
            Object.hasOwnProperty.call(e, "rows") &&
            t.uint32(8).uint32(e.rows),
          null != e.cols &&
            Object.hasOwnProperty.call(e, "cols") &&
            t.uint32(16).uint32(e.cols),
          null != e.data && e.data.length)
        ) {
          t.uint32(26).fork();
          for (let r = 0; r < e.data.length; ++r) t.double(e.data[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.DoubleMatrix();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.rows = e.uint32();
              break;
            case 2:
              n.cols = e.uint32();
              break;
            case 3:
              if (((n.data && n.data.length) || (n.data = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.data.push(e.double());
              } else n.data.push(e.double());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  OldHeatmap = (indexMinimal.OldHeatmap = (() => {
    function e(e) {
      if (((this.prices = []), (this.sizes = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.prices = $util.emptyArray),
      (e.prototype.sizes = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()), null != e.prices && e.prices.length)
        ) {
          t.uint32(10).fork();
          for (let r = 0; r < e.prices.length; ++r) t.float(e.prices[r]);
          t.ldelim();
        }
        if (null != e.sizes && e.sizes.length) {
          t.uint32(18).fork();
          for (let r = 0; r < e.sizes.length; ++r) t.float(e.sizes[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.OldHeatmap();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              if (
                ((n.prices && n.prices.length) || (n.prices = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.prices.push(e.float());
              } else n.prices.push(e.float());
              break;
            case 2:
              if (
                ((n.sizes && n.sizes.length) || (n.sizes = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.sizes.push(e.float());
              } else n.sizes.push(e.float());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  OldVPVR = (indexMinimal.OldVPVR = (() => {
    function e(e) {
      if (((this.data = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.data = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.data && e.data.length)) {
          t.uint32(10).fork();
          for (let r = 0; r < e.data.length; ++r) t.float(e.data[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.OldVPVR();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              if (((n.data && n.data.length) || (n.data = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.data.push(e.float());
              } else n.data.push(e.float());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  OldHeatmapResponse = (indexMinimal.OldHeatmapResponse = (() => {
    function e(e) {
      if (((this.times = []), (this.datas = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.times = $util.emptyArray),
      (e.prototype.datas = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.times && e.times.length)) {
          t.uint32(10).fork();
          for (let r = 0; r < e.times.length; ++r) t.int32(e.times[r]);
          t.ldelim();
        }
        if (null != e.datas && e.datas.length)
          for (let r = 0; r < e.datas.length; ++r)
            t.uint32(18).bytes(e.datas[r]);
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.OldHeatmapResponse();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              if (
                ((n.times && n.times.length) || (n.times = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.times.push(e.int32());
              } else n.times.push(e.int32());
              break;
            case 2:
              (n.datas && n.datas.length) || (n.datas = []),
                n.datas.push(e.bytes());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  OldVPVRResponse = (indexMinimal.OldVPVRResponse = (() => {
    function e(e) {
      if (((this.times = []), (this.datas = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.times = $util.emptyArray),
      (e.prototype.datas = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.times && e.times.length)) {
          t.uint32(10).fork();
          for (let r = 0; r < e.times.length; ++r) t.int32(e.times[r]);
          t.ldelim();
        }
        if (null != e.datas && e.datas.length)
          for (let r = 0; r < e.datas.length; ++r)
            t.uint32(18).bytes(e.datas[r]);
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.OldVPVRResponse();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              if (
                ((n.times && n.times.length) || (n.times = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.times.push(e.int32());
              } else n.times.push(e.int32());
              break;
            case 2:
              (n.datas && n.datas.length) || (n.datas = []),
                n.datas.push(e.bytes());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  OldCandle = (indexMinimal.OldCandle = (() => {
    function e(e) {
      if (e)
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = 0),
      (e.prototype.open = 0),
      (e.prototype.close = 0),
      (e.prototype.low = 0),
      (e.prototype.high = 0),
      (e.prototype.vbuy = 0),
      (e.prototype.vsell = 0),
      (e.encode = function (e, t) {
        return (
          t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int32(e.time),
          null != e.open &&
            Object.hasOwnProperty.call(e, "open") &&
            t.uint32(21).float(e.open),
          null != e.close &&
            Object.hasOwnProperty.call(e, "close") &&
            t.uint32(29).float(e.close),
          null != e.low &&
            Object.hasOwnProperty.call(e, "low") &&
            t.uint32(37).float(e.low),
          null != e.high &&
            Object.hasOwnProperty.call(e, "high") &&
            t.uint32(45).float(e.high),
          null != e.vbuy &&
            Object.hasOwnProperty.call(e, "vbuy") &&
            t.uint32(53).float(e.vbuy),
          null != e.vsell &&
            Object.hasOwnProperty.call(e, "vsell") &&
            t.uint32(61).float(e.vsell),
          t
        );
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.OldCandle();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int32();
              break;
            case 2:
              n.open = e.float();
              break;
            case 3:
              n.close = e.float();
              break;
            case 4:
              n.low = e.float();
              break;
            case 5:
              n.high = e.float();
              break;
            case 6:
              n.vbuy = e.float();
              break;
            case 7:
              n.vsell = e.float();
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  OldCandleResponse = (indexMinimal.OldCandleResponse = (() => {
    function e(e) {
      if (((this.candles = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.candles = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()), null != e.candles && e.candles.length)
        )
          for (let r = 0; r < e.candles.length; ++r)
            indexMinimal.OldCandle.encode(
              e.candles[r],
              t.uint32(10).fork()
            ).ldelim();
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.OldCandleResponse();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              (n.candles && n.candles.length) || (n.candles = []),
                n.candles.push(indexMinimal.OldCandle.decode(e, e.uint32()));
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  OldStat = (indexMinimal.OldStat = (() => {
    function e(e) {
      if (e)
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = 0),
      (e.prototype.open = 0),
      (e.prototype.high = 0),
      (e.prototype.low = 0),
      (e.prototype.close = 0),
      (e.prototype.fundingRate = 0),
      (e.prototype.liquidationLong = 0),
      (e.prototype.liquidationShort = 0),
      (e.encode = function (e, t) {
        return (
          t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int32(e.time),
          null != e.open &&
            Object.hasOwnProperty.call(e, "open") &&
            t.uint32(21).float(e.open),
          null != e.high &&
            Object.hasOwnProperty.call(e, "high") &&
            t.uint32(29).float(e.high),
          null != e.low &&
            Object.hasOwnProperty.call(e, "low") &&
            t.uint32(37).float(e.low),
          null != e.close &&
            Object.hasOwnProperty.call(e, "close") &&
            t.uint32(45).float(e.close),
          null != e.fundingRate &&
            Object.hasOwnProperty.call(e, "fundingRate") &&
            t.uint32(53).float(e.fundingRate),
          null != e.liquidationLong &&
            Object.hasOwnProperty.call(e, "liquidationLong") &&
            t.uint32(61).float(e.liquidationLong),
          null != e.liquidationShort &&
            Object.hasOwnProperty.call(e, "liquidationShort") &&
            t.uint32(69).float(e.liquidationShort),
          t
        );
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.OldStat();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int32();
              break;
            case 2:
              n.open = e.float();
              break;
            case 3:
              n.high = e.float();
              break;
            case 4:
              n.low = e.float();
              break;
            case 5:
              n.close = e.float();
              break;
            case 6:
              n.fundingRate = e.float();
              break;
            case 7:
              n.liquidationLong = e.float();
              break;
            case 8:
              n.liquidationShort = e.float();
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  OldStatsResponse = (indexMinimal.OldStatsResponse = (() => {
    function e(e) {
      if (((this.candles = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.candles = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()), null != e.candles && e.candles.length)
        )
          for (let r = 0; r < e.candles.length; ++r)
            indexMinimal.OldStat.encode(
              e.candles[r],
              t.uint32(10).fork()
            ).ldelim();
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.OldStatsResponse();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              (n.candles && n.candles.length) || (n.candles = []),
                n.candles.push(indexMinimal.OldStat.decode(e, e.uint32()));
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  HeatmapRedis = (indexMinimal.HeatmapRedis = (() => {
    function e(e) {
      if (((this.items = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.items = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.items && e.items.length))
          for (let r = 0; r < e.items.length; ++r)
            indexMinimal.HeatmapRedis.HeatmapRedisBlock.encode(
              e.items[r],
              t.uint32(10).fork()
            ).ldelim();
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.HeatmapRedis();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              (n.items && n.items.length) || (n.items = []),
                n.items.push(
                  indexMinimal.HeatmapRedis.HeatmapRedisBlock.decode(
                    e,
                    e.uint32()
                  )
                );
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      (e.HeatmapRedisBlock = (function () {
        function e(e) {
          if (e)
            for (let t = Object.keys(e), r = 0; r < t.length; ++r)
              null != e[t[r]] && (this[t[r]] = e[t[r]]);
        }
        return (
          (e.prototype.price = 0),
          (e.prototype.size = 0),
          (e.encode = function (e, t) {
            return (
              t || (t = $Writer.create()),
              null != e.price &&
                Object.hasOwnProperty.call(e, "price") &&
                t.uint32(9).double(e.price),
              null != e.size &&
                Object.hasOwnProperty.call(e, "size") &&
                t.uint32(17).double(e.size),
              t
            );
          }),
          (e.decode = function (e, t) {
            e instanceof $Reader || (e = $Reader.create(e));
            let r = void 0 === t ? e.len : e.pos + t,
              n = new indexMinimal.HeatmapRedis.HeatmapRedisBlock();
            for (; e.pos < r; ) {
              let t = e.uint32();
              switch (t >>> 3) {
                case 1:
                  n.price = e.double();
                  break;
                case 2:
                  n.size = e.double();
                  break;
                default:
                  e.skipType(7 & t);
              }
            }
            return n;
          }),
          e
        );
      })()),
      e
    );
  })()),
  CandleResponse = (indexMinimal.CandleResponse = (() => {
    function e(e) {
      if (
        ((this.time = []),
        (this.open = []),
        (this.close = []),
        (this.low = []),
        (this.high = []),
        (this.vbuy = []),
        (this.vsell = []),
        e)
      )
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.emptyArray),
      (e.prototype.open = $util.emptyArray),
      (e.prototype.close = $util.emptyArray),
      (e.prototype.low = $util.emptyArray),
      (e.prototype.high = $util.emptyArray),
      (e.prototype.vbuy = $util.emptyArray),
      (e.prototype.vsell = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.time && e.time.length)) {
          t.uint32(10).fork();
          for (let r = 0; r < e.time.length; ++r) t.int64(e.time[r]);
          t.ldelim();
        }
        if (null != e.open && e.open.length) {
          t.uint32(18).fork();
          for (let r = 0; r < e.open.length; ++r) t.double(e.open[r]);
          t.ldelim();
        }
        if (null != e.close && e.close.length) {
          t.uint32(26).fork();
          for (let r = 0; r < e.close.length; ++r) t.double(e.close[r]);
          t.ldelim();
        }
        if (null != e.low && e.low.length) {
          t.uint32(34).fork();
          for (let r = 0; r < e.low.length; ++r) t.double(e.low[r]);
          t.ldelim();
        }
        if (null != e.high && e.high.length) {
          t.uint32(42).fork();
          for (let r = 0; r < e.high.length; ++r) t.double(e.high[r]);
          t.ldelim();
        }
        if (null != e.vbuy && e.vbuy.length) {
          t.uint32(50).fork();
          for (let r = 0; r < e.vbuy.length; ++r) t.double(e.vbuy[r]);
          t.ldelim();
        }
        if (null != e.vsell && e.vsell.length) {
          t.uint32(58).fork();
          for (let r = 0; r < e.vsell.length; ++r) t.double(e.vsell[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.CandleResponse();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              if (((n.time && n.time.length) || (n.time = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.time.push(e.int64());
              } else n.time.push(e.int64());
              break;
            case 2:
              if (((n.open && n.open.length) || (n.open = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.open.push(e.double());
              } else n.open.push(e.double());
              break;
            case 3:
              if (
                ((n.close && n.close.length) || (n.close = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.close.push(e.double());
              } else n.close.push(e.double());
              break;
            case 4:
              if (((n.low && n.low.length) || (n.low = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.low.push(e.double());
              } else n.low.push(e.double());
              break;
            case 5:
              if (((n.high && n.high.length) || (n.high = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.high.push(e.double());
              } else n.high.push(e.double());
              break;
            case 6:
              if (((n.vbuy && n.vbuy.length) || (n.vbuy = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.vbuy.push(e.double());
              } else n.vbuy.push(e.double());
              break;
            case 7:
              if (
                ((n.vsell && n.vsell.length) || (n.vsell = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.vsell.push(e.double());
              } else n.vsell.push(e.double());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  HeatmapEntry = (indexMinimal.HeatmapEntry = (() => {
    function e(e) {
      if (((this.values = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
      (e.prototype.priceGroup = 0),
      (e.prototype.minPrice = 0),
      (e.prototype.maxPrice = 0),
      (e.prototype.values = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int64(e.time),
          null != e.priceGroup &&
            Object.hasOwnProperty.call(e, "priceGroup") &&
            t.uint32(17).double(e.priceGroup),
          null != e.minPrice &&
            Object.hasOwnProperty.call(e, "minPrice") &&
            t.uint32(25).double(e.minPrice),
          null != e.maxPrice &&
            Object.hasOwnProperty.call(e, "maxPrice") &&
            t.uint32(33).double(e.maxPrice),
          null != e.values && e.values.length)
        ) {
          t.uint32(42).fork();
          for (let r = 0; r < e.values.length; ++r) t.float(e.values[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.HeatmapEntry();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int64();
              break;
            case 2:
              n.priceGroup = e.double();
              break;
            case 3:
              n.minPrice = e.double();
              break;
            case 4:
              n.maxPrice = e.double();
              break;
            case 5:
              if (
                ((n.values && n.values.length) || (n.values = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.values.push(e.float());
              } else n.values.push(e.float());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  HeatmapResponse = (indexMinimal.HeatmapResponse = (() => {
    function e(e) {
      if (((this.entries = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.entries = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()), null != e.entries && e.entries.length)
        )
          for (let r = 0; r < e.entries.length; ++r)
            t.uint32(10).bytes(e.entries[r]);
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.HeatmapResponse();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              (n.entries && n.entries.length) || (n.entries = []),
                n.entries.push(e.bytes());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  StatsResponse = (indexMinimal.StatsResponse = (() => {
    function e(e) {
      if (
        ((this.time = []),
        (this.open = []),
        (this.close = []),
        (this.low = []),
        (this.high = []),
        (this.markPrice = []),
        (this.fundCurr = []),
        (this.fundPred = []),
        (this.liqAsk = []),
        (this.liqBid = []),
        e)
      )
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.emptyArray),
      (e.prototype.open = $util.emptyArray),
      (e.prototype.close = $util.emptyArray),
      (e.prototype.low = $util.emptyArray),
      (e.prototype.high = $util.emptyArray),
      (e.prototype.markPrice = $util.emptyArray),
      (e.prototype.fundCurr = $util.emptyArray),
      (e.prototype.fundPred = $util.emptyArray),
      (e.prototype.liqAsk = $util.emptyArray),
      (e.prototype.liqBid = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.time && e.time.length)) {
          t.uint32(10).fork();
          for (let r = 0; r < e.time.length; ++r) t.int64(e.time[r]);
          t.ldelim();
        }
        if (null != e.open && e.open.length) {
          t.uint32(18).fork();
          for (let r = 0; r < e.open.length; ++r) t.double(e.open[r]);
          t.ldelim();
        }
        if (null != e.close && e.close.length) {
          t.uint32(26).fork();
          for (let r = 0; r < e.close.length; ++r) t.double(e.close[r]);
          t.ldelim();
        }
        if (null != e.low && e.low.length) {
          t.uint32(34).fork();
          for (let r = 0; r < e.low.length; ++r) t.double(e.low[r]);
          t.ldelim();
        }
        if (null != e.high && e.high.length) {
          t.uint32(42).fork();
          for (let r = 0; r < e.high.length; ++r) t.double(e.high[r]);
          t.ldelim();
        }
        if (null != e.markPrice && e.markPrice.length) {
          t.uint32(50).fork();
          for (let r = 0; r < e.markPrice.length; ++r) t.double(e.markPrice[r]);
          t.ldelim();
        }
        if (null != e.fundCurr && e.fundCurr.length) {
          t.uint32(58).fork();
          for (let r = 0; r < e.fundCurr.length; ++r) t.double(e.fundCurr[r]);
          t.ldelim();
        }
        if (null != e.fundPred && e.fundPred.length) {
          t.uint32(66).fork();
          for (let r = 0; r < e.fundPred.length; ++r) t.double(e.fundPred[r]);
          t.ldelim();
        }
        if (null != e.liqAsk && e.liqAsk.length) {
          t.uint32(74).fork();
          for (let r = 0; r < e.liqAsk.length; ++r) t.double(e.liqAsk[r]);
          t.ldelim();
        }
        if (null != e.liqBid && e.liqBid.length) {
          t.uint32(82).fork();
          for (let r = 0; r < e.liqBid.length; ++r) t.double(e.liqBid[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.StatsResponse();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              if (((n.time && n.time.length) || (n.time = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.time.push(e.int64());
              } else n.time.push(e.int64());
              break;
            case 2:
              if (((n.open && n.open.length) || (n.open = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.open.push(e.double());
              } else n.open.push(e.double());
              break;
            case 3:
              if (
                ((n.close && n.close.length) || (n.close = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.close.push(e.double());
              } else n.close.push(e.double());
              break;
            case 4:
              if (((n.low && n.low.length) || (n.low = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.low.push(e.double());
              } else n.low.push(e.double());
              break;
            case 5:
              if (((n.high && n.high.length) || (n.high = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.high.push(e.double());
              } else n.high.push(e.double());
              break;
            case 6:
              if (
                ((n.markPrice && n.markPrice.length) || (n.markPrice = []),
                2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.markPrice.push(e.double());
              } else n.markPrice.push(e.double());
              break;
            case 7:
              if (
                ((n.fundCurr && n.fundCurr.length) || (n.fundCurr = []),
                2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.fundCurr.push(e.double());
              } else n.fundCurr.push(e.double());
              break;
            case 8:
              if (
                ((n.fundPred && n.fundPred.length) || (n.fundPred = []),
                2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.fundPred.push(e.double());
              } else n.fundPred.push(e.double());
              break;
            case 9:
              if (
                ((n.liqAsk && n.liqAsk.length) || (n.liqAsk = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.liqAsk.push(e.double());
              } else n.liqAsk.push(e.double());
              break;
            case 10:
              if (
                ((n.liqBid && n.liqBid.length) || (n.liqBid = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.liqBid.push(e.double());
              } else n.liqBid.push(e.double());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  VolumeEntry = (indexMinimal.VolumeEntry = (() => {
    function e(e) {
      if (((this.prices = []), (this.buys = []), (this.sells = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
      (e.prototype.prices = $util.emptyArray),
      (e.prototype.buys = $util.emptyArray),
      (e.prototype.sells = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int64(e.time),
          null != e.prices && e.prices.length)
        ) {
          t.uint32(18).fork();
          for (let r = 0; r < e.prices.length; ++r) t.double(e.prices[r]);
          t.ldelim();
        }
        if (null != e.buys && e.buys.length) {
          t.uint32(26).fork();
          for (let r = 0; r < e.buys.length; ++r) t.double(e.buys[r]);
          t.ldelim();
        }
        if (null != e.sells && e.sells.length) {
          t.uint32(34).fork();
          for (let r = 0; r < e.sells.length; ++r) t.double(e.sells[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.VolumeEntry();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int64();
              break;
            case 2:
              if (
                ((n.prices && n.prices.length) || (n.prices = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.prices.push(e.double());
              } else n.prices.push(e.double());
              break;
            case 3:
              if (((n.buys && n.buys.length) || (n.buys = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.buys.push(e.double());
              } else n.buys.push(e.double());
              break;
            case 4:
              if (
                ((n.sells && n.sells.length) || (n.sells = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.sells.push(e.double());
              } else n.sells.push(e.double());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  VolumeResponse = (indexMinimal.VolumeResponse = (() => {
    function e(e) {
      if (((this.times = []), (this.datas = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.times = $util.emptyArray),
      (e.prototype.datas = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.times && e.times.length)) {
          t.uint32(10).fork();
          for (let r = 0; r < e.times.length; ++r) t.int64(e.times[r]);
          t.ldelim();
        }
        if (null != e.datas && e.datas.length)
          for (let r = 0; r < e.datas.length; ++r)
            t.uint32(18).bytes(e.datas[r]);
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.VolumeResponse();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              if (
                ((n.times && n.times.length) || (n.times = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.times.push(e.int64());
              } else n.times.push(e.int64());
              break;
            case 2:
              (n.datas && n.datas.length) || (n.datas = []),
                n.datas.push(e.bytes());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  TradeMessage = (indexMinimal.TradeMessage = (() => {
    function e(e) {
      if (e)
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.side = !1),
      (e.prototype.price = 0),
      (e.prototype.size = 0),
      (e.prototype.unix = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
      (e.encode = function (e, t) {
        return (
          t || (t = $Writer.create()),
          null != e.side &&
            Object.hasOwnProperty.call(e, "side") &&
            t.uint32(8).bool(e.side),
          null != e.price &&
            Object.hasOwnProperty.call(e, "price") &&
            t.uint32(17).double(e.price),
          null != e.size &&
            Object.hasOwnProperty.call(e, "size") &&
            t.uint32(25).double(e.size),
          null != e.unix &&
            Object.hasOwnProperty.call(e, "unix") &&
            t.uint32(32).int64(e.unix),
          t
        );
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.TradeMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.side = e.bool();
              break;
            case 2:
              n.price = e.double();
              break;
            case 3:
              n.size = e.double();
              break;
            case 4:
              n.unix = e.int64();
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  TradesMultiMessage = (indexMinimal.TradesMultiMessage = (() => {
    function e(e) {
      if (((this.trades = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.trades = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.trades && e.trades.length))
          for (let r = 0; r < e.trades.length; ++r)
            indexMinimal.TradeMessage.encode(
              e.trades[r],
              t.uint32(10).fork()
            ).ldelim();
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.TradesMultiMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              (n.trades && n.trades.length) || (n.trades = []),
                n.trades.push(indexMinimal.TradeMessage.decode(e, e.uint32()));
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  CandleMessage = (indexMinimal.CandleMessage = (() => {
    function e(e) {
      if (e)
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
      (e.prototype.open = 0),
      (e.prototype.close = 0),
      (e.prototype.low = 0),
      (e.prototype.high = 0),
      (e.prototype.vbuy = 0),
      (e.prototype.vsell = 0),
      (e.encode = function (e, t) {
        return (
          t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int64(e.time),
          null != e.open &&
            Object.hasOwnProperty.call(e, "open") &&
            t.uint32(17).double(e.open),
          null != e.close &&
            Object.hasOwnProperty.call(e, "close") &&
            t.uint32(25).double(e.close),
          null != e.low &&
            Object.hasOwnProperty.call(e, "low") &&
            t.uint32(33).double(e.low),
          null != e.high &&
            Object.hasOwnProperty.call(e, "high") &&
            t.uint32(41).double(e.high),
          null != e.vbuy &&
            Object.hasOwnProperty.call(e, "vbuy") &&
            t.uint32(49).double(e.vbuy),
          null != e.vsell &&
            Object.hasOwnProperty.call(e, "vsell") &&
            t.uint32(57).double(e.vsell),
          t
        );
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.CandleMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int64();
              break;
            case 2:
              n.open = e.double();
              break;
            case 3:
              n.close = e.double();
              break;
            case 4:
              n.low = e.double();
              break;
            case 5:
              n.high = e.double();
              break;
            case 6:
              n.vbuy = e.double();
              break;
            case 7:
              n.vsell = e.double();
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  CandleMultiMessage = (indexMinimal.CandleMultiMessage = (() => {
    function e(e) {
      if (((this.candles = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.candles = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()), null != e.candles && e.candles.length)
        )
          for (let r = 0; r < e.candles.length; ++r)
            indexMinimal.CandleMessage.encode(
              e.candles[r],
              t.uint32(10).fork()
            ).ldelim();
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.CandleMultiMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              (n.candles && n.candles.length) || (n.candles = []),
                n.candles.push(
                  indexMinimal.CandleMessage.decode(e, e.uint32())
                );
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  HeatmapMessage = (indexMinimal.HeatmapMessage = (() => {
    function e(e) {
      if (((this.prices = []), (this.sizes = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
      (e.prototype.minPrice = 0),
      (e.prototype.maxPrice = 0),
      (e.prototype.priceGroup = 0),
      (e.prototype.prices = $util.emptyArray),
      (e.prototype.sizes = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int64(e.time),
          null != e.minPrice &&
            Object.hasOwnProperty.call(e, "minPrice") &&
            t.uint32(17).double(e.minPrice),
          null != e.maxPrice &&
            Object.hasOwnProperty.call(e, "maxPrice") &&
            t.uint32(25).double(e.maxPrice),
          null != e.priceGroup &&
            Object.hasOwnProperty.call(e, "priceGroup") &&
            t.uint32(33).double(e.priceGroup),
          null != e.prices && e.prices.length)
        ) {
          t.uint32(42).fork();
          for (let r = 0; r < e.prices.length; ++r) t.double(e.prices[r]);
          t.ldelim();
        }
        if (null != e.sizes && e.sizes.length) {
          t.uint32(50).fork();
          for (let r = 0; r < e.sizes.length; ++r) t.float(e.sizes[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.HeatmapMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int64();
              break;
            case 2:
              n.minPrice = e.double();
              break;
            case 3:
              n.maxPrice = e.double();
              break;
            case 4:
              n.priceGroup = e.double();
              break;
            case 5:
              if (
                ((n.prices && n.prices.length) || (n.prices = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.prices.push(e.double());
              } else n.prices.push(e.double());
              break;
            case 6:
              if (
                ((n.sizes && n.sizes.length) || (n.sizes = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.sizes.push(e.float());
              } else n.sizes.push(e.float());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  BookMessage = (indexMinimal.BookMessage = (() => {
    function e(e) {
      if (
        ((this.askPrices = []),
        (this.askSizes = []),
        (this.bidPrices = []),
        (this.bidSizes = []),
        e)
      )
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
      (e.prototype.type = 0),
      (e.prototype.askPrices = $util.emptyArray),
      (e.prototype.askSizes = $util.emptyArray),
      (e.prototype.bidPrices = $util.emptyArray),
      (e.prototype.bidSizes = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int64(e.time),
          null != e.type &&
            Object.hasOwnProperty.call(e, "type") &&
            t.uint32(16).int32(e.type),
          null != e.askPrices && e.askPrices.length)
        ) {
          t.uint32(26).fork();
          for (let r = 0; r < e.askPrices.length; ++r) t.double(e.askPrices[r]);
          t.ldelim();
        }
        if (null != e.askSizes && e.askSizes.length) {
          t.uint32(34).fork();
          for (let r = 0; r < e.askSizes.length; ++r) t.float(e.askSizes[r]);
          t.ldelim();
        }
        if (null != e.bidPrices && e.bidPrices.length) {
          t.uint32(42).fork();
          for (let r = 0; r < e.bidPrices.length; ++r) t.double(e.bidPrices[r]);
          t.ldelim();
        }
        if (null != e.bidSizes && e.bidSizes.length) {
          t.uint32(50).fork();
          for (let r = 0; r < e.bidSizes.length; ++r) t.float(e.bidSizes[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.BookMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int64();
              break;
            case 2:
              n.type = e.int32();
              break;
            case 3:
              if (
                ((n.askPrices && n.askPrices.length) || (n.askPrices = []),
                2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.askPrices.push(e.double());
              } else n.askPrices.push(e.double());
              break;
            case 4:
              if (
                ((n.askSizes && n.askSizes.length) || (n.askSizes = []),
                2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.askSizes.push(e.float());
              } else n.askSizes.push(e.float());
              break;
            case 5:
              if (
                ((n.bidPrices && n.bidPrices.length) || (n.bidPrices = []),
                2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.bidPrices.push(e.double());
              } else n.bidPrices.push(e.double());
              break;
            case 6:
              if (
                ((n.bidSizes && n.bidSizes.length) || (n.bidSizes = []),
                2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.bidSizes.push(e.float());
              } else n.bidSizes.push(e.float());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  VolumeMessage = (indexMinimal.VolumeMessage = (() => {
    function e(e) {
      if (((this.prices = []), (this.buys = []), (this.sells = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
      (e.prototype.prices = $util.emptyArray),
      (e.prototype.buys = $util.emptyArray),
      (e.prototype.sells = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int64(e.time),
          null != e.prices && e.prices.length)
        ) {
          t.uint32(18).fork();
          for (let r = 0; r < e.prices.length; ++r) t.double(e.prices[r]);
          t.ldelim();
        }
        if (null != e.buys && e.buys.length) {
          t.uint32(26).fork();
          for (let r = 0; r < e.buys.length; ++r) t.double(e.buys[r]);
          t.ldelim();
        }
        if (null != e.sells && e.sells.length) {
          t.uint32(34).fork();
          for (let r = 0; r < e.sells.length; ++r) t.double(e.sells[r]);
          t.ldelim();
        }
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.VolumeMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int64();
              break;
            case 2:
              if (
                ((n.prices && n.prices.length) || (n.prices = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.prices.push(e.double());
              } else n.prices.push(e.double());
              break;
            case 3:
              if (((n.buys && n.buys.length) || (n.buys = []), 2 == (7 & t))) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.buys.push(e.double());
              } else n.buys.push(e.double());
              break;
            case 4:
              if (
                ((n.sells && n.sells.length) || (n.sells = []), 2 == (7 & t))
              ) {
                let t = e.uint32() + e.pos;
                for (; e.pos < t; ) n.sells.push(e.double());
              } else n.sells.push(e.double());
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  VolumeMultiMessage = (indexMinimal.VolumeMultiMessage = (() => {
    function e(e) {
      if (((this.volumes = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.volumes = $util.emptyArray),
      (e.encode = function (e, t) {
        if (
          (t || (t = $Writer.create()), null != e.volumes && e.volumes.length)
        )
          for (let r = 0; r < e.volumes.length; ++r)
            indexMinimal.VolumeMessage.encode(
              e.volumes[r],
              t.uint32(10).fork()
            ).ldelim();
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.VolumeMultiMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              (n.volumes && n.volumes.length) || (n.volumes = []),
                n.volumes.push(
                  indexMinimal.VolumeMessage.decode(e, e.uint32())
                );
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  StatMessage = (indexMinimal.StatMessage = (() => {
    function e(e) {
      if (e)
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.time = $util.Long ? $util.Long.fromBits(0, 0, !1) : 0),
      (e.prototype.open = 0),
      (e.prototype.close = 0),
      (e.prototype.low = 0),
      (e.prototype.high = 0),
      (e.prototype.fundCurr = 0),
      (e.prototype.fundPred = 0),
      (e.prototype.markPrice = 0),
      (e.prototype.liqAsk = 0),
      (e.prototype.liqBid = 0),
      (e.encode = function (e, t) {
        return (
          t || (t = $Writer.create()),
          null != e.time &&
            Object.hasOwnProperty.call(e, "time") &&
            t.uint32(8).int64(e.time),
          null != e.open &&
            Object.hasOwnProperty.call(e, "open") &&
            t.uint32(17).double(e.open),
          null != e.close &&
            Object.hasOwnProperty.call(e, "close") &&
            t.uint32(25).double(e.close),
          null != e.low &&
            Object.hasOwnProperty.call(e, "low") &&
            t.uint32(33).double(e.low),
          null != e.high &&
            Object.hasOwnProperty.call(e, "high") &&
            t.uint32(41).double(e.high),
          null != e.fundCurr &&
            Object.hasOwnProperty.call(e, "fundCurr") &&
            t.uint32(49).double(e.fundCurr),
          null != e.fundPred &&
            Object.hasOwnProperty.call(e, "fundPred") &&
            t.uint32(57).double(e.fundPred),
          null != e.markPrice &&
            Object.hasOwnProperty.call(e, "markPrice") &&
            t.uint32(65).double(e.markPrice),
          null != e.liqAsk &&
            Object.hasOwnProperty.call(e, "liqAsk") &&
            t.uint32(73).double(e.liqAsk),
          null != e.liqBid &&
            Object.hasOwnProperty.call(e, "liqBid") &&
            t.uint32(81).double(e.liqBid),
          t
        );
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.StatMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              n.time = e.int64();
              break;
            case 2:
              n.open = e.double();
              break;
            case 3:
              n.close = e.double();
              break;
            case 4:
              n.low = e.double();
              break;
            case 5:
              n.high = e.double();
              break;
            case 6:
              n.fundCurr = e.double();
              break;
            case 7:
              n.fundPred = e.double();
              break;
            case 8:
              n.markPrice = e.double();
              break;
            case 9:
              n.liqAsk = e.double();
              break;
            case 10:
              n.liqBid = e.double();
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })()),
  StatMultiMessage = (indexMinimal.StatMultiMessage = (() => {
    function e(e) {
      if (((this.stats = []), e))
        for (let t = Object.keys(e), r = 0; r < t.length; ++r)
          null != e[t[r]] && (this[t[r]] = e[t[r]]);
    }
    return (
      (e.prototype.stats = $util.emptyArray),
      (e.encode = function (e, t) {
        if ((t || (t = $Writer.create()), null != e.stats && e.stats.length))
          for (let r = 0; r < e.stats.length; ++r)
            indexMinimal.StatMessage.encode(
              e.stats[r],
              t.uint32(10).fork()
            ).ldelim();
        return t;
      }),
      (e.decode = function (e, t) {
        e instanceof $Reader || (e = $Reader.create(e));
        let r = void 0 === t ? e.len : e.pos + t,
          n = new indexMinimal.StatMultiMessage();
        for (; e.pos < r; ) {
          let t = e.uint32();
          switch (t >>> 3) {
            case 1:
              (n.stats && n.stats.length) || (n.stats = []),
                n.stats.push(indexMinimal.StatMessage.decode(e, e.uint32()));
              break;
            default:
              e.skipType(7 & t);
          }
        }
        return n;
      }),
      e
    );
  })());
function identity$1(e) {
  return e;
}
var identity_1 = identity$1;
function listCacheClear() {
  (this.__data__ = []), (this.size = 0);
}
var _listCacheClear = listCacheClear;
function eq(e, t) {
  return e === t || (e != e && t != t);
}
var eq_1 = eq;
function assocIndexOf(e, t) {
  for (var r = e.length; r--; ) if (eq_1(e[r][0], t)) return r;
  return -1;
}
var _assocIndexOf = assocIndexOf,
  arrayProto = Array.prototype,
  splice = arrayProto.splice;
function listCacheDelete(e) {
  var t = this.__data__,
    r = _assocIndexOf(t, e);
  return !(
    r < 0 ||
    (r == t.length - 1 ? t.pop() : splice.call(t, r, 1), --this.size, 0)
  );
}
var _listCacheDelete = listCacheDelete;
function listCacheGet(e) {
  var t = this.__data__,
    r = _assocIndexOf(t, e);
  return r < 0 ? void 0 : t[r][1];
}
var _listCacheGet = listCacheGet;
function listCacheHas(e) {
  return _assocIndexOf(this.__data__, e) > -1;
}
var _listCacheHas = listCacheHas;
function listCacheSet(e, t) {
  var r = this.__data__,
    n = _assocIndexOf(r, e);
  return n < 0 ? (++this.size, r.push([e, t])) : (r[n][1] = t), this;
}
var _listCacheSet = listCacheSet;
function ListCache(e) {
  var t = -1,
    r = null == e ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
(ListCache.prototype.clear = _listCacheClear),
  (ListCache.prototype.delete = _listCacheDelete),
  (ListCache.prototype.get = _listCacheGet),
  (ListCache.prototype.has = _listCacheHas),
  (ListCache.prototype.set = _listCacheSet);
var _ListCache = ListCache;
function stackClear() {
  (this.__data__ = new _ListCache()), (this.size = 0);
}
var _stackClear = stackClear;
function stackDelete(e) {
  var t = this.__data__,
    r = t.delete(e);
  return (this.size = t.size), r;
}
var _stackDelete = stackDelete;
function stackGet(e) {
  return this.__data__.get(e);
}
var _stackGet = stackGet;
function stackHas(e) {
  return this.__data__.has(e);
}
var _stackHas = stackHas,
  freeGlobal =
    "object" == typeof commonjsGlobal &&
    commonjsGlobal &&
    commonjsGlobal.Object === Object &&
    commonjsGlobal,
  _freeGlobal = freeGlobal,
  freeSelf = "object" == typeof self && self && self.Object === Object && self,
  root = _freeGlobal || freeSelf || Function("return this")(),
  _root = root,
  Symbol$1 = _root.Symbol,
  _Symbol = Symbol$1,
  objectProto = Object.prototype,
  hasOwnProperty$1 = objectProto.hasOwnProperty,
  nativeObjectToString = objectProto.toString,
  symToStringTag = _Symbol ? _Symbol.toStringTag : void 0;
function getRawTag(e) {
  var t = hasOwnProperty$1.call(e, symToStringTag),
    r = e[symToStringTag];
  try {
    e[symToStringTag] = void 0;
    var n = !0;
  } catch (e) {}
  var o = nativeObjectToString.call(e);
  return n && (t ? (e[symToStringTag] = r) : delete e[symToStringTag]), o;
}
var _getRawTag = getRawTag,
  objectProto$1 = Object.prototype,
  nativeObjectToString$1 = objectProto$1.toString;
function objectToString(e) {
  return nativeObjectToString$1.call(e);
}
var _objectToString = objectToString,
  nullTag = "[object Null]",
  undefinedTag = "[object Undefined]",
  symToStringTag$1 = _Symbol ? _Symbol.toStringTag : void 0;
function baseGetTag(e) {
  return null == e
    ? void 0 === e
      ? undefinedTag
      : nullTag
    : symToStringTag$1 && symToStringTag$1 in Object(e)
    ? _getRawTag(e)
    : _objectToString(e);
}
var _baseGetTag = baseGetTag;
function isObject(e) {
  var t = typeof e;
  return null != e && ("object" == t || "function" == t);
}
var isObject_1 = isObject,
  asyncTag = "[object AsyncFunction]",
  funcTag = "[object Function]",
  genTag = "[object GeneratorFunction]",
  proxyTag = "[object Proxy]";
function isFunction(e) {
  if (!isObject_1(e)) return !1;
  var t = _baseGetTag(e);
  return t == funcTag || t == genTag || t == asyncTag || t == proxyTag;
}
var isFunction_1 = isFunction,
  coreJsData = _root["__core-js_shared__"],
  _coreJsData = coreJsData,
  maskSrcKey =
    ((uid = /[^.]+$/.exec(
      (_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO) || ""
    )),
    uid ? "Symbol(src)_1." + uid : ""),
  uid;
function isMasked(e) {
  return !!maskSrcKey && maskSrcKey in e;
}
var _isMasked = isMasked,
  funcProto = Function.prototype,
  funcToString = funcProto.toString;
function toSource(e) {
  if (null != e) {
    try {
      return funcToString.call(e);
    } catch (e) {}
    try {
      return e + "";
    } catch (e) {}
  }
  return "";
}
var _toSource = toSource,
  reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
  reIsHostCtor = /^\[object .+?Constructor\]$/,
  funcProto$1 = Function.prototype,
  objectProto$2 = Object.prototype,
  funcToString$1 = funcProto$1.toString,
  hasOwnProperty$2 = objectProto$2.hasOwnProperty,
  reIsNative = RegExp(
    "^" +
      funcToString$1
        .call(hasOwnProperty$2)
        .replace(reRegExpChar, "\\$&")
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
          "$1.*?"
        ) +
      "$"
  );
function baseIsNative(e) {
  return (
    !(!isObject_1(e) || _isMasked(e)) &&
    (isFunction_1(e) ? reIsNative : reIsHostCtor).test(_toSource(e))
  );
}
var _baseIsNative = baseIsNative;
function getValue(e, t) {
  return null == e ? void 0 : e[t];
}
var _getValue = getValue;
function getNative(e, t) {
  var r = _getValue(e, t);
  return _baseIsNative(r) ? r : void 0;
}
var _getNative = getNative,
  Map$1 = _getNative(_root, "Map"),
  _Map = Map$1,
  nativeCreate = _getNative(Object, "create"),
  _nativeCreate = nativeCreate;
function hashClear() {
  (this.__data__ = _nativeCreate ? _nativeCreate(null) : {}), (this.size = 0);
}
var _hashClear = hashClear;
function hashDelete(e) {
  var t = this.has(e) && delete this.__data__[e];
  return (this.size -= t ? 1 : 0), t;
}
var _hashDelete = hashDelete,
  HASH_UNDEFINED = "__lodash_hash_undefined__",
  objectProto$3 = Object.prototype,
  hasOwnProperty$3 = objectProto$3.hasOwnProperty;
function hashGet(e) {
  var t = this.__data__;
  if (_nativeCreate) {
    var r = t[e];
    return r === HASH_UNDEFINED ? void 0 : r;
  }
  return hasOwnProperty$3.call(t, e) ? t[e] : void 0;
}
var _hashGet = hashGet,
  objectProto$4 = Object.prototype,
  hasOwnProperty$4 = objectProto$4.hasOwnProperty;
function hashHas(e) {
  var t = this.__data__;
  return _nativeCreate ? void 0 !== t[e] : hasOwnProperty$4.call(t, e);
}
var _hashHas = hashHas,
  HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
function hashSet(e, t) {
  var r = this.__data__;
  return (
    (this.size += this.has(e) ? 0 : 1),
    (r[e] = _nativeCreate && void 0 === t ? HASH_UNDEFINED$1 : t),
    this
  );
}
var _hashSet = hashSet;
function Hash(e) {
  var t = -1,
    r = null == e ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
(Hash.prototype.clear = _hashClear),
  (Hash.prototype.delete = _hashDelete),
  (Hash.prototype.get = _hashGet),
  (Hash.prototype.has = _hashHas),
  (Hash.prototype.set = _hashSet);
var _Hash = Hash;
function mapCacheClear() {
  (this.size = 0),
    (this.__data__ = {
      hash: new _Hash(),
      map: new (_Map || _ListCache)(),
      string: new _Hash(),
    });
}
var _mapCacheClear = mapCacheClear;
function isKeyable(e) {
  var t = typeof e;
  return "string" == t || "number" == t || "symbol" == t || "boolean" == t
    ? "__proto__" !== e
    : null === e;
}
var _isKeyable = isKeyable;
function getMapData(e, t) {
  var r = e.__data__;
  return _isKeyable(t) ? r["string" == typeof t ? "string" : "hash"] : r.map;
}
var _getMapData = getMapData;
function mapCacheDelete(e) {
  var t = _getMapData(this, e).delete(e);
  return (this.size -= t ? 1 : 0), t;
}
var _mapCacheDelete = mapCacheDelete;
function mapCacheGet(e) {
  return _getMapData(this, e).get(e);
}
var _mapCacheGet = mapCacheGet;
function mapCacheHas(e) {
  return _getMapData(this, e).has(e);
}
var _mapCacheHas = mapCacheHas;
function mapCacheSet(e, t) {
  var r = _getMapData(this, e),
    n = r.size;
  return r.set(e, t), (this.size += r.size == n ? 0 : 1), this;
}
var _mapCacheSet = mapCacheSet;
function MapCache(e) {
  var t = -1,
    r = null == e ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var n = e[t];
    this.set(n[0], n[1]);
  }
}
(MapCache.prototype.clear = _mapCacheClear),
  (MapCache.prototype.delete = _mapCacheDelete),
  (MapCache.prototype.get = _mapCacheGet),
  (MapCache.prototype.has = _mapCacheHas),
  (MapCache.prototype.set = _mapCacheSet);
var _MapCache = MapCache,
  LARGE_ARRAY_SIZE = 200;
function stackSet(e, t) {
  var r = this.__data__;
  if (r instanceof _ListCache) {
    var n = r.__data__;
    if (!_Map || n.length < LARGE_ARRAY_SIZE - 1)
      return n.push([e, t]), (this.size = ++r.size), this;
    r = this.__data__ = new _MapCache(n);
  }
  return r.set(e, t), (this.size = r.size), this;
}
var _stackSet = stackSet;
function Stack(e) {
  var t = (this.__data__ = new _ListCache(e));
  this.size = t.size;
}
(Stack.prototype.clear = _stackClear),
  (Stack.prototype.delete = _stackDelete),
  (Stack.prototype.get = _stackGet),
  (Stack.prototype.has = _stackHas),
  (Stack.prototype.set = _stackSet);
var _Stack = Stack;
function arrayEach(e, t) {
  for (
    var r = -1, n = null == e ? 0 : e.length;
    ++r < n && !1 !== t(e[r], r, e);

  );
  return e;
}
var _arrayEach = arrayEach,
  defineProperty = (function () {
    try {
      var e = _getNative(Object, "defineProperty");
      return e({}, "", {}), e;
    } catch (e) {}
  })(),
  _defineProperty = defineProperty;
function baseAssignValue(e, t, r) {
  "__proto__" == t && _defineProperty
    ? _defineProperty(e, t, {
        configurable: !0,
        enumerable: !0,
        value: r,
        writable: !0,
      })
    : (e[t] = r);
}
var _baseAssignValue = baseAssignValue,
  objectProto$5 = Object.prototype,
  hasOwnProperty$5 = objectProto$5.hasOwnProperty;
function assignValue(e, t, r) {
  var n = e[t];
  (hasOwnProperty$5.call(e, t) && eq_1(n, r) && (void 0 !== r || t in e)) ||
    _baseAssignValue(e, t, r);
}
var _assignValue = assignValue;
function copyObject(e, t, r, n) {
  var o = !r;
  r || (r = {});
  for (var a = -1, i = t.length; ++a < i; ) {
    var s = t[a],
      u = n ? n(r[s], e[s], s, r, e) : void 0;
    void 0 === u && (u = e[s]),
      o ? _baseAssignValue(r, s, u) : _assignValue(r, s, u);
  }
  return r;
}
var _copyObject = copyObject;
function baseTimes(e, t) {
  for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
  return n;
}
var _baseTimes = baseTimes;
function isObjectLike(e) {
  return null != e && "object" == typeof e;
}
var isObjectLike_1 = isObjectLike,
  argsTag = "[object Arguments]";
function baseIsArguments(e) {
  return isObjectLike_1(e) && _baseGetTag(e) == argsTag;
}
var _baseIsArguments = baseIsArguments,
  objectProto$6 = Object.prototype,
  hasOwnProperty$6 = objectProto$6.hasOwnProperty,
  propertyIsEnumerable = objectProto$6.propertyIsEnumerable,
  isArguments = _baseIsArguments(
    (function () {
      return arguments;
    })()
  )
    ? _baseIsArguments
    : function (e) {
        return (
          isObjectLike_1(e) &&
          hasOwnProperty$6.call(e, "callee") &&
          !propertyIsEnumerable.call(e, "callee")
        );
      },
  isArguments_1 = isArguments,
  isArray$4 = Array.isArray,
  isArray_1 = isArray$4;
function stubFalse() {
  return !1;
}
var stubFalse_1 = stubFalse,
  isBuffer_1 = createCommonjsModule(function (e, t) {
    var r = t && !t.nodeType && t,
      n = r && e && !e.nodeType && e,
      o = n && n.exports === r ? _root.Buffer : void 0,
      a = (o ? o.isBuffer : void 0) || stubFalse_1;
    e.exports = a;
  }),
  MAX_SAFE_INTEGER = 9007199254740991,
  reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(e, t) {
  var r = typeof e;
  return (
    !!(t = null == t ? MAX_SAFE_INTEGER : t) &&
    ("number" == r || ("symbol" != r && reIsUint.test(e))) &&
    e > -1 &&
    e % 1 == 0 &&
    e < t
  );
}
var _isIndex = isIndex,
  MAX_SAFE_INTEGER$1 = 9007199254740991;
function isLength(e) {
  return (
    "number" == typeof e && e > -1 && e % 1 == 0 && e <= MAX_SAFE_INTEGER$1
  );
}
var isLength_1 = isLength,
  argsTag$1 = "[object Arguments]",
  arrayTag = "[object Array]",
  boolTag = "[object Boolean]",
  dateTag = "[object Date]",
  errorTag = "[object Error]",
  funcTag$1 = "[object Function]",
  mapTag = "[object Map]",
  numberTag = "[object Number]",
  objectTag = "[object Object]",
  regexpTag = "[object RegExp]",
  setTag = "[object Set]",
  stringTag = "[object String]",
  weakMapTag = "[object WeakMap]",
  arrayBufferTag = "[object ArrayBuffer]",
  dataViewTag = "[object DataView]",
  float32Tag = "[object Float32Array]",
  float64Tag = "[object Float64Array]",
  int8Tag = "[object Int8Array]",
  int16Tag = "[object Int16Array]",
  int32Tag = "[object Int32Array]",
  uint8Tag = "[object Uint8Array]",
  uint8ClampedTag = "[object Uint8ClampedArray]",
  uint16Tag = "[object Uint16Array]",
  uint32Tag = "[object Uint32Array]",
  typedArrayTags = {};
function baseIsTypedArray(e) {
  return (
    isObjectLike_1(e) &&
    isLength_1(e.length) &&
    !!typedArrayTags[_baseGetTag(e)]
  );
}
(typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[
  int8Tag
] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[
  uint8Tag
] = typedArrayTags[uint8ClampedTag] = typedArrayTags[
  uint16Tag
] = typedArrayTags[uint32Tag] = !0),
  (typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[
    arrayBufferTag
  ] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[
    dateTag
  ] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[
    mapTag
  ] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[
    regexpTag
  ] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[
    weakMapTag
  ] = !1);
var _baseIsTypedArray = baseIsTypedArray;
function baseUnary(e) {
  return function (t) {
    return e(t);
  };
}
var _baseUnary = baseUnary,
  _nodeUtil = createCommonjsModule(function (e, t) {
    var r = t && !t.nodeType && t,
      n = r && e && !e.nodeType && e,
      o = n && n.exports === r && _freeGlobal.process,
      a = (function () {
        try {
          return (
            (n && n.require && n.require("util").types) ||
            (o && o.binding && o.binding("util"))
          );
        } catch (e) {}
      })();
    e.exports = a;
  }),
  nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray,
  isTypedArray = nodeIsTypedArray
    ? _baseUnary(nodeIsTypedArray)
    : _baseIsTypedArray,
  isTypedArray_1 = isTypedArray,
  objectProto$7 = Object.prototype,
  hasOwnProperty$7 = objectProto$7.hasOwnProperty;
function arrayLikeKeys(e, t) {
  var r = isArray_1(e),
    n = !r && isArguments_1(e),
    o = !r && !n && isBuffer_1(e),
    a = !r && !n && !o && isTypedArray_1(e),
    i = r || n || o || a,
    s = i ? _baseTimes(e.length, String) : [],
    u = s.length;
  for (var c in e)
    (!t && !hasOwnProperty$7.call(e, c)) ||
      (i &&
        ("length" == c ||
          (o && ("offset" == c || "parent" == c)) ||
          (a && ("buffer" == c || "byteLength" == c || "byteOffset" == c)) ||
          _isIndex(c, u))) ||
      s.push(c);
  return s;
}
var _arrayLikeKeys = arrayLikeKeys,
  objectProto$8 = Object.prototype;
function isPrototype(e) {
  var t = e && e.constructor;
  return e === (("function" == typeof t && t.prototype) || objectProto$8);
}
var _isPrototype = isPrototype;
function overArg(e, t) {
  return function (r) {
    return e(t(r));
  };
}
var _overArg = overArg,
  nativeKeys = _overArg(Object.keys, Object),
  _nativeKeys = nativeKeys,
  objectProto$9 = Object.prototype,
  hasOwnProperty$8 = objectProto$9.hasOwnProperty;
function baseKeys(e) {
  if (!_isPrototype(e)) return _nativeKeys(e);
  var t = [];
  for (var r in Object(e))
    hasOwnProperty$8.call(e, r) && "constructor" != r && t.push(r);
  return t;
}
var _baseKeys = baseKeys;
function isArrayLike(e) {
  return null != e && isLength_1(e.length) && !isFunction_1(e);
}
var isArrayLike_1 = isArrayLike;
function keys(e) {
  return isArrayLike_1(e) ? _arrayLikeKeys(e) : _baseKeys(e);
}
var keys_1 = keys;
function baseAssign(e, t) {
  return e && _copyObject(t, keys_1(t), e);
}
var _baseAssign = baseAssign;
function nativeKeysIn(e) {
  var t = [];
  if (null != e) for (var r in Object(e)) t.push(r);
  return t;
}
var _nativeKeysIn = nativeKeysIn,
  objectProto$a = Object.prototype,
  hasOwnProperty$9 = objectProto$a.hasOwnProperty;
function baseKeysIn(e) {
  if (!isObject_1(e)) return _nativeKeysIn(e);
  var t = _isPrototype(e),
    r = [];
  for (var n in e)
    ("constructor" != n || (!t && hasOwnProperty$9.call(e, n))) && r.push(n);
  return r;
}
var _baseKeysIn = baseKeysIn;
function keysIn$1(e) {
  return isArrayLike_1(e) ? _arrayLikeKeys(e, !0) : _baseKeysIn(e);
}
var keysIn_1 = keysIn$1;
function baseAssignIn(e, t) {
  return e && _copyObject(t, keysIn_1(t), e);
}
var _baseAssignIn = baseAssignIn,
  _cloneBuffer = createCommonjsModule(function (e, t) {
    var r = t && !t.nodeType && t,
      n = r && e && !e.nodeType && e,
      o = n && n.exports === r ? _root.Buffer : void 0,
      a = o ? o.allocUnsafe : void 0;
    e.exports = function (e, t) {
      if (t) return e.slice();
      var r = e.length,
        n = a ? a(r) : new e.constructor(r);
      return e.copy(n), n;
    };
  });
function copyArray(e, t) {
  var r = -1,
    n = e.length;
  for (t || (t = Array(n)); ++r < n; ) t[r] = e[r];
  return t;
}
var _copyArray = copyArray;
function arrayFilter(e, t) {
  for (var r = -1, n = null == e ? 0 : e.length, o = 0, a = []; ++r < n; ) {
    var i = e[r];
    t(i, r, e) && (a[o++] = i);
  }
  return a;
}
var _arrayFilter = arrayFilter;
function stubArray() {
  return [];
}
var stubArray_1 = stubArray,
  objectProto$b = Object.prototype,
  propertyIsEnumerable$1 = objectProto$b.propertyIsEnumerable,
  nativeGetSymbols = Object.getOwnPropertySymbols,
  getSymbols = nativeGetSymbols
    ? function (e) {
        return null == e
          ? []
          : ((e = Object(e)),
            _arrayFilter(nativeGetSymbols(e), function (t) {
              return propertyIsEnumerable$1.call(e, t);
            }));
      }
    : stubArray_1,
  _getSymbols = getSymbols;
function copySymbols(e, t) {
  return _copyObject(e, _getSymbols(e), t);
}
var _copySymbols = copySymbols;
function arrayPush(e, t) {
  for (var r = -1, n = t.length, o = e.length; ++r < n; ) e[o + r] = t[r];
  return e;
}
var _arrayPush = arrayPush,
  getPrototype = _overArg(Object.getPrototypeOf, Object),
  _getPrototype = getPrototype,
  nativeGetSymbols$1 = Object.getOwnPropertySymbols,
  getSymbolsIn = nativeGetSymbols$1
    ? function (e) {
        for (var t = []; e; )
          _arrayPush(t, _getSymbols(e)), (e = _getPrototype(e));
        return t;
      }
    : stubArray_1,
  _getSymbolsIn = getSymbolsIn;
function copySymbolsIn(e, t) {
  return _copyObject(e, _getSymbolsIn(e), t);
}
var _copySymbolsIn = copySymbolsIn;
function baseGetAllKeys(e, t, r) {
  var n = t(e);
  return isArray_1(e) ? n : _arrayPush(n, r(e));
}
var _baseGetAllKeys = baseGetAllKeys;
function getAllKeys(e) {
  return _baseGetAllKeys(e, keys_1, _getSymbols);
}
var _getAllKeys = getAllKeys;
function getAllKeysIn(e) {
  return _baseGetAllKeys(e, keysIn_1, _getSymbolsIn);
}
var _getAllKeysIn = getAllKeysIn,
  DataView$1 = _getNative(_root, "DataView"),
  _DataView = DataView$1,
  Promise$1 = _getNative(_root, "Promise"),
  _Promise = Promise$1,
  Set$1 = _getNative(_root, "Set"),
  _Set = Set$1,
  WeakMap = _getNative(_root, "WeakMap"),
  _WeakMap = WeakMap,
  mapTag$1 = "[object Map]",
  objectTag$1 = "[object Object]",
  promiseTag = "[object Promise]",
  setTag$1 = "[object Set]",
  weakMapTag$1 = "[object WeakMap]",
  dataViewTag$1 = "[object DataView]",
  dataViewCtorString = _toSource(_DataView),
  mapCtorString = _toSource(_Map),
  promiseCtorString = _toSource(_Promise),
  setCtorString = _toSource(_Set),
  weakMapCtorString = _toSource(_WeakMap),
  getTag = _baseGetTag;
((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
  (_Map && getTag(new _Map()) != mapTag$1) ||
  (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
  (_Set && getTag(new _Set()) != setTag$1) ||
  (_WeakMap && getTag(new _WeakMap()) != weakMapTag$1)) &&
  (getTag = function (e) {
    var t = _baseGetTag(e),
      r = t == objectTag$1 ? e.constructor : void 0,
      n = r ? _toSource(r) : "";
    if (n)
      switch (n) {
        case dataViewCtorString:
          return dataViewTag$1;
        case mapCtorString:
          return mapTag$1;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$1;
        case weakMapCtorString:
          return weakMapTag$1;
      }
    return t;
  });
var _getTag = getTag,
  objectProto$c = Object.prototype,
  hasOwnProperty$a = objectProto$c.hasOwnProperty;
function initCloneArray(e) {
  var t = e.length,
    r = new e.constructor(t);
  return (
    t &&
      "string" == typeof e[0] &&
      hasOwnProperty$a.call(e, "index") &&
      ((r.index = e.index), (r.input = e.input)),
    r
  );
}
var _initCloneArray = initCloneArray,
  Uint8Array$1 = _root.Uint8Array,
  _Uint8Array = Uint8Array$1;
function cloneArrayBuffer(e) {
  var t = new e.constructor(e.byteLength);
  return new _Uint8Array(t).set(new _Uint8Array(e)), t;
}
var _cloneArrayBuffer = cloneArrayBuffer;
function cloneDataView(e, t) {
  var r = t ? _cloneArrayBuffer(e.buffer) : e.buffer;
  return new e.constructor(r, e.byteOffset, e.byteLength);
}
var _cloneDataView = cloneDataView,
  reFlags = /\w*$/;
function cloneRegExp(e) {
  var t = new e.constructor(e.source, reFlags.exec(e));
  return (t.lastIndex = e.lastIndex), t;
}
var _cloneRegExp = cloneRegExp,
  symbolProto = _Symbol ? _Symbol.prototype : void 0,
  symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function cloneSymbol(e) {
  return symbolValueOf ? Object(symbolValueOf.call(e)) : {};
}
var _cloneSymbol = cloneSymbol;
function cloneTypedArray(e, t) {
  var r = t ? _cloneArrayBuffer(e.buffer) : e.buffer;
  return new e.constructor(r, e.byteOffset, e.length);
}
var _cloneTypedArray = cloneTypedArray,
  boolTag$1 = "[object Boolean]",
  dateTag$1 = "[object Date]",
  mapTag$2 = "[object Map]",
  numberTag$1 = "[object Number]",
  regexpTag$1 = "[object RegExp]",
  setTag$2 = "[object Set]",
  stringTag$1 = "[object String]",
  symbolTag = "[object Symbol]",
  arrayBufferTag$1 = "[object ArrayBuffer]",
  dataViewTag$2 = "[object DataView]",
  float32Tag$1 = "[object Float32Array]",
  float64Tag$1 = "[object Float64Array]",
  int8Tag$1 = "[object Int8Array]",
  int16Tag$1 = "[object Int16Array]",
  int32Tag$1 = "[object Int32Array]",
  uint8Tag$1 = "[object Uint8Array]",
  uint8ClampedTag$1 = "[object Uint8ClampedArray]",
  uint16Tag$1 = "[object Uint16Array]",
  uint32Tag$1 = "[object Uint32Array]";
function initCloneByTag(e, t, r) {
  var n = e.constructor;
  switch (t) {
    case arrayBufferTag$1:
      return _cloneArrayBuffer(e);
    case boolTag$1:
    case dateTag$1:
      return new n(+e);
    case dataViewTag$2:
      return _cloneDataView(e, r);
    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return _cloneTypedArray(e, r);
    case mapTag$2:
      return new n();
    case numberTag$1:
    case stringTag$1:
      return new n(e);
    case regexpTag$1:
      return _cloneRegExp(e);
    case setTag$2:
      return new n();
    case symbolTag:
      return _cloneSymbol(e);
  }
}
var _initCloneByTag = initCloneByTag,
  objectCreate = Object.create,
  baseCreate = (function () {
    function e() {}
    return function (t) {
      if (!isObject_1(t)) return {};
      if (objectCreate) return objectCreate(t);
      e.prototype = t;
      var r = new e();
      return (e.prototype = void 0), r;
    };
  })(),
  _baseCreate = baseCreate;
function initCloneObject(e) {
  return "function" != typeof e.constructor || _isPrototype(e)
    ? {}
    : _baseCreate(_getPrototype(e));
}
var _initCloneObject = initCloneObject,
  mapTag$3 = "[object Map]";
function baseIsMap(e) {
  return isObjectLike_1(e) && _getTag(e) == mapTag$3;
}
var _baseIsMap = baseIsMap,
  nodeIsMap = _nodeUtil && _nodeUtil.isMap,
  isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap,
  isMap_1 = isMap,
  setTag$3 = "[object Set]";
function baseIsSet(e) {
  return isObjectLike_1(e) && _getTag(e) == setTag$3;
}
var _baseIsSet = baseIsSet,
  nodeIsSet = _nodeUtil && _nodeUtil.isSet,
  isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet,
  isSet_1 = isSet,
  CLONE_DEEP_FLAG = 1,
  CLONE_FLAT_FLAG = 2,
  CLONE_SYMBOLS_FLAG = 4,
  argsTag$2 = "[object Arguments]",
  arrayTag$1 = "[object Array]",
  boolTag$2 = "[object Boolean]",
  dateTag$2 = "[object Date]",
  errorTag$1 = "[object Error]",
  funcTag$2 = "[object Function]",
  genTag$1 = "[object GeneratorFunction]",
  mapTag$4 = "[object Map]",
  numberTag$2 = "[object Number]",
  objectTag$2 = "[object Object]",
  regexpTag$2 = "[object RegExp]",
  setTag$4 = "[object Set]",
  stringTag$2 = "[object String]",
  symbolTag$1 = "[object Symbol]",
  weakMapTag$2 = "[object WeakMap]",
  arrayBufferTag$2 = "[object ArrayBuffer]",
  dataViewTag$3 = "[object DataView]",
  float32Tag$2 = "[object Float32Array]",
  float64Tag$2 = "[object Float64Array]",
  int8Tag$2 = "[object Int8Array]",
  int16Tag$2 = "[object Int16Array]",
  int32Tag$2 = "[object Int32Array]",
  uint8Tag$2 = "[object Uint8Array]",
  uint8ClampedTag$2 = "[object Uint8ClampedArray]",
  uint16Tag$2 = "[object Uint16Array]",
  uint32Tag$2 = "[object Uint32Array]",
  cloneableTags = {};
function baseClone(e, t, r, n, o, a) {
  var i,
    s = t & CLONE_DEEP_FLAG,
    u = t & CLONE_FLAT_FLAG,
    c = t & CLONE_SYMBOLS_FLAG;
  if ((r && (i = o ? r(e, n, o, a) : r(e)), void 0 !== i)) return i;
  if (!isObject_1(e)) return e;
  var l = isArray_1(e);
  if (l) {
    if (((i = _initCloneArray(e)), !s)) return _copyArray(e, i);
  } else {
    var f = _getTag(e),
      p = f == funcTag$2 || f == genTag$1;
    if (isBuffer_1(e)) return _cloneBuffer(e, s);
    if (f == objectTag$2 || f == argsTag$2 || (p && !o)) {
      if (((i = u || p ? {} : _initCloneObject(e)), !s))
        return u
          ? _copySymbolsIn(e, _baseAssignIn(i, e))
          : _copySymbols(e, _baseAssign(i, e));
    } else {
      if (!cloneableTags[f]) return o ? e : {};
      i = _initCloneByTag(e, f, s);
    }
  }
  a || (a = new _Stack());
  var d = a.get(e);
  if (d) return d;
  a.set(e, i),
    isSet_1(e)
      ? e.forEach(function (n) {
          i.add(baseClone(n, t, r, n, e, a));
        })
      : isMap_1(e) &&
        e.forEach(function (n, o) {
          i.set(o, baseClone(n, t, r, o, e, a));
        });
  var h = c ? (u ? _getAllKeysIn : _getAllKeys) : u ? keysIn : keys_1,
    g = l ? void 0 : h(e);
  return (
    _arrayEach(g || e, function (n, o) {
      g && (n = e[(o = n)]), _assignValue(i, o, baseClone(n, t, r, o, e, a));
    }),
    i
  );
}
(cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] = cloneableTags[
  arrayBufferTag$2
] = cloneableTags[dataViewTag$3] = cloneableTags[boolTag$2] = cloneableTags[
  dateTag$2
] = cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] = cloneableTags[
  int8Tag$2
] = cloneableTags[int16Tag$2] = cloneableTags[int32Tag$2] = cloneableTags[
  mapTag$4
] = cloneableTags[numberTag$2] = cloneableTags[objectTag$2] = cloneableTags[
  regexpTag$2
] = cloneableTags[setTag$4] = cloneableTags[stringTag$2] = cloneableTags[
  symbolTag$1
] = cloneableTags[uint8Tag$2] = cloneableTags[
  uint8ClampedTag$2
] = cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = !0),
  (cloneableTags[errorTag$1] = cloneableTags[funcTag$2] = cloneableTags[
    weakMapTag$2
  ] = !1);
var _baseClone = baseClone,
  CLONE_DEEP_FLAG$1 = 1,
  CLONE_SYMBOLS_FLAG$1 = 4;
function cloneDeep(e) {
  return _baseClone(e, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
}
var cloneDeep_1 = cloneDeep;
function mitt(e) {
  return {
    all: (e = e || new Map()),
    on: function (t, r) {
      var n = e.get(t);
      (n && n.push(r)) || e.set(t, [r]);
    },
    off: function (t, r) {
      var n = e.get(t);
      n && n.splice(n.indexOf(r) >>> 0, 1);
    },
    emit: function (t, r) {
      (e.get(t) || []).slice().map(function (e) {
        e(r);
      }),
        (e.get("*") || []).slice().map(function (e) {
          e(t, r);
        });
    },
  };
}
function ascending(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function bisector(e) {
  return (
    1 === e.length && (e = ascendingComparator(e)),
    {
      left: function (t, r, n, o) {
        for (null == n && (n = 0), null == o && (o = t.length); n < o; ) {
          var a = (n + o) >>> 1;
          e(t[a], r) < 0 ? (n = a + 1) : (o = a);
        }
        return n;
      },
      right: function (t, r, n, o) {
        for (null == n && (n = 0), null == o && (o = t.length); n < o; ) {
          var a = (n + o) >>> 1;
          e(t[a], r) > 0 ? (o = a) : (n = a + 1);
        }
        return n;
      },
    }
  );
}
function ascendingComparator(e) {
  return function (t, r) {
    return ascending(e(t), r);
  };
}
var ascendingBisect = bisector(ascending),
  bisectRight = ascendingBisect.right,
  e10 = Math.sqrt(50),
  e5 = Math.sqrt(10),
  e2 = Math.sqrt(2);
function ticks(e, t, r) {
  var n,
    o,
    a,
    i,
    s = -1;
  if (((r = +r), (e = +e) == (t = +t) && r > 0)) return [e];
  if (
    ((n = t < e) && ((o = e), (e = t), (t = o)),
    0 === (i = tickIncrement(e, t, r)) || !isFinite(i))
  )
    return [];
  if (i > 0)
    for (
      e = Math.ceil(e / i),
        t = Math.floor(t / i),
        a = new Array((o = Math.ceil(t - e + 1)));
      ++s < o;

    )
      a[s] = (e + s) * i;
  else
    for (
      i = -i,
        e = Math.floor(e * i),
        t = Math.ceil(t * i),
        a = new Array((o = Math.ceil(t - e + 1)));
      ++s < o;

    )
      a[s] = (e + s) / i;
  return n && a.reverse(), a;
}
function tickIncrement(e, t, r) {
  var n = (t - e) / Math.max(0, r),
    o = Math.floor(Math.log(n) / Math.LN10),
    a = n / Math.pow(10, o);
  return o >= 0
    ? (a >= e10 ? 10 : a >= e5 ? 5 : a >= e2 ? 2 : 1) * Math.pow(10, o)
    : -Math.pow(10, -o) / (a >= e10 ? 10 : a >= e5 ? 5 : a >= e2 ? 2 : 1);
}
function tickStep(e, t, r) {
  var n = Math.abs(t - e) / Math.max(0, r),
    o = Math.pow(10, Math.floor(Math.log(n) / Math.LN10)),
    a = n / o;
  return (
    a >= e10 ? (o *= 10) : a >= e5 ? (o *= 5) : a >= e2 && (o *= 2),
    t < e ? -o : o
  );
}
function initRange(e, t) {
  switch (arguments.length) {
    case 0:
      break;
    case 1:
      this.range(e);
      break;
    default:
      this.range(t).domain(e);
  }
  return this;
}
function define(e, t, r) {
  (e.prototype = t.prototype = r), (r.constructor = e);
}
function extend(e, t) {
  var r = Object.create(e.prototype);
  for (var n in t) r[n] = t[n];
  return r;
}
function Color() {}
var darker = 0.7,
  brighter = 1 / darker,
  reI = "\\s*([+-]?\\d+)\\s*",
  reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
  reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
  reHex = /^#([0-9a-f]{3,8})$/,
  reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
  reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
  reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
  reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
  reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
  reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$"),
  named = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    N: 6908265,
    F: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  };
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(e) {
  var t, r;
  return (
    (e = (e + "").trim().toLowerCase()),
    (t = reHex.exec(e))
      ? ((r = t[1].length),
        (t = parseInt(t[1], 16)),
        6 === r
          ? rgbn(t)
          : 3 === r
          ? new Rgb(
              ((t >> 8) & 15) | ((t >> 4) & 240),
              ((t >> 4) & 15) | (240 & t),
              ((15 & t) << 4) | (15 & t),
              1
            )
          : 8 === r
          ? rgba(
              (t >> 24) & 255,
              (t >> 16) & 255,
              (t >> 8) & 255,
              (255 & t) / 255
            )
          : 4 === r
          ? rgba(
              ((t >> 12) & 15) | ((t >> 8) & 240),
              ((t >> 8) & 15) | ((t >> 4) & 240),
              ((t >> 4) & 15) | (240 & t),
              (((15 & t) << 4) | (15 & t)) / 255
            )
          : null)
      : (t = reRgbInteger.exec(e))
      ? new Rgb(t[1], t[2], t[3], 1)
      : (t = reRgbPercent.exec(e))
      ? new Rgb((255 * t[1]) / 100, (255 * t[2]) / 100, (255 * t[3]) / 100, 1)
      : (t = reRgbaInteger.exec(e))
      ? rgba(t[1], t[2], t[3], t[4])
      : (t = reRgbaPercent.exec(e))
      ? rgba((255 * t[1]) / 100, (255 * t[2]) / 100, (255 * t[3]) / 100, t[4])
      : (t = reHslPercent.exec(e))
      ? hsla(t[1], t[2] / 100, t[3] / 100, 1)
      : (t = reHslaPercent.exec(e))
      ? hsla(t[1], t[2] / 100, t[3] / 100, t[4])
      : named.hasOwnProperty(e)
      ? rgbn(named[e])
      : "transparent" === e
      ? new Rgb(NaN, NaN, NaN, 0)
      : null
  );
}
function rgbn(e) {
  return new Rgb((e >> 16) & 255, (e >> 8) & 255, 255 & e, 1);
}
function rgba(e, t, r, n) {
  return n <= 0 && (e = t = r = NaN), new Rgb(e, t, r, n);
}
function rgbConvert(e) {
  return (
    e instanceof Color || (e = color(e)),
    e ? new Rgb((e = e.rgb()).r, e.g, e.b, e.opacity) : new Rgb()
  );
}
function rgb(e, t, r, n) {
  return 1 === arguments.length
    ? rgbConvert(e)
    : new Rgb(e, t, r, null == n ? 1 : n);
}
function Rgb(e, t, r, n) {
  (this.r = +e), (this.g = +t), (this.b = +r), (this.opacity = +n);
}
function rgb_formatHex() {
  return "#" + hex(this.r) + hex(this.g) + hex(this.b);
}
function rgb_formatRgb() {
  var e = this.opacity;
  return (
    (1 === (e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e)))
      ? "rgb("
      : "rgba(") +
    Math.max(0, Math.min(255, Math.round(this.r) || 0)) +
    ", " +
    Math.max(0, Math.min(255, Math.round(this.g) || 0)) +
    ", " +
    Math.max(0, Math.min(255, Math.round(this.b) || 0)) +
    (1 === e ? ")" : ", " + e + ")")
  );
}
function hex(e) {
  return (
    ((e = Math.max(0, Math.min(255, Math.round(e) || 0))) < 16 ? "0" : "") +
    e.toString(16)
  );
}
function hsla(e, t, r, n) {
  return (
    n <= 0
      ? (e = t = r = NaN)
      : r <= 0 || r >= 1
      ? (e = t = NaN)
      : t <= 0 && (e = NaN),
    new Hsl(e, t, r, n)
  );
}
function hslConvert(e) {
  if (e instanceof Hsl) return new Hsl(e.h, e.s, e.l, e.opacity);
  if ((e instanceof Color || (e = color(e)), !e)) return new Hsl();
  if (e instanceof Hsl) return e;
  var t = (e = e.rgb()).r / 255,
    r = e.g / 255,
    n = e.b / 255,
    o = Math.min(t, r, n),
    a = Math.max(t, r, n),
    i = NaN,
    s = a - o,
    u = (a + o) / 2;
  return (
    s
      ? ((i =
          t === a
            ? (r - n) / s + 6 * (r < n)
            : r === a
            ? (n - t) / s + 2
            : (t - r) / s + 4),
        (s /= u < 0.5 ? a + o : 2 - a - o),
        (i *= 60))
      : (s = u > 0 && u < 1 ? 0 : i),
    new Hsl(i, s, u, e.opacity)
  );
}
function hsl(e, t, r, n) {
  return 1 === arguments.length
    ? hslConvert(e)
    : new Hsl(e, t, r, null == n ? 1 : n);
}
function Hsl(e, t, r, n) {
  (this.h = +e), (this.s = +t), (this.l = +r), (this.opacity = +n);
}
function hsl2rgb(e, t, r) {
  return (
    255 *
    (e < 60
      ? t + ((r - t) * e) / 60
      : e < 180
      ? r
      : e < 240
      ? t + ((r - t) * (240 - e)) / 60
      : t)
  );
}
function constant(e) {
  return function () {
    return e;
  };
}
function linear(e, t) {
  return function (r) {
    return e + r * t;
  };
}
function exponential(e, t, r) {
  return (
    (e = Math.pow(e, r)),
    (t = Math.pow(t, r) - e),
    (r = 1 / r),
    function (n) {
      return Math.pow(e + n * t, r);
    }
  );
}
function gamma(e) {
  return 1 == (e = +e)
    ? nogamma
    : function (t, r) {
        return r - t ? exponential(t, r, e) : constant(isNaN(t) ? r : t);
      };
}
function nogamma(e, t) {
  var r = t - e;
  return r ? linear(e, r) : constant(isNaN(e) ? t : e);
}
define(Color, color, {
  copy: function (e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable: function () {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  formatHex: color_formatHex,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb,
}),
  define(Rgb, rgb, extend(Color, {
    brighter: function (e) {
      return (
        (e = null == e ? brighter : Math.pow(brighter, e)),
        new Rgb(this.r * e, this.g * e, this.b * e, this.opacity)
      );
    },
    darker: function (e) {
      return (
        (e = null == e ? darker : Math.pow(darker, e)),
        new Rgb(this.r * e, this.g * e, this.b * e, this.opacity)
      );
    },
    rgb: function () {
      return this;
    },
    displayable: function () {
      return (
        -0.5 <= this.r &&
        this.r < 255.5 &&
        -0.5 <= this.g &&
        this.g < 255.5 &&
        -0.5 <= this.b &&
        this.b < 255.5 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    hex: rgb_formatHex,
    formatHex: rgb_formatHex,
    formatRgb: rgb_formatRgb,
    toString: rgb_formatRgb,
  })),
  define(Hsl, hsl, extend(Color, {
    brighter: function (e) {
      return (
        (e = null == e ? brighter : Math.pow(brighter, e)),
        new Hsl(this.h, this.s, this.l * e, this.opacity)
      );
    },
    darker: function (e) {
      return (
        (e = null == e ? darker : Math.pow(darker, e)),
        new Hsl(this.h, this.s, this.l * e, this.opacity)
      );
    },
    rgb: function () {
      var e = (this.h % 360) + 360 * (this.h < 0),
        t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
        r = this.l,
        n = r + (r < 0.5 ? r : 1 - r) * t,
        o = 2 * r - n;
      return new Rgb(
        hsl2rgb(e >= 240 ? e - 240 : e + 120, o, n),
        hsl2rgb(e, o, n),
        hsl2rgb(e < 120 ? e + 240 : e - 120, o, n),
        this.opacity
      );
    },
    displayable: function () {
      return (
        ((0 <= this.s && this.s <= 1) || isNaN(this.s)) &&
        0 <= this.l &&
        this.l <= 1 &&
        0 <= this.opacity &&
        this.opacity <= 1
      );
    },
    formatHsl: function () {
      var e = this.opacity;
      return (
        (1 === (e = isNaN(e) ? 1 : Math.max(0, Math.min(1, e)))
          ? "hsl("
          : "hsla(") +
        (this.h || 0) +
        ", " +
        100 * (this.s || 0) +
        "%, " +
        100 * (this.l || 0) +
        "%" +
        (1 === e ? ")" : ", " + e + ")")
      );
    },
  }));
var rgb$1 = (function e(t) {
  var r = gamma(t);
  function n(e, t) {
    var n = r((e = rgb(e)).r, (t = rgb(t)).r),
      o = r(e.g, t.g),
      a = r(e.b, t.b),
      i = nogamma(e.opacity, t.opacity);
    return function (t) {
      return (
        (e.r = n(t)), (e.g = o(t)), (e.b = a(t)), (e.opacity = i(t)), e + ""
      );
    };
  }
  return (n.gamma = e), n;
})(1);
function numberArray(e, t) {
  t || (t = []);
  var r,
    n = e ? Math.min(t.length, e.length) : 0,
    o = t.slice();
  return function (a) {
    for (r = 0; r < n; ++r) o[r] = e[r] * (1 - a) + t[r] * a;
    return o;
  };
}
function isNumberArray(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function genericArray(e, t) {
  var r,
    n = t ? t.length : 0,
    o = e ? Math.min(n, e.length) : 0,
    a = new Array(o),
    i = new Array(n);
  for (r = 0; r < o; ++r) a[r] = interpolate(e[r], t[r]);
  for (; r < n; ++r) i[r] = t[r];
  return function (e) {
    for (r = 0; r < o; ++r) i[r] = a[r](e);
    return i;
  };
}
function date(e, t) {
  var r = new Date();
  return (
    (e = +e),
    (t = +t),
    function (n) {
      return r.setTime(e * (1 - n) + t * n), r;
    }
  );
}
function interpolateNumber(e, t) {
  return (
    (e = +e),
    (t = +t),
    function (r) {
      return e * (1 - r) + t * r;
    }
  );
}
function object(e, t) {
  var r,
    n = {},
    o = {};
  for (r in ((null !== e && "object" == typeof e) || (e = {}),
  (null !== t && "object" == typeof t) || (t = {}),
  t))
    r in e ? (n[r] = interpolate(e[r], t[r])) : (o[r] = t[r]);
  return function (e) {
    for (r in n) o[r] = n[r](e);
    return o;
  };
}
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
  reB = new RegExp(reA.source, "g");
function zero$1(e) {
  return function () {
    return e;
  };
}
function one(e) {
  return function (t) {
    return e(t) + "";
  };
}
function string(e, t) {
  var r,
    n,
    o,
    a = (reA.lastIndex = reB.lastIndex = 0),
    i = -1,
    s = [],
    u = [];
  for (e += "", t += ""; (r = reA.exec(e)) && (n = reB.exec(t)); )
    (o = n.index) > a &&
      ((o = t.slice(a, o)), s[i] ? (s[i] += o) : (s[++i] = o)),
      (r = r[0]) === (n = n[0])
        ? s[i]
          ? (s[i] += n)
          : (s[++i] = n)
        : ((s[++i] = null),
          u.push({
            i,
            x: interpolateNumber(r, n),
          })),
      (a = reB.lastIndex);
  return (
    a < t.length && ((o = t.slice(a)), s[i] ? (s[i] += o) : (s[++i] = o)),
    s.length < 2
      ? u[0]
        ? one(u[0].x)
        : zero$1(t)
      : ((t = u.length),
        function (e) {
          for (var r, n = 0; n < t; ++n) s[(r = u[n]).i] = r.x(e);
          return s.join("");
        })
  );
}
function interpolate(e, t) {
  var r,
    n = typeof t;
  return null == t || "boolean" === n
    ? constant(t)
    : ("number" === n
        ? interpolateNumber
        : "string" === n
        ? (r = color(t))
          ? ((t = r), rgb$1)
          : string
        : t instanceof color
        ? rgb$1
        : t instanceof Date
        ? date
        : isNumberArray(t)
        ? numberArray
        : Array.isArray(t)
        ? genericArray
        : ("function" != typeof t.valueOf && "function" != typeof t.toString) ||
          isNaN(t)
        ? object
        : interpolateNumber)(e, t);
}
function interpolateRound(e, t) {
  return (
    (e = +e),
    (t = +t),
    function (r) {
      return Math.round(e * (1 - r) + t * r);
    }
  );
}
function constant$1(e) {
  return function () {
    return e;
  };
}
function number(e) {
  return +e;
}
var unit = [0, 1];
function identity$2(e) {
  return e;
}
function normalize(e, t) {
  return (t -= e = +e)
    ? function (r) {
        return (r - e) / t;
      }
    : constant$1(isNaN(t) ? NaN : 0.5);
}
function clamper(e, t) {
  var r;
  return (
    e > t && ((r = e), (e = t), (t = r)),
    function (r) {
      return Math.max(e, Math.min(t, r));
    }
  );
}
function bimap(e, t, r) {
  var n = e[0],
    o = e[1],
    a = t[0],
    i = t[1];
  return (
    o < n
      ? ((n = normalize(o, n)), (a = r(i, a)))
      : ((n = normalize(n, o)), (a = r(a, i))),
    function (e) {
      return a(n(e));
    }
  );
}
function polymap(e, t, r) {
  var n = Math.min(e.length, t.length) - 1,
    o = new Array(n),
    a = new Array(n),
    i = -1;
  for (
    e[n] < e[0] && ((e = e.slice().reverse()), (t = t.slice().reverse()));
    ++i < n;

  )
    (o[i] = normalize(e[i], e[i + 1])), (a[i] = r(t[i], t[i + 1]));
  return function (t) {
    var r = bisectRight(e, t, 1, n) - 1;
    return a[r](o[r](t));
  };
}
function copy(e, t) {
  return t
    .domain(e.domain())
    .range(e.range())
    .interpolate(e.interpolate())
    .clamp(e.clamp())
    .unknown(e.unknown());
}
function transformer() {
  var e,
    t,
    r,
    n,
    o,
    a,
    i = unit,
    s = unit,
    u = interpolate,
    c = identity$2;
  function l() {
    var e = Math.min(i.length, s.length);
    return (
      c !== identity$2 && (c = clamper(i[0], i[e - 1])),
      (n = e > 2 ? polymap : bimap),
      (o = a = null),
      f
    );
  }
  function f(t) {
    return isNaN((t = +t)) ? r : (o || (o = n(i.map(e), s, u)))(e(c(t)));
  }
  return (
    (f.invert = function (r) {
      return c(t((a || (a = n(s, i.map(e), interpolateNumber)))(r)));
    }),
    (f.domain = function (e) {
      return arguments.length ? ((i = Array.from(e, number)), l()) : i.slice();
    }),
    (f.range = function (e) {
      return arguments.length ? ((s = Array.from(e)), l()) : s.slice();
    }),
    (f.rangeRound = function (e) {
      return (s = Array.from(e)), (u = interpolateRound), l();
    }),
    (f.clamp = function (e) {
      return arguments.length
        ? ((c = !!e || identity$2), l())
        : c !== identity$2;
    }),
    (f.interpolate = function (e) {
      return arguments.length ? ((u = e), l()) : u;
    }),
    (f.unknown = function (e) {
      return arguments.length ? ((r = e), f) : r;
    }),
    function (r, n) {
      return (e = r), (t = n), l();
    }
  );
}
function continuous() {
  return transformer()(identity$2, identity$2);
}
function formatDecimal(e, t) {
  if (
    (r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e")) < 0
  )
    return null;
  var r,
    n = e.slice(0, r);
  return [n.length > 1 ? n[0] + n.slice(2) : n, +e.slice(r + 1)];
}
function exponent(e) {
  return (e = formatDecimal(Math.abs(e))) ? e[1] : NaN;
}
function formatGroup(e, t) {
  return function (r, n) {
    for (
      var o = r.length, a = [], i = 0, s = e[0], u = 0;
      o > 0 &&
      s > 0 &&
      (u + s + 1 > n && (s = Math.max(1, n - u)),
      a.push(r.substring((o -= s), o + s)),
      !((u += s + 1) > n));

    )
      s = e[(i = (i + 1) % e.length)];
    return a.reverse().join(t);
  };
}
function formatNumerals(e) {
  return function (t) {
    return t.replace(/[0-9]/g, function (t) {
      return e[+t];
    });
  };
}
var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i,
  prefixExponent;
function formatSpecifier(e) {
  if (!(t = re.exec(e))) throw new Error("invalid format: " + e);
  var t;
  return new FormatSpecifier({
    fill: t[1],
    align: t[2],
    sign: t[3],
    symbol: t[4],
    zero: t[5],
    width: t[6],
    comma: t[7],
    precision: t[8] && t[8].slice(1),
    trim: t[9],
    type: t[10],
  });
}
function FormatSpecifier(e) {
  (this.fill = void 0 === e.fill ? " " : e.fill + ""),
    (this.align = void 0 === e.align ? ">" : e.align + ""),
    (this.sign = void 0 === e.sign ? "-" : e.sign + ""),
    (this.symbol = void 0 === e.symbol ? "" : e.symbol + ""),
    (this.zero = !!e.zero),
    (this.width = void 0 === e.width ? void 0 : +e.width),
    (this.comma = !!e.comma),
    (this.precision = void 0 === e.precision ? void 0 : +e.precision),
    (this.trim = !!e.trim),
    (this.type = void 0 === e.type ? "" : e.type + "");
}
function formatTrim(e) {
  e: for (var t, r = e.length, n = 1, o = -1; n < r; ++n)
    switch (e[n]) {
      case ".":
        o = t = n;
        break;
      case "0":
        0 === o && (o = n), (t = n);
        break;
      default:
        if (!+e[n]) break e;
        o > 0 && (o = 0);
    }
  return o > 0 ? e.slice(0, o) + e.slice(t + 1) : e;
}
function formatPrefixAuto(e, t) {
  var r = formatDecimal(e, t);
  if (!r) return e + "";
  var n = r[0],
    o = r[1],
    a =
      o -
      (prefixExponent = 3 * Math.max(-8, Math.min(8, Math.floor(o / 3)))) +
      1,
    i = n.length;
  return a === i
    ? n
    : a > i
    ? n + new Array(a - i + 1).join("0")
    : a > 0
    ? n.slice(0, a) + "." + n.slice(a)
    : "0." +
      new Array(1 - a).join("0") +
      formatDecimal(e, Math.max(0, t + a - 1))[0];
}
function formatRounded(e, t) {
  var r = formatDecimal(e, t);
  if (!r) return e + "";
  var n = r[0],
    o = r[1];
  return o < 0
    ? "0." + new Array(-o).join("0") + n
    : n.length > o + 1
    ? n.slice(0, o + 1) + "." + n.slice(o + 1)
    : n + new Array(o - n.length + 2).join("0");
}
(formatSpecifier.prototype = FormatSpecifier.prototype),
  (FormatSpecifier.prototype.toString = function () {
    return (
      this.fill +
      this.align +
      this.sign +
      this.symbol +
      (this.zero ? "0" : "") +
      (void 0 === this.width ? "" : Math.max(1, 0 | this.width)) +
      (this.comma ? "," : "") +
      (void 0 === this.precision ? "" : "." + Math.max(0, 0 | this.precision)) +
      (this.trim ? "~" : "") +
      this.type
    );
  });
var formatTypes = {
  "%": function (e, t) {
    return (100 * e).toFixed(t);
  },
  b: function (e) {
    return Math.round(e).toString(2);
  },
  c: function (e) {
    return e + "";
  },
  d: function (e) {
    return Math.round(e).toString(10);
  },
  e: function (e, t) {
    return e.toExponential(t);
  },
  f: function (e, t) {
    return e.toFixed(t);
  },
  g: function (e, t) {
    return e.toPrecision(t);
  },
  o: function (e) {
    return Math.round(e).toString(8);
  },
  p: function (e, t) {
    return formatRounded(100 * e, t);
  },
  r: formatRounded,
  s: formatPrefixAuto,
  X: function (e) {
    return Math.round(e).toString(16).toUpperCase();
  },
  x: function (e) {
    return Math.round(e).toString(16);
  },
};
function identity$3(e) {
  return e;
}
var map = Array.prototype.map,
  prefixes = [
    "y",
    "z",
    "a",
    "f",
    "p",
    "n",
    "µ",
    "m",
    "",
    "k",
    "M",
    "G",
    "T",
    "P",
    "E",
    "Z",
    "Y",
  ],
  locale,
  format,
  formatPrefix;
function formatLocale(e) {
  var t =
      void 0 === e.grouping || void 0 === e.thousands
        ? identity$3
        : formatGroup(map.call(e.grouping, Number), e.thousands + ""),
    r = void 0 === e.currency ? "" : e.currency[0] + "",
    n = void 0 === e.currency ? "" : e.currency[1] + "",
    o = void 0 === e.decimal ? "." : e.decimal + "",
    a =
      void 0 === e.numerals
        ? identity$3
        : formatNumerals(map.call(e.numerals, String)),
    i = void 0 === e.percent ? "%" : e.percent + "",
    s = void 0 === e.minus ? "-" : e.minus + "",
    u = void 0 === e.nan ? "NaN" : e.nan + "";
  function c(e) {
    var c = (e = formatSpecifier(e)).fill,
      l = e.align,
      f = e.sign,
      p = e.symbol,
      d = e.zero,
      h = e.width,
      g = e.comma,
      m = e.precision,
      y = e.trim,
      b = e.type;
    "n" === b
      ? ((g = !0), (b = "g"))
      : formatTypes[b] || (void 0 === m && (m = 12), (y = !0), (b = "g")),
      (d || ("0" === c && "=" === l)) && ((d = !0), (c = "0"), (l = "="));
    var v =
        "$" === p
          ? r
          : "#" === p && /[boxX]/.test(b)
          ? "0" + b.toLowerCase()
          : "",
      _ = "$" === p ? n : /[%p]/.test(b) ? i : "",
      w = formatTypes[b],
      T = /[defgprs%]/.test(b);
    function O(e) {
      var r,
        n,
        i,
        p = v,
        O = _;
      if ("c" === b) (O = w(e) + O), (e = "");
      else {
        var A = (e = +e) < 0 || 1 / e < 0;
        if (
          ((e = isNaN(e) ? u : w(Math.abs(e), m)),
          y && (e = formatTrim(e)),
          A && 0 == +e && "+" !== f && (A = !1),
          (p = (A ? ("(" === f ? f : s) : "-" === f || "(" === f ? "" : f) + p),
          (O =
            ("s" === b ? prefixes[8 + prefixExponent / 3] : "") +
            O +
            (A && "(" === f ? ")" : "")),
          T)
        )
          for (r = -1, n = e.length; ++r < n; )
            if (48 > (i = e.charCodeAt(r)) || i > 57) {
              (O = (46 === i ? o + e.slice(r + 1) : e.slice(r)) + O),
                (e = e.slice(0, r));
              break;
            }
      }
      g && !d && (e = t(e, 1 / 0));
      var M = p.length + e.length + O.length,
        S = M < h ? new Array(h - M + 1).join(c) : "";
      switch (
        (g && d && ((e = t(S + e, S.length ? h - O.length : 1 / 0)), (S = "")),
        l)
      ) {
        case "<":
          e = p + e + O + S;
          break;
        case "=":
          e = p + S + e + O;
          break;
        case "^":
          e = S.slice(0, (M = S.length >> 1)) + p + e + O + S.slice(M);
          break;
        default:
          e = S + p + e + O;
      }
      return a(e);
    }
    return (
      (m =
        void 0 === m
          ? 6
          : /[gprs]/.test(b)
          ? Math.max(1, Math.min(21, m))
          : Math.max(0, Math.min(20, m))),
      (O.toString = function () {
        return e + "";
      }),
      O
    );
  }
  return {
    format: c,
    formatPrefix: function (e, t) {
      var r = c((((e = formatSpecifier(e)).type = "f"), e)),
        n = 3 * Math.max(-8, Math.min(8, Math.floor(exponent(t) / 3))),
        o = Math.pow(10, -n),
        a = prefixes[8 + n / 3];
      return function (e) {
        return r(o * e) + a;
      };
    },
  };
}
function defaultLocale(e) {
  return (
    (locale = formatLocale(e)),
    (format = locale.format),
    (formatPrefix = locale.formatPrefix),
    locale
  );
}
function precisionFixed(e) {
  return Math.max(0, -exponent(Math.abs(e)));
}
function precisionPrefix(e, t) {
  return Math.max(
    0,
    3 * Math.max(-8, Math.min(8, Math.floor(exponent(t) / 3))) -
      exponent(Math.abs(e))
  );
}
function precisionRound(e, t) {
  return (
    (e = Math.abs(e)),
    (t = Math.abs(t) - e),
    Math.max(0, exponent(t) - exponent(e)) + 1
  );
}
function tickFormat(e, t, r, n) {
  var o,
    a = tickStep(e, t, r);
  switch ((n = formatSpecifier(null == n ? ",f" : n)).type) {
    case "s":
      var i = Math.max(Math.abs(e), Math.abs(t));
      return (
        null != n.precision ||
          isNaN((o = precisionPrefix(a, i))) ||
          (n.precision = o),
        formatPrefix(n, i)
      );
    case "":
    case "e":
    case "g":
    case "p":
    case "r":
      null != n.precision ||
        isNaN((o = precisionRound(a, Math.max(Math.abs(e), Math.abs(t))))) ||
        (n.precision = o - ("e" === n.type));
      break;
    case "f":
    case "%":
      null != n.precision ||
        isNaN((o = precisionFixed(a))) ||
        (n.precision = o - 2 * ("%" === n.type));
  }
  return format(n);
}
function linearish(e) {
  var t = e.domain;
  return (
    (e.ticks = function (e) {
      var r = t();
      return ticks(r[0], r[r.length - 1], null == e ? 10 : e);
    }),
    (e.tickFormat = function (e, r) {
      var n = t();
      return tickFormat(n[0], n[n.length - 1], null == e ? 10 : e, r);
    }),
    (e.nice = function (r) {
      null == r && (r = 10);
      var n,
        o = t(),
        a = 0,
        i = o.length - 1,
        s = o[a],
        u = o[i];
      return (
        u < s && ((n = s), (s = u), (u = n), (n = a), (a = i), (i = n)),
        (n = tickIncrement(s, u, r)) > 0
          ? (n = tickIncrement(
              (s = Math.floor(s / n) * n),
              (u = Math.ceil(u / n) * n),
              r
            ))
          : n < 0 &&
            (n = tickIncrement(
              (s = Math.ceil(s * n) / n),
              (u = Math.floor(u * n) / n),
              r
            )),
        n > 0
          ? ((o[a] = Math.floor(s / n) * n),
            (o[i] = Math.ceil(u / n) * n),
            t(o))
          : n < 0 &&
            ((o[a] = Math.ceil(s * n) / n),
            (o[i] = Math.floor(u * n) / n),
            t(o)),
        e
      );
    }),
    e
  );
}
function linear$1() {
  var e = continuous();
  return (
    (e.copy = function () {
      return copy(e, linear$1());
    }),
    initRange.apply(e, arguments),
    linearish(e)
  );
}
function nice(e, t) {
  var r,
    n = 0,
    o = (e = e.slice()).length - 1,
    a = e[n],
    i = e[o];
  return (
    i < a && ((r = n), (n = o), (o = r), (r = a), (a = i), (i = r)),
    (e[n] = t.floor(a)),
    (e[o] = t.ceil(i)),
    e
  );
}
defaultLocale({
  decimal: ".",
  thousands: ",",
  grouping: [3],
  currency: ["$", ""],
  minus: "-",
});
var t0 = new Date(),
  t1 = new Date();
function newInterval(e, t, r, n) {
  function o(t) {
    return e((t = 0 === arguments.length ? new Date() : new Date(+t))), t;
  }
  return (
    (o.floor = function (t) {
      return e((t = new Date(+t))), t;
    }),
    (o.ceil = function (r) {
      return e((r = new Date(r - 1))), t(r, 1), e(r), r;
    }),
    (o.round = function (e) {
      var t = o(e),
        r = o.ceil(e);
      return e - t < r - e ? t : r;
    }),
    (o.offset = function (e, r) {
      return t((e = new Date(+e)), null == r ? 1 : Math.floor(r)), e;
    }),
    (o.range = function (r, n, a) {
      var i,
        s = [];
      if (
        ((r = o.ceil(r)),
        (a = null == a ? 1 : Math.floor(a)),
        !(r < n && a > 0))
      )
        return s;
      do {
        s.push((i = new Date(+r))), t(r, a), e(r);
      } while (i < r && r < n);
      return s;
    }),
    (o.filter = function (r) {
      return newInterval(
        function (t) {
          if (t >= t) for (; e(t), !r(t); ) t.setTime(t - 1);
        },
        function (e, n) {
          if (e >= e)
            if (n < 0) for (; ++n <= 0; ) for (; t(e, -1), !r(e); );
            else for (; --n >= 0; ) for (; t(e, 1), !r(e); );
        }
      );
    }),
    r &&
      ((o.count = function (t, n) {
        return (
          t0.setTime(+t), t1.setTime(+n), e(t0), e(t1), Math.floor(r(t0, t1))
        );
      }),
      (o.every = function (e) {
        return (
          (e = Math.floor(e)),
          isFinite(e) && e > 0
            ? e > 1
              ? o.filter(
                  n
                    ? function (t) {
                        return n(t) % e == 0;
                      }
                    : function (t) {
                        return o.count(0, t) % e == 0;
                      }
                )
              : o
            : null
        );
      })),
    o
  );
}
var millisecond = newInterval(
  function () {},
  function (e, t) {
    e.setTime(+e + t);
  },
  function (e, t) {
    return t - e;
  }
);
millisecond.every = function (e) {
  return (
    (e = Math.floor(e)),
    isFinite(e) && e > 0
      ? e > 1
        ? newInterval(
            function (t) {
              t.setTime(Math.floor(t / e) * e);
            },
            function (t, r) {
              t.setTime(+t + r * e);
            },
            function (t, r) {
              return (r - t) / e;
            }
          )
        : millisecond
      : null
  );
};
var durationSecond = 1e3,
  durationMinute = 6e4,
  durationHour = 36e5,
  durationDay = 864e5,
  durationWeek = 6048e5,
  second = newInterval(
    function (e) {
      e.setTime(e - e.getMilliseconds());
    },
    function (e, t) {
      e.setTime(+e + t * durationSecond);
    },
    function (e, t) {
      return (t - e) / durationSecond;
    },
    function (e) {
      return e.getUTCSeconds();
    }
  ),
  minute = newInterval(
    function (e) {
      e.setTime(e - e.getMilliseconds() - e.getSeconds() * durationSecond);
    },
    function (e, t) {
      e.setTime(+e + t * durationMinute);
    },
    function (e, t) {
      return (t - e) / durationMinute;
    },
    function (e) {
      return e.getMinutes();
    }
  ),
  hour = newInterval(
    function (e) {
      e.setTime(
        e -
          e.getMilliseconds() -
          e.getSeconds() * durationSecond -
          e.getMinutes() * durationMinute
      );
    },
    function (e, t) {
      e.setTime(+e + t * durationHour);
    },
    function (e, t) {
      return (t - e) / durationHour;
    },
    function (e) {
      return e.getHours();
    }
  ),
  day = newInterval(
    function (e) {
      e.setHours(0, 0, 0, 0);
    },
    function (e, t) {
      e.setDate(e.getDate() + t);
    },
    function (e, t) {
      return (
        (t -
          e -
          (t.getTimezoneOffset() - e.getTimezoneOffset()) * durationMinute) /
        durationDay
      );
    },
    function (e) {
      return e.getDate() - 1;
    }
  );
function weekday(e) {
  return newInterval(
    function (t) {
      t.setDate(t.getDate() - ((t.getDay() + 7 - e) % 7)),
        t.setHours(0, 0, 0, 0);
    },
    function (e, t) {
      e.setDate(e.getDate() + 7 * t);
    },
    function (e, t) {
      return (
        (t -
          e -
          (t.getTimezoneOffset() - e.getTimezoneOffset()) * durationMinute) /
        durationWeek
      );
    }
  );
}
var sunday = weekday(0),
  monday = weekday(1),
  tuesday = weekday(2),
  wednesday = weekday(3),
  thursday = weekday(4),
  friday = weekday(5),
  saturday = weekday(6),
  month = newInterval(
    function (e) {
      e.setDate(1), e.setHours(0, 0, 0, 0);
    },
    function (e, t) {
      e.setMonth(e.getMonth() + t);
    },
    function (e, t) {
      return (
        t.getMonth() - e.getMonth() + 12 * (t.getFullYear() - e.getFullYear())
      );
    },
    function (e) {
      return e.getMonth();
    }
  ),
  year = newInterval(
    function (e) {
      e.setMonth(0, 1), e.setHours(0, 0, 0, 0);
    },
    function (e, t) {
      e.setFullYear(e.getFullYear() + t);
    },
    function (e, t) {
      return t.getFullYear() - e.getFullYear();
    },
    function (e) {
      return e.getFullYear();
    }
  );
year.every = function (e) {
  return isFinite((e = Math.floor(e))) && e > 0
    ? newInterval(
        function (t) {
          t.setFullYear(Math.floor(t.getFullYear() / e) * e),
            t.setMonth(0, 1),
            t.setHours(0, 0, 0, 0);
        },
        function (t, r) {
          t.setFullYear(t.getFullYear() + r * e);
        }
      )
    : null;
};
var utcMinute = newInterval(
    function (e) {
      e.setUTCSeconds(0, 0);
    },
    function (e, t) {
      e.setTime(+e + t * durationMinute);
    },
    function (e, t) {
      return (t - e) / durationMinute;
    },
    function (e) {
      return e.getUTCMinutes();
    }
  ),
  utcHour = newInterval(
    function (e) {
      e.setUTCMinutes(0, 0, 0);
    },
    function (e, t) {
      e.setTime(+e + t * durationHour);
    },
    function (e, t) {
      return (t - e) / durationHour;
    },
    function (e) {
      return e.getUTCHours();
    }
  ),
  utcDay = newInterval(
    function (e) {
      e.setUTCHours(0, 0, 0, 0);
    },
    function (e, t) {
      e.setUTCDate(e.getUTCDate() + t);
    },
    function (e, t) {
      return (t - e) / durationDay;
    },
    function (e) {
      return e.getUTCDate() - 1;
    }
  );
function utcWeekday(e) {
  return newInterval(
    function (t) {
      t.setUTCDate(t.getUTCDate() - ((t.getUTCDay() + 7 - e) % 7)),
        t.setUTCHours(0, 0, 0, 0);
    },
    function (e, t) {
      e.setUTCDate(e.getUTCDate() + 7 * t);
    },
    function (e, t) {
      return (t - e) / durationWeek;
    }
  );
}
var utcSunday = utcWeekday(0),
  utcMonday = utcWeekday(1),
  utcTuesday = utcWeekday(2),
  utcWednesday = utcWeekday(3),
  utcThursday = utcWeekday(4),
  utcFriday = utcWeekday(5),
  utcSaturday = utcWeekday(6),
  utcMonth = newInterval(
    function (e) {
      e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0);
    },
    function (e, t) {
      e.setUTCMonth(e.getUTCMonth() + t);
    },
    function (e, t) {
      return (
        t.getUTCMonth() -
        e.getUTCMonth() +
        12 * (t.getUTCFullYear() - e.getUTCFullYear())
      );
    },
    function (e) {
      return e.getUTCMonth();
    }
  ),
  utcYear = newInterval(
    function (e) {
      e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0);
    },
    function (e, t) {
      e.setUTCFullYear(e.getUTCFullYear() + t);
    },
    function (e, t) {
      return t.getUTCFullYear() - e.getUTCFullYear();
    },
    function (e) {
      return e.getUTCFullYear();
    }
  );
function localDate(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
    return t.setFullYear(e.y), t;
  }
  return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function utcDate(e) {
  if (0 <= e.y && e.y < 100) {
    var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
    return t.setUTCFullYear(e.y), t;
  }
  return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function newDate(e, t, r) {
  return {
    y: e,
    m: t,
    d: r,
    H: 0,
    M: 0,
    S: 0,
    L: 0,
  };
}
function formatLocale$1(e) {
  var t = e.dateTime,
    r = e.date,
    n = e.time,
    o = e.periods,
    a = e.days,
    i = e.shortDays,
    s = e.months,
    u = e.shortMonths,
    c = formatRe(o),
    l = formatLookup(o),
    f = formatRe(a),
    p = formatLookup(a),
    d = formatRe(i),
    h = formatLookup(i),
    g = formatRe(s),
    m = formatLookup(s),
    y = formatRe(u),
    b = formatLookup(u),
    v = {
      a: function (e) {
        return i[e.getDay()];
      },
      A: function (e) {
        return a[e.getDay()];
      },
      b: function (e) {
        return u[e.getMonth()];
      },
      B: function (e) {
        return s[e.getMonth()];
      },
      c: null,
      d: formatDayOfMonth,
      e: formatDayOfMonth,
      f: formatMicroseconds,
      H: formatHour24,
      I: formatHour12,
      j: formatDayOfYear,
      L: formatMilliseconds,
      m: formatMonthNumber,
      M: formatMinutes,
      p: function (e) {
        return o[+(e.getHours() >= 12)];
      },
      q: function (e) {
        return 1 + ~~(e.getMonth() / 3);
      },
      Q: formatUnixTimestamp,
      s: formatUnixTimestampSeconds,
      S: formatSeconds,
      u: formatWeekdayNumberMonday,
      U: formatWeekNumberSunday,
      V: formatWeekNumberISO,
      w: formatWeekdayNumberSunday,
      W: formatWeekNumberMonday,
      x: null,
      X: null,
      y: formatYear,
      Y: formatFullYear,
      Z: formatZone,
      "%": formatLiteralPercent,
    },
    _ = {
      a: function (e) {
        return i[e.getUTCDay()];
      },
      A: function (e) {
        return a[e.getUTCDay()];
      },
      b: function (e) {
        return u[e.getUTCMonth()];
      },
      B: function (e) {
        return s[e.getUTCMonth()];
      },
      c: null,
      d: formatUTCDayOfMonth,
      e: formatUTCDayOfMonth,
      f: formatUTCMicroseconds,
      H: formatUTCHour24,
      I: formatUTCHour12,
      j: formatUTCDayOfYear,
      L: formatUTCMilliseconds,
      m: formatUTCMonthNumber,
      M: formatUTCMinutes,
      p: function (e) {
        return o[+(e.getUTCHours() >= 12)];
      },
      q: function (e) {
        return 1 + ~~(e.getUTCMonth() / 3);
      },
      Q: formatUnixTimestamp,
      s: formatUnixTimestampSeconds,
      S: formatUTCSeconds,
      u: formatUTCWeekdayNumberMonday,
      U: formatUTCWeekNumberSunday,
      V: formatUTCWeekNumberISO,
      w: formatUTCWeekdayNumberSunday,
      W: formatUTCWeekNumberMonday,
      x: null,
      X: null,
      y: formatUTCYear,
      Y: formatUTCFullYear,
      Z: formatUTCZone,
      "%": formatLiteralPercent,
    },
    w = {
      a: function (e, t, r) {
        var n = d.exec(t.slice(r));
        return n ? ((e.w = h[n[0].toLowerCase()]), r + n[0].length) : -1;
      },
      A: function (e, t, r) {
        var n = f.exec(t.slice(r));
        return n ? ((e.w = p[n[0].toLowerCase()]), r + n[0].length) : -1;
      },
      b: function (e, t, r) {
        var n = y.exec(t.slice(r));
        return n ? ((e.m = b[n[0].toLowerCase()]), r + n[0].length) : -1;
      },
      B: function (e, t, r) {
        var n = g.exec(t.slice(r));
        return n ? ((e.m = m[n[0].toLowerCase()]), r + n[0].length) : -1;
      },
      c: function (e, r, n) {
        return A(e, t, r, n);
      },
      d: parseDayOfMonth,
      e: parseDayOfMonth,
      f: parseMicroseconds,
      H: parseHour24,
      I: parseHour24,
      j: parseDayOfYear,
      L: parseMilliseconds,
      m: parseMonthNumber,
      M: parseMinutes,
      p: function (e, t, r) {
        var n = c.exec(t.slice(r));
        return n ? ((e.p = l[n[0].toLowerCase()]), r + n[0].length) : -1;
      },
      q: parseQuarter,
      Q: parseUnixTimestamp,
      s: parseUnixTimestampSeconds,
      S: parseSeconds,
      u: parseWeekdayNumberMonday,
      U: parseWeekNumberSunday,
      V: parseWeekNumberISO,
      w: parseWeekdayNumberSunday,
      W: parseWeekNumberMonday,
      x: function (e, t, n) {
        return A(e, r, t, n);
      },
      X: function (e, t, r) {
        return A(e, n, t, r);
      },
      y: parseYear,
      Y: parseFullYear,
      Z: parseZone,
      "%": parseLiteralPercent,
    };
  function T(e, t) {
    return function (r) {
      var n,
        o,
        a,
        i = [],
        s = -1,
        u = 0,
        c = e.length;
      for (r instanceof Date || (r = new Date(+r)); ++s < c; )
        37 === e.charCodeAt(s) &&
          (i.push(e.slice(u, s)),
          null != (o = pads[(n = e.charAt(++s))])
            ? (n = e.charAt(++s))
            : (o = "e" === n ? " " : "0"),
          (a = t[n]) && (n = a(r, o)),
          i.push(n),
          (u = s + 1));
      return i.push(e.slice(u, s)), i.join("");
    };
  }
  function O(e, t) {
    return function (r) {
      var n,
        o,
        a = newDate(1900, void 0, 1);
      if (A(a, e, (r += ""), 0) != r.length) return null;
      if ("Q" in a) return new Date(a.Q);
      if ("s" in a) return new Date(1e3 * a.s + ("L" in a ? a.L : 0));
      if (
        (t && !("Z" in a) && (a.Z = 0),
        "p" in a && (a.H = (a.H % 12) + 12 * a.p),
        void 0 === a.m && (a.m = "q" in a ? a.q : 0),
        "V" in a)
      ) {
        if (a.V < 1 || a.V > 53) return null;
        "w" in a || (a.w = 1),
          "Z" in a
            ? ((o = (n = utcDate(newDate(a.y, 0, 1))).getUTCDay()),
              (n = o > 4 || 0 === o ? utcMonday.ceil(n) : utcMonday(n)),
              (n = utcDay.offset(n, 7 * (a.V - 1))),
              (a.y = n.getUTCFullYear()),
              (a.m = n.getUTCMonth()),
              (a.d = n.getUTCDate() + ((a.w + 6) % 7)))
            : ((o = (n = localDate(newDate(a.y, 0, 1))).getDay()),
              (n = o > 4 || 0 === o ? monday.ceil(n) : monday(n)),
              (n = day.offset(n, 7 * (a.V - 1))),
              (a.y = n.getFullYear()),
              (a.m = n.getMonth()),
              (a.d = n.getDate() + ((a.w + 6) % 7)));
      } else
        ("W" in a || "U" in a) &&
          ("w" in a || (a.w = "u" in a ? a.u % 7 : "W" in a ? 1 : 0),
          (o =
            "Z" in a
              ? utcDate(newDate(a.y, 0, 1)).getUTCDay()
              : localDate(newDate(a.y, 0, 1)).getDay()),
          (a.m = 0),
          (a.d =
            "W" in a
              ? ((a.w + 6) % 7) + 7 * a.W - ((o + 5) % 7)
              : a.w + 7 * a.U - ((o + 6) % 7)));
      return "Z" in a
        ? ((a.H += (a.Z / 100) | 0), (a.M += a.Z % 100), utcDate(a))
        : localDate(a);
    };
  }
  function A(e, t, r, n) {
    for (var o, a, i = 0, s = t.length, u = r.length; i < s; ) {
      if (n >= u) return -1;
      if (37 === (o = t.charCodeAt(i++))) {
        if (
          ((o = t.charAt(i++)),
          !(a = w[o in pads ? t.charAt(i++) : o]) || (n = a(e, r, n)) < 0)
        )
          return -1;
      } else if (o != r.charCodeAt(n++)) return -1;
    }
    return n;
  }
  return (
    (v.x = T(r, v)),
    (v.X = T(n, v)),
    (v.c = T(t, v)),
    (_.x = T(r, _)),
    (_.X = T(n, _)),
    (_.c = T(t, _)),
    {
      format: function (e) {
        var t = T((e += ""), v);
        return (
          (t.toString = function () {
            return e;
          }),
          t
        );
      },
      parse: function (e) {
        var t = O((e += ""), !1);
        return (
          (t.toString = function () {
            return e;
          }),
          t
        );
      },
      utcFormat: function (e) {
        var t = T((e += ""), _);
        return (
          (t.toString = function () {
            return e;
          }),
          t
        );
      },
      utcParse: function (e) {
        var t = O((e += ""), !0);
        return (
          (t.toString = function () {
            return e;
          }),
          t
        );
      },
    }
  );
}
utcYear.every = function (e) {
  return isFinite((e = Math.floor(e))) && e > 0
    ? newInterval(
        function (t) {
          t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e),
            t.setUTCMonth(0, 1),
            t.setUTCHours(0, 0, 0, 0);
        },
        function (t, r) {
          t.setUTCFullYear(t.getUTCFullYear() + r * e);
        }
      )
    : null;
};
var pads = {
    "-": "",
    _: " ",
    0: "0",
  },
  numberRe = /^\s*\d+/,
  percentRe = /^%/,
  requoteRe = /[\\^$*+?|[\]().{}]/g,
  locale$1,
  timeFormat,
  timeParse,
  utcFormat,
  utcParse;
function pad(e, t, r) {
  var n = e < 0 ? "-" : "",
    o = (n ? -e : e) + "",
    a = o.length;
  return n + (a < r ? new Array(r - a + 1).join(t) + o : o);
}
function requote(e) {
  return e.replace(requoteRe, "\\$&");
}
function formatRe(e) {
  return new RegExp("^(?:" + e.map(requote).join("|") + ")", "i");
}
function formatLookup(e) {
  for (var t = {}, r = -1, n = e.length; ++r < n; ) t[e[r].toLowerCase()] = r;
  return t;
}
function parseWeekdayNumberSunday(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 1));
  return n ? ((e.w = +n[0]), r + n[0].length) : -1;
}
function parseWeekdayNumberMonday(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 1));
  return n ? ((e.u = +n[0]), r + n[0].length) : -1;
}
function parseWeekNumberSunday(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.U = +n[0]), r + n[0].length) : -1;
}
function parseWeekNumberISO(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.V = +n[0]), r + n[0].length) : -1;
}
function parseWeekNumberMonday(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.W = +n[0]), r + n[0].length) : -1;
}
function parseFullYear(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 4));
  return n ? ((e.y = +n[0]), r + n[0].length) : -1;
}
function parseYear(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3)), r + n[0].length) : -1;
}
function parseZone(e, t, r) {
  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
  return n
    ? ((e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00"))), r + n[0].length)
    : -1;
}
function parseQuarter(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 1));
  return n ? ((e.q = 3 * n[0] - 3), r + n[0].length) : -1;
}
function parseMonthNumber(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.m = n[0] - 1), r + n[0].length) : -1;
}
function parseDayOfMonth(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.d = +n[0]), r + n[0].length) : -1;
}
function parseDayOfYear(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 3));
  return n ? ((e.m = 0), (e.d = +n[0]), r + n[0].length) : -1;
}
function parseHour24(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.H = +n[0]), r + n[0].length) : -1;
}
function parseMinutes(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.M = +n[0]), r + n[0].length) : -1;
}
function parseSeconds(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 2));
  return n ? ((e.S = +n[0]), r + n[0].length) : -1;
}
function parseMilliseconds(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 3));
  return n ? ((e.L = +n[0]), r + n[0].length) : -1;
}
function parseMicroseconds(e, t, r) {
  var n = numberRe.exec(t.slice(r, r + 6));
  return n ? ((e.L = Math.floor(n[0] / 1e3)), r + n[0].length) : -1;
}
function parseLiteralPercent(e, t, r) {
  var n = percentRe.exec(t.slice(r, r + 1));
  return n ? r + n[0].length : -1;
}
function parseUnixTimestamp(e, t, r) {
  var n = numberRe.exec(t.slice(r));
  return n ? ((e.Q = +n[0]), r + n[0].length) : -1;
}
function parseUnixTimestampSeconds(e, t, r) {
  var n = numberRe.exec(t.slice(r));
  return n ? ((e.s = +n[0]), r + n[0].length) : -1;
}
function formatDayOfMonth(e, t) {
  return pad(e.getDate(), t, 2);
}
function formatHour24(e, t) {
  return pad(e.getHours(), t, 2);
}
function formatHour12(e, t) {
  return pad(e.getHours() % 12 || 12, t, 2);
}
function formatDayOfYear(e, t) {
  return pad(1 + day.count(year(e), e), t, 3);
}
function formatMilliseconds(e, t) {
  return pad(e.getMilliseconds(), t, 3);
}
function formatMicroseconds(e, t) {
  return formatMilliseconds(e, t) + "000";
}
function formatMonthNumber(e, t) {
  return pad(e.getMonth() + 1, t, 2);
}
function formatMinutes(e, t) {
  return pad(e.getMinutes(), t, 2);
}
function formatSeconds(e, t) {
  return pad(e.getSeconds(), t, 2);
}
function formatWeekdayNumberMonday(e) {
  var t = e.getDay();
  return 0 === t ? 7 : t;
}
function formatWeekNumberSunday(e, t) {
  return pad(sunday.count(year(e) - 1, e), t, 2);
}
function formatWeekNumberISO(e, t) {
  var r = e.getDay();
  return (
    (e = r >= 4 || 0 === r ? thursday(e) : thursday.ceil(e)),
    pad(thursday.count(year(e), e) + (4 === year(e).getDay()), t, 2)
  );
}
function formatWeekdayNumberSunday(e) {
  return e.getDay();
}
function formatWeekNumberMonday(e, t) {
  return pad(monday.count(year(e) - 1, e), t, 2);
}
function formatYear(e, t) {
  return pad(e.getFullYear() % 100, t, 2);
}
function formatFullYear(e, t) {
  return pad(e.getFullYear() % 1e4, t, 4);
}
function formatZone(e) {
  var t = e.getTimezoneOffset();
  return (
    (t > 0 ? "-" : ((t *= -1), "+")) +
    pad((t / 60) | 0, "0", 2) +
    pad(t % 60, "0", 2)
  );
}
function formatUTCDayOfMonth(e, t) {
  return pad(e.getUTCDate(), t, 2);
}
function formatUTCHour24(e, t) {
  return pad(e.getUTCHours(), t, 2);
}
function formatUTCHour12(e, t) {
  return pad(e.getUTCHours() % 12 || 12, t, 2);
}
function formatUTCDayOfYear(e, t) {
  return pad(1 + utcDay.count(utcYear(e), e), t, 3);
}
function formatUTCMilliseconds(e, t) {
  return pad(e.getUTCMilliseconds(), t, 3);
}
function formatUTCMicroseconds(e, t) {
  return formatUTCMilliseconds(e, t) + "000";
}
function formatUTCMonthNumber(e, t) {
  return pad(e.getUTCMonth() + 1, t, 2);
}
function formatUTCMinutes(e, t) {
  return pad(e.getUTCMinutes(), t, 2);
}
function formatUTCSeconds(e, t) {
  return pad(e.getUTCSeconds(), t, 2);
}
function formatUTCWeekdayNumberMonday(e) {
  var t = e.getUTCDay();
  return 0 === t ? 7 : t;
}
function formatUTCWeekNumberSunday(e, t) {
  return pad(utcSunday.count(utcYear(e) - 1, e), t, 2);
}
function formatUTCWeekNumberISO(e, t) {
  var r = e.getUTCDay();
  return (
    (e = r >= 4 || 0 === r ? utcThursday(e) : utcThursday.ceil(e)),
    pad(utcThursday.count(utcYear(e), e) + (4 === utcYear(e).getUTCDay()), t, 2)
  );
}
function formatUTCWeekdayNumberSunday(e) {
  return e.getUTCDay();
}
function formatUTCWeekNumberMonday(e, t) {
  return pad(utcMonday.count(utcYear(e) - 1, e), t, 2);
}
function formatUTCYear(e, t) {
  return pad(e.getUTCFullYear() % 100, t, 2);
}
function formatUTCFullYear(e, t) {
  return pad(e.getUTCFullYear() % 1e4, t, 4);
}
function formatUTCZone() {
  return "+0000";
}
function formatLiteralPercent() {
  return "%";
}
function formatUnixTimestamp(e) {
  return +e;
}
function formatUnixTimestampSeconds(e) {
  return Math.floor(+e / 1e3);
}
function defaultLocale$1(e) {
  return (
    (locale$1 = formatLocale$1(e)),
    (timeFormat = locale$1.format),
    (timeParse = locale$1.parse),
    (utcFormat = locale$1.utcFormat),
    (utcParse = locale$1.utcParse),
    locale$1
  );
}
defaultLocale$1({
  dateTime: "%x, %X",
  date: "%-m/%-d/%Y",
  time: "%-I:%M:%S %p",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
});
var durationSecond$1 = 1e3,
  durationMinute$1 = 60 * durationSecond$1,
  durationHour$1 = 60 * durationMinute$1,
  durationDay$1 = 24 * durationHour$1,
  durationWeek$1 = 7 * durationDay$1,
  durationMonth = 30 * durationDay$1,
  durationYear = 365 * durationDay$1;
function date$1(e) {
  return new Date(e);
}
function number$1(e) {
  return e instanceof Date ? +e : +new Date(+e);
}
function calendar(e, t, r, n, o, a, i, s, u) {
  var c = continuous(),
    l = c.invert,
    f = c.domain,
    p = u(".%L"),
    d = u(":%S"),
    h = u("%I:%M"),
    g = u("%I %p"),
    m = u("%a %d"),
    y = u("%b %d"),
    b = u("%B"),
    v = u("%Y"),
    _ = [
      [i, 1, durationSecond$1],
      [i, 5, 5 * durationSecond$1],
      [i, 15, 15 * durationSecond$1],
      [i, 30, 30 * durationSecond$1],
      [a, 1, durationMinute$1],
      [a, 5, 5 * durationMinute$1],
      [a, 15, 15 * durationMinute$1],
      [a, 30, 30 * durationMinute$1],
      [o, 1, durationHour$1],
      [o, 3, 3 * durationHour$1],
      [o, 6, 6 * durationHour$1],
      [o, 12, 12 * durationHour$1],
      [n, 1, durationDay$1],
      [n, 2, 2 * durationDay$1],
      [r, 1, durationWeek$1],
      [t, 1, durationMonth],
      [t, 3, 3 * durationMonth],
      [e, 1, durationYear],
    ];
  function w(s) {
    return (i(s) < s
      ? p
      : a(s) < s
      ? d
      : o(s) < s
      ? h
      : n(s) < s
      ? g
      : t(s) < s
      ? r(s) < s
        ? m
        : y
      : e(s) < s
      ? b
      : v)(s);
  }
  function T(t, r, n) {
    if ((null == t && (t = 10), "number" == typeof t)) {
      var o,
        a = Math.abs(n - r) / t,
        i = bisector(function (e) {
          return e[2];
        }).right(_, a);
      return (
        i === _.length
          ? ((o = tickStep(r / durationYear, n / durationYear, t)), (t = e))
          : i
          ? ((o = (i = _[a / _[i - 1][2] < _[i][2] / a ? i - 1 : i])[1]),
            (t = i[0]))
          : ((o = Math.max(tickStep(r, n, t), 1)), (t = s)),
        t.every(o)
      );
    }
    return t;
  }
  return (
    (c.invert = function (e) {
      return new Date(l(e));
    }),
    (c.domain = function (e) {
      return arguments.length ? f(Array.from(e, number$1)) : f().map(date$1);
    }),
    (c.ticks = function (e) {
      var t,
        r = f(),
        n = r[0],
        o = r[r.length - 1],
        a = o < n;
      return (
        a && ((t = n), (n = o), (o = t)),
        (t = (t = T(e, n, o)) ? t.range(n, o + 1) : []),
        a ? t.reverse() : t
      );
    }),
    (c.tickFormat = function (e, t) {
      return null == t ? w : u(t);
    }),
    (c.nice = function (e) {
      var t = f();
      return (e = T(e, t[0], t[t.length - 1])) ? f(nice(t, e)) : c;
    }),
    (c.copy = function () {
      return copy(c, calendar(e, t, r, n, o, a, i, s, u));
    }),
    c
  );
}
function scaleUtc() {
  return initRange.apply(
    calendar(
      utcYear,
      utcMonth,
      utcSunday,
      utcDay,
      utcHour,
      utcMinute,
      second,
      millisecond,
      utcFormat
    ).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]),
    arguments
  );
}
function requiredArgs(e, t) {
  if (t.length < e)
    throw new TypeError(
      e +
        " argument" +
        (e > 1 ? "s" : "") +
        " required, but only " +
        t.length +
        " present"
    );
}
function toDate(e) {
  requiredArgs(1, arguments);
  var t = Object.prototype.toString.call(e);
  return e instanceof Date || ("object" == typeof e && "[object Date]" === t)
    ? new Date(e.getTime())
    : "number" == typeof e || "[object Number]" === t
    ? new Date(e)
    : (("string" != typeof e && "[object String]" !== t) ||
        "undefined" == typeof console ||
        (console.warn(
          "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"
        ),
        console.warn(new Error().stack)),
      new Date(NaN));
}
function isValid(e) {
  requiredArgs(1, arguments);
  var t = toDate(e);
  return !isNaN(t);
}
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds",
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds",
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes",
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes",
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours",
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours",
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days",
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks",
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks",
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months",
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months",
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years",
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years",
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years",
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years",
  },
};
function formatDistance(e, t, r) {
  var n;
  return (
    (r = r || {}),
    (n =
      "string" == typeof formatDistanceLocale[e]
        ? formatDistanceLocale[e]
        : 1 === t
        ? formatDistanceLocale[e].one
        : formatDistanceLocale[e].other.replace("{{count}}", t)),
    r.addSuffix ? (r.comparison > 0 ? "in " + n : n + " ago") : n
  );
}
function buildFormatLongFn(e) {
  return function (t) {
    var r = t || {},
      n = r.width ? String(r.width) : e.defaultWidth;
    return e.formats[n] || e.formats[e.defaultWidth];
  };
}
var dateFormats = {
    full: "EEEE, MMMM do, y",
    long: "MMMM do, y",
    medium: "MMM d, y",
    short: "MM/dd/yyyy",
  },
  timeFormats = {
    full: "h:mm:ss a zzzz",
    long: "h:mm:ss a z",
    medium: "h:mm:ss a",
    short: "h:mm a",
  },
  dateTimeFormats = {
    full: "{{date}} 'at' {{time}}",
    long: "{{date}} 'at' {{time}}",
    medium: "{{date}}, {{time}}",
    short: "{{date}}, {{time}}",
  },
  formatLong = {
    date: buildFormatLongFn({
      formats: dateFormats,
      defaultWidth: "full",
    }),
    time: buildFormatLongFn({
      formats: timeFormats,
      defaultWidth: "full",
    }),
    dateTime: buildFormatLongFn({
      formats: dateTimeFormats,
      defaultWidth: "full",
    }),
  },
  formatRelativeLocale = {
    lastWeek: "'last' eeee 'at' p",
    yesterday: "'yesterday at' p",
    today: "'today at' p",
    tomorrow: "'tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P",
  };
function formatRelative(e, t, r, n) {
  return formatRelativeLocale[e];
}
function buildLocalizeFn(e) {
  return function (t, r) {
    var n,
      o = r || {};
    if (
      "formatting" === (o.context ? String(o.context) : "standalone") &&
      e.formattingValues
    ) {
      var a = e.defaultFormattingWidth || e.defaultWidth,
        i = o.width ? String(o.width) : a;
      n = e.formattingValues[i] || e.formattingValues[a];
    } else {
      var s = e.defaultWidth,
        u = o.width ? String(o.width) : e.defaultWidth;
      n = e.values[u] || e.values[s];
    }
    return n[e.argumentCallback ? e.argumentCallback(t) : t];
  };
}
var eraValues = {
    narrow: ["B", "A"],
    abbreviated: ["BC", "AD"],
    wide: ["Before Christ", "Anno Domini"],
  },
  quarterValues = {
    narrow: ["1", "2", "3", "4"],
    abbreviated: ["Q1", "Q2", "Q3", "Q4"],
    wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"],
  },
  monthValues = {
    narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    abbreviated: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    wide: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  },
  dayValues = {
    narrow: ["S", "M", "T", "W", "T", "F", "S"],
    short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    wide: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  },
  dayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "morning",
      afternoon: "afternoon",
      evening: "evening",
      night: "night",
    },
  },
  formattingDayPeriodValues = {
    narrow: {
      am: "a",
      pm: "p",
      midnight: "mi",
      noon: "n",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    abbreviated: {
      am: "AM",
      pm: "PM",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
    wide: {
      am: "a.m.",
      pm: "p.m.",
      midnight: "midnight",
      noon: "noon",
      morning: "in the morning",
      afternoon: "in the afternoon",
      evening: "in the evening",
      night: "at night",
    },
  };
function ordinalNumber(e, t) {
  var r = Number(e),
    n = r % 100;
  if (n > 20 || n < 10)
    switch (n % 10) {
      case 1:
        return r + "st";
      case 2:
        return r + "nd";
      case 3:
        return r + "rd";
    }
  return r + "th";
}
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide",
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: function (e) {
      return Number(e) - 1;
    },
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide",
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide",
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide",
  }),
};
function buildMatchPatternFn(e) {
  return function (t, r) {
    var n = String(t),
      o = r || {},
      a = n.match(e.matchPattern);
    if (!a) return null;
    var i = a[0],
      s = n.match(e.parsePattern);
    if (!s) return null;
    var u = e.valueCallback ? e.valueCallback(s[0]) : s[0];
    return {
      value: (u = o.valueCallback ? o.valueCallback(u) : u),
      rest: n.slice(i.length),
    };
  };
}
function buildMatchFn(e) {
  return function (t, r) {
    var n = String(t),
      o = r || {},
      a = o.width,
      i = (a && e.matchPatterns[a]) || e.matchPatterns[e.defaultMatchWidth],
      s = n.match(i);
    if (!s) return null;
    var u,
      c = s[0],
      l = (a && e.parsePatterns[a]) || e.parsePatterns[e.defaultParseWidth];
    return (
      (u =
        "[object Array]" === Object.prototype.toString.call(l)
          ? findIndex(l, function (e) {
              return e.test(c);
            })
          : findKey(l, function (e) {
              return e.test(c);
            })),
      (u = e.valueCallback ? e.valueCallback(u) : u),
      {
        value: (u = o.valueCallback ? o.valueCallback(u) : u),
        rest: n.slice(c.length),
      }
    );
  };
}
function findKey(e, t) {
  for (var r in e) if (e.hasOwnProperty(r) && t(e[r])) return r;
}
function findIndex(e, t) {
  for (var r = 0; r < e.length; r++) if (t(e[r])) return r;
}
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i,
  parseOrdinalNumberPattern = /\d+/i,
  matchEraPatterns = {
    narrow: /^(b|a)/i,
    abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
    wide: /^(before christ|before common era|anno domini|common era)/i,
  },
  parseEraPatterns = {
    any: [/^b/i, /^(a|c)/i],
  },
  matchQuarterPatterns = {
    narrow: /^[1234]/i,
    abbreviated: /^q[1234]/i,
    wide: /^[1234](th|st|nd|rd)? quarter/i,
  },
  parseQuarterPatterns = {
    any: [/1/i, /2/i, /3/i, /4/i],
  },
  matchMonthPatterns = {
    narrow: /^[jfmasond]/i,
    abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
    wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i,
  },
  parseMonthPatterns = {
    narrow: [
      /^j/i,
      /^f/i,
      /^m/i,
      /^a/i,
      /^m/i,
      /^j/i,
      /^j/i,
      /^a/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
    any: [
      /^ja/i,
      /^f/i,
      /^mar/i,
      /^ap/i,
      /^may/i,
      /^jun/i,
      /^jul/i,
      /^au/i,
      /^s/i,
      /^o/i,
      /^n/i,
      /^d/i,
    ],
  },
  matchDayPatterns = {
    narrow: /^[smtwf]/i,
    short: /^(su|mo|tu|we|th|fr|sa)/i,
    abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
    wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i,
  },
  parseDayPatterns = {
    narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
    any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i],
  },
  matchDayPeriodPatterns = {
    narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
    any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i,
  },
  parseDayPeriodPatterns = {
    any: {
      am: /^a/i,
      pm: /^p/i,
      midnight: /^mi/i,
      noon: /^no/i,
      morning: /morning/i,
      afternoon: /afternoon/i,
      evening: /evening/i,
      night: /night/i,
    },
  },
  match = {
    ordinalNumber: buildMatchPatternFn({
      matchPattern: matchOrdinalNumberPattern,
      parsePattern: parseOrdinalNumberPattern,
      valueCallback: function (e) {
        return parseInt(e, 10);
      },
    }),
    era: buildMatchFn({
      matchPatterns: matchEraPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseEraPatterns,
      defaultParseWidth: "any",
    }),
    quarter: buildMatchFn({
      matchPatterns: matchQuarterPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseQuarterPatterns,
      defaultParseWidth: "any",
      valueCallback: function (e) {
        return e + 1;
      },
    }),
    month: buildMatchFn({
      matchPatterns: matchMonthPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseMonthPatterns,
      defaultParseWidth: "any",
    }),
    day: buildMatchFn({
      matchPatterns: matchDayPatterns,
      defaultMatchWidth: "wide",
      parsePatterns: parseDayPatterns,
      defaultParseWidth: "any",
    }),
    dayPeriod: buildMatchFn({
      matchPatterns: matchDayPeriodPatterns,
      defaultMatchWidth: "any",
      parsePatterns: parseDayPeriodPatterns,
      defaultParseWidth: "any",
    }),
  },
  locale$2 = {
    code: "en-US",
    formatDistance,
    formatLong,
    formatRelative,
    localize,
    match,
    options: {
      weekStartsOn: 0,
      firstWeekContainsDate: 1,
    },
  };
function toInteger(e) {
  if (null === e || !0 === e || !1 === e) return NaN;
  var t = Number(e);
  return isNaN(t) ? t : t < 0 ? Math.ceil(t) : Math.floor(t);
}
function addMilliseconds(e, t) {
  requiredArgs(2, arguments);
  var r = toDate(e).getTime(),
    n = toInteger(t);
  return new Date(r + n);
}
function subMilliseconds(e, t) {
  requiredArgs(2, arguments);
  var r = toInteger(t);
  return addMilliseconds(e, -r);
}
function addLeadingZeros(e, t) {
  for (var r = e < 0 ? "-" : "", n = Math.abs(e).toString(); n.length < t; )
    n = "0" + n;
  return r + n;
}
var formatters = {
    y: function (e, t) {
      var r = e.getUTCFullYear(),
        n = r > 0 ? r : 1 - r;
      return addLeadingZeros("yy" === t ? n % 100 : n, t.length);
    },
    M: function (e, t) {
      var r = e.getUTCMonth();
      return "M" === t ? String(r + 1) : addLeadingZeros(r + 1, 2);
    },
    d: function (e, t) {
      return addLeadingZeros(e.getUTCDate(), t.length);
    },
    a: function (e, t) {
      var r = e.getUTCHours() / 12 >= 1 ? "pm" : "am";
      switch (t) {
        case "a":
        case "aa":
        case "aaa":
          return r.toUpperCase();
        case "aaaaa":
          return r[0];
        case "aaaa":
        default:
          return "am" === r ? "a.m." : "p.m.";
      }
    },
    h: function (e, t) {
      return addLeadingZeros(e.getUTCHours() % 12 || 12, t.length);
    },
    H: function (e, t) {
      return addLeadingZeros(e.getUTCHours(), t.length);
    },
    m: function (e, t) {
      return addLeadingZeros(e.getUTCMinutes(), t.length);
    },
    s: function (e, t) {
      return addLeadingZeros(e.getUTCSeconds(), t.length);
    },
    S: function (e, t) {
      var r = t.length,
        n = e.getUTCMilliseconds();
      return addLeadingZeros(Math.floor(n * Math.pow(10, r - 3)), t.length);
    },
  },
  MILLISECONDS_IN_DAY = 864e5;
function getUTCDayOfYear(e) {
  requiredArgs(1, arguments);
  var t = toDate(e),
    r = t.getTime();
  t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0);
  var n = t.getTime(),
    o = r - n;
  return Math.floor(o / MILLISECONDS_IN_DAY) + 1;
}
function startOfUTCISOWeek(e) {
  requiredArgs(1, arguments);
  var t = 1,
    r = toDate(e),
    n = r.getUTCDay(),
    o = (n < t ? 7 : 0) + n - t;
  return r.setUTCDate(r.getUTCDate() - o), r.setUTCHours(0, 0, 0, 0), r;
}
function getUTCISOWeekYear(e) {
  requiredArgs(1, arguments);
  var t = toDate(e),
    r = t.getUTCFullYear(),
    n = new Date(0);
  n.setUTCFullYear(r + 1, 0, 4), n.setUTCHours(0, 0, 0, 0);
  var o = startOfUTCISOWeek(n),
    a = new Date(0);
  a.setUTCFullYear(r, 0, 4), a.setUTCHours(0, 0, 0, 0);
  var i = startOfUTCISOWeek(a);
  return t.getTime() >= o.getTime()
    ? r + 1
    : t.getTime() >= i.getTime()
    ? r
    : r - 1;
}
function startOfUTCISOWeekYear(e) {
  requiredArgs(1, arguments);
  var t = getUTCISOWeekYear(e),
    r = new Date(0);
  r.setUTCFullYear(t, 0, 4), r.setUTCHours(0, 0, 0, 0);
  var n = startOfUTCISOWeek(r);
  return n;
}
var MILLISECONDS_IN_WEEK = 6048e5;
function getUTCISOWeek(e) {
  requiredArgs(1, arguments);
  var t = toDate(e),
    r = startOfUTCISOWeek(t).getTime() - startOfUTCISOWeekYear(t).getTime();
  return Math.round(r / MILLISECONDS_IN_WEEK) + 1;
}
function startOfUTCWeek(e, t) {
  requiredArgs(1, arguments);
  var r = t || {},
    n = r.locale,
    o = n && n.options && n.options.weekStartsOn,
    a = null == o ? 0 : toInteger(o),
    i = null == r.weekStartsOn ? a : toInteger(r.weekStartsOn);
  if (!(i >= 0 && i <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  var s = toDate(e),
    u = s.getUTCDay(),
    c = (u < i ? 7 : 0) + u - i;
  return s.setUTCDate(s.getUTCDate() - c), s.setUTCHours(0, 0, 0, 0), s;
}
function getUTCWeekYear(e, t) {
  requiredArgs(1, arguments);
  var r = toDate(e, t),
    n = r.getUTCFullYear(),
    o = t || {},
    a = o.locale,
    i = a && a.options && a.options.firstWeekContainsDate,
    s = null == i ? 1 : toInteger(i),
    u =
      null == o.firstWeekContainsDate ? s : toInteger(o.firstWeekContainsDate);
  if (!(u >= 1 && u <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively"
    );
  var c = new Date(0);
  c.setUTCFullYear(n + 1, 0, u), c.setUTCHours(0, 0, 0, 0);
  var l = startOfUTCWeek(c, t),
    f = new Date(0);
  f.setUTCFullYear(n, 0, u), f.setUTCHours(0, 0, 0, 0);
  var p = startOfUTCWeek(f, t);
  return r.getTime() >= l.getTime()
    ? n + 1
    : r.getTime() >= p.getTime()
    ? n
    : n - 1;
}
function startOfUTCWeekYear(e, t) {
  requiredArgs(1, arguments);
  var r = t || {},
    n = r.locale,
    o = n && n.options && n.options.firstWeekContainsDate,
    a = null == o ? 1 : toInteger(o),
    i =
      null == r.firstWeekContainsDate ? a : toInteger(r.firstWeekContainsDate),
    s = getUTCWeekYear(e, t),
    u = new Date(0);
  u.setUTCFullYear(s, 0, i), u.setUTCHours(0, 0, 0, 0);
  var c = startOfUTCWeek(u, t);
  return c;
}
var MILLISECONDS_IN_WEEK$1 = 6048e5;
function getUTCWeek(e, t) {
  requiredArgs(1, arguments);
  var r = toDate(e),
    n = startOfUTCWeek(r, t).getTime() - startOfUTCWeekYear(r, t).getTime();
  return Math.round(n / MILLISECONDS_IN_WEEK$1) + 1;
}
var dayPeriodEnum = {
    am: "am",
    pm: "pm",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night",
  },
  formatters$1 = {
    G: function (e, t, r) {
      var n = e.getUTCFullYear() > 0 ? 1 : 0;
      switch (t) {
        case "G":
        case "GG":
        case "GGG":
          return r.era(n, {
            width: "abbreviated",
          });
        case "GGGGG":
          return r.era(n, {
            width: "narrow",
          });
        case "GGGG":
        default:
          return r.era(n, {
            width: "wide",
          });
      }
    },
    y: function (e, t, r) {
      if ("yo" === t) {
        var n = e.getUTCFullYear(),
          o = n > 0 ? n : 1 - n;
        return r.ordinalNumber(o, {
          unit: "year",
        });
      }
      return formatters.y(e, t);
    },
    Y: function (e, t, r, n) {
      var o = getUTCWeekYear(e, n),
        a = o > 0 ? o : 1 - o;
      return "YY" === t
        ? addLeadingZeros(a % 100, 2)
        : "Yo" === t
        ? r.ordinalNumber(a, {
            unit: "year",
          })
        : addLeadingZeros(a, t.length);
    },
    R: function (e, t) {
      return addLeadingZeros(getUTCISOWeekYear(e), t.length);
    },
    u: function (e, t) {
      return addLeadingZeros(e.getUTCFullYear(), t.length);
    },
    Q: function (e, t, r) {
      var n = Math.ceil((e.getUTCMonth() + 1) / 3);
      switch (t) {
        case "Q":
          return String(n);
        case "QQ":
          return addLeadingZeros(n, 2);
        case "Qo":
          return r.ordinalNumber(n, {
            unit: "quarter",
          });
        case "QQQ":
          return r.quarter(n, {
            width: "abbreviated",
            context: "formatting",
          });
        case "QQQQQ":
          return r.quarter(n, {
            width: "narrow",
            context: "formatting",
          });
        case "QQQQ":
        default:
          return r.quarter(n, {
            width: "wide",
            context: "formatting",
          });
      }
    },
    q: function (e, t, r) {
      var n = Math.ceil((e.getUTCMonth() + 1) / 3);
      switch (t) {
        case "q":
          return String(n);
        case "qq":
          return addLeadingZeros(n, 2);
        case "qo":
          return r.ordinalNumber(n, {
            unit: "quarter",
          });
        case "qqq":
          return r.quarter(n, {
            width: "abbreviated",
            context: "standalone",
          });
        case "qqqqq":
          return r.quarter(n, {
            width: "narrow",
            context: "standalone",
          });
        case "qqqq":
        default:
          return r.quarter(n, {
            width: "wide",
            context: "standalone",
          });
      }
    },
    M: function (e, t, r) {
      var n = e.getUTCMonth();
      switch (t) {
        case "M":
        case "MM":
          return formatters.M(e, t);
        case "Mo":
          return r.ordinalNumber(n + 1, {
            unit: "month",
          });
        case "MMM":
          return r.month(n, {
            width: "abbreviated",
            context: "formatting",
          });
        case "MMMMM":
          return r.month(n, {
            width: "narrow",
            context: "formatting",
          });
        case "MMMM":
        default:
          return r.month(n, {
            width: "wide",
            context: "formatting",
          });
      }
    },
    L: function (e, t, r) {
      var n = e.getUTCMonth();
      switch (t) {
        case "L":
          return String(n + 1);
        case "LL":
          return addLeadingZeros(n + 1, 2);
        case "Lo":
          return r.ordinalNumber(n + 1, {
            unit: "month",
          });
        case "LLL":
          return r.month(n, {
            width: "abbreviated",
            context: "standalone",
          });
        case "LLLLL":
          return r.month(n, {
            width: "narrow",
            context: "standalone",
          });
        case "LLLL":
        default:
          return r.month(n, {
            width: "wide",
            context: "standalone",
          });
      }
    },
    w: function (e, t, r, n) {
      var o = getUTCWeek(e, n);
      return "wo" === t
        ? r.ordinalNumber(o, {
            unit: "week",
          })
        : addLeadingZeros(o, t.length);
    },
    I: function (e, t, r) {
      var n = getUTCISOWeek(e);
      return "Io" === t
        ? r.ordinalNumber(n, {
            unit: "week",
          })
        : addLeadingZeros(n, t.length);
    },
    d: function (e, t, r) {
      return "do" === t
        ? r.ordinalNumber(e.getUTCDate(), {
            unit: "date",
          })
        : formatters.d(e, t);
    },
    D: function (e, t, r) {
      var n = getUTCDayOfYear(e);
      return "Do" === t
        ? r.ordinalNumber(n, {
            unit: "dayOfYear",
          })
        : addLeadingZeros(n, t.length);
    },
    E: function (e, t, r) {
      var n = e.getUTCDay();
      switch (t) {
        case "E":
        case "EE":
        case "EEE":
          return r.day(n, {
            width: "abbreviated",
            context: "formatting",
          });
        case "EEEEE":
          return r.day(n, {
            width: "narrow",
            context: "formatting",
          });
        case "EEEEEE":
          return r.day(n, {
            width: "short",
            context: "formatting",
          });
        case "EEEE":
        default:
          return r.day(n, {
            width: "wide",
            context: "formatting",
          });
      }
    },
    e: function (e, t, r, n) {
      var o = e.getUTCDay(),
        a = (o - n.weekStartsOn + 8) % 7 || 7;
      switch (t) {
        case "e":
          return String(a);
        case "ee":
          return addLeadingZeros(a, 2);
        case "eo":
          return r.ordinalNumber(a, {
            unit: "day",
          });
        case "eee":
          return r.day(o, {
            width: "abbreviated",
            context: "formatting",
          });
        case "eeeee":
          return r.day(o, {
            width: "narrow",
            context: "formatting",
          });
        case "eeeeee":
          return r.day(o, {
            width: "short",
            context: "formatting",
          });
        case "eeee":
        default:
          return r.day(o, {
            width: "wide",
            context: "formatting",
          });
      }
    },
    c: function (e, t, r, n) {
      var o = e.getUTCDay(),
        a = (o - n.weekStartsOn + 8) % 7 || 7;
      switch (t) {
        case "c":
          return String(a);
        case "cc":
          return addLeadingZeros(a, t.length);
        case "co":
          return r.ordinalNumber(a, {
            unit: "day",
          });
        case "ccc":
          return r.day(o, {
            width: "abbreviated",
            context: "standalone",
          });
        case "ccccc":
          return r.day(o, {
            width: "narrow",
            context: "standalone",
          });
        case "cccccc":
          return r.day(o, {
            width: "short",
            context: "standalone",
          });
        case "cccc":
        default:
          return r.day(o, {
            width: "wide",
            context: "standalone",
          });
      }
    },
    i: function (e, t, r) {
      var n = e.getUTCDay(),
        o = 0 === n ? 7 : n;
      switch (t) {
        case "i":
          return String(o);
        case "ii":
          return addLeadingZeros(o, t.length);
        case "io":
          return r.ordinalNumber(o, {
            unit: "day",
          });
        case "iii":
          return r.day(n, {
            width: "abbreviated",
            context: "formatting",
          });
        case "iiiii":
          return r.day(n, {
            width: "narrow",
            context: "formatting",
          });
        case "iiiiii":
          return r.day(n, {
            width: "short",
            context: "formatting",
          });
        case "iiii":
        default:
          return r.day(n, {
            width: "wide",
            context: "formatting",
          });
      }
    },
    a: function (e, t, r) {
      var n = e.getUTCHours() / 12 >= 1 ? "pm" : "am";
      switch (t) {
        case "a":
        case "aa":
        case "aaa":
          return r.dayPeriod(n, {
            width: "abbreviated",
            context: "formatting",
          });
        case "aaaaa":
          return r.dayPeriod(n, {
            width: "narrow",
            context: "formatting",
          });
        case "aaaa":
        default:
          return r.dayPeriod(n, {
            width: "wide",
            context: "formatting",
          });
      }
    },
    b: function (e, t, r) {
      var n,
        o = e.getUTCHours();
      switch (
        ((n =
          12 === o
            ? dayPeriodEnum.noon
            : 0 === o
            ? dayPeriodEnum.midnight
            : o / 12 >= 1
            ? "pm"
            : "am"),
        t)
      ) {
        case "b":
        case "bb":
        case "bbb":
          return r.dayPeriod(n, {
            width: "abbreviated",
            context: "formatting",
          });
        case "bbbbb":
          return r.dayPeriod(n, {
            width: "narrow",
            context: "formatting",
          });
        case "bbbb":
        default:
          return r.dayPeriod(n, {
            width: "wide",
            context: "formatting",
          });
      }
    },
    B: function (e, t, r) {
      var n,
        o = e.getUTCHours();
      switch (
        ((n =
          o >= 17
            ? dayPeriodEnum.evening
            : o >= 12
            ? dayPeriodEnum.afternoon
            : o >= 4
            ? dayPeriodEnum.morning
            : dayPeriodEnum.night),
        t)
      ) {
        case "B":
        case "BB":
        case "BBB":
          return r.dayPeriod(n, {
            width: "abbreviated",
            context: "formatting",
          });
        case "BBBBB":
          return r.dayPeriod(n, {
            width: "narrow",
            context: "formatting",
          });
        case "BBBB":
        default:
          return r.dayPeriod(n, {
            width: "wide",
            context: "formatting",
          });
      }
    },
    h: function (e, t, r) {
      if ("ho" === t) {
        var n = e.getUTCHours() % 12;
        return (
          0 === n && (n = 12),
          r.ordinalNumber(n, {
            unit: "hour",
          })
        );
      }
      return formatters.h(e, t);
    },
    H: function (e, t, r) {
      return "Ho" === t
        ? r.ordinalNumber(e.getUTCHours(), {
            unit: "hour",
          })
        : formatters.H(e, t);
    },
    K: function (e, t, r) {
      var n = e.getUTCHours() % 12;
      return "Ko" === t
        ? r.ordinalNumber(n, {
            unit: "hour",
          })
        : addLeadingZeros(n, t.length);
    },
    k: function (e, t, r) {
      var n = e.getUTCHours();
      return (
        0 === n && (n = 24),
        "ko" === t
          ? r.ordinalNumber(n, {
              unit: "hour",
            })
          : addLeadingZeros(n, t.length)
      );
    },
    m: function (e, t, r) {
      return "mo" === t
        ? r.ordinalNumber(e.getUTCMinutes(), {
            unit: "minute",
          })
        : formatters.m(e, t);
    },
    s: function (e, t, r) {
      return "so" === t
        ? r.ordinalNumber(e.getUTCSeconds(), {
            unit: "second",
          })
        : formatters.s(e, t);
    },
    S: function (e, t) {
      return formatters.S(e, t);
    },
    X: function (e, t, r, n) {
      var o = (n._originalDate || e).getTimezoneOffset();
      if (0 === o) return "Z";
      switch (t) {
        case "X":
          return formatTimezoneWithOptionalMinutes(o);
        case "XXXX":
        case "XX":
          return formatTimezone(o);
        case "XXXXX":
        case "XXX":
        default:
          return formatTimezone(o, ":");
      }
    },
    x: function (e, t, r, n) {
      var o = (n._originalDate || e).getTimezoneOffset();
      switch (t) {
        case "x":
          return formatTimezoneWithOptionalMinutes(o);
        case "xxxx":
        case "xx":
          return formatTimezone(o);
        case "xxxxx":
        case "xxx":
        default:
          return formatTimezone(o, ":");
      }
    },
    O: function (e, t, r, n) {
      var o = (n._originalDate || e).getTimezoneOffset();
      switch (t) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + formatTimezoneShort(o, ":");
        case "OOOO":
        default:
          return "GMT" + formatTimezone(o, ":");
      }
    },
    z: function (e, t, r, n) {
      var o = (n._originalDate || e).getTimezoneOffset();
      switch (t) {
        case "z":
        case "zz":
        case "zzz":
          return "GMT" + formatTimezoneShort(o, ":");
        case "zzzz":
        default:
          return "GMT" + formatTimezone(o, ":");
      }
    },
    t: function (e, t, r, n) {
      var o = n._originalDate || e;
      return addLeadingZeros(Math.floor(o.getTime() / 1e3), t.length);
    },
    T: function (e, t, r, n) {
      return addLeadingZeros((n._originalDate || e).getTime(), t.length);
    },
  };
function formatTimezoneShort(e, t) {
  var r = e > 0 ? "-" : "+",
    n = Math.abs(e),
    o = Math.floor(n / 60),
    a = n % 60;
  if (0 === a) return r + String(o);
  var i = t || "";
  return r + String(o) + i + addLeadingZeros(a, 2);
}
function formatTimezoneWithOptionalMinutes(e, t) {
  return e % 60 == 0
    ? (e > 0 ? "-" : "+") + addLeadingZeros(Math.abs(e) / 60, 2)
    : formatTimezone(e, t);
}
function formatTimezone(e, t) {
  var r = t || "",
    n = e > 0 ? "-" : "+",
    o = Math.abs(e);
  return (
    n + addLeadingZeros(Math.floor(o / 60), 2) + r + addLeadingZeros(o % 60, 2)
  );
}
function dateLongFormatter(e, t) {
  switch (e) {
    case "P":
      return t.date({
        width: "short",
      });
    case "PP":
      return t.date({
        width: "medium",
      });
    case "PPP":
      return t.date({
        width: "long",
      });
    case "PPPP":
    default:
      return t.date({
        width: "full",
      });
  }
}
function timeLongFormatter(e, t) {
  switch (e) {
    case "p":
      return t.time({
        width: "short",
      });
    case "pp":
      return t.time({
        width: "medium",
      });
    case "ppp":
      return t.time({
        width: "long",
      });
    case "pppp":
    default:
      return t.time({
        width: "full",
      });
  }
}
function dateTimeLongFormatter(e, t) {
  var r,
    n = e.match(/(P+)(p+)?/),
    o = n[1],
    a = n[2];
  if (!a) return dateLongFormatter(e, t);
  switch (o) {
    case "P":
      r = t.dateTime({
        width: "short",
      });
      break;
    case "PP":
      r = t.dateTime({
        width: "medium",
      });
      break;
    case "PPP":
      r = t.dateTime({
        width: "long",
      });
      break;
    case "PPPP":
    default:
      r = t.dateTime({
        width: "full",
      });
  }
  return r
    .replace("{{date}}", dateLongFormatter(o, t))
    .replace("{{time}}", timeLongFormatter(a, t));
}
var longFormatters = {
    p: timeLongFormatter,
    P: dateTimeLongFormatter,
  },
  MILLISECONDS_IN_MINUTE = 6e4;
function getDateMillisecondsPart(e) {
  return e.getTime() % MILLISECONDS_IN_MINUTE;
}
function getTimezoneOffsetInMilliseconds(e) {
  var t = new Date(e.getTime()),
    r = Math.ceil(t.getTimezoneOffset());
  t.setSeconds(0, 0);
  var n =
    r > 0
      ? (MILLISECONDS_IN_MINUTE + getDateMillisecondsPart(t)) %
        MILLISECONDS_IN_MINUTE
      : getDateMillisecondsPart(t);
  return r * MILLISECONDS_IN_MINUTE + n;
}
var protectedDayOfYearTokens = ["D", "DD"],
  protectedWeekYearTokens = ["YY", "YYYY"];
function isProtectedDayOfYearToken(e) {
  return -1 !== protectedDayOfYearTokens.indexOf(e);
}
function isProtectedWeekYearToken(e) {
  return -1 !== protectedWeekYearTokens.indexOf(e);
}
function throwProtectedError(e, t, r) {
  if ("YYYY" === e)
    throw new RangeError(
      "Use `yyyy` instead of `YYYY` (in `"
        .concat(t, "`) for formatting years to the input `")
        .concat(r, "`; see: https://git.io/fxCyr")
    );
  if ("YY" === e)
    throw new RangeError(
      "Use `yy` instead of `YY` (in `"
        .concat(t, "`) for formatting years to the input `")
        .concat(r, "`; see: https://git.io/fxCyr")
    );
  if ("D" === e)
    throw new RangeError(
      "Use `d` instead of `D` (in `"
        .concat(t, "`) for formatting days of the month to the input `")
        .concat(r, "`; see: https://git.io/fxCyr")
    );
  if ("DD" === e)
    throw new RangeError(
      "Use `dd` instead of `DD` (in `"
        .concat(t, "`) for formatting days of the month to the input `")
        .concat(r, "`; see: https://git.io/fxCyr")
    );
}
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
  longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
  escapedStringRegExp = /^'([^]*?)'?$/,
  doubleQuoteRegExp = /''/g,
  unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format$1(e, t, r) {
  requiredArgs(2, arguments);
  var n = String(t),
    o = r || {},
    a = o.locale || locale$2,
    i = a.options && a.options.firstWeekContainsDate,
    s = null == i ? 1 : toInteger(i),
    u =
      null == o.firstWeekContainsDate ? s : toInteger(o.firstWeekContainsDate);
  if (!(u >= 1 && u <= 7))
    throw new RangeError(
      "firstWeekContainsDate must be between 1 and 7 inclusively"
    );
  var c = a.options && a.options.weekStartsOn,
    l = null == c ? 0 : toInteger(c),
    f = null == o.weekStartsOn ? l : toInteger(o.weekStartsOn);
  if (!(f >= 0 && f <= 6))
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  if (!a.localize)
    throw new RangeError("locale must contain localize property");
  if (!a.formatLong)
    throw new RangeError("locale must contain formatLong property");
  var p = toDate(e);
  if (!isValid(p)) throw new RangeError("Invalid time value");
  var d = getTimezoneOffsetInMilliseconds(p),
    h = subMilliseconds(p, d),
    g = {
      firstWeekContainsDate: u,
      weekStartsOn: f,
      locale: a,
      _originalDate: p,
    },
    m = n
      .match(longFormattingTokensRegExp)
      .map(function (e) {
        var t = e[0];
        return "p" === t || "P" === t
          ? (0, longFormatters[t])(e, a.formatLong, g)
          : e;
      })
      .join("")
      .match(formattingTokensRegExp)
      .map(function (r) {
        if ("''" === r) return "'";
        var n = r[0];
        if ("'" === n) return cleanEscapedString(r);
        var i = formatters$1[n];
        if (i)
          return (
            !o.useAdditionalWeekYearTokens &&
              isProtectedWeekYearToken(r) &&
              throwProtectedError(r, t, e),
            !o.useAdditionalDayOfYearTokens &&
              isProtectedDayOfYearToken(r) &&
              throwProtectedError(r, t, e),
            i(h, r, a.localize, g)
          );
        if (n.match(unescapedLatinCharacterRegExp))
          throw new RangeError(
            "Format string contains an unescaped latin alphabet character `" +
              n +
              "`"
          );
        return r;
      })
      .join("");
  return m;
}
function cleanEscapedString(e) {
  return e.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
}
function tzIntlTimeZoneName(e, t, r) {
  var n = getDTF(e, r.timeZone, r.locale);
  return n.formatToParts ? partsTimeZone(n, t) : hackyTimeZone(n, t);
}
function partsTimeZone(e, t) {
  var r = e.formatToParts(t);
  return r[r.length - 1].value;
}
function hackyTimeZone(e, t) {
  var r = e.format(t).replace(/\u200E/g, ""),
    n = / [\w-+ ]+$/.exec(r);
  return n ? n[0].substr(1) : "";
}
function getDTF(e, t, r) {
  if (r && !r.code)
    throw new Error(
      "date-fns-tz error: Please set a language code on the locale object imported from date-fns, e.g. `locale.code = 'en-US'`"
    );
  return new Intl.DateTimeFormat(r ? [r.code, "en-US"] : void 0, {
    timeZone: t,
    timeZoneName: e,
  });
}
function tzTokenizeDate(e, t) {
  var r = getDateTimeFormat(t);
  return r.formatToParts ? partsOffset(r, e) : hackyOffset(r, e);
}
var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5,
};
function partsOffset(e, t) {
  for (var r = e.formatToParts(t), n = [], o = 0; o < r.length; o++) {
    var a = typeToPos[r[o].type];
    a >= 0 && (n[a] = parseInt(r[o].value, 10));
  }
  return n;
}
function hackyOffset(e, t) {
  var r = e.format(t).replace(/\u200E/g, ""),
    n = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(r);
  return [n[3], n[1], n[2], n[4], n[5], n[6]];
}
var dtfCache = {};
function getDateTimeFormat(e) {
  if (!dtfCache[e]) {
    var t = new Intl.DateTimeFormat("en-US", {
        hour12: !1,
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date("2014-06-25T04:00:00.123Z")),
      r =
        "06/25/2014, 00:00:00" === t || "‎06‎/‎25‎/‎2014‎ ‎00‎:‎00‎:‎00" === t;
    dtfCache[e] = r
      ? new Intl.DateTimeFormat("en-US", {
          hour12: !1,
          timeZone: e,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      : new Intl.DateTimeFormat("en-US", {
          hourCycle: "h23",
          timeZone: e,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
  }
  return dtfCache[e];
}
var MILLISECONDS_IN_HOUR = 36e5,
  MILLISECONDS_IN_MINUTE$1 = 6e4,
  patterns = {
    timezone: /([Z+-].*)$/,
    timezoneZ: /^(Z)$/,
    timezoneHH: /^([+-])(\d{2})$/,
    timezoneHHMM: /^([+-])(\d{2}):?(\d{2})$/,
    timezoneIANA: /(UTC|(?:[a-zA-Z]+\/[a-zA-Z_]+(?:\/[a-zA-Z_]+)?))$/,
  };
function tzParseTimezone(e, t) {
  var r, n, o;
  if ((r = patterns.timezoneZ.exec(e))) return 0;
  if ((r = patterns.timezoneHH.exec(e)))
    return (
      (o = parseInt(r[2], 10)),
      validateTimezone()
        ? ((n = o * MILLISECONDS_IN_HOUR), "+" === r[1] ? -n : n)
        : NaN
    );
  if ((r = patterns.timezoneHHMM.exec(e))) {
    o = parseInt(r[2], 10);
    var a = parseInt(r[3], 10);
    return validateTimezone(o, a)
      ? ((n = o * MILLISECONDS_IN_HOUR + a * MILLISECONDS_IN_MINUTE$1),
        "+" === r[1] ? -n : n)
      : NaN;
  }
  if ((r = patterns.timezoneIANA.exec(e))) {
    var i = tzTokenizeDate(t, e);
    return -(
      Date.UTC(i[0], i[1] - 1, i[2], i[3], i[4], i[5]) -
      (t.getTime() - (t.getTime() % 1e3))
    );
  }
  return 0;
}
function validateTimezone(e, t) {
  return null == t || !(t < 0 || t > 59);
}
var MILLISECONDS_IN_MINUTE$2 = 6e4,
  formatters$2 = {
    X: function (e, t, r, n) {
      var o = n._originalDate || e,
        a = n.timeZone
          ? tzParseTimezone(n.timeZone, o) / MILLISECONDS_IN_MINUTE$2
          : o.getTimezoneOffset();
      if (0 === a) return "Z";
      switch (t) {
        case "X":
          return formatTimezoneWithOptionalMinutes$1(a);
        case "XXXX":
        case "XX":
          return formatTimezone$1(a);
        case "XXXXX":
        case "XXX":
        default:
          return formatTimezone$1(a, ":");
      }
    },
    x: function (e, t, r, n) {
      var o = n._originalDate || e,
        a = n.timeZone
          ? tzParseTimezone(n.timeZone, o) / MILLISECONDS_IN_MINUTE$2
          : o.getTimezoneOffset();
      switch (t) {
        case "x":
          return formatTimezoneWithOptionalMinutes$1(a);
        case "xxxx":
        case "xx":
          return formatTimezone$1(a);
        case "xxxxx":
        case "xxx":
        default:
          return formatTimezone$1(a, ":");
      }
    },
    O: function (e, t, r, n) {
      var o = n._originalDate || e,
        a = n.timeZone
          ? tzParseTimezone(n.timeZone, o) / MILLISECONDS_IN_MINUTE$2
          : o.getTimezoneOffset();
      switch (t) {
        case "O":
        case "OO":
        case "OOO":
          return "GMT" + formatTimezoneShort$1(a, ":");
        case "OOOO":
        default:
          return "GMT" + formatTimezone$1(a, ":");
      }
    },
    z: function (e, t, r, n) {
      var o = n._originalDate || e;
      switch (t) {
        case "z":
        case "zz":
        case "zzz":
          return tzIntlTimeZoneName("short", o, n);
        case "zzzz":
        default:
          return tzIntlTimeZoneName("long", o, n);
      }
    },
  };
function addLeadingZeros$1(e, t) {
  for (var r = e < 0 ? "-" : "", n = Math.abs(e).toString(); n.length < t; )
    n = "0" + n;
  return r + n;
}
function formatTimezone$1(e, t) {
  var r = t || "",
    n = e > 0 ? "-" : "+",
    o = Math.abs(e);
  return (
    n +
    addLeadingZeros$1(Math.floor(o / 60), 2) +
    r +
    addLeadingZeros$1(o % 60, 2)
  );
}
function formatTimezoneWithOptionalMinutes$1(e, t) {
  return e % 60 == 0
    ? (e > 0 ? "-" : "+") + addLeadingZeros$1(Math.abs(e) / 60, 2)
    : formatTimezone$1(e, t);
}
function formatTimezoneShort$1(e, t) {
  var r = e > 0 ? "-" : "+",
    n = Math.abs(e),
    o = Math.floor(n / 60),
    a = n % 60;
  if (0 === a) return r + String(o);
  var i = t || "";
  return r + String(o) + i + addLeadingZeros$1(a, 2);
}
var MILLISECONDS_IN_HOUR$1 = 36e5,
  MILLISECONDS_IN_MINUTE$3 = 6e4,
  DEFAULT_ADDITIONAL_DIGITS = 2,
  patterns$1 = {
    dateTimeDelimeter: /[T ]/,
    plainTime: /:/,
    timeZoneDelimeter: /[Z ]/i,
    YY: /^(\d{2})$/,
    YYY: [/^([+-]\d{2})$/, /^([+-]\d{3})$/, /^([+-]\d{4})$/],
    YYYY: /^(\d{4})/,
    YYYYY: [/^([+-]\d{4})/, /^([+-]\d{5})/, /^([+-]\d{6})/],
    MM: /^-(\d{2})$/,
    DDD: /^-?(\d{3})$/,
    MMDD: /^-?(\d{2})-?(\d{2})$/,
    Www: /^-?W(\d{2})$/,
    WwwD: /^-?W(\d{2})-?(\d{1})$/,
    HH: /^(\d{2}([.,]\d*)?)$/,
    HHMM: /^(\d{2}):?(\d{2}([.,]\d*)?)$/,
    HHMMSS: /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/,
    timezone: /([Z+-].*| UTC|(?:[a-zA-Z]+\/[a-zA-Z_]+(?:\/[a-zA-Z_]+)?))$/,
  };
function toDate$1(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only " + arguments.length + " present"
    );
  if (null === e) return new Date(NaN);
  var r = t || {},
    n =
      null == r.additionalDigits
        ? DEFAULT_ADDITIONAL_DIGITS
        : toInteger(r.additionalDigits);
  if (2 !== n && 1 !== n && 0 !== n)
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  if (
    e instanceof Date ||
    ("object" == typeof e &&
      "[object Date]" === Object.prototype.toString.call(e))
  )
    return new Date(e.getTime());
  if (
    "number" == typeof e ||
    "[object Number]" === Object.prototype.toString.call(e)
  )
    return new Date(e);
  if (
    "string" != typeof e &&
    "[object String]" !== Object.prototype.toString.call(e)
  )
    return new Date(NaN);
  var o = splitDateString(e),
    a = parseYear$1(o.date, n),
    i = a.year,
    s = a.restDateString,
    u = parseDate(s, i);
  if (isNaN(u)) return new Date(NaN);
  if (u) {
    var c,
      l = u.getTime(),
      f = 0;
    if (o.time && ((f = parseTime(o.time)), isNaN(f))) return new Date(NaN);
    if (o.timezone || r.timeZone) {
      if (
        ((c = tzParseTimezone(o.timezone || r.timeZone, new Date(l + f))),
        isNaN(c))
      )
        return new Date(NaN);
    } else
      (c = getTimezoneOffsetInMilliseconds(new Date(l + f))),
        (c = getTimezoneOffsetInMilliseconds(new Date(l + f + c)));
    return new Date(l + f + c);
  }
  return new Date(NaN);
}
function splitDateString(e) {
  var t,
    r = {},
    n = e.split(patterns$1.dateTimeDelimeter);
  if (
    (patterns$1.plainTime.test(n[0])
      ? ((r.date = null), (t = n[0]))
      : ((r.date = n[0]),
        (t = n[1]),
        (r.timezone = n[2]),
        patterns$1.timeZoneDelimeter.test(r.date) &&
          ((r.date = e.split(patterns$1.timeZoneDelimeter)[0]),
          (t = e.substr(r.date.length, e.length)))),
    t)
  ) {
    var o = patterns$1.timezone.exec(t);
    o ? ((r.time = t.replace(o[1], "")), (r.timezone = o[1])) : (r.time = t);
  }
  return r;
}
function parseYear$1(e, t) {
  var r,
    n = patterns$1.YYY[t],
    o = patterns$1.YYYYY[t];
  if ((r = patterns$1.YYYY.exec(e) || o.exec(e))) {
    var a = r[1];
    return {
      year: parseInt(a, 10),
      restDateString: e.slice(a.length),
    };
  }
  if ((r = patterns$1.YY.exec(e) || n.exec(e))) {
    var i = r[1];
    return {
      year: 100 * parseInt(i, 10),
      restDateString: e.slice(i.length),
    };
  }
  return {
    year: null,
  };
}
function parseDate(e, t) {
  if (null === t) return null;
  var r, n, o, a;
  if (0 === e.length) return (n = new Date(0)).setUTCFullYear(t), n;
  if ((r = patterns$1.MM.exec(e)))
    return (
      (n = new Date(0)),
      validateDate(t, (o = parseInt(r[1], 10) - 1))
        ? (n.setUTCFullYear(t, o), n)
        : new Date(NaN)
    );
  if ((r = patterns$1.DDD.exec(e))) {
    n = new Date(0);
    var i = parseInt(r[1], 10);
    return validateDayOfYearDate(t, i)
      ? (n.setUTCFullYear(t, 0, i), n)
      : new Date(NaN);
  }
  if ((r = patterns$1.MMDD.exec(e))) {
    (n = new Date(0)), (o = parseInt(r[1], 10) - 1);
    var s = parseInt(r[2], 10);
    return validateDate(t, o, s)
      ? (n.setUTCFullYear(t, o, s), n)
      : new Date(NaN);
  }
  if ((r = patterns$1.Www.exec(e)))
    return validateWeekDate(t, (a = parseInt(r[1], 10) - 1))
      ? dayOfISOWeekYear(t, a)
      : new Date(NaN);
  if ((r = patterns$1.WwwD.exec(e))) {
    a = parseInt(r[1], 10) - 1;
    var u = parseInt(r[2], 10) - 1;
    return validateWeekDate(t, a, u)
      ? dayOfISOWeekYear(t, a, u)
      : new Date(NaN);
  }
  return null;
}
function parseTime(e) {
  var t, r, n;
  if ((t = patterns$1.HH.exec(e)))
    return validateTime((r = parseFloat(t[1].replace(",", "."))))
      ? (r % 24) * MILLISECONDS_IN_HOUR$1
      : NaN;
  if ((t = patterns$1.HHMM.exec(e)))
    return validateTime(
      (r = parseInt(t[1], 10)),
      (n = parseFloat(t[2].replace(",", ".")))
    )
      ? (r % 24) * MILLISECONDS_IN_HOUR$1 + n * MILLISECONDS_IN_MINUTE$3
      : NaN;
  if ((t = patterns$1.HHMMSS.exec(e))) {
    (r = parseInt(t[1], 10)), (n = parseInt(t[2], 10));
    var o = parseFloat(t[3].replace(",", "."));
    return validateTime(r, n, o)
      ? (r % 24) * MILLISECONDS_IN_HOUR$1 +
          n * MILLISECONDS_IN_MINUTE$3 +
          1e3 * o
      : NaN;
  }
  return null;
}
function dayOfISOWeekYear(e, t, r) {
  (t = t || 0), (r = r || 0);
  var n = new Date(0);
  n.setUTCFullYear(e, 0, 4);
  var o = 7 * t + r + 1 - (n.getUTCDay() || 7);
  return n.setUTCDate(n.getUTCDate() + o), n;
}
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex(e) {
  return e % 400 == 0 || (e % 4 == 0 && e % 100 != 0);
}
function validateDate(e, t, r) {
  if (t < 0 || t > 11) return !1;
  if (null != r) {
    if (r < 1) return !1;
    var n = isLeapYearIndex(e);
    if (n && r > DAYS_IN_MONTH_LEAP_YEAR[t]) return !1;
    if (!n && r > DAYS_IN_MONTH[t]) return !1;
  }
  return !0;
}
function validateDayOfYearDate(e, t) {
  if (t < 1) return !1;
  var r = isLeapYearIndex(e);
  return !((r && t > 366) || (!r && t > 365));
}
function validateWeekDate(e, t, r) {
  return !(t < 0 || t > 52 || (null != r && (r < 0 || r > 6)));
}
function validateTime(e, t, r) {
  return !(
    (null != e && (e < 0 || e >= 25)) ||
    (null != t && (t < 0 || t >= 60)) ||
    (null != r && (r < 0 || r >= 60))
  );
}
var tzFormattingTokensRegExp = /([xXOz]+)|''|'(''|[^'])+('|$)/g;
function format$2(e, t, r) {
  var n = String(t),
    o = r || {},
    a = n.match(tzFormattingTokensRegExp);
  if (a) {
    var i = toDate$1(e, o);
    n = a.reduce(function (e, t) {
      return "'" === t[0]
        ? e
        : e.replace(t, "'" + formatters$2[t[0]](i, t, null, o) + "'");
    }, n);
  }
  return format$1(e, n, o);
}
function utcToZonedTime(e, t, r) {
  var n = toDate$1(e, r),
    o = new Date(
      n.getUTCFullYear(),
      n.getUTCMonth(),
      n.getUTCDate(),
      n.getUTCHours(),
      n.getUTCMinutes(),
      n.getUTCSeconds(),
      n.getUTCMilliseconds()
    ),
    a = tzParseTimezone(t, n);
  return a ? subMilliseconds(o, a) : o;
}
function assign$2(e, t) {
  if (null == e)
    throw new TypeError(
      "assign requires that input parameter not be null or undefined"
    );
  for (var r in (t = t || {})) t.hasOwnProperty(r) && (e[r] = t[r]);
  return e;
}
function cloneObject(e) {
  return assign$2({}, e);
}
function zonedTimeToUtc(e, t, r) {
  e instanceof Date && (e = format$1(e, "yyyy-MM-dd'T'HH:mm:ss.SSS"));
  var n = cloneObject(r);
  return (n.timeZone = t), toDate$1(e, n);
}
var stringTag$3 = "[object String]";
function isString(e) {
  return (
    "string" == typeof e ||
    (!isArray_1(e) && isObjectLike_1(e) && _baseGetTag(e) == stringTag$3)
  );
}
var isString_1 = isString;
function baseProperty(e) {
  return function (t) {
    return null == t ? void 0 : t[e];
  };
}
var _baseProperty = baseProperty,
  asciiSize = _baseProperty("length"),
  _asciiSize = asciiSize,
  rsAstralRange = "\\ud800-\\udfff",
  rsComboMarksRange = "\\u0300-\\u036f",
  reComboHalfMarksRange = "\\ufe20-\\ufe2f",
  rsComboSymbolsRange = "\\u20d0-\\u20ff",
  rsComboRange =
    rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
  rsVarRange = "\\ufe0e\\ufe0f",
  rsZWJ = "\\u200d",
  reHasUnicode = RegExp(
    "[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]"
  );
function hasUnicode(e) {
  return reHasUnicode.test(e);
}
var _hasUnicode = hasUnicode,
  rsAstralRange$1 = "\\ud800-\\udfff",
  rsComboMarksRange$1 = "\\u0300-\\u036f",
  reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f",
  rsComboSymbolsRange$1 = "\\u20d0-\\u20ff",
  rsComboRange$1 =
    rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
  rsVarRange$1 = "\\ufe0e\\ufe0f",
  rsAstral = "[" + rsAstralRange$1 + "]",
  rsCombo = "[" + rsComboRange$1 + "]",
  rsFitz = "\\ud83c[\\udffb-\\udfff]",
  rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")",
  rsNonAstral = "[^" + rsAstralRange$1 + "]",
  rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}",
  rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]",
  rsZWJ$1 = "\\u200d",
  reOptMod = rsModifier + "?",
  rsOptVar = "[" + rsVarRange$1 + "]?",
  rsOptJoin =
    "(?:" +
    rsZWJ$1 +
    "(?:" +
    [rsNonAstral, rsRegional, rsSurrPair].join("|") +
    ")" +
    rsOptVar +
    reOptMod +
    ")*",
  rsSeq = rsOptVar + reOptMod + rsOptJoin,
  rsSymbol =
    "(?:" +
    [
      rsNonAstral + rsCombo + "?",
      rsCombo,
      rsRegional,
      rsSurrPair,
      rsAstral,
    ].join("|") +
    ")",
  reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
function unicodeSize(e) {
  for (var t = (reUnicode.lastIndex = 0); reUnicode.test(e); ) ++t;
  return t;
}
var _unicodeSize = unicodeSize;
function stringSize(e) {
  return _hasUnicode(e) ? _unicodeSize(e) : _asciiSize(e);
}
var _stringSize = stringSize,
  mapTag$5 = "[object Map]",
  setTag$5 = "[object Set]";
function size(e) {
  if (null == e) return 0;
  if (isArrayLike_1(e)) return isString_1(e) ? _stringSize(e) : e.length;
  var t = _getTag(e);
  return t == mapTag$5 || t == setTag$5 ? e.size : _baseKeys(e).length;
}
var size_1 = size,
  HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
function setCacheAdd(e) {
  return this.__data__.set(e, HASH_UNDEFINED$2), this;
}
var _setCacheAdd = setCacheAdd;
function setCacheHas(e) {
  return this.__data__.has(e);
}
var _setCacheHas = setCacheHas;
function SetCache(e) {
  var t = -1,
    r = null == e ? 0 : e.length;
  for (this.__data__ = new _MapCache(); ++t < r; ) this.add(e[t]);
}
(SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd),
  (SetCache.prototype.has = _setCacheHas);
var _SetCache = SetCache;
function arraySome(e, t) {
  for (var r = -1, n = null == e ? 0 : e.length; ++r < n; )
    if (t(e[r], r, e)) return !0;
  return !1;
}
var _arraySome = arraySome;
function cacheHas(e, t) {
  return e.has(t);
}
var _cacheHas = cacheHas,
  COMPARE_PARTIAL_FLAG = 1,
  COMPARE_UNORDERED_FLAG = 2;
function equalArrays(e, t, r, n, o, a) {
  var i = r & COMPARE_PARTIAL_FLAG,
    s = e.length,
    u = t.length;
  if (s != u && !(i && u > s)) return !1;
  var c = a.get(e);
  if (c && a.get(t)) return c == t;
  var l = -1,
    f = !0,
    p = r & COMPARE_UNORDERED_FLAG ? new _SetCache() : void 0;
  for (a.set(e, t), a.set(t, e); ++l < s; ) {
    var d = e[l],
      h = t[l];
    if (n) var g = i ? n(h, d, l, t, e, a) : n(d, h, l, e, t, a);
    if (void 0 !== g) {
      if (g) continue;
      f = !1;
      break;
    }
    if (p) {
      if (
        !_arraySome(t, function (e, t) {
          if (!_cacheHas(p, t) && (d === e || o(d, e, r, n, a)))
            return p.push(t);
        })
      ) {
        f = !1;
        break;
      }
    } else if (d !== h && !o(d, h, r, n, a)) {
      f = !1;
      break;
    }
  }
  return a.delete(e), a.delete(t), f;
}
var _equalArrays = equalArrays;
function mapToArray(e) {
  var t = -1,
    r = Array(e.size);
  return (
    e.forEach(function (e, n) {
      r[++t] = [n, e];
    }),
    r
  );
}
var _mapToArray = mapToArray;
function setToArray(e) {
  var t = -1,
    r = Array(e.size);
  return (
    e.forEach(function (e) {
      r[++t] = e;
    }),
    r
  );
}
var _setToArray = setToArray,
  COMPARE_PARTIAL_FLAG$1 = 1,
  COMPARE_UNORDERED_FLAG$1 = 2,
  boolTag$3 = "[object Boolean]",
  dateTag$3 = "[object Date]",
  errorTag$2 = "[object Error]",
  mapTag$6 = "[object Map]",
  numberTag$3 = "[object Number]",
  regexpTag$3 = "[object RegExp]",
  setTag$6 = "[object Set]",
  stringTag$4 = "[object String]",
  symbolTag$2 = "[object Symbol]",
  arrayBufferTag$3 = "[object ArrayBuffer]",
  dataViewTag$4 = "[object DataView]",
  symbolProto$1 = _Symbol ? _Symbol.prototype : void 0,
  symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
function equalByTag(e, t, r, n, o, a, i) {
  switch (r) {
    case dataViewTag$4:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      (e = e.buffer), (t = t.buffer);
    case arrayBufferTag$3:
      return !(
        e.byteLength != t.byteLength ||
        !a(new _Uint8Array(e), new _Uint8Array(t))
      );
    case boolTag$3:
    case dateTag$3:
    case numberTag$3:
      return eq_1(+e, +t);
    case errorTag$2:
      return e.name == t.name && e.message == t.message;
    case regexpTag$3:
    case stringTag$4:
      return e == t + "";
    case mapTag$6:
      var s = _mapToArray;
    case setTag$6:
      var u = n & COMPARE_PARTIAL_FLAG$1;
      if ((s || (s = _setToArray), e.size != t.size && !u)) return !1;
      var c = i.get(e);
      if (c) return c == t;
      (n |= COMPARE_UNORDERED_FLAG$1), i.set(e, t);
      var l = _equalArrays(s(e), s(t), n, o, a, i);
      return i.delete(e), l;
    case symbolTag$2:
      if (symbolValueOf$1)
        return symbolValueOf$1.call(e) == symbolValueOf$1.call(t);
  }
  return !1;
}
var _equalByTag = equalByTag,
  COMPARE_PARTIAL_FLAG$2 = 1,
  objectProto$d = Object.prototype,
  hasOwnProperty$b = objectProto$d.hasOwnProperty;
function equalObjects(e, t, r, n, o, a) {
  var i = r & COMPARE_PARTIAL_FLAG$2,
    s = _getAllKeys(e),
    u = s.length;
  if (u != _getAllKeys(t).length && !i) return !1;
  for (var c = u; c--; ) {
    var l = s[c];
    if (!(i ? l in t : hasOwnProperty$b.call(t, l))) return !1;
  }
  var f = a.get(e);
  if (f && a.get(t)) return f == t;
  var p = !0;
  a.set(e, t), a.set(t, e);
  for (var d = i; ++c < u; ) {
    var h = e[(l = s[c])],
      g = t[l];
    if (n) var m = i ? n(g, h, l, t, e, a) : n(h, g, l, e, t, a);
    if (!(void 0 === m ? h === g || o(h, g, r, n, a) : m)) {
      p = !1;
      break;
    }
    d || (d = "constructor" == l);
  }
  if (p && !d) {
    var y = e.constructor,
      b = t.constructor;
    y == b ||
      !("constructor" in e) ||
      !("constructor" in t) ||
      ("function" == typeof y &&
        y instanceof y &&
        "function" == typeof b &&
        b instanceof b) ||
      (p = !1);
  }
  return a.delete(e), a.delete(t), p;
}
var _equalObjects = equalObjects,
  COMPARE_PARTIAL_FLAG$3 = 1,
  argsTag$3 = "[object Arguments]",
  arrayTag$2 = "[object Array]",
  objectTag$3 = "[object Object]",
  objectProto$e = Object.prototype,
  hasOwnProperty$c = objectProto$e.hasOwnProperty;
function baseIsEqualDeep(e, t, r, n, o, a) {
  var i = isArray_1(e),
    s = isArray_1(t),
    u = i ? arrayTag$2 : _getTag(e),
    c = s ? arrayTag$2 : _getTag(t),
    l = (u = u == argsTag$3 ? objectTag$3 : u) == objectTag$3,
    f = (c = c == argsTag$3 ? objectTag$3 : c) == objectTag$3,
    p = u == c;
  if (p && isBuffer_1(e)) {
    if (!isBuffer_1(t)) return !1;
    (i = !0), (l = !1);
  }
  if (p && !l)
    return (
      a || (a = new _Stack()),
      i || isTypedArray_1(e)
        ? _equalArrays(e, t, r, n, o, a)
        : _equalByTag(e, t, u, r, n, o, a)
    );
  if (!(r & COMPARE_PARTIAL_FLAG$3)) {
    var d = l && hasOwnProperty$c.call(e, "__wrapped__"),
      h = f && hasOwnProperty$c.call(t, "__wrapped__");
    if (d || h) {
      var g = d ? e.value() : e,
        m = h ? t.value() : t;
      return a || (a = new _Stack()), o(g, m, r, n, a);
    }
  }
  return !!p && (a || (a = new _Stack()), _equalObjects(e, t, r, n, o, a));
}
var _baseIsEqualDeep = baseIsEqualDeep;
function baseIsEqual(e, t, r, n, o) {
  return (
    e === t ||
    (null == e || null == t || (!isObjectLike_1(e) && !isObjectLike_1(t))
      ? e != e && t != t
      : _baseIsEqualDeep(e, t, r, n, baseIsEqual, o))
  );
}
var _baseIsEqual = baseIsEqual,
  COMPARE_PARTIAL_FLAG$4 = 1,
  COMPARE_UNORDERED_FLAG$2 = 2;
function baseIsMatch(e, t, r, n) {
  var o = r.length,
    a = o,
    i = !n;
  if (null == e) return !a;
  for (e = Object(e); o--; ) {
    var s = r[o];
    if (i && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1;
  }
  for (; ++o < a; ) {
    var u = (s = r[o])[0],
      c = e[u],
      l = s[1];
    if (i && s[2]) {
      if (void 0 === c && !(u in e)) return !1;
    } else {
      var f = new _Stack();
      if (n) var p = n(c, l, u, e, t, f);
      if (
        !(void 0 === p
          ? _baseIsEqual(
              l,
              c,
              COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2,
              n,
              f
            )
          : p)
      )
        return !1;
    }
  }
  return !0;
}
var _baseIsMatch = baseIsMatch;
function isStrictComparable(e) {
  return e == e && !isObject_1(e);
}
var _isStrictComparable = isStrictComparable;
function getMatchData(e) {
  for (var t = keys_1(e), r = t.length; r--; ) {
    var n = t[r],
      o = e[n];
    t[r] = [n, o, _isStrictComparable(o)];
  }
  return t;
}
var _getMatchData = getMatchData;
function matchesStrictComparable(e, t) {
  return function (r) {
    return null != r && r[e] === t && (void 0 !== t || e in Object(r));
  };
}
var _matchesStrictComparable = matchesStrictComparable;
function baseMatches(e) {
  var t = _getMatchData(e);
  return 1 == t.length && t[0][2]
    ? _matchesStrictComparable(t[0][0], t[0][1])
    : function (r) {
        return r === e || _baseIsMatch(r, e, t);
      };
}
var _baseMatches = baseMatches,
  symbolTag$3 = "[object Symbol]";
function isSymbol(e) {
  return (
    "symbol" == typeof e || (isObjectLike_1(e) && _baseGetTag(e) == symbolTag$3)
  );
}
var isSymbol_1 = isSymbol,
  reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  reIsPlainProp = /^\w*$/;
function isKey(e, t) {
  if (isArray_1(e)) return !1;
  var r = typeof e;
  return (
    !(
      "number" != r &&
      "symbol" != r &&
      "boolean" != r &&
      null != e &&
      !isSymbol_1(e)
    ) ||
    reIsPlainProp.test(e) ||
    !reIsDeepProp.test(e) ||
    (null != t && e in Object(t))
  );
}
var _isKey = isKey,
  FUNC_ERROR_TEXT = "Expected a function";
function memoize(e, t) {
  if ("function" != typeof e || (null != t && "function" != typeof t))
    throw new TypeError(FUNC_ERROR_TEXT);
  var r = function () {
    var n = arguments,
      o = t ? t.apply(this, n) : n[0],
      a = r.cache;
    if (a.has(o)) return a.get(o);
    var i = e.apply(this, n);
    return (r.cache = a.set(o, i) || a), i;
  };
  return (r.cache = new (memoize.Cache || _MapCache)()), r;
}
memoize.Cache = _MapCache;
var memoize_1 = memoize,
  MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(e) {
  var t = memoize_1(e, function (e) {
      return r.size === MAX_MEMOIZE_SIZE && r.clear(), e;
    }),
    r = t.cache;
  return t;
}
var _memoizeCapped = memoizeCapped,
  rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
  reEscapeChar = /\\(\\)?/g,
  stringToPath = _memoizeCapped(function (e) {
    var t = [];
    return (
      46 === e.charCodeAt(0) && t.push(""),
      e.replace(rePropName, function (e, r, n, o) {
        t.push(n ? o.replace(reEscapeChar, "$1") : r || e);
      }),
      t
    );
  }),
  _stringToPath = stringToPath;
function arrayMap(e, t) {
  for (var r = -1, n = null == e ? 0 : e.length, o = Array(n); ++r < n; )
    o[r] = t(e[r], r, e);
  return o;
}
var _arrayMap = arrayMap,
  INFINITY = 1 / 0,
  symbolProto$2 = _Symbol ? _Symbol.prototype : void 0,
  symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
function baseToString(e) {
  if ("string" == typeof e) return e;
  if (isArray_1(e)) return _arrayMap(e, baseToString) + "";
  if (isSymbol_1(e)) return symbolToString ? symbolToString.call(e) : "";
  var t = e + "";
  return "0" == t && 1 / e == -INFINITY ? "-0" : t;
}
var _baseToString = baseToString;
function toString$1(e) {
  return null == e ? "" : _baseToString(e);
}
var toString_1 = toString$1;
function castPath(e, t) {
  return isArray_1(e) ? e : _isKey(e, t) ? [e] : _stringToPath(toString_1(e));
}
var _castPath = castPath,
  INFINITY$1 = 1 / 0;
function toKey(e) {
  if ("string" == typeof e || isSymbol_1(e)) return e;
  var t = e + "";
  return "0" == t && 1 / e == -INFINITY$1 ? "-0" : t;
}
var _toKey = toKey;
function baseGet(e, t) {
  for (var r = 0, n = (t = _castPath(t, e)).length; null != e && r < n; )
    e = e[_toKey(t[r++])];
  return r && r == n ? e : void 0;
}
var _baseGet = baseGet;
function get(e, t, r) {
  var n = null == e ? void 0 : _baseGet(e, t);
  return void 0 === n ? r : n;
}
var get_1 = get;
function baseHasIn(e, t) {
  return null != e && t in Object(e);
}
var _baseHasIn = baseHasIn;
function hasPath(e, t, r) {
  for (var n = -1, o = (t = _castPath(t, e)).length, a = !1; ++n < o; ) {
    var i = _toKey(t[n]);
    if (!(a = null != e && r(e, i))) break;
    e = e[i];
  }
  return a || ++n != o
    ? a
    : !!(o = null == e ? 0 : e.length) &&
        isLength_1(o) &&
        _isIndex(i, o) &&
        (isArray_1(e) || isArguments_1(e));
}
var _hasPath = hasPath;
function hasIn(e, t) {
  return null != e && _hasPath(e, t, _baseHasIn);
}
var hasIn_1 = hasIn,
  COMPARE_PARTIAL_FLAG$5 = 1,
  COMPARE_UNORDERED_FLAG$3 = 2;
function baseMatchesProperty(e, t) {
  return _isKey(e) && _isStrictComparable(t)
    ? _matchesStrictComparable(_toKey(e), t)
    : function (r) {
        var n = get_1(r, e);
        return void 0 === n && n === t
          ? hasIn_1(r, e)
          : _baseIsEqual(
              t,
              n,
              COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3
            );
      };
}
var _baseMatchesProperty = baseMatchesProperty;
function basePropertyDeep(e) {
  return function (t) {
    return _baseGet(t, e);
  };
}
var _basePropertyDeep = basePropertyDeep;
function property(e) {
  return _isKey(e) ? _baseProperty(_toKey(e)) : _basePropertyDeep(e);
}
var property_1 = property;
function baseIteratee(e) {
  return "function" == typeof e
    ? e
    : null == e
    ? identity_1
    : "object" == typeof e
    ? isArray_1(e)
      ? _baseMatchesProperty(e[0], e[1])
      : _baseMatches(e)
    : property_1(e);
}
var _baseIteratee = baseIteratee;
function last(e) {
  var t = null == e ? 0 : e.length;
  return t ? e[t - 1] : void 0;
}
var last_1 = last;
function baseSlice(e, t, r) {
  var n = -1,
    o = e.length;
  t < 0 && (t = -t > o ? 0 : o + t),
    (r = r > o ? o : r) < 0 && (r += o),
    (o = t > r ? 0 : (r - t) >>> 0),
    (t >>>= 0);
  for (var a = Array(o); ++n < o; ) a[n] = e[n + t];
  return a;
}
var _baseSlice = baseSlice;
function parent(e, t) {
  return t.length < 2 ? e : _baseGet(e, _baseSlice(t, 0, -1));
}
var _parent = parent;
function baseUnset(e, t) {
  return (
    (t = _castPath(t, e)),
    null == (e = _parent(e, t)) || delete e[_toKey(last_1(t))]
  );
}
var _baseUnset = baseUnset,
  arrayProto$1 = Array.prototype,
  splice$1 = arrayProto$1.splice;
function basePullAt(e, t) {
  for (var r = e ? t.length : 0, n = r - 1; r--; ) {
    var o = t[r];
    if (r == n || o !== a) {
      var a = o;
      _isIndex(o) ? splice$1.call(e, o, 1) : _baseUnset(e, o);
    }
  }
  return e;
}
var _basePullAt = basePullAt;
function remove(e, t) {
  var r = [];
  if (!e || !e.length) return r;
  var n = -1,
    o = [],
    a = e.length;
  for (t = _baseIteratee(t); ++n < a; ) {
    var i = e[n];
    t(i, n, e) && (r.push(i), o.push(n));
  }
  return _basePullAt(e, o), r;
}
var remove_1 = remove;
function isEqual(e, t) {
  return _baseIsEqual(e, t);
}
var isEqual_1 = isEqual,
  now$1 = function () {
    return _root.Date.now();
  },
  now_1 = now$1,
  NAN = NaN,
  reTrim = /^\s+|\s+$/g,
  reIsBadHex = /^[-+]0x[0-9a-f]+$/i,
  reIsBinary = /^0b[01]+$/i,
  reIsOctal = /^0o[0-7]+$/i,
  freeParseInt = parseInt;
function toNumber(e) {
  if ("number" == typeof e) return e;
  if (isSymbol_1(e)) return NAN;
  if (isObject_1(e)) {
    var t = "function" == typeof e.valueOf ? e.valueOf() : e;
    e = isObject_1(t) ? t + "" : t;
  }
  if ("string" != typeof e) return 0 === e ? e : +e;
  e = e.replace(reTrim, "");
  var r = reIsBinary.test(e);
  return r || reIsOctal.test(e)
    ? freeParseInt(e.slice(2), r ? 2 : 8)
    : reIsBadHex.test(e)
    ? NAN
    : +e;
}
var toNumber_1 = toNumber,
  FUNC_ERROR_TEXT$1 = "Expected a function",
  nativeMax = Math.max,
  nativeMin = Math.min;
function debounce(e, t, r) {
  var n,
    o,
    a,
    i,
    s,
    u,
    c = 0,
    l = !1,
    f = !1,
    p = !0;
  if ("function" != typeof e) throw new TypeError(FUNC_ERROR_TEXT$1);
  function d(t) {
    var r = n,
      a = o;
    return (n = o = void 0), (c = t), (i = e.apply(a, r));
  }
  function h(e) {
    return (c = e), (s = setTimeout(m, t)), l ? d(e) : i;
  }
  function g(e) {
    var r = e - u;
    return void 0 === u || r >= t || r < 0 || (f && e - c >= a);
  }
  function m() {
    var e = now_1();
    if (g(e)) return y(e);
    s = setTimeout(
      m,
      (function (e) {
        var r = t - (e - u);
        return f ? nativeMin(r, a - (e - c)) : r;
      })(e)
    );
  }
  function y(e) {
    return (s = void 0), p && n ? d(e) : ((n = o = void 0), i);
  }
  function b() {
    var e = now_1(),
      r = g(e);
    if (((n = arguments), (o = this), (u = e), r)) {
      if (void 0 === s) return h(u);
      if (f) return clearTimeout(s), (s = setTimeout(m, t)), d(u);
    }
    return void 0 === s && (s = setTimeout(m, t)), i;
  }
  return (
    (t = toNumber_1(t) || 0),
    isObject_1(r) &&
      ((l = !!r.leading),
      (a = (f = "maxWait" in r) ? nativeMax(toNumber_1(r.maxWait) || 0, t) : a),
      (p = "trailing" in r ? !!r.trailing : p)),
    (b.cancel = function () {
      void 0 !== s && clearTimeout(s), (c = 0), (n = u = o = s = void 0);
    }),
    (b.flush = function () {
      return void 0 === s ? i : y(now_1());
    }),
    b
  );
}
var debounce_1 = debounce;
function isIterateeCall(e, t, r) {
  if (!isObject_1(r)) return !1;
  var n = typeof t;
  return (
    !!("number" == n
      ? isArrayLike_1(r) && _isIndex(t, r.length)
      : "string" == n && t in r) && eq_1(r[t], e)
  );
}
var _isIterateeCall = isIterateeCall,
  INFINITY$2 = 1 / 0,
  MAX_INTEGER = 17976931348623157e292;
function toFinite(e) {
  return e
    ? (e = toNumber_1(e)) === INFINITY$2 || e === -INFINITY$2
      ? (e < 0 ? -1 : 1) * MAX_INTEGER
      : e == e
      ? e
      : 0
    : 0 === e
    ? e
    : 0;
}
var toFinite_1 = toFinite;
function toInteger$1(e) {
  var t = toFinite_1(e),
    r = t % 1;
  return t == t ? (r ? t - r : t) : 0;
}
var toInteger_1 = toInteger$1,
  nativeCeil = Math.ceil,
  nativeMax$1 = Math.max;
function chunk(e, t, r) {
  t = (r ? _isIterateeCall(e, t, r) : void 0 === t)
    ? 1
    : nativeMax$1(toInteger_1(t), 0);
  var n = null == e ? 0 : e.length;
  if (!n || t < 1) return [];
  for (var o = 0, a = 0, i = Array(nativeCeil(n / t)); o < n; )
    i[a++] = _baseSlice(e, o, (o += t));
  return i;
}
var chunk_1 = chunk,
  spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : void 0;
function isFlattenable(e) {
  return (
    isArray_1(e) ||
    isArguments_1(e) ||
    !!(spreadableSymbol && e && e[spreadableSymbol])
  );
}
var _isFlattenable = isFlattenable;
function baseFlatten(e, t, r, n, o) {
  var a = -1,
    i = e.length;
  for (r || (r = _isFlattenable), o || (o = []); ++a < i; ) {
    var s = e[a];
    t > 0 && r(s)
      ? t > 1
        ? baseFlatten(s, t - 1, r, n, o)
        : _arrayPush(o, s)
      : n || (o[o.length] = s);
  }
  return o;
}
var _baseFlatten = baseFlatten;
function createBaseFor(e) {
  return function (t, r, n) {
    for (var o = -1, a = Object(t), i = n(t), s = i.length; s--; ) {
      var u = i[e ? s : ++o];
      if (!1 === r(a[u], u, a)) break;
    }
    return t;
  };
}
var _createBaseFor = createBaseFor,
  baseFor = _createBaseFor(),
  _baseFor = baseFor;
function baseForOwn(e, t) {
  return e && _baseFor(e, t, keys_1);
}
var _baseForOwn = baseForOwn;
function createBaseEach(e, t) {
  return function (r, n) {
    if (null == r) return r;
    if (!isArrayLike_1(r)) return e(r, n);
    for (
      var o = r.length, a = t ? o : -1, i = Object(r);
      (t ? a-- : ++a < o) && !1 !== n(i[a], a, i);

    );
    return r;
  };
}
var _createBaseEach = createBaseEach,
  baseEach = _createBaseEach(_baseForOwn),
  _baseEach = baseEach;
function baseMap(e, t) {
  var r = -1,
    n = isArrayLike_1(e) ? Array(e.length) : [];
  return (
    _baseEach(e, function (e, o, a) {
      n[++r] = t(e, o, a);
    }),
    n
  );
}
var _baseMap = baseMap;
function baseSortBy(e, t) {
  var r = e.length;
  for (e.sort(t); r--; ) e[r] = e[r].value;
  return e;
}
var _baseSortBy = baseSortBy;
function compareAscending(e, t) {
  if (e !== t) {
    var r = void 0 !== e,
      n = null === e,
      o = e == e,
      a = isSymbol_1(e),
      i = void 0 !== t,
      s = null === t,
      u = t == t,
      c = isSymbol_1(t);
    if (
      (!s && !c && !a && e > t) ||
      (a && i && u && !s && !c) ||
      (n && i && u) ||
      (!r && u) ||
      !o
    )
      return 1;
    if (
      (!n && !a && !c && e < t) ||
      (c && r && o && !n && !a) ||
      (s && r && o) ||
      (!i && o) ||
      !u
    )
      return -1;
  }
  return 0;
}
var _compareAscending = compareAscending;
function compareMultiple(e, t, r) {
  for (
    var n = -1, o = e.criteria, a = t.criteria, i = o.length, s = r.length;
    ++n < i;

  ) {
    var u = _compareAscending(o[n], a[n]);
    if (u) return n >= s ? u : u * ("desc" == r[n] ? -1 : 1);
  }
  return e.index - t.index;
}
var _compareMultiple = compareMultiple;
function baseOrderBy(e, t, r) {
  var n = -1;
  t = _arrayMap(t.length ? t : [identity_1], _baseUnary(_baseIteratee));
  var o = _baseMap(e, function (e, r, o) {
    return {
      criteria: _arrayMap(t, function (t) {
        return t(e);
      }),
      index: ++n,
      value: e,
    };
  });
  return _baseSortBy(o, function (e, t) {
    return _compareMultiple(e, t, r);
  });
}
var _baseOrderBy = baseOrderBy;
function apply(e, t, r) {
  switch (r.length) {
    case 0:
      return e.call(t);
    case 1:
      return e.call(t, r[0]);
    case 2:
      return e.call(t, r[0], r[1]);
    case 3:
      return e.call(t, r[0], r[1], r[2]);
  }
  return e.apply(t, r);
}
var _apply = apply,
  nativeMax$2 = Math.max;
function overRest(e, t, r) {
  return (
    (t = nativeMax$2(void 0 === t ? e.length - 1 : t, 0)),
    function () {
      for (
        var n = arguments,
          o = -1,
          a = nativeMax$2(n.length - t, 0),
          i = Array(a);
        ++o < a;

      )
        i[o] = n[t + o];
      o = -1;
      for (var s = Array(t + 1); ++o < t; ) s[o] = n[o];
      return (s[t] = r(i)), _apply(e, this, s);
    }
  );
}
var _overRest = overRest;
function constant$2(e) {
  return function () {
    return e;
  };
}
var constant_1 = constant$2,
  baseSetToString = _defineProperty
    ? function (e, t) {
        return _defineProperty(e, "toString", {
          configurable: !0,
          enumerable: !1,
          value: constant_1(t),
          writable: !0,
        });
      }
    : identity_1,
  _baseSetToString = baseSetToString,
  HOT_COUNT = 800,
  HOT_SPAN = 16,
  nativeNow = Date.now;
function shortOut(e) {
  var t = 0,
    r = 0;
  return function () {
    var n = nativeNow(),
      o = HOT_SPAN - (n - r);
    if (((r = n), o > 0)) {
      if (++t >= HOT_COUNT) return arguments[0];
    } else t = 0;
    return e.apply(void 0, arguments);
  };
}
var _shortOut = shortOut,
  setToString = _shortOut(_baseSetToString),
  _setToString = setToString;
function baseRest(e, t) {
  return _setToString(_overRest(e, t, identity_1), e + "");
}
var _baseRest = baseRest,
  sortBy = _baseRest(function (e, t) {
    if (null == e) return [];
    var r = t.length;
    return (
      r > 1 && _isIterateeCall(e, t[0], t[1])
        ? (t = [])
        : r > 2 && _isIterateeCall(t[0], t[1], t[2]) && (t = [t[0]]),
      _baseOrderBy(e, _baseFlatten(t, 1), [])
    );
  }),
  sortBy_1 = sortBy,
  nativeIsFinite = _root.isFinite,
  nativeMin$1 = Math.min;
function createRound(e) {
  var t = Math[e];
  return function (e, r) {
    if (
      ((e = toNumber_1(e)),
      (r = null == r ? 0 : nativeMin$1(toInteger_1(r), 292)) &&
        nativeIsFinite(e))
    ) {
      var n = (toString_1(e) + "e").split("e"),
        o = t(n[0] + "e" + (+n[1] + r));
      return +((n = (toString_1(o) + "e").split("e"))[0] + "e" + (+n[1] - r));
    }
    return t(e);
  };
}
var _createRound = createRound,
  round$1 = _createRound("round"),
  round_1 = round$1;
function factorIndexUp(e, t, r, n) {
  const o = Math.ceil((t - e - 1e-9) / r);
  return Math.round(o * n) / n;
}
function factorIndexDw(e, t, r, n) {
  const o = Math.floor((t - e + 1e-9) / r);
  return Math.round(o * n) / n;
}
function factorRoundUp(e, t, r, n = !1) {
  const o = n ? Math.ceil((e - 1e-9) / t) * t : Math.round(e / t) * t;
  return Math.round(o * r) / r;
}
function factorRoundDw(e, t, r, n = !1) {
  const o = n ? Math.floor((e + 1e-9) / t) * t : Math.round(e / t) * t;
  return Math.round(o * r) / r;
}
function getCurrentTimeUnix(e = 5, t = 0) {
  const r = Date.now();
  return r - (r % (6e4 * e)) - t * e * 6e4;
}
function getFutureTimeUnix(e = 5, t = 0) {
  return getCurrentTimeUnix(e, 0) + (1 + t) * e * 6e4;
}
const time = readable(Date.now(), function (e) {
  const t = setInterval(() => {
    e(Date.now());
  }, 1e3);
  return function () {
    clearInterval(t);
  };
});
function roundTime(e, t, r = 0) {
  return e - (e % (60 * t * 1e3)) - r * t * 60 * 1e3;
}
function formatToHHMMSS(e, t) {
  const r = (t - e) / 1e3,
    n = Math.floor(r / 60 / 60),
    o = Math.floor((r - 60 * n * 60) / 60),
    a = Math.floor(r - 60 * n * 60 - 60 * o);
  return 0 === n
    ? minTwoDigits(o) + ":" + minTwoDigits(a)
    : minTwoDigits(n) + ":" + minTwoDigits(o) + ":" + minTwoDigits(a);
}
function minTwoDigits(e) {
  return (e < 10 ? "0" : "") + e;
}
function closest(e, t, ...r) {
  const { dimensions: n = [], rules: o, check: a } = e;
  if (!n.length)
    throw new Error(
      "Please provide a dimensions array in order to use the closest method."
    );
  const i = n.indexOf(r[r.length - 1]);
  if (-1 == i) return closest(e, t, ...r, n[n.length - 2]);
  const s = r.pop();
  for (let e of s) {
    const u = r[i];
    if (
      ((r[i] = e),
      a(
        {
          rules: o,
          dimensions: n,
        },
        ...r
      ))
    )
      return t._dimension
        ? {
            dimension: s,
            dimensionIndex: i,
            value: e,
            conditions: r,
          }
        : t._partial
        ? e
        : r;
    if (((r[i] = u), 0 == i))
      return t._dimension
        ? {
            dimension: null,
            dimensionIndex: null,
            value: null,
            conditions: null,
          }
        : null;
  }
  return closest(e, t, ...r, n[i - 1]);
}
var closest_1 = closest;
function check(e = {}, ...t) {
  const { rules: r = [], dimensions: n = [] } = e;
  if (!r.length)
    throw new Error(
      "Please provide a rules array in order to use the check method."
    );
  if (!t.length)
    throw new Error(
      "Please provide conditions as arguments to the check call."
    );
  const o = ["ALLOW", "DENY"];
  for (let e = 0; e < r.length; e++) {
    const a = r[e].slice(),
      i = a.shift();
    if (!o.includes(i))
      throw new Error(`Unknown action ${i} in rule "${a}" at index ${e}.`);
    if (
      a.every((e, r) =>
        t.length <= r
          ? "ALLOW" == i
          : "*" == e
          ? !n.length || n[r].includes(t[r])
          : (Array.isArray(e) || (e = [e]), e.includes(t[r]))
      )
    )
      return "ALLOW" == i;
  }
  return !1;
}
var check_1 = check;
class Recht {
  constructor() {
    (this.rules = []), (this.dimensions = []);
  }
  check(...e) {
    return Recht.check(this, ...e);
  }
  closest(...e) {
    return Recht.closest(this, ...e);
  }
  closestValue(...e) {
    return Recht.closestValue(this, ...e);
  }
  closestVerbose(...e) {
    return Recht.closestVerbose(this, ...e);
  }
}
(Recht.check = check_1),
  (Recht.closest = (e = {}, ...t) =>
    closest_1(
      {
        ...e,
        check: check_1,
      },
      {},
      ...t
    )),
  (Recht.closestValue = (e = {}, ...t) =>
    closest_1(
      {
        ...e,
        check: check_1,
      },
      {
        _partial: !0,
      },
      ...t
    )),
  (Recht.closestVerbose = (e = {}, ...t) =>
    closest_1(
      {
        ...e,
        check: check_1,
      },
      {
        _dimension: !0,
      },
      ...t
    ));
var recht = Recht;
function addDays(e, t) {
  requiredArgs(2, arguments);
  var r = toDate(e),
    n = toInteger(t);
  return isNaN(n) ? new Date(NaN) : n ? (r.setDate(r.getDate() + n), r) : r;
}
function startOfDay(e) {
  requiredArgs(1, arguments);
  var t = toDate(e);
  return t.setHours(0, 0, 0, 0), t;
}
var MILLISECONDS_IN_DAY$1 = 864e5;
function differenceInCalendarDays(e, t) {
  requiredArgs(2, arguments);
  var r = startOfDay(e),
    n = startOfDay(t),
    o = r.getTime() - getTimezoneOffsetInMilliseconds(r),
    a = n.getTime() - getTimezoneOffsetInMilliseconds(n);
  return Math.round((o - a) / MILLISECONDS_IN_DAY$1);
}
function compareAsc(e, t) {
  requiredArgs(2, arguments);
  var r = toDate(e),
    n = toDate(t),
    o = r.getTime() - n.getTime();
  return o < 0 ? -1 : o > 0 ? 1 : o;
}
function differenceInCalendarMonths(e, t) {
  requiredArgs(2, arguments);
  var r = toDate(e),
    n = toDate(t),
    o = r.getFullYear() - n.getFullYear(),
    a = r.getMonth() - n.getMonth();
  return 12 * o + a;
}
function differenceInMilliseconds(e, t) {
  requiredArgs(2, arguments);
  var r = toDate(e),
    n = toDate(t);
  return r.getTime() - n.getTime();
}
function differenceInMonths(e, t) {
  requiredArgs(2, arguments);
  var r = toDate(e),
    n = toDate(t),
    o = compareAsc(r, n),
    a = Math.abs(differenceInCalendarMonths(r, n));
  r.setMonth(r.getMonth() - o * a);
  var i = compareAsc(r, n) === -o,
    s = o * (a - i);
  return 0 === s ? 0 : s;
}
function differenceInSeconds(e, t) {
  requiredArgs(2, arguments);
  var r = differenceInMilliseconds(e, t) / 1e3;
  return r > 0 ? Math.floor(r) : Math.ceil(r);
}
var MINUTES_IN_DAY = 1440,
  MINUTES_IN_ALMOST_TWO_DAYS = 2520,
  MINUTES_IN_MONTH = 43200,
  MINUTES_IN_TWO_MONTHS = 86400;
function formatDistance$1(e, t, r) {
  requiredArgs(2, arguments);
  var n = r || {},
    o = n.locale || locale$2;
  if (!o.formatDistance)
    throw new RangeError("locale must contain formatDistance property");
  var a = compareAsc(e, t);
  if (isNaN(a)) throw new RangeError("Invalid time value");
  var i,
    s,
    u = cloneObject(n);
  (u.addSuffix = Boolean(n.addSuffix)),
    (u.comparison = a),
    a > 0
      ? ((i = toDate(t)), (s = toDate(e)))
      : ((i = toDate(e)), (s = toDate(t)));
  var c,
    l = differenceInSeconds(s, i),
    f =
      (getTimezoneOffsetInMilliseconds(s) -
        getTimezoneOffsetInMilliseconds(i)) /
      1e3,
    p = Math.round((l - f) / 60);
  if (p < 2)
    return n.includeSeconds
      ? l < 5
        ? o.formatDistance("lessThanXSeconds", 5, u)
        : l < 10
        ? o.formatDistance("lessThanXSeconds", 10, u)
        : l < 20
        ? o.formatDistance("lessThanXSeconds", 20, u)
        : l < 40
        ? o.formatDistance("halfAMinute", null, u)
        : l < 60
        ? o.formatDistance("lessThanXMinutes", 1, u)
        : o.formatDistance("xMinutes", 1, u)
      : 0 === p
      ? o.formatDistance("lessThanXMinutes", 1, u)
      : o.formatDistance("xMinutes", p, u);
  if (p < 45) return o.formatDistance("xMinutes", p, u);
  if (p < 90) return o.formatDistance("aboutXHours", 1, u);
  if (p < MINUTES_IN_DAY) {
    var d = Math.round(p / 60);
    return o.formatDistance("aboutXHours", d, u);
  }
  if (p < MINUTES_IN_ALMOST_TWO_DAYS) return o.formatDistance("xDays", 1, u);
  if (p < MINUTES_IN_MONTH) {
    var h = Math.round(p / MINUTES_IN_DAY);
    return o.formatDistance("xDays", h, u);
  }
  if (p < MINUTES_IN_TWO_MONTHS)
    return (
      (c = Math.round(p / MINUTES_IN_MONTH)),
      o.formatDistance("aboutXMonths", c, u)
    );
  if ((c = differenceInMonths(s, i)) < 12) {
    var g = Math.round(p / MINUTES_IN_MONTH);
    return o.formatDistance("xMonths", g, u);
  }
  var m = c % 12,
    y = Math.floor(c / 12);
  return m < 3
    ? o.formatDistance("aboutXYears", y, u)
    : m < 9
    ? o.formatDistance("overXYears", y, u)
    : o.formatDistance("almostXYears", y + 1, u);
}
function formatDistanceToNow(e, t) {
  return requiredArgs(1, arguments), formatDistance$1(e, Date.now(), t);
}
function formatISO(e, t) {
  if (arguments.length < 1)
    throw new TypeError(
      "1 argument required, but only ".concat(arguments.length, " present")
    );
  var r = toDate(e);
  if (!isValid(r)) throw new RangeError("Invalid time value");
  var n = t || {},
    o = null == n.format ? "extended" : String(n.format),
    a = null == n.representation ? "complete" : String(n.representation);
  if ("extended" !== o && "basic" !== o)
    throw new RangeError("format must be 'extended' or 'basic'");
  if ("date" !== a && "time" !== a && "complete" !== a)
    throw new RangeError(
      "representation must be 'date', 'time', or 'complete'"
    );
  var i = "",
    s = "",
    u = "extended" === o ? "-" : "",
    c = "extended" === o ? ":" : "";
  if ("time" !== a) {
    var l = addLeadingZeros(r.getDate(), 2),
      f = addLeadingZeros(r.getMonth() + 1, 2),
      p = addLeadingZeros(r.getFullYear(), 4);
    i = "".concat(p).concat(u).concat(f).concat(u).concat(l);
  }
  if ("date" !== a) {
    var d = r.getTimezoneOffset();
    if (0 !== d) {
      var h = Math.abs(d),
        g = addLeadingZeros(Math.floor(h / 60), 2),
        m = addLeadingZeros(h % 60, 2),
        y = d < 0 ? "+" : "-";
      s = "".concat(y).concat(g, ":").concat(m);
    } else s = "Z";
    var b = addLeadingZeros(r.getHours(), 2),
      v = addLeadingZeros(r.getMinutes(), 2),
      _ = addLeadingZeros(r.getSeconds(), 2),
      w = "" === i ? "" : "T",
      T = [b, v, _].join(c);
    i = "".concat(i).concat(w).concat(T).concat(s);
  }
  return i;
}
function formatRelative$1(e, t, r) {
  requiredArgs(2, arguments);
  var n = toDate(e),
    o = toDate(t),
    a = r || {},
    i = a.locale || locale$2;
  if (!i.localize)
    throw new RangeError("locale must contain localize property");
  if (!i.formatLong)
    throw new RangeError("locale must contain formatLong property");
  if (!i.formatRelative)
    throw new RangeError("locale must contain formatRelative property");
  var s,
    u = differenceInCalendarDays(n, o);
  if (isNaN(u)) throw new RangeError("Invalid time value");
  s =
    u < -6
      ? "other"
      : u < -1
      ? "lastWeek"
      : u < 0
      ? "yesterday"
      : u < 1
      ? "today"
      : u < 2
      ? "tomorrow"
      : u < 7
      ? "nextWeek"
      : "other";
  var c = subMilliseconds(n, getTimezoneOffsetInMilliseconds(n)),
    l = subMilliseconds(o, getTimezoneOffsetInMilliseconds(o)),
    f = i.formatRelative(s, c, l, a);
  return format$1(n, f, a);
}
function subDays(e, t) {
  requiredArgs(2, arguments);
  var r = toInteger(t);
  return addDays(e, -r);
}
var fuzzysort = createCommonjsModule(function (e) {
  !(function (t, r) {
    e.exports ? (e.exports = r()) : (t.fuzzysort = r());
  })(commonjsGlobal, function () {
    var e = void 0 !== commonjsRequire && "undefined" == typeof window,
      t = new Map(),
      r = new Map(),
      n = [];
    n.total = 0;
    var o = [],
      a = [];
    function i() {
      t.clear(), r.clear(), (o = []), (a = []);
    }
    function s(e) {
      for (var t = -9007199254740991, r = e.length - 1; r >= 0; --r) {
        var n = e[r];
        if (null !== n) {
          var o = n.score;
          o > t && (t = o);
        }
      }
      return -9007199254740991 === t ? null : t;
    }
    function u(e, t) {
      var r = e[t];
      if (void 0 !== r) return r;
      var n = t;
      Array.isArray(t) || (n = t.split("."));
      for (var o = n.length, a = -1; e && ++a < o; ) e = e[n[a]];
      return e;
    }
    function c(e) {
      return "object" == typeof e;
    }
    var l = function () {
        var e = [],
          t = 0,
          r = {};
        function n() {
          for (var r = 0, n = e[r], o = 1; o < t; ) {
            var a = o + 1;
            (r = o),
              a < t && e[a].score < e[o].score && (r = a),
              (e[(r - 1) >> 1] = e[r]),
              (o = 1 + (r << 1));
          }
          for (
            var i = (r - 1) >> 1;
            r > 0 && n.score < e[i].score;
            i = ((r = i) - 1) >> 1
          )
            e[r] = e[i];
          e[r] = n;
        }
        return (
          (r.add = function (r) {
            var n = t;
            e[t++] = r;
            for (
              var o = (n - 1) >> 1;
              n > 0 && r.score < e[o].score;
              o = ((n = o) - 1) >> 1
            )
              e[n] = e[o];
            e[n] = r;
          }),
          (r.poll = function () {
            if (0 !== t) {
              var r = e[0];
              return (e[0] = e[--t]), n(), r;
            }
          }),
          (r.peek = function (r) {
            if (0 !== t) return e[0];
          }),
          (r.replaceTop = function (t) {
            (e[0] = t), n();
          }),
          r
        );
      },
      f = l();
    return (function p(d) {
      var h = {
        single: function (e, t, r) {
          return e
            ? (c(e) || (e = h.getPreparedSearch(e)),
              t
                ? (c(t) || (t = h.getPrepared(t)),
                  ((
                    r && void 0 !== r.allowTypo
                      ? r.allowTypo
                      : !d || void 0 === d.allowTypo || d.allowTypo
                  )
                    ? h.algorithm
                    : h.algorithmNoTypo)(e, t, e[0]))
                : null)
            : null;
        },
        go: function (e, t, r) {
          if (!e) return n;
          var o = (e = h.prepareSearch(e))[0],
            a = (r && r.threshold) || (d && d.threshold) || -9007199254740991,
            i = (r && r.limit) || (d && d.limit) || 9007199254740991,
            l = (
              r && void 0 !== r.allowTypo
                ? r.allowTypo
                : !d || void 0 === d.allowTypo || d.allowTypo
            )
              ? h.algorithm
              : h.algorithmNoTypo,
            p = 0,
            g = 0,
            m = t.length;
          if (r && r.keys)
            for (
              var y = r.scoreFn || s, b = r.keys, v = b.length, _ = m - 1;
              _ >= 0;
              --_
            ) {
              for (var w = t[_], T = new Array(v), O = v - 1; O >= 0; --O)
                (S = u(w, (M = b[O])))
                  ? (c(S) || (S = h.getPrepared(S)), (T[O] = l(e, S, o)))
                  : (T[O] = null);
              T.obj = w;
              var A = y(T);
              null !== A &&
                (A < a ||
                  ((T.score = A),
                  p < i
                    ? (f.add(T), ++p)
                    : (++g, A > f.peek().score && f.replaceTop(T))));
            }
          else if (r && r.key) {
            var M = r.key;
            for (_ = m - 1; _ >= 0; --_)
              (S = u((w = t[_]), M)) &&
                (c(S) || (S = h.getPrepared(S)),
                null !== (k = l(e, S, o)) &&
                  (k.score < a ||
                    ((k = {
                      target: k.target,
                      _targetLowerCodes: null,
                      _nextBeginningIndexes: null,
                      score: k.score,
                      indexes: k.indexes,
                      obj: w,
                    }),
                    p < i
                      ? (f.add(k), ++p)
                      : (++g, k.score > f.peek().score && f.replaceTop(k)))));
          } else
            for (_ = m - 1; _ >= 0; --_) {
              var S, k;
              (S = t[_]) &&
                (c(S) || (S = h.getPrepared(S)),
                null !== (k = l(e, S, o)) &&
                  (k.score < a ||
                    (p < i
                      ? (f.add(k), ++p)
                      : (++g, k.score > f.peek().score && f.replaceTop(k)))));
            }
          if (0 === p) return n;
          var x = new Array(p);
          for (_ = p - 1; _ >= 0; --_) x[_] = f.poll();
          return (x.total = p + g), x;
        },
        goAsync: function (t, r, o) {
          var a = !1,
            i = new Promise(function (i, f) {
              if (!t) return i(n);
              var p = (t = h.prepareSearch(t))[0],
                g = l(),
                m = r.length - 1,
                y =
                  (o && o.threshold) || (d && d.threshold) || -9007199254740991,
                b = (o && o.limit) || (d && d.limit) || 9007199254740991,
                v = (
                  o && void 0 !== o.allowTypo
                    ? o.allowTypo
                    : !d || void 0 === d.allowTypo || d.allowTypo
                )
                  ? h.algorithm
                  : h.algorithmNoTypo,
                _ = 0,
                w = 0;
              function T() {
                if (a) return f("canceled");
                var l = Date.now();
                if (o && o.keys)
                  for (
                    var d = o.scoreFn || s, O = o.keys, A = O.length;
                    m >= 0;
                    --m
                  ) {
                    for (var M = r[m], S = new Array(A), k = A - 1; k >= 0; --k)
                      (C = u(M, (E = O[k])))
                        ? (c(C) || (C = h.getPrepared(C)), (S[k] = v(t, C, p)))
                        : (S[k] = null);
                    S.obj = M;
                    var x = d(S);
                    if (
                      null !== x &&
                      !(x < y) &&
                      ((S.score = x),
                      _ < b
                        ? (g.add(S), ++_)
                        : (++w, x > g.peek().score && g.replaceTop(S)),
                      m % 1e3 == 0 && Date.now() - l >= 10)
                    )
                      return void (e ? setImmediate(T) : setTimeout(T));
                  }
                else if (o && o.key) {
                  for (var E = o.key; m >= 0; --m)
                    if (
                      (C = u((M = r[m]), E)) &&
                      (c(C) || (C = h.getPrepared(C)),
                      null !== ($ = v(t, C, p)) &&
                        !($.score < y) &&
                        (($ = {
                          target: $.target,
                          _targetLowerCodes: null,
                          _nextBeginningIndexes: null,
                          score: $.score,
                          indexes: $.indexes,
                          obj: M,
                        }),
                        _ < b
                          ? (g.add($), ++_)
                          : (++w, $.score > g.peek().score && g.replaceTop($)),
                        m % 1e3 == 0 && Date.now() - l >= 10))
                    )
                      return void (e ? setImmediate(T) : setTimeout(T));
                } else
                  for (; m >= 0; --m) {
                    var C, $;
                    if (
                      (C = r[m]) &&
                      (c(C) || (C = h.getPrepared(C)),
                      null !== ($ = v(t, C, p)) &&
                        !($.score < y) &&
                        (_ < b
                          ? (g.add($), ++_)
                          : (++w, $.score > g.peek().score && g.replaceTop($)),
                        m % 1e3 == 0 && Date.now() - l >= 10))
                    )
                      return void (e ? setImmediate(T) : setTimeout(T));
                  }
                if (0 === _) return i(n);
                for (var P = new Array(_), I = _ - 1; I >= 0; --I)
                  P[I] = g.poll();
                (P.total = _ + w), i(P);
              }
              e ? setImmediate(T) : T();
            });
          return (
            (i.cancel = function () {
              a = !0;
            }),
            i
          );
        },
        highlight: function (e, t, r) {
          if (null === e) return null;
          void 0 === t && (t = "<b>"), void 0 === r && (r = "</b>");
          for (
            var n = "",
              o = 0,
              a = !1,
              i = e.target,
              s = i.length,
              u = e.indexes,
              c = 0;
            c < s;
            ++c
          ) {
            var l = i[c];
            if (u[o] === c) {
              if ((a || ((a = !0), (n += t)), ++o === u.length)) {
                n += l + r + i.substr(c + 1);
                break;
              }
            } else a && ((a = !1), (n += r));
            n += l;
          }
          return n;
        },
        prepare: function (e) {
          if (e)
            return {
              target: e,
              _targetLowerCodes: h.prepareLowerCodes(e),
              _nextBeginningIndexes: null,
              score: null,
              indexes: null,
              obj: null,
            };
        },
        prepareSlow: function (e) {
          if (e)
            return {
              target: e,
              _targetLowerCodes: h.prepareLowerCodes(e),
              _nextBeginningIndexes: h.prepareNextBeginningIndexes(e),
              score: null,
              indexes: null,
              obj: null,
            };
        },
        prepareSearch: function (e) {
          if (e) return h.prepareLowerCodes(e);
        },
        getPrepared: function (e) {
          if (e.length > 999) return h.prepare(e);
          var r = t.get(e);
          return void 0 !== r || ((r = h.prepare(e)), t.set(e, r)), r;
        },
        getPreparedSearch: function (e) {
          if (e.length > 999) return h.prepareSearch(e);
          var t = r.get(e);
          return void 0 !== t || ((t = h.prepareSearch(e)), r.set(e, t)), t;
        },
        algorithm: function (e, t, r) {
          for (
            var n = t._targetLowerCodes,
              i = e.length,
              s = n.length,
              u = 0,
              c = 0,
              l = 0,
              f = 0;
            ;

          ) {
            if (r === n[c]) {
              if (((o[f++] = c), ++u === i)) break;
              r = e[0 === l ? u : l === u ? u + 1 : l === u - 1 ? u - 1 : u];
            }
            if (++c >= s)
              for (;;) {
                if (u <= 1) return null;
                if (0 === l) {
                  if (r === e[--u]) continue;
                  l = u;
                } else {
                  if (1 === l) return null;
                  if ((r = e[1 + (u = --l)]) === e[u]) continue;
                }
                c = o[(f = u) - 1] + 1;
                break;
              }
          }
          u = 0;
          var p = 0,
            d = !1,
            g = 0,
            m = t._nextBeginningIndexes;
          null === m &&
            (m = t._nextBeginningIndexes = h.prepareNextBeginningIndexes(
              t.target
            ));
          var y = (c = 0 === o[0] ? 0 : m[o[0] - 1]);
          if (c !== s)
            for (;;)
              if (c >= s) {
                if (u <= 0) {
                  if (++p > i - 2) break;
                  if (e[p] === e[p + 1]) continue;
                  c = y;
                  continue;
                }
                --u, (c = m[a[--g]]);
              } else if (
                e[0 === p ? u : p === u ? u + 1 : p === u - 1 ? u - 1 : u] ===
                n[c]
              ) {
                if (((a[g++] = c), ++u === i)) {
                  d = !0;
                  break;
                }
                ++c;
              } else c = m[c];
          if (d)
            var b = a,
              v = g;
          else (b = o), (v = f);
          for (var _ = 0, w = -1, T = 0; T < i; ++T)
            w !== (c = b[T]) - 1 && (_ -= c), (w = c);
          for (
            d ? 0 !== p && (_ += -20) : ((_ *= 1e3), 0 !== l && (_ += -20)),
              _ -= s - i,
              t.score = _,
              t.indexes = new Array(v),
              T = v - 1;
            T >= 0;
            --T
          )
            t.indexes[T] = b[T];
          return t;
        },
        algorithmNoTypo: function (e, t, r) {
          for (
            var n = t._targetLowerCodes,
              i = e.length,
              s = n.length,
              u = 0,
              c = 0,
              l = 0;
            ;

          ) {
            if (r === n[c]) {
              if (((o[l++] = c), ++u === i)) break;
              r = e[u];
            }
            if (++c >= s) return null;
          }
          u = 0;
          var f = !1,
            p = 0,
            d = t._nextBeginningIndexes;
          if (
            (null === d &&
              (d = t._nextBeginningIndexes = h.prepareNextBeginningIndexes(
                t.target
              )),
            (c = 0 === o[0] ? 0 : d[o[0] - 1]) !== s)
          )
            for (;;)
              if (c >= s) {
                if (u <= 0) break;
                --u, (c = d[a[--p]]);
              } else if (e[u] === n[c]) {
                if (((a[p++] = c), ++u === i)) {
                  f = !0;
                  break;
                }
                ++c;
              } else c = d[c];
          if (f)
            var g = a,
              m = p;
          else (g = o), (m = l);
          for (var y = 0, b = -1, v = 0; v < i; ++v)
            b !== (c = g[v]) - 1 && (y -= c), (b = c);
          for (
            f || (y *= 1e3),
              y -= s - i,
              t.score = y,
              t.indexes = new Array(m),
              v = m - 1;
            v >= 0;
            --v
          )
            t.indexes[v] = g[v];
          return t;
        },
        prepareLowerCodes: function (e) {
          for (var t = e.length, r = [], n = e.toLowerCase(), o = 0; o < t; ++o)
            r[o] = n.charCodeAt(o);
          return r;
        },
        prepareBeginningIndexes: function (e) {
          for (
            var t = e.length, r = [], n = 0, o = !1, a = !1, i = 0;
            i < t;
            ++i
          ) {
            var s = e.charCodeAt(i),
              u = s >= 65 && s <= 90,
              c = u || (s >= 97 && s <= 122) || (s >= 48 && s <= 57),
              l = (u && !o) || !a || !c;
            (o = u), (a = c), l && (r[n++] = i);
          }
          return r;
        },
        prepareNextBeginningIndexes: function (e) {
          for (
            var t = e.length,
              r = h.prepareBeginningIndexes(e),
              n = [],
              o = r[0],
              a = 0,
              i = 0;
            i < t;
            ++i
          )
            o > i ? (n[i] = o) : ((o = r[++a]), (n[i] = void 0 === o ? t : o));
          return n;
        },
        cleanup: i,
        new: p,
      };
      return h;
    })();
  });
});
function getBoundingClientRect(e) {
  var t = e.getBoundingClientRect();
  return {
    width: t.width,
    height: t.height,
    top: t.top,
    right: t.right,
    bottom: t.bottom,
    left: t.left,
    x: t.left,
    y: t.top,
  };
}
function getWindow(e) {
  if ("[object Window]" !== e.toString()) {
    var t = e.ownerDocument;
    return t ? t.defaultView : window;
  }
  return e;
}
function getWindowScroll(e) {
  var t = getWindow(e);
  return {
    scrollLeft: t.pageXOffset,
    scrollTop: t.pageYOffset,
  };
}
function isElement(e) {
  return e instanceof getWindow(e).Element || e instanceof Element;
}
function isHTMLElement(e) {
  return e instanceof getWindow(e).HTMLElement || e instanceof HTMLElement;
}
function getHTMLElementScroll(e) {
  return {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop,
  };
}
function getNodeScroll(e) {
  return e !== getWindow(e) && isHTMLElement(e)
    ? getHTMLElementScroll(e)
    : getWindowScroll(e);
}
function getNodeName(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function getDocumentElement(e) {
  return (isElement(e) ? e.ownerDocument : e.document).documentElement;
}
function getWindowScrollBarX(e) {
  return (
    getBoundingClientRect(getDocumentElement(e)).left +
    getWindowScroll(e).scrollLeft
  );
}
function getComputedStyle$1(e) {
  return getWindow(e).getComputedStyle(e);
}
function isScrollParent(e) {
  var t = getComputedStyle$1(e),
    r = t.overflow,
    n = t.overflowX,
    o = t.overflowY;
  return /auto|scroll|overlay|hidden/.test(r + o + n);
}
function getCompositeRect(e, t, r) {
  void 0 === r && (r = !1);
  var n = getDocumentElement(t),
    o = getBoundingClientRect(e),
    a = isHTMLElement(t),
    i = {
      scrollLeft: 0,
      scrollTop: 0,
    },
    s = {
      x: 0,
      y: 0,
    };
  return (
    (a || (!a && !r)) &&
      (("body" !== getNodeName(t) || isScrollParent(n)) &&
        (i = getNodeScroll(t)),
      isHTMLElement(t)
        ? (((s = getBoundingClientRect(t)).x += t.clientLeft),
          (s.y += t.clientTop))
        : n && (s.x = getWindowScrollBarX(n))),
    {
      x: o.left + i.scrollLeft - s.x,
      y: o.top + i.scrollTop - s.y,
      width: o.width,
      height: o.height,
    }
  );
}
function getLayoutRect(e) {
  return {
    x: e.offsetLeft,
    y: e.offsetTop,
    width: e.offsetWidth,
    height: e.offsetHeight,
  };
}
function getParentNode(e) {
  return "html" === getNodeName(e)
    ? e
    : e.assignedSlot || e.parentNode || e.host || getDocumentElement(e);
}
function getScrollParent(e) {
  return ["html", "body", "#document"].indexOf(getNodeName(e)) >= 0
    ? e.ownerDocument.body
    : isHTMLElement(e) && isScrollParent(e)
    ? e
    : getScrollParent(getParentNode(e));
}
function listScrollParents(e, t) {
  void 0 === t && (t = []);
  var r = getScrollParent(e),
    n = "body" === getNodeName(r),
    o = getWindow(r),
    a = n ? [o].concat(o.visualViewport || [], isScrollParent(r) ? r : []) : r,
    i = t.concat(a);
  return n ? i : i.concat(listScrollParents(getParentNode(a)));
}
function isTableElement(e) {
  return ["table", "td", "th"].indexOf(getNodeName(e)) >= 0;
}
function getTrueOffsetParent(e) {
  if (!isHTMLElement(e) || "fixed" === getComputedStyle$1(e).position)
    return null;
  var t = e.offsetParent;
  if (t) {
    var r = getDocumentElement(t);
    if (
      "body" === getNodeName(t) &&
      "static" === getComputedStyle$1(t).position &&
      "static" !== getComputedStyle$1(r).position
    )
      return r;
  }
  return t;
}
function getContainingBlock(e) {
  for (
    var t = getParentNode(e);
    isHTMLElement(t) && ["html", "body"].indexOf(getNodeName(t)) < 0;

  ) {
    var r = getComputedStyle$1(t);
    if (
      "none" !== r.transform ||
      "none" !== r.perspective ||
      (r.willChange && "auto" !== r.willChange)
    )
      return t;
    t = t.parentNode;
  }
  return null;
}
function getOffsetParent(e) {
  for (
    var t = getWindow(e), r = getTrueOffsetParent(e);
    r && isTableElement(r) && "static" === getComputedStyle$1(r).position;

  )
    r = getTrueOffsetParent(r);
  return r &&
    "body" === getNodeName(r) &&
    "static" === getComputedStyle$1(r).position
    ? t
    : r || getContainingBlock(e) || t;
}
var top = "top",
  bottom = "bottom",
  right = "right",
  left = "left",
  auto = "auto",
  basePlacements = [top, bottom, right, left],
  start = "start",
  end = "end",
  clippingParents = "clippingParents",
  viewport = "viewport",
  popper = "popper",
  reference = "reference",
  variationPlacements = basePlacements.reduce(function (e, t) {
    return e.concat([t + "-" + start, t + "-" + end]);
  }, []),
  placements = [].concat(basePlacements, [auto]).reduce(function (e, t) {
    return e.concat([t, t + "-" + start, t + "-" + end]);
  }, []),
  beforeRead = "beforeRead",
  read$1 = "read",
  afterRead = "afterRead",
  beforeMain = "beforeMain",
  main = "main",
  afterMain = "afterMain",
  beforeWrite = "beforeWrite",
  write$1 = "write",
  afterWrite = "afterWrite",
  modifierPhases = [
    beforeRead,
    read$1,
    afterRead,
    beforeMain,
    main,
    afterMain,
    beforeWrite,
    write$1,
    afterWrite,
  ];
function order(e) {
  var t = new Map(),
    r = new Set(),
    n = [];
  return (
    e.forEach(function (e) {
      t.set(e.name, e);
    }),
    e.forEach(function (e) {
      r.has(e.name) ||
        (function e(o) {
          r.add(o.name),
            []
              .concat(o.requires || [], o.requiresIfExists || [])
              .forEach(function (n) {
                if (!r.has(n)) {
                  var o = t.get(n);
                  o && e(o);
                }
              }),
            n.push(o);
        })(e);
    }),
    n
  );
}
function orderModifiers(e) {
  var t = order(e);
  return modifierPhases.reduce(function (e, r) {
    return e.concat(
      t.filter(function (e) {
        return e.phase === r;
      })
    );
  }, []);
}
function debounce$1(e) {
  var t;
  return function () {
    return (
      t ||
        (t = new Promise(function (r) {
          Promise.resolve().then(function () {
            (t = void 0), r(e());
          });
        })),
      t
    );
  };
}
function format$3(e) {
  for (
    var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), n = 1;
    n < t;
    n++
  )
    r[n - 1] = arguments[n];
  return [].concat(r).reduce(function (e, t) {
    return e.replace(/%s/, t);
  }, e);
}
var INVALID_MODIFIER_ERROR =
    'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s',
  MISSING_DEPENDENCY_ERROR =
    'Popper: modifier "%s" requires "%s", but "%s" modifier is not available',
  VALID_PROPERTIES = [
    "name",
    "enabled",
    "phase",
    "fn",
    "effect",
    "requires",
    "options",
  ];
function validateModifiers(e) {
  e.forEach(function (t) {
    Object.keys(t).forEach(function (r) {
      switch (r) {
        case "name":
          "string" != typeof t.name &&
            console.error(
              format$3(
                INVALID_MODIFIER_ERROR,
                String(t.name),
                '"name"',
                '"string"',
                '"' + String(t.name) + '"'
              )
            );
          break;
        case "enabled":
          "boolean" != typeof t.enabled &&
            console.error(
              format$3(
                INVALID_MODIFIER_ERROR,
                t.name,
                '"enabled"',
                '"boolean"',
                '"' + String(t.enabled) + '"'
              )
            );
        case "phase":
          modifierPhases.indexOf(t.phase) < 0 &&
            console.error(
              format$3(
                INVALID_MODIFIER_ERROR,
                t.name,
                '"phase"',
                "either " + modifierPhases.join(", "),
                '"' + String(t.phase) + '"'
              )
            );
          break;
        case "fn":
          "function" != typeof t.fn &&
            console.error(
              format$3(
                INVALID_MODIFIER_ERROR,
                t.name,
                '"fn"',
                '"function"',
                '"' + String(t.fn) + '"'
              )
            );
          break;
        case "effect":
          "function" != typeof t.effect &&
            console.error(
              format$3(
                INVALID_MODIFIER_ERROR,
                t.name,
                '"effect"',
                '"function"',
                '"' + String(t.fn) + '"'
              )
            );
          break;
        case "requires":
          Array.isArray(t.requires) ||
            console.error(
              format$3(
                INVALID_MODIFIER_ERROR,
                t.name,
                '"requires"',
                '"array"',
                '"' + String(t.requires) + '"'
              )
            );
          break;
        case "requiresIfExists":
          Array.isArray(t.requiresIfExists) ||
            console.error(
              format$3(
                INVALID_MODIFIER_ERROR,
                t.name,
                '"requiresIfExists"',
                '"array"',
                '"' + String(t.requiresIfExists) + '"'
              )
            );
          break;
        case "options":
        case "data":
          break;
        default:
          console.error(
            'PopperJS: an invalid property has been provided to the "' +
              t.name +
              '" modifier, valid properties are ' +
              VALID_PROPERTIES.map(function (e) {
                return '"' + e + '"';
              }).join(", ") +
              '; but "' +
              r +
              '" was provided.'
          );
      }
      t.requires &&
        t.requires.forEach(function (r) {
          null ==
            e.find(function (e) {
              return e.name === r;
            }) &&
            console.error(
              format$3(MISSING_DEPENDENCY_ERROR, String(t.name), r, r)
            );
        });
    });
  });
}
function uniqueBy(e, t) {
  var r = new Set();
  return e.filter(function (e) {
    var n = t(e);
    if (!r.has(n)) return r.add(n), !0;
  });
}
function getBasePlacement(e) {
  return e.split("-")[0];
}
function mergeByName(e) {
  var t = e.reduce(function (e, t) {
    var r = e[t.name];
    return (
      (e[t.name] = r
        ? Object.assign(
            Object.assign(Object.assign({}, r), t),
            {},
            {
              options: Object.assign(Object.assign({}, r.options), t.options),
              data: Object.assign(Object.assign({}, r.data), t.data),
            }
          )
        : t),
      e
    );
  }, {});
  return Object.keys(t).map(function (e) {
    return t[e];
  });
}
function getViewportRect(e) {
  var t = getWindow(e),
    r = getDocumentElement(e),
    n = t.visualViewport,
    o = r.clientWidth,
    a = r.clientHeight,
    i = 0,
    s = 0;
  return (
    n &&
      ((o = n.width),
      (a = n.height),
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
        ((i = n.offsetLeft), (s = n.offsetTop))),
    {
      width: o,
      height: a,
      x: i + getWindowScrollBarX(e),
      y: s,
    }
  );
}
function getDocumentRect(e) {
  var t = getDocumentElement(e),
    r = getWindowScroll(e),
    n = e.ownerDocument.body,
    o = Math.max(
      t.scrollWidth,
      t.clientWidth,
      n ? n.scrollWidth : 0,
      n ? n.clientWidth : 0
    ),
    a = Math.max(
      t.scrollHeight,
      t.clientHeight,
      n ? n.scrollHeight : 0,
      n ? n.clientHeight : 0
    ),
    i = -r.scrollLeft + getWindowScrollBarX(e),
    s = -r.scrollTop;
  return (
    "rtl" === getComputedStyle$1(n || t).direction &&
      (i += Math.max(t.clientWidth, n ? n.clientWidth : 0) - o),
    {
      width: o,
      height: a,
      x: i,
      y: s,
    }
  );
}
function contains(e, t) {
  var r = Boolean(t.getRootNode && t.getRootNode().host);
  if (e.contains(t)) return !0;
  if (r) {
    var n = t;
    do {
      if (n && e.isSameNode(n)) return !0;
      n = n.parentNode || n.host;
    } while (n);
  }
  return !1;
}
function rectToClientRect(e) {
  return Object.assign(
    Object.assign({}, e),
    {},
    {
      left: e.x,
      top: e.y,
      right: e.x + e.width,
      bottom: e.y + e.height,
    }
  );
}
function getInnerBoundingClientRect(e) {
  var t = getBoundingClientRect(e);
  return (
    (t.top = t.top + e.clientTop),
    (t.left = t.left + e.clientLeft),
    (t.bottom = t.top + e.clientHeight),
    (t.right = t.left + e.clientWidth),
    (t.width = e.clientWidth),
    (t.height = e.clientHeight),
    (t.x = t.left),
    (t.y = t.top),
    t
  );
}
function getClientRectFromMixedType(e, t) {
  return t === viewport
    ? rectToClientRect(getViewportRect(e))
    : isHTMLElement(t)
    ? getInnerBoundingClientRect(t)
    : rectToClientRect(getDocumentRect(getDocumentElement(e)));
}
function getClippingParents(e) {
  var t = listScrollParents(getParentNode(e)),
    r =
      ["absolute", "fixed"].indexOf(getComputedStyle$1(e).position) >= 0 &&
      isHTMLElement(e)
        ? getOffsetParent(e)
        : e;
  return isElement(r)
    ? t.filter(function (e) {
        return isElement(e) && contains(e, r) && "body" !== getNodeName(e);
      })
    : [];
}
function getClippingRect(e, t, r) {
  var n = "clippingParents" === t ? getClippingParents(e) : [].concat(t),
    o = [].concat(n, [r]),
    a = o[0],
    i = o.reduce(function (t, r) {
      var n = getClientRectFromMixedType(e, r);
      return (
        (t.top = Math.max(n.top, t.top)),
        (t.right = Math.min(n.right, t.right)),
        (t.bottom = Math.min(n.bottom, t.bottom)),
        (t.left = Math.max(n.left, t.left)),
        t
      );
    }, getClientRectFromMixedType(e, a));
  return (
    (i.width = i.right - i.left),
    (i.height = i.bottom - i.top),
    (i.x = i.left),
    (i.y = i.top),
    i
  );
}
function getVariation(e) {
  return e.split("-")[1];
}
function getMainAxisFromPlacement(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function computeOffsets(e) {
  var t,
    r = e.reference,
    n = e.element,
    o = e.placement,
    a = o ? getBasePlacement(o) : null,
    i = o ? getVariation(o) : null,
    s = r.x + r.width / 2 - n.width / 2,
    u = r.y + r.height / 2 - n.height / 2;
  switch (a) {
    case top:
      t = {
        x: s,
        y: r.y - n.height,
      };
      break;
    case bottom:
      t = {
        x: s,
        y: r.y + r.height,
      };
      break;
    case right:
      t = {
        x: r.x + r.width,
        y: u,
      };
      break;
    case left:
      t = {
        x: r.x - n.width,
        y: u,
      };
      break;
    default:
      t = {
        x: r.x,
        y: r.y,
      };
  }
  var c = a ? getMainAxisFromPlacement(a) : null;
  if (null != c) {
    var l = "y" === c ? "height" : "width";
    switch (i) {
      case start:
        t[c] = Math.floor(t[c]) - Math.floor(r[l] / 2 - n[l] / 2);
        break;
      case end:
        t[c] = Math.floor(t[c]) + Math.ceil(r[l] / 2 - n[l] / 2);
    }
  }
  return t;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
}
function mergePaddingObject(e) {
  return Object.assign(Object.assign({}, getFreshSideObject()), e);
}
function expandToHashMap(e, t) {
  return t.reduce(function (t, r) {
    return (t[r] = e), t;
  }, {});
}
function detectOverflow(e, t) {
  void 0 === t && (t = {});
  var r = t,
    n = r.placement,
    o = void 0 === n ? e.placement : n,
    a = r.boundary,
    i = void 0 === a ? clippingParents : a,
    s = r.rootBoundary,
    u = void 0 === s ? viewport : s,
    c = r.elementContext,
    l = void 0 === c ? popper : c,
    f = r.altBoundary,
    p = void 0 !== f && f,
    d = r.padding,
    h = void 0 === d ? 0 : d,
    g = mergePaddingObject(
      "number" != typeof h ? h : expandToHashMap(h, basePlacements)
    ),
    m = l === popper ? reference : popper,
    y = e.elements.reference,
    b = e.rects.popper,
    v = e.elements[p ? m : l],
    _ = getClippingRect(
      isElement(v)
        ? v
        : v.contextElement || getDocumentElement(e.elements.popper),
      i,
      u
    ),
    w = getBoundingClientRect(y),
    T = computeOffsets({
      reference: w,
      element: b,
      strategy: "absolute",
      placement: o,
    }),
    O = rectToClientRect(Object.assign(Object.assign({}, b), T)),
    A = l === popper ? O : w,
    M = {
      top: _.top - A.top + g.top,
      bottom: A.bottom - _.bottom + g.bottom,
      left: _.left - A.left + g.left,
      right: A.right - _.right + g.right,
    },
    S = e.modifiersData.offset;
  if (l === popper && S) {
    var k = S[o];
    Object.keys(M).forEach(function (e) {
      var t = [right, bottom].indexOf(e) >= 0 ? 1 : -1,
        r = [top, bottom].indexOf(e) >= 0 ? "y" : "x";
      M[e] += k[r] * t;
    });
  }
  return M;
}
var INVALID_ELEMENT_ERROR =
    "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.",
  INFINITE_LOOP_ERROR =
    "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.",
  DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute",
  };
function areValidElements() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return !t.some(function (e) {
    return !(e && "function" == typeof e.getBoundingClientRect);
  });
}
function popperGenerator(e) {
  void 0 === e && (e = {});
  var t = e,
    r = t.defaultModifiers,
    n = void 0 === r ? [] : r,
    o = t.defaultOptions,
    a = void 0 === o ? DEFAULT_OPTIONS : o;
  return function (e, t, r) {
    void 0 === r && (r = a);
    var o = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign(Object.assign({}, DEFAULT_OPTIONS), a),
        modifiersData: {},
        elements: {
          reference: e,
          popper: t,
        },
        attributes: {},
        styles: {},
      },
      i = [],
      s = !1,
      u = {
        state: o,
        setOptions: function (r) {
          c(),
            (o.options = Object.assign(
              Object.assign(Object.assign({}, a), o.options),
              r
            )),
            (o.scrollParents = {
              reference: isElement(e)
                ? listScrollParents(e)
                : e.contextElement
                ? listScrollParents(e.contextElement)
                : [],
              popper: listScrollParents(t),
            });
          var s = orderModifiers(
            mergeByName([].concat(n, o.options.modifiers))
          );
          return (
            (o.orderedModifiers = s.filter(function (e) {
              return e.enabled;
            })),
            o.orderedModifiers.forEach(function (e) {
              var t = e.name,
                r = e.options,
                n = void 0 === r ? {} : r,
                a = e.effect;
              if ("function" == typeof a) {
                var s = a({
                  state: o,
                  name: t,
                  instance: u,
                  options: n,
                });
                i.push(s || function () {});
              }
            }),
            u.update()
          );
        },
        forceUpdate: function () {
          if (!s) {
            var e = o.elements,
              t = e.reference,
              r = e.popper;
            if (areValidElements(t, r)) {
              (o.rects = {
                reference: getCompositeRect(
                  t,
                  getOffsetParent(r),
                  "fixed" === o.options.strategy
                ),
                popper: getLayoutRect(r),
              }),
                (o.reset = !1),
                (o.placement = o.options.placement),
                o.orderedModifiers.forEach(function (e) {
                  return (o.modifiersData[e.name] = Object.assign({}, e.data));
                });
              for (var n = 0; n < o.orderedModifiers.length; n++)
                if (!0 !== o.reset) {
                  var a = o.orderedModifiers[n],
                    i = a.fn,
                    c = a.options,
                    l = void 0 === c ? {} : c,
                    f = a.name;
                  "function" == typeof i &&
                    (o =
                      i({
                        state: o,
                        options: l,
                        name: f,
                        instance: u,
                      }) || o);
                } else (o.reset = !1), (n = -1);
            }
          }
        },
        update: debounce$1(function () {
          return new Promise(function (e) {
            u.forceUpdate(), e(o);
          });
        }),
        destroy: function () {
          c(), (s = !0);
        },
      };
    if (!areValidElements(e, t)) return u;
    function c() {
      i.forEach(function (e) {
        return e();
      }),
        (i = []);
    }
    return (
      u.setOptions(r).then(function (e) {
        !s && r.onFirstUpdate && r.onFirstUpdate(e);
      }),
      u
    );
  };
}
var passive = {
  passive: !0,
};
function effect(e) {
  var t = e.state,
    r = e.instance,
    n = e.options,
    o = n.scroll,
    a = void 0 === o || o,
    i = n.resize,
    s = void 0 === i || i,
    u = getWindow(t.elements.popper),
    c = [].concat(t.scrollParents.reference, t.scrollParents.popper);
  return (
    a &&
      c.forEach(function (e) {
        e.addEventListener("scroll", r.update, passive);
      }),
    s && u.addEventListener("resize", r.update, passive),
    function () {
      a &&
        c.forEach(function (e) {
          e.removeEventListener("scroll", r.update, passive);
        }),
        s && u.removeEventListener("resize", r.update, passive);
    }
  );
}
var eventListeners = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function () {},
  effect,
  data: {},
};
function popperOffsets(e) {
  var t = e.state,
    r = e.name;
  t.modifiersData[r] = computeOffsets({
    reference: t.rects.reference,
    element: t.rects.popper,
    strategy: "absolute",
    placement: t.placement,
  });
}
var popperOffsets$1 = {
    name: "popperOffsets",
    enabled: !0,
    phase: "read",
    fn: popperOffsets,
    data: {},
  },
  unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
  };
function roundOffsets(e) {
  var t = e.x,
    r = e.y,
    n = window.devicePixelRatio || 1;
  return {
    x: Math.round(t * n) / n || 0,
    y: Math.round(r * n) / n || 0,
  };
}
function mapToStyles(e) {
  var t,
    r = e.popper,
    n = e.popperRect,
    o = e.placement,
    a = e.offsets,
    i = e.position,
    s = e.gpuAcceleration,
    u = e.adaptive,
    c = roundOffsets(a),
    l = c.x,
    f = c.y,
    p = a.hasOwnProperty("x"),
    d = a.hasOwnProperty("y"),
    h = left,
    g = top,
    m = window;
  if (u) {
    var y = getOffsetParent(r);
    y === getWindow(r) && (y = getDocumentElement(r)),
      o === top &&
        ((g = bottom), (f -= y.clientHeight - n.height), (f *= s ? 1 : -1)),
      o === left &&
        ((h = right), (l -= y.clientWidth - n.width), (l *= s ? 1 : -1));
  }
  var b,
    v = Object.assign(
      {
        position: i,
      },
      u && unsetSides
    );
  return s
    ? Object.assign(
        Object.assign({}, v),
        {},
        (((b = {})[g] = d ? "0" : ""),
        (b[h] = p ? "0" : ""),
        (b.transform =
          (m.devicePixelRatio || 1) < 2
            ? "translate(" + l + "px, " + f + "px)"
            : "translate3d(" + l + "px, " + f + "px, 0)"),
        b)
      )
    : Object.assign(
        Object.assign({}, v),
        {},
        (((t = {})[g] = d ? f + "px" : ""),
        (t[h] = p ? l + "px" : ""),
        (t.transform = ""),
        t)
      );
}
function computeStyles(e) {
  var t = e.state,
    r = e.options,
    n = r.gpuAcceleration,
    o = void 0 === n || n,
    a = r.adaptive,
    i = void 0 === a || a,
    s = {
      placement: getBasePlacement(t.placement),
      popper: t.elements.popper,
      popperRect: t.rects.popper,
      gpuAcceleration: o,
    };
  null != t.modifiersData.popperOffsets &&
    (t.styles.popper = Object.assign(
      Object.assign({}, t.styles.popper),
      mapToStyles(
        Object.assign(
          Object.assign({}, s),
          {},
          {
            offsets: t.modifiersData.popperOffsets,
            position: t.options.strategy,
            adaptive: i,
          }
        )
      )
    )),
    null != t.modifiersData.arrow &&
      (t.styles.arrow = Object.assign(
        Object.assign({}, t.styles.arrow),
        mapToStyles(
          Object.assign(
            Object.assign({}, s),
            {},
            {
              offsets: t.modifiersData.arrow,
              position: "absolute",
              adaptive: !1,
            }
          )
        )
      )),
    (t.attributes.popper = Object.assign(
      Object.assign({}, t.attributes.popper),
      {},
      {
        "data-popper-placement": t.placement,
      }
    ));
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {},
};
function applyStyles(e) {
  var t = e.state;
  Object.keys(t.elements).forEach(function (e) {
    var r = t.styles[e] || {},
      n = t.attributes[e] || {},
      o = t.elements[e];
    isHTMLElement(o) &&
      getNodeName(o) &&
      (Object.assign(o.style, r),
      Object.keys(n).forEach(function (e) {
        var t = n[e];
        !1 === t ? o.removeAttribute(e) : o.setAttribute(e, !0 === t ? "" : t);
      }));
  });
}
function effect$1(e) {
  var t = e.state,
    r = {
      popper: {
        position: t.options.strategy,
        left: "0",
        top: "0",
        margin: "0",
      },
      arrow: {
        position: "absolute",
      },
      reference: {},
    };
  return (
    Object.assign(t.elements.popper.style, r.popper),
    t.elements.arrow && Object.assign(t.elements.arrow.style, r.arrow),
    function () {
      Object.keys(t.elements).forEach(function (e) {
        var n = t.elements[e],
          o = t.attributes[e] || {},
          a = Object.keys(
            t.styles.hasOwnProperty(e) ? t.styles[e] : r[e]
          ).reduce(function (e, t) {
            return (e[t] = ""), e;
          }, {});
        isHTMLElement(n) &&
          getNodeName(n) &&
          (Object.assign(n.style, a),
          Object.keys(o).forEach(function (e) {
            n.removeAttribute(e);
          }));
      });
    }
  );
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: applyStyles,
  effect: effect$1,
  requires: ["computeStyles"],
};
function distanceAndSkiddingToXY(e, t, r) {
  var n = getBasePlacement(e),
    o = [left, top].indexOf(n) >= 0 ? -1 : 1,
    a =
      "function" == typeof r
        ? r(
            Object.assign(
              Object.assign({}, t),
              {},
              {
                placement: e,
              }
            )
          )
        : r,
    i = a[0],
    s = a[1];
  return (
    (i = i || 0),
    (s = (s || 0) * o),
    [left, right].indexOf(n) >= 0
      ? {
          x: s,
          y: i,
        }
      : {
          x: i,
          y: s,
        }
  );
}
function offset(e) {
  var t = e.state,
    r = e.options,
    n = e.name,
    o = r.offset,
    a = void 0 === o ? [0, 0] : o,
    i = placements.reduce(function (e, r) {
      return (e[r] = distanceAndSkiddingToXY(r, t.rects, a)), e;
    }, {}),
    s = i[t.placement],
    u = s.x,
    c = s.y;
  null != t.modifiersData.popperOffsets &&
    ((t.modifiersData.popperOffsets.x += u),
    (t.modifiersData.popperOffsets.y += c)),
    (t.modifiersData[n] = i);
}
var offset$1 = {
    name: "offset",
    enabled: !0,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset,
  },
  hash$1 = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom",
  };
function getOppositePlacement(e) {
  return e.replace(/left|right|bottom|top/g, function (e) {
    return hash$1[e];
  });
}
var hash$2 = {
  start: "end",
  end: "start",
};
function getOppositeVariationPlacement(e) {
  return e.replace(/start|end/g, function (e) {
    return hash$2[e];
  });
}
function computeAutoPlacement(e, t) {
  void 0 === t && (t = {});
  var r = t,
    n = r.placement,
    o = r.boundary,
    a = r.rootBoundary,
    i = r.padding,
    s = r.flipVariations,
    u = r.allowedAutoPlacements,
    c = void 0 === u ? placements : u,
    l = getVariation(n),
    f = l
      ? s
        ? variationPlacements
        : variationPlacements.filter(function (e) {
            return getVariation(e) === l;
          })
      : basePlacements,
    p = f.filter(function (e) {
      return c.indexOf(e) >= 0;
    });
  0 === p.length && (p = f);
  var d = p.reduce(function (t, r) {
    return (
      (t[r] = detectOverflow(e, {
        placement: r,
        boundary: o,
        rootBoundary: a,
        padding: i,
      })[getBasePlacement(r)]),
      t
    );
  }, {});
  return Object.keys(d).sort(function (e, t) {
    return d[e] - d[t];
  });
}
function getExpandedFallbackPlacements(e) {
  if (getBasePlacement(e) === auto) return [];
  var t = getOppositePlacement(e);
  return [
    getOppositeVariationPlacement(e),
    t,
    getOppositeVariationPlacement(t),
  ];
}
function flip(e) {
  var t = e.state,
    r = e.options,
    n = e.name;
  if (!t.modifiersData[n]._skip) {
    for (
      var o = r.mainAxis,
        a = void 0 === o || o,
        i = r.altAxis,
        s = void 0 === i || i,
        u = r.fallbackPlacements,
        c = r.padding,
        l = r.boundary,
        f = r.rootBoundary,
        p = r.altBoundary,
        d = r.flipVariations,
        h = void 0 === d || d,
        g = r.allowedAutoPlacements,
        m = t.options.placement,
        y = getBasePlacement(m),
        b =
          u ||
          (y !== m && h
            ? getExpandedFallbackPlacements(m)
            : [getOppositePlacement(m)]),
        v = [m].concat(b).reduce(function (e, r) {
          return e.concat(
            getBasePlacement(r) === auto
              ? computeAutoPlacement(t, {
                  placement: r,
                  boundary: l,
                  rootBoundary: f,
                  padding: c,
                  flipVariations: h,
                  allowedAutoPlacements: g,
                })
              : r
          );
        }, []),
        _ = t.rects.reference,
        w = t.rects.popper,
        T = new Map(),
        O = !0,
        A = v[0],
        M = 0;
      M < v.length;
      M++
    ) {
      var S = v[M],
        k = getBasePlacement(S),
        x = getVariation(S) === start,
        E = [top, bottom].indexOf(k) >= 0,
        C = E ? "width" : "height",
        $ = detectOverflow(t, {
          placement: S,
          boundary: l,
          rootBoundary: f,
          altBoundary: p,
          padding: c,
        }),
        P = E ? (x ? right : left) : x ? bottom : top;
      _[C] > w[C] && (P = getOppositePlacement(P));
      var I = getOppositePlacement(P),
        R = [];
      if (
        (a && R.push($[k] <= 0),
        s && R.push($[P] <= 0, $[I] <= 0),
        R.every(function (e) {
          return e;
        }))
      ) {
        (A = S), (O = !1);
        break;
      }
      T.set(S, R);
    }
    if (O)
      for (
        var D = function (e) {
            var t = v.find(function (t) {
              var r = T.get(t);
              if (r)
                return r.slice(0, e).every(function (e) {
                  return e;
                });
            });
            if (t) return (A = t), "break";
          },
          L = h ? 3 : 1;
        L > 0 && "break" !== D(L);
        L--
      );
    t.placement !== A &&
      ((t.modifiersData[n]._skip = !0), (t.placement = A), (t.reset = !0));
  }
}
var flip$1 = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1,
  },
};
function getAltAxis(e) {
  return "x" === e ? "y" : "x";
}
function within(e, t, r) {
  return Math.max(e, Math.min(t, r));
}
function preventOverflow(e) {
  var t = e.state,
    r = e.options,
    n = e.name,
    o = r.mainAxis,
    a = void 0 === o || o,
    i = r.altAxis,
    s = void 0 !== i && i,
    u = r.boundary,
    c = r.rootBoundary,
    l = r.altBoundary,
    f = r.padding,
    p = r.tether,
    d = void 0 === p || p,
    h = r.tetherOffset,
    g = void 0 === h ? 0 : h,
    m = detectOverflow(t, {
      boundary: u,
      rootBoundary: c,
      padding: f,
      altBoundary: l,
    }),
    y = getBasePlacement(t.placement),
    b = getVariation(t.placement),
    v = !b,
    _ = getMainAxisFromPlacement(y),
    w = getAltAxis(_),
    T = t.modifiersData.popperOffsets,
    O = t.rects.reference,
    A = t.rects.popper,
    M =
      "function" == typeof g
        ? g(
            Object.assign(
              Object.assign({}, t.rects),
              {},
              {
                placement: t.placement,
              }
            )
          )
        : g,
    S = {
      x: 0,
      y: 0,
    };
  if (T) {
    if (a) {
      var k = "y" === _ ? top : left,
        x = "y" === _ ? bottom : right,
        E = "y" === _ ? "height" : "width",
        C = T[_],
        $ = T[_] + m[k],
        P = T[_] - m[x],
        I = d ? -A[E] / 2 : 0,
        R = b === start ? O[E] : A[E],
        D = b === start ? -A[E] : -O[E],
        L = t.elements.arrow,
        N =
          d && L
            ? getLayoutRect(L)
            : {
                width: 0,
                height: 0,
              },
        j = t.modifiersData["arrow#persistent"]
          ? t.modifiersData["arrow#persistent"].padding
          : getFreshSideObject(),
        B = j[k],
        U = j[x],
        F = within(0, O[E], N[E]),
        H = v ? O[E] / 2 - I - F - B - M : R - F - B - M,
        z = v ? -O[E] / 2 + I + F + U + M : D + F + U + M,
        W = t.elements.arrow && getOffsetParent(t.elements.arrow),
        Y = W ? ("y" === _ ? W.clientTop || 0 : W.clientLeft || 0) : 0,
        q = t.modifiersData.offset ? t.modifiersData.offset[t.placement][_] : 0,
        V = T[_] + H - q - Y,
        G = T[_] + z - q,
        Z = within(d ? Math.min($, V) : $, C, d ? Math.max(P, G) : P);
      (T[_] = Z), (S[_] = Z - C);
    }
    if (s) {
      var X = "x" === _ ? top : left,
        K = "x" === _ ? bottom : right,
        Q = T[w],
        J = within(Q + m[X], Q, Q - m[K]);
      (T[w] = J), (S[w] = J - Q);
    }
    t.modifiersData[n] = S;
  }
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"],
};
function arrow(e) {
  var t,
    r = e.state,
    n = e.name,
    o = r.elements.arrow,
    a = r.modifiersData.popperOffsets,
    i = getBasePlacement(r.placement),
    s = getMainAxisFromPlacement(i),
    u = [left, right].indexOf(i) >= 0 ? "height" : "width";
  if (o && a) {
    var c = r.modifiersData[n + "#persistent"].padding,
      l = getLayoutRect(o),
      f = "y" === s ? top : left,
      p = "y" === s ? bottom : right,
      d =
        r.rects.reference[u] + r.rects.reference[s] - a[s] - r.rects.popper[u],
      h = a[s] - r.rects.reference[s],
      g = getOffsetParent(o),
      m = g ? ("y" === s ? g.clientHeight || 0 : g.clientWidth || 0) : 0,
      y = d / 2 - h / 2,
      b = c[f],
      v = m - l[u] - c[p],
      _ = m / 2 - l[u] / 2 + y,
      w = within(b, _, v),
      T = s;
    r.modifiersData[n] = (((t = {})[T] = w), (t.centerOffset = w - _), t);
  }
}
function effect$2(e) {
  var t = e.state,
    r = e.options,
    n = e.name,
    o = r.element,
    a = void 0 === o ? "[data-popper-arrow]" : o,
    i = r.padding,
    s = void 0 === i ? 0 : i;
  null != a &&
    ("string" != typeof a || (a = t.elements.popper.querySelector(a))) &&
    contains(t.elements.popper, a) &&
    ((t.elements.arrow = a),
    (t.modifiersData[n + "#persistent"] = {
      padding: mergePaddingObject(
        "number" != typeof s ? s : expandToHashMap(s, basePlacements)
      ),
    }));
}
var arrow$1 = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: arrow,
  effect: effect$2,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"],
};
function getSideOffsets(e, t, r) {
  return (
    void 0 === r &&
      (r = {
        x: 0,
        y: 0,
      }),
    {
      top: e.top - t.height - r.y,
      right: e.right - t.width + r.x,
      bottom: e.bottom - t.height + r.y,
      left: e.left - t.width - r.x,
    }
  );
}
function isAnySideFullyClipped(e) {
  return [top, right, bottom, left].some(function (t) {
    return e[t] >= 0;
  });
}
function hide(e) {
  var t = e.state,
    r = e.name,
    n = t.rects.reference,
    o = t.rects.popper,
    a = t.modifiersData.preventOverflow,
    i = detectOverflow(t, {
      elementContext: "reference",
    }),
    s = detectOverflow(t, {
      altBoundary: !0,
    }),
    u = getSideOffsets(i, n),
    c = getSideOffsets(s, o, a),
    l = isAnySideFullyClipped(u),
    f = isAnySideFullyClipped(c);
  (t.modifiersData[r] = {
    referenceClippingOffsets: u,
    popperEscapeOffsets: c,
    isReferenceHidden: l,
    hasPopperEscaped: f,
  }),
    (t.attributes.popper = Object.assign(
      Object.assign({}, t.attributes.popper),
      {},
      {
        "data-popper-reference-hidden": l,
        "data-popper-escaped": f,
      }
    ));
}
var hide$1 = {
    name: "hide",
    enabled: !0,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: hide,
  },
  defaultModifiers = [
    eventListeners,
    popperOffsets$1,
    computeStyles$1,
    applyStyles$1,
    offset$1,
    flip$1,
    preventOverflow$1,
    arrow$1,
    hide$1,
  ],
  createPopper = popperGenerator({
    defaultModifiers,
  }),
  BOX_CLASS = "tippy-box",
  CONTENT_CLASS = "tippy-content",
  BACKDROP_CLASS = "tippy-backdrop",
  ARROW_CLASS = "tippy-arrow",
  SVG_ARROW_CLASS = "tippy-svg-arrow",
  TOUCH_OPTIONS = {
    passive: !0,
    capture: !0,
  };
function hasOwnProperty$d(e, t) {
  return {}.hasOwnProperty.call(e, t);
}
function getValueAtIndexOrReturn(e, t, r) {
  if (Array.isArray(e)) {
    var n = e[t];
    return null == n ? (Array.isArray(r) ? r[t] : r) : n;
  }
  return e;
}
function isType(e, t) {
  var r = {}.toString.call(e);
  return 0 === r.indexOf("[object") && r.indexOf(t + "]") > -1;
}
function invokeWithArgsOrReturn(e, t) {
  return "function" == typeof e ? e.apply(void 0, t) : e;
}
function debounce$2(e, t) {
  return 0 === t
    ? e
    : function (n) {
        clearTimeout(r),
          (r = setTimeout(function () {
            e(n);
          }, t));
      };
  var r;
}
function removeProperties(e, t) {
  var r = Object.assign({}, e);
  return (
    t.forEach(function (e) {
      delete r[e];
    }),
    r
  );
}
function splitBySpaces(e) {
  return e.split(/\s+/).filter(Boolean);
}
function normalizeToArray(e) {
  return [].concat(e);
}
function pushIfUnique(e, t) {
  -1 === e.indexOf(t) && e.push(t);
}
function unique(e) {
  return e.filter(function (t, r) {
    return e.indexOf(t) === r;
  });
}
function getBasePlacement$1(e) {
  return e.split("-")[0];
}
function arrayFrom(e) {
  return [].slice.call(e);
}
function removeUndefinedProps(e) {
  return Object.keys(e).reduce(function (t, r) {
    return void 0 !== e[r] && (t[r] = e[r]), t;
  }, {});
}
function div() {
  return document.createElement("div");
}
function isElement$1(e) {
  return ["Element", "Fragment"].some(function (t) {
    return isType(e, t);
  });
}
function isNodeList(e) {
  return isType(e, "NodeList");
}
function isMouseEvent(e) {
  return isType(e, "MouseEvent");
}
function isReferenceElement(e) {
  return !(!e || !e._tippy || e._tippy.reference !== e);
}
function getArrayOfElements(e) {
  return isElement$1(e)
    ? [e]
    : isNodeList(e)
    ? arrayFrom(e)
    : Array.isArray(e)
    ? e
    : arrayFrom(document.querySelectorAll(e));
}
function setTransitionDuration(e, t) {
  e.forEach(function (e) {
    e && (e.style.transitionDuration = t + "ms");
  });
}
function setVisibilityState(e, t) {
  e.forEach(function (e) {
    e && e.setAttribute("data-state", t);
  });
}
function getOwnerDocument(e) {
  var t = normalizeToArray(e)[0];
  return (t && t.ownerDocument) || document;
}
function isCursorOutsideInteractiveBorder(e, t) {
  var r = t.clientX,
    n = t.clientY;
  return e.every(function (e) {
    var t = e.popperRect,
      o = e.popperState,
      a = e.props.interactiveBorder,
      i = getBasePlacement$1(o.placement),
      s = o.modifiersData.offset;
    if (!s) return !0;
    var u = "bottom" === i ? s.top.y : 0,
      c = "top" === i ? s.bottom.y : 0,
      l = "right" === i ? s.left.x : 0,
      f = "left" === i ? s.right.x : 0,
      p = t.top - n + u > a,
      d = n - t.bottom - c > a,
      h = t.left - r + l > a,
      g = r - t.right - f > a;
    return p || d || h || g;
  });
}
function updateTransitionEndListener(e, t, r) {
  var n = t + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function (t) {
    e[n](t, r);
  });
}
var currentInput = {
    isTouch: !1,
  },
  lastMouseMoveTime = 0;
function onDocumentTouchStart() {
  currentInput.isTouch ||
    ((currentInput.isTouch = !0),
    window.performance &&
      document.addEventListener("mousemove", onDocumentMouseMove));
}
function onDocumentMouseMove() {
  var e = performance.now();
  e - lastMouseMoveTime < 20 &&
    ((currentInput.isTouch = !1),
    document.removeEventListener("mousemove", onDocumentMouseMove)),
    (lastMouseMoveTime = e);
}
function onWindowBlur() {
  var e = document.activeElement;
  if (isReferenceElement(e)) {
    var t = e._tippy;
    e.blur && !t.state.isVisible && e.blur();
  }
}
function bindGlobalEventListeners() {
  document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS),
    window.addEventListener("blur", onWindowBlur);
}
var isBrowser = "undefined" != typeof window && "undefined" != typeof document,
  ua = isBrowser ? navigator.userAgent : "",
  isIE = /MSIE |Trident\//.test(ua),
  visitedMessages;
function createMemoryLeakWarning(e) {
  return [
    e +
      "() was called on a" +
      ("destroy" === e ? "n already-" : " ") +
      "destroyed instance. This is a no-op but",
    "indicates a potential memory leak.",
  ].join(" ");
}
function clean(e) {
  return e
    .replace(/[ \t]{2,}/g, " ")
    .replace(/^[ \t]*/gm, "")
    .trim();
}
function getDevMessage(e) {
  return clean(
    "\n  %ctippy.js\n\n  %c" +
      clean(e) +
      "\n\n  %c👷‍ This is a development-only message. It will be removed in production.\n  "
  );
}
function getFormattedMessage(e) {
  return [
    getDevMessage(e),
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    "line-height: 1.5",
    "color: #a6a095;",
  ];
}
function resetVisitedMessages() {
  visitedMessages = new Set();
}
function warnWhen(e, t) {
  var r;
  e &&
    !visitedMessages.has(t) &&
    (visitedMessages.add(t),
    (r = console).warn.apply(r, getFormattedMessage(t)));
}
function errorWhen(e, t) {
  var r;
  e &&
    !visitedMessages.has(t) &&
    (visitedMessages.add(t),
    (r = console).error.apply(r, getFormattedMessage(t)));
}
function validateTargets(e) {
  var t = !e,
    r =
      "[object Object]" === Object.prototype.toString.call(e) &&
      !e.addEventListener;
  errorWhen(
    t,
    [
      "tippy() was passed",
      "`" + String(e) + "`",
      "as its targets (first) argument. Valid types are: String, Element,",
      "Element[], or NodeList.",
    ].join(" ")
  ),
    errorWhen(
      r,
      [
        "tippy() was passed a plain object which is not supported as an argument",
        "for virtual positioning. Use props.getReferenceClientRect instead.",
      ].join(" ")
    );
}
var pluginProps = {
    animateFill: !1,
    followCursor: !1,
    inlinePositioning: !1,
    sticky: !1,
  },
  renderProps = {
    allowHTML: !1,
    animation: "fade",
    arrow: !0,
    content: "",
    inertia: !1,
    maxWidth: 350,
    role: "tooltip",
    theme: "",
    zIndex: 9999,
  },
  defaultProps = Object.assign(
    {
      appendTo: function () {
        return document.body;
      },
      aria: {
        content: "auto",
        expanded: "auto",
      },
      delay: 0,
      duration: [300, 250],
      getReferenceClientRect: null,
      hideOnClick: !0,
      ignoreAttributes: !1,
      interactive: !1,
      interactiveBorder: 2,
      interactiveDebounce: 0,
      moveTransition: "",
      offset: [0, 10],
      onAfterUpdate: function () {},
      onBeforeUpdate: function () {},
      onCreate: function () {},
      onDestroy: function () {},
      onHidden: function () {},
      onHide: function () {},
      onMount: function () {},
      onShow: function () {},
      onShown: function () {},
      onTrigger: function () {},
      onUntrigger: function () {},
      onClickOutside: function () {},
      placement: "top",
      plugins: [],
      popperOptions: {},
      render: null,
      showOnCreate: !1,
      touch: !0,
      trigger: "mouseenter focus",
      triggerTarget: null,
    },
    pluginProps,
    {},
    renderProps
  ),
  defaultKeys = Object.keys(defaultProps),
  setDefaultProps = function (e) {
    Object.keys(e).forEach(function (t) {
      defaultProps[t] = e[t];
    });
  };
function getExtendedPassedProps(e) {
  var t = (e.plugins || []).reduce(function (t, r) {
    var n = r.name,
      o = r.defaultValue;
    return n && (t[n] = void 0 !== e[n] ? e[n] : o), t;
  }, {});
  return Object.assign({}, e, {}, t);
}
function getDataAttributeProps(e, t) {
  return (t
    ? Object.keys(
        getExtendedPassedProps(
          Object.assign({}, defaultProps, {
            plugins: t,
          })
        )
      )
    : defaultKeys
  ).reduce(function (t, r) {
    var n = (e.getAttribute("data-tippy-" + r) || "").trim();
    if (!n) return t;
    if ("content" === r) t[r] = n;
    else
      try {
        t[r] = JSON.parse(n);
      } catch (e) {
        t[r] = n;
      }
    return t;
  }, {});
}
function evaluateProps(e, t) {
  var r = Object.assign(
    {},
    t,
    {
      content: invokeWithArgsOrReturn(t.content, [e]),
    },
    t.ignoreAttributes ? {} : getDataAttributeProps(e, t.plugins)
  );
  return (
    (r.aria = Object.assign({}, defaultProps.aria, {}, r.aria)),
    (r.aria = {
      expanded: "auto" === r.aria.expanded ? t.interactive : r.aria.expanded,
      content:
        "auto" === r.aria.content
          ? t.interactive
            ? null
            : "describedby"
          : r.aria.content,
    }),
    r
  );
}
function validateProps(e, t) {
  void 0 === e && (e = {}),
    void 0 === t && (t = []),
    Object.keys(e).forEach(function (e) {
      var r = !hasOwnProperty$d(
        removeProperties(defaultProps, Object.keys(pluginProps)),
        e
      );
      r &&
        (r =
          0 ===
          t.filter(function (t) {
            return t.name === e;
          }).length),
        warnWhen(
          r,
          [
            "`" + e + "`",
            "is not a valid prop. You may have spelled it incorrectly, or if it's",
            "a plugin, forgot to pass it in an array as props.plugins.",
            "\n\n",
            "All props: https://atomiks.github.io/tippyjs/v6/all-props/\n",
            "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/",
          ].join(" ")
        );
    });
}
var innerHTML = function () {
  return "innerHTML";
};
function dangerouslySetInnerHTML(e, t) {
  e[innerHTML()] = t;
}
function createArrowElement(e) {
  var t = div();
  return (
    !0 === e
      ? (t.className = ARROW_CLASS)
      : ((t.className = SVG_ARROW_CLASS),
        isElement$1(e) ? t.appendChild(e) : dangerouslySetInnerHTML(t, e)),
    t
  );
}
function setContent(e, t) {
  isElement$1(t.content)
    ? (dangerouslySetInnerHTML(e, ""), e.appendChild(t.content))
    : "function" != typeof t.content &&
      (t.allowHTML
        ? dangerouslySetInnerHTML(e, t.content)
        : (e.textContent = t.content));
}
function getChildren(e) {
  var t = e.firstElementChild,
    r = arrayFrom(t.children);
  return {
    box: t,
    content: r.find(function (e) {
      return e.classList.contains(CONTENT_CLASS);
    }),
    arrow: r.find(function (e) {
      return (
        e.classList.contains(ARROW_CLASS) ||
        e.classList.contains(SVG_ARROW_CLASS)
      );
    }),
    backdrop: r.find(function (e) {
      return e.classList.contains(BACKDROP_CLASS);
    }),
  };
}
function render(e) {
  var t = div(),
    r = div();
  (r.className = BOX_CLASS),
    r.setAttribute("data-state", "hidden"),
    r.setAttribute("tabindex", "-1");
  var n = div();
  function o(r, n) {
    var o = getChildren(t),
      a = o.box,
      i = o.content,
      s = o.arrow;
    n.theme
      ? a.setAttribute("data-theme", n.theme)
      : a.removeAttribute("data-theme"),
      "string" == typeof n.animation
        ? a.setAttribute("data-animation", n.animation)
        : a.removeAttribute("data-animation"),
      n.inertia
        ? a.setAttribute("data-inertia", "")
        : a.removeAttribute("data-inertia"),
      (a.style.maxWidth =
        "number" == typeof n.maxWidth ? n.maxWidth + "px" : n.maxWidth),
      n.role ? a.setAttribute("role", n.role) : a.removeAttribute("role"),
      (r.content === n.content && r.allowHTML === n.allowHTML) ||
        setContent(i, e.props),
      n.arrow
        ? s
          ? r.arrow !== n.arrow &&
            (a.removeChild(s), a.appendChild(createArrowElement(n.arrow)))
          : a.appendChild(createArrowElement(n.arrow))
        : s && a.removeChild(s);
  }
  return (
    (n.className = CONTENT_CLASS),
    n.setAttribute("data-state", "hidden"),
    setContent(n, e.props),
    t.appendChild(r),
    r.appendChild(n),
    o(e.props, e.props),
    {
      popper: t,
      onUpdate: o,
    }
  );
}
render.$$tippy = !0;
var idCounter = 1,
  mouseMoveListeners = [],
  mountedInstances = [];
function createTippy(e, t) {
  var r,
    n,
    o,
    a,
    i,
    s,
    u,
    c = evaluateProps(
      e,
      Object.assign(
        {},
        defaultProps,
        {},
        getExtendedPassedProps(removeUndefinedProps(t))
      )
    ),
    l = !1,
    f = !1,
    p = !1,
    d = !1,
    h = [],
    g = debounce$2(q, c.interactiveDebounce),
    m = getOwnerDocument(c.triggerTarget || e),
    y = idCounter++,
    b = unique(c.plugins),
    v = {
      id: y,
      reference: e,
      popper: div(),
      popperInstance: null,
      props: c,
      state: {
        isEnabled: !0,
        isVisible: !1,
        isDestroyed: !1,
        isMounted: !1,
        isShown: !1,
      },
      plugins: b,
      clearDelayTimeouts: function () {
        clearTimeout(r), clearTimeout(n), cancelAnimationFrame(o);
      },
      setProps: function (t) {
        if (!v.state.isDestroyed) {
          P("onBeforeUpdate", [v, t]), W();
          var r = v.props,
            n = evaluateProps(
              e,
              Object.assign({}, v.props, {}, t, {
                ignoreAttributes: !0,
              })
            );
          (v.props = n),
            z(),
            r.interactiveDebounce !== n.interactiveDebounce &&
              (D(), (g = debounce$2(q, n.interactiveDebounce))),
            r.triggerTarget && !n.triggerTarget
              ? normalizeToArray(r.triggerTarget).forEach(function (e) {
                  e.removeAttribute("aria-expanded");
                })
              : n.triggerTarget && e.removeAttribute("aria-expanded"),
            R(),
            $(),
            T && T(r, n),
            v.popperInstance &&
              (X(),
              Q().forEach(function (e) {
                requestAnimationFrame(e._tippy.popperInstance.forceUpdate);
              })),
            P("onAfterUpdate", [v, t]);
        }
      },
      setContent: function (e) {
        v.setProps({
          content: e,
        });
      },
      show: function () {
        var e = v.state.isVisible,
          t = v.state.isDestroyed,
          r = !v.state.isEnabled,
          n = currentInput.isTouch && !v.props.touch,
          o = getValueAtIndexOrReturn(
            v.props.duration,
            0,
            defaultProps.duration
          );
        if (
          !(
            e ||
            t ||
            r ||
            n ||
            x().hasAttribute("disabled") ||
            (P("onShow", [v], !1), !1 === v.props.onShow(v))
          )
        ) {
          if (
            ((v.state.isVisible = !0),
            k() && (w.style.visibility = "visible"),
            $(),
            B(),
            v.state.isMounted || (w.style.transition = "none"),
            k())
          ) {
            var a = E();
            setTransitionDuration([a.box, a.content], 0);
          }
          (s = function () {
            if (v.state.isVisible && !d) {
              if (
                ((d = !0),
                w.offsetHeight,
                (w.style.transition = v.props.moveTransition),
                k() && v.props.animation)
              ) {
                var e = E(),
                  t = e.box,
                  r = e.content;
                setTransitionDuration([t, r], o),
                  setVisibilityState([t, r], "visible");
              }
              I(),
                R(),
                pushIfUnique(mountedInstances, v),
                (v.state.isMounted = !0),
                P("onMount", [v]),
                v.props.animation &&
                  k() &&
                  (function (e, t) {
                    F(e, function () {
                      (v.state.isShown = !0), P("onShown", [v]);
                    });
                  })(o);
            }
          }),
            (function () {
              var e,
                t = v.props.appendTo,
                r = x();
              (e =
                (v.props.interactive && t === defaultProps.appendTo) ||
                "parent" === t
                  ? r.parentNode
                  : invokeWithArgsOrReturn(t, [r])).contains(w) ||
                e.appendChild(w),
                X();
            })();
        }
      },
      hide: function () {
        var e = !v.state.isVisible,
          t = v.state.isDestroyed,
          r = !v.state.isEnabled,
          n = getValueAtIndexOrReturn(
            v.props.duration,
            1,
            defaultProps.duration
          );
        if (
          !(e || t || r) &&
          (P("onHide", [v], !1), !1 !== v.props.onHide(v))
        ) {
          if (
            ((v.state.isVisible = !1),
            (v.state.isShown = !1),
            (d = !1),
            (l = !1),
            k() && (w.style.visibility = "hidden"),
            D(),
            U(),
            $(),
            k())
          ) {
            var o = E(),
              a = o.box,
              i = o.content;
            v.props.animation &&
              (setTransitionDuration([a, i], n),
              setVisibilityState([a, i], "hidden"));
          }
          I(),
            R(),
            v.props.animation
              ? k() &&
                (function (e, t) {
                  F(e, function () {
                    !v.state.isVisible &&
                      w.parentNode &&
                      w.parentNode.contains(w) &&
                      t();
                  });
                })(n, v.unmount)
              : v.unmount();
        }
      },
      hideWithInteractivity: function (e) {
        m.addEventListener("mousemove", g),
          pushIfUnique(mouseMoveListeners, g),
          g(e);
      },
      enable: function () {
        v.state.isEnabled = !0;
      },
      disable: function () {
        v.hide(), (v.state.isEnabled = !1);
      },
      unmount: function () {
        v.state.isVisible && v.hide(),
          v.state.isMounted &&
            (K(),
            Q().forEach(function (e) {
              e._tippy.unmount();
            }),
            w.parentNode && w.parentNode.removeChild(w),
            (mountedInstances = mountedInstances.filter(function (e) {
              return e !== v;
            })),
            (v.state.isMounted = !1),
            P("onHidden", [v]));
      },
      destroy: function () {
        v.state.isDestroyed ||
          (v.clearDelayTimeouts(),
          v.unmount(),
          W(),
          delete e._tippy,
          (v.state.isDestroyed = !0),
          P("onDestroy", [v]));
      },
    };
  if (!c.render) return v;
  var _ = c.render(v),
    w = _.popper,
    T = _.onUpdate;
  w.setAttribute("data-tippy-root", ""),
    (w.id = "tippy-" + v.id),
    (v.popper = w),
    (e._tippy = v),
    (w._tippy = v);
  var O = b.map(function (e) {
      return e.fn(v);
    }),
    A = e.hasAttribute("aria-expanded");
  return (
    z(),
    R(),
    $(),
    P("onCreate", [v]),
    c.showOnCreate && J(),
    w.addEventListener("mouseenter", function () {
      v.props.interactive && v.state.isVisible && v.clearDelayTimeouts();
    }),
    w.addEventListener("mouseleave", function (e) {
      v.props.interactive &&
        v.props.trigger.indexOf("mouseenter") >= 0 &&
        (m.addEventListener("mousemove", g), g(e));
    }),
    v
  );
  function M() {
    var e = v.props.touch;
    return Array.isArray(e) ? e : [e, 0];
  }
  function S() {
    return "hold" === M()[0];
  }
  function k() {
    var e;
    return !!(null == (e = v.props.render) ? void 0 : e.$$tippy);
  }
  function x() {
    return u || e;
  }
  function E() {
    return getChildren(w);
  }
  function C(e) {
    return (v.state.isMounted && !v.state.isVisible) ||
      currentInput.isTouch ||
      (a && "focus" === a.type)
      ? 0
      : getValueAtIndexOrReturn(v.props.delay, e ? 0 : 1, defaultProps.delay);
  }
  function $() {
    (w.style.pointerEvents =
      v.props.interactive && v.state.isVisible ? "" : "none"),
      (w.style.zIndex = "" + v.props.zIndex);
  }
  function P(e, t, r) {
    var n;
    void 0 === r && (r = !0),
      O.forEach(function (r) {
        r[e] && r[e].apply(void 0, t);
      }),
      r && (n = v.props)[e].apply(n, t);
  }
  function I() {
    var t = v.props.aria;
    if (t.content) {
      var r = "aria-" + t.content,
        n = w.id;
      normalizeToArray(v.props.triggerTarget || e).forEach(function (e) {
        var t = e.getAttribute(r);
        if (v.state.isVisible) e.setAttribute(r, t ? t + " " + n : n);
        else {
          var o = t && t.replace(n, "").trim();
          o ? e.setAttribute(r, o) : e.removeAttribute(r);
        }
      });
    }
  }
  function R() {
    !A &&
      v.props.aria.expanded &&
      normalizeToArray(v.props.triggerTarget || e).forEach(function (e) {
        v.props.interactive
          ? e.setAttribute(
              "aria-expanded",
              v.state.isVisible && e === x() ? "true" : "false"
            )
          : e.removeAttribute("aria-expanded");
      });
  }
  function D() {
    m.removeEventListener("mousemove", g),
      (mouseMoveListeners = mouseMoveListeners.filter(function (e) {
        return e !== g;
      }));
  }
  function L(e) {
    if (
      !(
        (currentInput.isTouch && (p || "mousedown" === e.type)) ||
        (v.props.interactive && w.contains(e.target))
      )
    ) {
      if (x().contains(e.target)) {
        if (currentInput.isTouch) return;
        if (v.state.isVisible && v.props.trigger.indexOf("click") >= 0) return;
      } else P("onClickOutside", [v, e]);
      !0 === v.props.hideOnClick &&
        (v.clearDelayTimeouts(),
        v.hide(),
        (f = !0),
        setTimeout(function () {
          f = !1;
        }),
        v.state.isMounted || U());
    }
  }
  function N() {
    p = !0;
  }
  function j() {
    p = !1;
  }
  function B() {
    m.addEventListener("mousedown", L, !0),
      m.addEventListener("touchend", L, TOUCH_OPTIONS),
      m.addEventListener("touchstart", j, TOUCH_OPTIONS),
      m.addEventListener("touchmove", N, TOUCH_OPTIONS);
  }
  function U() {
    m.removeEventListener("mousedown", L, !0),
      m.removeEventListener("touchend", L, TOUCH_OPTIONS),
      m.removeEventListener("touchstart", j, TOUCH_OPTIONS),
      m.removeEventListener("touchmove", N, TOUCH_OPTIONS);
  }
  function F(e, t) {
    var r = E().box;
    function n(e) {
      e.target === r && (updateTransitionEndListener(r, "remove", n), t());
    }
    if (0 === e) return t();
    updateTransitionEndListener(r, "remove", i),
      updateTransitionEndListener(r, "add", n),
      (i = n);
  }
  function H(t, r, n) {
    void 0 === n && (n = !1),
      normalizeToArray(v.props.triggerTarget || e).forEach(function (e) {
        e.addEventListener(t, r, n),
          h.push({
            node: e,
            eventType: t,
            handler: r,
            options: n,
          });
      });
  }
  function z() {
    S() &&
      (H("touchstart", Y, {
        passive: !0,
      }),
      H("touchend", V, {
        passive: !0,
      })),
      splitBySpaces(v.props.trigger).forEach(function (e) {
        if ("manual" !== e)
          switch ((H(e, Y), e)) {
            case "mouseenter":
              H("mouseleave", V);
              break;
            case "focus":
              H(isIE ? "focusout" : "blur", G);
              break;
            case "focusin":
              H("focusout", G);
          }
      });
  }
  function W() {
    h.forEach(function (e) {
      var t = e.node,
        r = e.eventType,
        n = e.handler,
        o = e.options;
      t.removeEventListener(r, n, o);
    }),
      (h = []);
  }
  function Y(e) {
    var t,
      r = !1;
    if (v.state.isEnabled && !Z(e) && !f) {
      var n = "focus" === (null == (t = a) ? void 0 : t.type);
      (a = e),
        (u = e.currentTarget),
        R(),
        !v.state.isVisible &&
          isMouseEvent(e) &&
          mouseMoveListeners.forEach(function (t) {
            return t(e);
          }),
        "click" === e.type &&
        (v.props.trigger.indexOf("mouseenter") < 0 || l) &&
        !1 !== v.props.hideOnClick &&
        v.state.isVisible
          ? (r = !0)
          : J(e),
        "click" === e.type && (l = !r),
        r && !n && ee(e);
    }
  }
  function q(e) {
    var t = e.target,
      r = x().contains(t) || w.contains(t);
    ("mousemove" === e.type && r) ||
      (isCursorOutsideInteractiveBorder(
        Q()
          .concat(w)
          .map(function (e) {
            var t,
              r = null == (t = e._tippy.popperInstance) ? void 0 : t.state;
            return r
              ? {
                  popperRect: e.getBoundingClientRect(),
                  popperState: r,
                  props: c,
                }
              : null;
          })
          .filter(Boolean),
        e
      ) &&
        (D(), ee(e)));
  }
  function V(e) {
    Z(e) ||
      (v.props.trigger.indexOf("click") >= 0 && l) ||
      (v.props.interactive ? v.hideWithInteractivity(e) : ee(e));
  }
  function G(e) {
    (v.props.trigger.indexOf("focusin") < 0 && e.target !== x()) ||
      (v.props.interactive && e.relatedTarget && w.contains(e.relatedTarget)) ||
      ee(e);
  }
  function Z(e) {
    return !!currentInput.isTouch && S() !== e.type.indexOf("touch") >= 0;
  }
  function X() {
    K();
    var t = v.props,
      r = t.popperOptions,
      n = t.placement,
      o = t.offset,
      a = t.getReferenceClientRect,
      i = t.moveTransition,
      u = k() ? getChildren(w).arrow : null,
      c = a
        ? {
            getBoundingClientRect: a,
            contextElement: a.contextElement || x(),
          }
        : e,
      l = [
        {
          name: "offset",
          options: {
            offset: o,
          },
        },
        {
          name: "preventOverflow",
          options: {
            padding: {
              top: 2,
              bottom: 2,
              left: 5,
              right: 5,
            },
          },
        },
        {
          name: "flip",
          options: {
            padding: 5,
          },
        },
        {
          name: "computeStyles",
          options: {
            adaptive: !i,
          },
        },
        {
          name: "$$tippy",
          enabled: !0,
          phase: "beforeWrite",
          requires: ["computeStyles"],
          fn: function (e) {
            var t = e.state;
            if (k()) {
              var r = E().box;
              ["placement", "reference-hidden", "escaped"].forEach(function (
                e
              ) {
                "placement" === e
                  ? r.setAttribute("data-placement", t.placement)
                  : t.attributes.popper["data-popper-" + e]
                  ? r.setAttribute("data-" + e, "")
                  : r.removeAttribute("data-" + e);
              }),
                (t.attributes.popper = {});
            }
          },
        },
      ];
    k() &&
      u &&
      l.push({
        name: "arrow",
        options: {
          element: u,
          padding: 3,
        },
      }),
      l.push.apply(l, (null == r ? void 0 : r.modifiers) || []),
      (v.popperInstance = createPopper(
        c,
        w,
        Object.assign({}, r, {
          placement: n,
          onFirstUpdate: s,
          modifiers: l,
        })
      ));
  }
  function K() {
    v.popperInstance && (v.popperInstance.destroy(), (v.popperInstance = null));
  }
  function Q() {
    return arrayFrom(w.querySelectorAll("[data-tippy-root]"));
  }
  function J(e) {
    v.clearDelayTimeouts(), e && P("onTrigger", [v, e]), B();
    var t = C(!0),
      n = M(),
      o = n[0],
      a = n[1];
    currentInput.isTouch && "hold" === o && a && (t = a),
      t
        ? (r = setTimeout(function () {
            v.show();
          }, t))
        : v.show();
  }
  function ee(e) {
    if ((v.clearDelayTimeouts(), P("onUntrigger", [v, e]), v.state.isVisible)) {
      if (
        !(
          v.props.trigger.indexOf("mouseenter") >= 0 &&
          v.props.trigger.indexOf("click") >= 0 &&
          ["mouseleave", "mousemove"].indexOf(e.type) >= 0 &&
          l
        )
      ) {
        var t = C(!1);
        t
          ? (n = setTimeout(function () {
              v.state.isVisible && v.hide();
            }, t))
          : (o = requestAnimationFrame(function () {
              v.hide();
            }));
      }
    } else U();
  }
}
function tippy(e, t) {
  void 0 === t && (t = {});
  var r = defaultProps.plugins.concat(t.plugins || []);
  bindGlobalEventListeners();
  var n = Object.assign({}, t, {
      plugins: r,
    }),
    o = getArrayOfElements(e).reduce(function (e, t) {
      var r = t && createTippy(t, n);
      return r && e.push(r), e;
    }, []);
  return isElement$1(e) ? o[0] : o;
}
(tippy.defaultProps = defaultProps),
  (tippy.setDefaultProps = setDefaultProps),
  (tippy.currentInput = currentInput),
  tippy.setDefaultProps({
    render,
  });
function baseFindIndex(e, t, r, n) {
  for (var o = e.length, a = r + (n ? 1 : -1); n ? a-- : ++a < o; )
    if (t(e[a], a, e)) return a;
  return -1;
}
var _baseFindIndex = baseFindIndex;
function baseIsNaN(e) {
  return e != e;
}
var _baseIsNaN = baseIsNaN;
function strictIndexOf(e, t, r) {
  for (var n = r - 1, o = e.length; ++n < o; ) if (e[n] === t) return n;
  return -1;
}
var _strictIndexOf = strictIndexOf;
function baseIndexOf(e, t, r) {
  return t == t ? _strictIndexOf(e, t, r) : _baseFindIndex(e, _baseIsNaN, r);
}
var _baseIndexOf = baseIndexOf;
function arrayIncludes(e, t) {
  return !(null == e || !e.length) && _baseIndexOf(e, t, 0) > -1;
}
var _arrayIncludes = arrayIncludes;
function arrayIncludesWith(e, t, r) {
  for (var n = -1, o = null == e ? 0 : e.length; ++n < o; )
    if (r(t, e[n])) return !0;
  return !1;
}
var _arrayIncludesWith = arrayIncludesWith,
  LARGE_ARRAY_SIZE$1 = 200;
function baseDifference(e, t, r, n) {
  var o = -1,
    a = _arrayIncludes,
    i = !0,
    s = e.length,
    u = [],
    c = t.length;
  if (!s) return u;
  r && (t = _arrayMap(t, _baseUnary(r))),
    n
      ? ((a = _arrayIncludesWith), (i = !1))
      : t.length >= LARGE_ARRAY_SIZE$1 &&
        ((a = _cacheHas), (i = !1), (t = new _SetCache(t)));
  e: for (; ++o < s; ) {
    var l = e[o],
      f = null == r ? l : r(l);
    if (((l = n || 0 !== l ? l : 0), i && f == f)) {
      for (var p = c; p--; ) if (t[p] === f) continue e;
      u.push(l);
    } else a(t, f, n) || u.push(l);
  }
  return u;
}
var _baseDifference = baseDifference;
function isArrayLikeObject(e) {
  return isObjectLike_1(e) && isArrayLike_1(e);
}
var isArrayLikeObject_1 = isArrayLikeObject,
  without = _baseRest(function (e, t) {
    return isArrayLikeObject_1(e) ? _baseDifference(e, t) : [];
  }),
  without_1 = without;
function baseSet(e, t, r, n) {
  if (!isObject_1(e)) return e;
  for (
    var o = -1, a = (t = _castPath(t, e)).length, i = a - 1, s = e;
    null != s && ++o < a;

  ) {
    var u = _toKey(t[o]),
      c = r;
    if (o != i) {
      var l = s[u];
      void 0 === (c = n ? n(l, u, s) : void 0) &&
        (c = isObject_1(l) ? l : _isIndex(t[o + 1]) ? [] : {});
    }
    _assignValue(s, u, c), (s = s[u]);
  }
  return e;
}
var _baseSet = baseSet;
function set(e, t, r) {
  return null == e ? e : _baseSet(e, t, r);
}
var set_1 = set;
function formatNum(e, t = 1) {
  const r = Math.pow(10, t);
  return Math.round(+e * r) / r;
}
function formatNumCeil(e, t = 1) {
  const r = Math.pow(10, t);
  return Math.ceil(+e * r) / r;
}
function formatSizeSimple(e, t = 1) {
  const r = Math.abs(e);
  return r > 1e9
    ? round(e / 1e9, 2) + "b"
    : r >= 1e6
    ? round(e / 1e6, 2) + "m"
    : r >= 1e4
    ? round(e / 1e3, 0) + "k"
    : r >= 1e3
    ? round(e / 1e3, 1) + "k"
    : round(e, t).toString();
}
function formatSize(e, t = 1) {
  const r = Math.abs(e);
  return r > 1e9
    ? round(e / 1e9, 2) + "b"
    : r >= 1e6
    ? round(e / 1e6, 2) + "m"
    : r >= 1e5
    ? round(e / 1e3, 0) + "k"
    : r >= 1e4
    ? round(e / 1e3, 1) + "k"
    : r >= 1e3
    ? round(e, 0).toString()
    : r >= 100
    ? round(e, 1).toString()
    : round(e, t).toString();
}
function formatPrice(e, t = 8) {
  return void 0 === e
    ? ""
    : Math.abs(e) >= 1e5
    ? formatSize(e, t) + " "
    : Math.abs(e) < 10
    ? formatNum(e, t)
    : formatNum(e, t) + (e === (0 | e) ? ".0" : "");
}
function formatDuration(e) {
  const t = e < 0 ? -e : e,
    r = e <= 0 ? "-" : "",
    n = Math.floor(t / 864e5),
    o = Math.floor(t / 36e5) % 24,
    a = Math.floor(t / 6e4) % 60;
  return 0 !== n && 0 === a
    ? r + n + "d " + minTwoDigits$1(o) + ":" + minTwoDigits$1(a)
    : 0 !== o
    ? r + minTwoDigits$1(o) + ":" + minTwoDigits$1(a)
    : r + "00:" + a;
}
function minTwoDigits$1(e) {
  return (e < 10 ? "0" : "") + e;
}
function isArray$5(e) {
  return Array.isArray ? Array.isArray(e) : "[object Array]" === getTag$1(e);
}
const INFINITY$3 = 1 / 0;
function baseToString$1(e) {
  if ("string" == typeof e) return e;
  let t = e + "";
  return "0" == t && 1 / e == -INFINITY$3 ? "-0" : t;
}
function toString$2(e) {
  return null == e ? "" : baseToString$1(e);
}
function isString$1(e) {
  return "string" == typeof e;
}
function isNumber(e) {
  return "number" == typeof e;
}
function isBoolean(e) {
  return (
    !0 === e ||
    !1 === e ||
    (isObjectLike$1(e) && "[object Boolean]" == getTag$1(e))
  );
}
function isObject$1(e) {
  return "object" == typeof e;
}
function isObjectLike$1(e) {
  return isObject$1(e) && null !== e;
}
function isDefined(e) {
  return null != e;
}
function isBlank(e) {
  return !e.trim().length;
}
function getTag$1(e) {
  return null == e
    ? void 0 === e
      ? "[object Undefined]"
      : "[object Null]"
    : Object.prototype.toString.call(e);
}
const EXTENDED_SEARCH_UNAVAILABLE = "Extended search is not available",
  INCORRECT_INDEX_TYPE = "Incorrect 'index' type",
  LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (e) => "Invalid value for key " + e,
  PATTERN_LENGTH_TOO_LARGE = (e) => `Pattern length exceeds max of ${e}.`,
  MISSING_KEY_PROPERTY = (e) => `Missing ${e} property in key`,
  INVALID_KEY_WEIGHT_VALUE = (e) =>
    `Property 'weight' in key '${e}' must be a positive integer`,
  hasOwn = Object.prototype.hasOwnProperty;
class KeyStore {
  constructor(e) {
    (this._keys = []), (this._keyMap = {});
    let t = 0;
    e.forEach((e) => {
      let r = createKey(e);
      (t += r.weight),
        this._keys.push(r),
        (this._keyMap[r.id] = r),
        (t += r.weight);
    }),
      this._keys.forEach((e) => {
        e.weight /= t;
      });
  }
  get(e) {
    return this._keyMap[e];
  }
  keys() {
    return this._keys;
  }
  toJSON() {
    return JSON.stringify(this._keys);
  }
}
function createKey(e) {
  let t = null,
    r = null,
    n = null,
    o = 1;
  if (isString$1(e) || isArray$5(e))
    (n = e), (t = createKeyPath(e)), (r = createKeyId(e));
  else {
    if (!hasOwn.call(e, "name")) throw new Error(MISSING_KEY_PROPERTY("name"));
    const a = e.name;
    if (((n = a), hasOwn.call(e, "weight") && ((o = e.weight), o <= 0)))
      throw new Error(INVALID_KEY_WEIGHT_VALUE(a));
    (t = createKeyPath(a)), (r = createKeyId(a));
  }
  return {
    path: t,
    id: r,
    weight: o,
    src: n,
  };
}
function createKeyPath(e) {
  return isArray$5(e) ? e : e.split(".");
}
function createKeyId(e) {
  return isArray$5(e) ? e.join(".") : e;
}
function get$1(e, t) {
  let r = [],
    n = !1;
  const o = (e, t, a) => {
    if (t[a]) {
      const i = e[t[a]];
      if (!isDefined(i)) return;
      if (a === t.length - 1 && (isString$1(i) || isNumber(i) || isBoolean(i)))
        r.push(toString$2(i));
      else if (isArray$5(i)) {
        n = !0;
        for (let e = 0, r = i.length; e < r; e += 1) o(i[e], t, a + 1);
      } else t.length && o(i, t, a + 1);
    } else r.push(e);
  };
  return o(e, isString$1(t) ? t.split(".") : t, 0), n ? r : r[0];
}
const MatchOptions = {
    includeMatches: !1,
    findAllMatches: !1,
    minMatchCharLength: 1,
  },
  BasicOptions = {
    isCaseSensitive: !1,
    includeScore: !1,
    keys: [],
    shouldSort: !0,
    sortFn: (e, t) =>
      e.score === t.score
        ? e.idx < t.idx
          ? -1
          : 1
        : e.score < t.score
        ? -1
        : 1,
  },
  FuzzyOptions = {
    location: 0,
    threshold: 0.6,
    distance: 100,
  },
  AdvancedOptions = {
    useExtendedSearch: !1,
    getFn: get$1,
    ignoreLocation: !1,
    ignoreFieldNorm: !1,
  };
var Config = {
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions,
};
const SPACE = /[^ ]+/g;
function norm(e = 3) {
  const t = new Map();
  return {
    get(r) {
      const n = r.match(SPACE).length;
      if (t.has(n)) return t.get(n);
      const o = parseFloat((1 / Math.sqrt(n)).toFixed(e));
      return t.set(n, o), o;
    },
    clear() {
      t.clear();
    },
  };
}
class FuseIndex {
  constructor({ getFn: e = Config.getFn } = {}) {
    (this.norm = norm(3)),
      (this.getFn = e),
      (this.isCreated = !1),
      this.setIndexRecords();
  }
  setSources(e = []) {
    this.docs = e;
  }
  setIndexRecords(e = []) {
    this.records = e;
  }
  setKeys(e = []) {
    (this.keys = e),
      (this._keysMap = {}),
      e.forEach((e, t) => {
        this._keysMap[e.id] = t;
      });
  }
  create() {
    !this.isCreated &&
      this.docs.length &&
      ((this.isCreated = !0),
      isString$1(this.docs[0])
        ? this.docs.forEach((e, t) => {
            this._addString(e, t);
          })
        : this.docs.forEach((e, t) => {
            this._addObject(e, t);
          }),
      this.norm.clear());
  }
  add(e) {
    const t = this.size();
    isString$1(e) ? this._addString(e, t) : this._addObject(e, t);
  }
  removeAt(e) {
    this.records.splice(e, 1);
    for (let t = e, r = this.size(); t < r; t += 1) this.records[t].i -= 1;
  }
  getValueForItemAtKeyId(e, t) {
    return e[this._keysMap[t]];
  }
  size() {
    return this.records.length;
  }
  _addString(e, t) {
    if (!isDefined(e) || isBlank(e)) return;
    let r = {
      v: e,
      i: t,
      n: this.norm.get(e),
    };
    this.records.push(r);
  }
  _addObject(e, t) {
    let r = {
      i: t,
      $: {},
    };
    this.keys.forEach((t, n) => {
      let o = this.getFn(e, t.path);
      if (isDefined(o))
        if (isArray$5(o)) {
          let e = [];
          const t = [
            {
              nestedArrIndex: -1,
              value: o,
            },
          ];
          for (; t.length; ) {
            const { nestedArrIndex: r, value: n } = t.pop();
            if (isDefined(n))
              if (isString$1(n) && !isBlank(n)) {
                let t = {
                  v: n,
                  i: r,
                  n: this.norm.get(n),
                };
                e.push(t);
              } else
                isArray$5(n) &&
                  n.forEach((e, r) => {
                    t.push({
                      nestedArrIndex: r,
                      value: e,
                    });
                  });
          }
          r.$[n] = e;
        } else if (!isBlank(o)) {
          let e = {
            v: o,
            n: this.norm.get(o),
          };
          r.$[n] = e;
        }
    }),
      this.records.push(r);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records,
    };
  }
}
function createIndex(e, t, { getFn: r = Config.getFn } = {}) {
  const n = new FuseIndex({
    getFn: r,
  });
  return n.setKeys(e.map(createKey)), n.setSources(t), n.create(), n;
}
function parseIndex(e, { getFn: t = Config.getFn } = {}) {
  const { keys: r, records: n } = e,
    o = new FuseIndex({
      getFn: t,
    });
  return o.setKeys(r), o.setIndexRecords(n), o;
}
function transformMatches(e, t) {
  const r = e.matches;
  (t.matches = []),
    isDefined(r) &&
      r.forEach((e) => {
        if (!isDefined(e.indices) || !e.indices.length) return;
        const { indices: r, value: n } = e;
        let o = {
          indices: r,
          value: n,
        };
        e.key && (o.key = e.key.src),
          e.idx > -1 && (o.refIndex = e.idx),
          t.matches.push(o);
      });
}
function transformScore(e, t) {
  t.score = e.score;
}
function computeScore(
  e,
  {
    errors: t = 0,
    currentLocation: r = 0,
    expectedLocation: n = 0,
    distance: o = Config.distance,
    ignoreLocation: a = Config.ignoreLocation,
  } = {}
) {
  const i = t / e.length;
  if (a) return i;
  const s = Math.abs(n - r);
  return o ? i + s / o : s ? 1 : i;
}
function convertMaskToIndices(e = [], t = Config.minMatchCharLength) {
  let r = [],
    n = -1,
    o = -1,
    a = 0;
  for (let i = e.length; a < i; a += 1) {
    let i = e[a];
    i && -1 === n
      ? (n = a)
      : i ||
        -1 === n ||
        ((o = a - 1), o - n + 1 >= t && r.push([n, o]), (n = -1));
  }
  return e[a - 1] && a - n >= t && r.push([n, a - 1]), r;
}
const MAX_BITS = 32;
function search(
  e,
  t,
  r,
  {
    location: n = Config.location,
    distance: o = Config.distance,
    threshold: a = Config.threshold,
    findAllMatches: i = Config.findAllMatches,
    minMatchCharLength: s = Config.minMatchCharLength,
    includeMatches: u = Config.includeMatches,
    ignoreLocation: c = Config.ignoreLocation,
  } = {}
) {
  if (t.length > MAX_BITS) throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
  const l = t.length,
    f = e.length,
    p = Math.max(0, Math.min(n, f));
  let d = a,
    h = p;
  const g = s > 1 || u,
    m = g ? Array(f) : [];
  let y;
  for (; (y = e.indexOf(t, h)) > -1; ) {
    let e = computeScore(t, {
      currentLocation: y,
      expectedLocation: p,
      distance: o,
      ignoreLocation: c,
    });
    if (((d = Math.min(e, d)), (h = y + l), g)) {
      let e = 0;
      for (; e < l; ) (m[y + e] = 1), (e += 1);
    }
  }
  h = -1;
  let b = [],
    v = 1,
    _ = l + f;
  const w = 1 << (l - 1);
  for (let n = 0; n < l; n += 1) {
    let a = 0,
      s = _;
    for (; a < s; )
      computeScore(t, {
        errors: n,
        currentLocation: p + s,
        expectedLocation: p,
        distance: o,
        ignoreLocation: c,
      }) <= d
        ? (a = s)
        : (_ = s),
        (s = Math.floor((_ - a) / 2 + a));
    _ = s;
    let u = Math.max(1, p - s + 1),
      y = i ? f : Math.min(p + s, f) + l,
      T = Array(y + 2);
    T[y + 1] = (1 << n) - 1;
    for (let a = y; a >= u; a -= 1) {
      let i = a - 1,
        s = r[e.charAt(i)];
      if (
        (g && (m[i] = +!!s),
        (T[a] = ((T[a + 1] << 1) | 1) & s),
        n && (T[a] |= ((b[a + 1] | b[a]) << 1) | 1 | b[a + 1]),
        T[a] & w &&
          ((v = computeScore(t, {
            errors: n,
            currentLocation: i,
            expectedLocation: p,
            distance: o,
            ignoreLocation: c,
          })),
          v <= d))
      ) {
        if (((d = v), (h = i), h <= p)) break;
        u = Math.max(1, 2 * p - h);
      }
    }
    if (
      computeScore(t, {
        errors: n + 1,
        currentLocation: p,
        expectedLocation: p,
        distance: o,
        ignoreLocation: c,
      }) > d
    )
      break;
    b = T;
  }
  const T = {
    isMatch: h >= 0,
    score: Math.max(0.001, v),
  };
  if (g) {
    const e = convertMaskToIndices(m, s);
    e.length ? u && (T.indices = e) : (T.isMatch = !1);
  }
  return T;
}
function createPatternAlphabet(e) {
  let t = {};
  for (let r = 0, n = e.length; r < n; r += 1) {
    const o = e.charAt(r);
    t[o] = (t[o] || 0) | (1 << (n - r - 1));
  }
  return t;
}
class BitapSearch {
  constructor(
    e,
    {
      location: t = Config.location,
      threshold: r = Config.threshold,
      distance: n = Config.distance,
      includeMatches: o = Config.includeMatches,
      findAllMatches: a = Config.findAllMatches,
      minMatchCharLength: i = Config.minMatchCharLength,
      isCaseSensitive: s = Config.isCaseSensitive,
      ignoreLocation: u = Config.ignoreLocation,
    } = {}
  ) {
    if (
      ((this.options = {
        location: t,
        threshold: r,
        distance: n,
        includeMatches: o,
        findAllMatches: a,
        minMatchCharLength: i,
        isCaseSensitive: s,
        ignoreLocation: u,
      }),
      (this.pattern = s ? e : e.toLowerCase()),
      (this.chunks = []),
      !this.pattern.length)
    )
      return;
    const c = (e, t) => {
        this.chunks.push({
          pattern: e,
          alphabet: createPatternAlphabet(e),
          startIndex: t,
        });
      },
      l = this.pattern.length;
    if (l > MAX_BITS) {
      let e = 0;
      const t = l % MAX_BITS,
        r = l - t;
      for (; e < r; ) c(this.pattern.substr(e, MAX_BITS), e), (e += MAX_BITS);
      if (t) {
        const e = l - MAX_BITS;
        c(this.pattern.substr(e), e);
      }
    } else c(this.pattern, 0);
  }
  searchIn(e) {
    const { isCaseSensitive: t, includeMatches: r } = this.options;
    if ((t || (e = e.toLowerCase()), this.pattern === e)) {
      let t = {
        isMatch: !0,
        score: 0,
      };
      return r && (t.indices = [[0, e.length - 1]]), t;
    }
    const {
      location: n,
      distance: o,
      threshold: a,
      findAllMatches: i,
      minMatchCharLength: s,
      ignoreLocation: u,
    } = this.options;
    let c = [],
      l = 0,
      f = !1;
    this.chunks.forEach(({ pattern: t, alphabet: p, startIndex: d }) => {
      const { isMatch: h, score: g, indices: m } = search(e, t, p, {
        location: n + d,
        distance: o,
        threshold: a,
        findAllMatches: i,
        minMatchCharLength: s,
        includeMatches: r,
        ignoreLocation: u,
      });
      h && (f = !0), (l += g), h && m && (c = [...c, ...m]);
    });
    let p = {
      isMatch: f,
      score: f ? l / this.chunks.length : 1,
    };
    return f && r && (p.indices = c), p;
  }
}
class BaseMatch {
  constructor(e) {
    this.pattern = e;
  }
  static isMultiMatch(e) {
    return getMatch(e, this.multiRegex);
  }
  static isSingleMatch(e) {
    return getMatch(e, this.singleRegex);
  }
  search() {}
}
function getMatch(e, t) {
  const r = e.match(t);
  return r ? r[1] : null;
}
class ExactMatch extends BaseMatch {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "exact";
  }
  static get multiRegex() {
    return /^="(.*)"$/;
  }
  static get singleRegex() {
    return /^=(.*)$/;
  }
  search(e) {
    const t = e === this.pattern;
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, this.pattern.length - 1],
    };
  }
}
class InverseExactMatch extends BaseMatch {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"$/;
  }
  static get singleRegex() {
    return /^!(.*)$/;
  }
  search(e) {
    const t = -1 === e.indexOf(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, e.length - 1],
    };
  }
}
class PrefixExactMatch extends BaseMatch {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "prefix-exact";
  }
  static get multiRegex() {
    return /^\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^\^(.*)$/;
  }
  search(e) {
    const t = e.startsWith(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, this.pattern.length - 1],
    };
  }
}
class InversePrefixExactMatch extends BaseMatch {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-prefix-exact";
  }
  static get multiRegex() {
    return /^!\^"(.*)"$/;
  }
  static get singleRegex() {
    return /^!\^(.*)$/;
  }
  search(e) {
    const t = !e.startsWith(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, e.length - 1],
    };
  }
}
class SuffixExactMatch extends BaseMatch {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "suffix-exact";
  }
  static get multiRegex() {
    return /^"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^(.*)\$$/;
  }
  search(e) {
    const t = e.endsWith(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [e.length - this.pattern.length, e.length - 1],
    };
  }
}
class InverseSuffixExactMatch extends BaseMatch {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "inverse-suffix-exact";
  }
  static get multiRegex() {
    return /^!"(.*)"\$$/;
  }
  static get singleRegex() {
    return /^!(.*)\$$/;
  }
  search(e) {
    const t = !e.endsWith(this.pattern);
    return {
      isMatch: t,
      score: t ? 0 : 1,
      indices: [0, e.length - 1],
    };
  }
}
class FuzzyMatch extends BaseMatch {
  constructor(
    e,
    {
      location: t = Config.location,
      threshold: r = Config.threshold,
      distance: n = Config.distance,
      includeMatches: o = Config.includeMatches,
      findAllMatches: a = Config.findAllMatches,
      minMatchCharLength: i = Config.minMatchCharLength,
      isCaseSensitive: s = Config.isCaseSensitive,
    } = {}
  ) {
    super(e),
      (this._bitapSearch = new BitapSearch(e, {
        location: t,
        threshold: r,
        distance: n,
        includeMatches: o,
        findAllMatches: a,
        minMatchCharLength: i,
        isCaseSensitive: s,
      }));
  }
  static get type() {
    return "fuzzy";
  }
  static get multiRegex() {
    return /^"(.*)"$/;
  }
  static get singleRegex() {
    return /^(.*)$/;
  }
  search(e) {
    return this._bitapSearch.searchIn(e);
  }
}
class IncludeMatch extends BaseMatch {
  constructor(e) {
    super(e);
  }
  static get type() {
    return "include";
  }
  static get multiRegex() {
    return /^'"(.*)"$/;
  }
  static get singleRegex() {
    return /^'(.*)$/;
  }
  search(e) {
    let t,
      r = 0;
    const n = [],
      o = this.pattern.length;
    for (; (t = e.indexOf(this.pattern, r)) > -1; )
      (r = t + o), n.push([t, r - 1]);
    const a = !!n.length;
    return {
      isMatch: a,
      score: a ? 1 : 0,
      indices: n,
    };
  }
}
const searchers = [
    ExactMatch,
    IncludeMatch,
    PrefixExactMatch,
    InversePrefixExactMatch,
    InverseSuffixExactMatch,
    SuffixExactMatch,
    InverseExactMatch,
    FuzzyMatch,
  ],
  searchersLen = searchers.length,
  SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/,
  OR_TOKEN = "|";
function parseQuery(e, t = {}) {
  return e.split(OR_TOKEN).map((e) => {
    let r = e
        .trim()
        .split(SPACE_RE)
        .filter((e) => e && !!e.trim()),
      n = [];
    for (let e = 0, o = r.length; e < o; e += 1) {
      const o = r[e];
      let a = !1,
        i = -1;
      for (; !a && ++i < searchersLen; ) {
        const e = searchers[i];
        let r = e.isMultiMatch(o);
        r && (n.push(new e(r, t)), (a = !0));
      }
      if (!a)
        for (i = -1; ++i < searchersLen; ) {
          const e = searchers[i];
          let r = e.isSingleMatch(o);
          if (r) {
            n.push(new e(r, t));
            break;
          }
        }
    }
    return n;
  });
}
const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);
class ExtendedSearch {
  constructor(
    e,
    {
      isCaseSensitive: t = Config.isCaseSensitive,
      includeMatches: r = Config.includeMatches,
      minMatchCharLength: n = Config.minMatchCharLength,
      findAllMatches: o = Config.findAllMatches,
      location: a = Config.location,
      threshold: i = Config.threshold,
      distance: s = Config.distance,
    } = {}
  ) {
    (this.query = null),
      (this.options = {
        isCaseSensitive: t,
        includeMatches: r,
        minMatchCharLength: n,
        findAllMatches: o,
        location: a,
        threshold: i,
        distance: s,
      }),
      (this.pattern = t ? e : e.toLowerCase()),
      (this.query = parseQuery(this.pattern, this.options));
  }
  static condition(e, t) {
    return t.useExtendedSearch;
  }
  searchIn(e) {
    const t = this.query;
    if (!t)
      return {
        isMatch: !1,
        score: 1,
      };
    const { includeMatches: r, isCaseSensitive: n } = this.options;
    e = n ? e : e.toLowerCase();
    let o = 0,
      a = [],
      i = 0;
    for (let n = 0, s = t.length; n < s; n += 1) {
      const s = t[n];
      (a.length = 0), (o = 0);
      for (let t = 0, n = s.length; t < n; t += 1) {
        const n = s[t],
          { isMatch: u, indices: c, score: l } = n.search(e);
        if (!u) {
          (i = 0), (o = 0), (a.length = 0);
          break;
        }
        if (((o += 1), (i += l), r)) {
          const e = n.constructor.type;
          MultiMatchSet.has(e) ? (a = [...a, ...c]) : a.push(c);
        }
      }
      if (o) {
        let e = {
          isMatch: !0,
          score: i / o,
        };
        return r && (e.indices = a), e;
      }
    }
    return {
      isMatch: !1,
      score: 1,
    };
  }
}
const registeredSearchers = [];
function register(...e) {
  registeredSearchers.push(...e);
}
function createSearcher(e, t) {
  for (let r = 0, n = registeredSearchers.length; r < n; r += 1) {
    let n = registeredSearchers[r];
    if (n.condition(e, t)) return new n(e, t);
  }
  return new BitapSearch(e, t);
}
const LogicalOperator = {
    AND: "$and",
    OR: "$or",
  },
  KeyType = {
    PATH: "$path",
    PATTERN: "$val",
  },
  isExpression = (e) => !(!e[LogicalOperator.AND] && !e[LogicalOperator.OR]),
  isPath = (e) => !!e[KeyType.PATH],
  isLeaf = (e) => !isArray$5(e) && isObject$1(e) && !isExpression(e),
  convertToExplicit = (e) => ({
    [LogicalOperator.AND]: Object.keys(e).map((t) => ({
      [t]: e[t],
    })),
  });
function parse$2(e, t, { auto: r = !0 } = {}) {
  const n = (e) => {
    let o = Object.keys(e);
    const a = isPath(e);
    if (!a && o.length > 1 && !isExpression(e)) return n(convertToExplicit(e));
    if (isLeaf(e)) {
      const n = a ? e[KeyType.PATH] : o[0],
        i = a ? e[KeyType.PATTERN] : e[n];
      if (!isString$1(i))
        throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(n));
      const s = {
        keyId: createKeyId(n),
        pattern: i,
      };
      return r && (s.searcher = createSearcher(i, t)), s;
    }
    let i = {
      children: [],
      operator: o[0],
    };
    return (
      o.forEach((t) => {
        const r = e[t];
        isArray$5(r) &&
          r.forEach((e) => {
            i.children.push(n(e));
          });
      }),
      i
    );
  };
  return isExpression(e) || (e = convertToExplicit(e)), n(e);
}
class Fuse {
  constructor(e, t = {}, r) {
    (this.options = {
      ...Config,
      ...t,
    }),
      this.options.useExtendedSearch,
      (this._keyStore = new KeyStore(this.options.keys)),
      this.setCollection(e, r);
  }
  setCollection(e, t) {
    if (((this._docs = e), t && !(t instanceof FuseIndex)))
      throw new Error(INCORRECT_INDEX_TYPE);
    this._myIndex =
      t ||
      createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn,
      });
  }
  add(e) {
    isDefined(e) && (this._docs.push(e), this._myIndex.add(e));
  }
  remove(e = () => !1) {
    const t = [];
    for (let r = 0, n = this._docs.length; r < n; r += 1) {
      const n = this._docs[r];
      e(n, r) && (this.removeAt(r), (r -= 1), t.push(n));
    }
    return t;
  }
  removeAt(e) {
    this._docs.splice(e, 1), this._myIndex.removeAt(e);
  }
  getIndex() {
    return this._myIndex;
  }
  search(e, { limit: t = -1 } = {}) {
    const {
      includeMatches: r,
      includeScore: n,
      shouldSort: o,
      sortFn: a,
      ignoreFieldNorm: i,
    } = this.options;
    let s = isString$1(e)
      ? isString$1(this._docs[0])
        ? this._searchStringList(e)
        : this._searchObjectList(e)
      : this._searchLogical(e);
    return (
      computeScore$1(s, {
        ignoreFieldNorm: i,
      }),
      o && s.sort(a),
      isNumber(t) && t > -1 && (s = s.slice(0, t)),
      format$4(s, this._docs, {
        includeMatches: r,
        includeScore: n,
      })
    );
  }
  _searchStringList(e) {
    const t = createSearcher(e, this.options),
      { records: r } = this._myIndex,
      n = [];
    return (
      r.forEach(({ v: e, i: r, n: o }) => {
        if (!isDefined(e)) return;
        const { isMatch: a, score: i, indices: s } = t.searchIn(e);
        a &&
          n.push({
            item: e,
            idx: r,
            matches: [
              {
                score: i,
                value: e,
                norm: o,
                indices: s,
              },
            ],
          });
      }),
      n
    );
  }
  _searchLogical(e) {
    const t = parse$2(e, this.options),
      r = (e, t, n) => {
        if (!e.children) {
          const { keyId: r, searcher: o } = e,
            a = this._findMatches({
              key: this._keyStore.get(r),
              value: this._myIndex.getValueForItemAtKeyId(t, r),
              searcher: o,
            });
          return a && a.length
            ? [
                {
                  idx: n,
                  item: t,
                  matches: a,
                },
              ]
            : [];
        }
        switch (e.operator) {
          case LogicalOperator.AND: {
            const o = [];
            for (let a = 0, i = e.children.length; a < i; a += 1) {
              const i = e.children[a],
                s = r(i, t, n);
              if (!s.length) return [];
              o.push(...s);
            }
            return o;
          }
          case LogicalOperator.OR: {
            const o = [];
            for (let a = 0, i = e.children.length; a < i; a += 1) {
              const i = e.children[a],
                s = r(i, t, n);
              if (s.length) {
                o.push(...s);
                break;
              }
            }
            return o;
          }
        }
      },
      n = this._myIndex.records,
      o = {},
      a = [];
    return (
      n.forEach(({ $: e, i: n }) => {
        if (isDefined(e)) {
          let i = r(t, e, n);
          i.length &&
            (o[n] ||
              ((o[n] = {
                idx: n,
                item: e,
                matches: [],
              }),
              a.push(o[n])),
            i.forEach(({ matches: e }) => {
              o[n].matches.push(...e);
            }));
        }
      }),
      a
    );
  }
  _searchObjectList(e) {
    const t = createSearcher(e, this.options),
      { keys: r, records: n } = this._myIndex,
      o = [];
    return (
      n.forEach(({ $: e, i: n }) => {
        if (!isDefined(e)) return;
        let a = [];
        r.forEach((r, n) => {
          a.push(
            ...this._findMatches({
              key: r,
              value: e[n],
              searcher: t,
            })
          );
        }),
          a.length &&
            o.push({
              idx: n,
              item: e,
              matches: a,
            });
      }),
      o
    );
  }
  _findMatches({ key: e, value: t, searcher: r }) {
    if (!isDefined(t)) return [];
    let n = [];
    if (isArray$5(t))
      t.forEach(({ v: t, i: o, n: a }) => {
        if (!isDefined(t)) return;
        const { isMatch: i, score: s, indices: u } = r.searchIn(t);
        i &&
          n.push({
            score: s,
            key: e,
            value: t,
            idx: o,
            norm: a,
            indices: u,
          });
      });
    else {
      const { v: o, n: a } = t,
        { isMatch: i, score: s, indices: u } = r.searchIn(o);
      i &&
        n.push({
          score: s,
          key: e,
          value: o,
          norm: a,
          indices: u,
        });
    }
    return n;
  }
}
function computeScore$1(e, { ignoreFieldNorm: t = Config.ignoreFieldNorm }) {
  e.forEach((e) => {
    let r = 1;
    e.matches.forEach(({ key: e, norm: n, score: o }) => {
      const a = e ? e.weight : null;
      r *= Math.pow(0 === o && a ? Number.EPSILON : o, (a || 1) * (t ? 1 : n));
    }),
      (e.score = r);
  });
}
function format$4(
  e,
  t,
  {
    includeMatches: r = Config.includeMatches,
    includeScore: n = Config.includeScore,
  } = {}
) {
  const o = [];
  return (
    r && o.push(transformMatches),
    n && o.push(transformScore),
    e.map((e) => {
      const { idx: r } = e,
        n = {
          item: t[r],
          refIndex: r,
        };
      return (
        o.length &&
          o.forEach((t) => {
            t(e, n);
          }),
        n
      );
    })
  );
}
(Fuse.version = "6.4.1"),
  (Fuse.createIndex = createIndex),
  (Fuse.parseIndex = parseIndex),
  (Fuse.config = Config),
  (Fuse.parseQuery = parse$2),
  register(ExtendedSearch);
var getRandomValues =
    ("undefined" != typeof crypto &&
      crypto.getRandomValues &&
      crypto.getRandomValues.bind(crypto)) ||
    ("undefined" != typeof msCrypto &&
      "function" == typeof msCrypto.getRandomValues &&
      msCrypto.getRandomValues.bind(msCrypto)),
  rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues)
    throw new Error(
      "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"
    );
  return getRandomValues(rnds8);
}
var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function validate(e) {
  return "string" == typeof e && REGEX.test(e);
}
for (var byteToHex = [], i = 0; i < 256; ++i)
  byteToHex.push((i + 256).toString(16).substr(1));
function stringify$1(e) {
  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
    r = (
      byteToHex[e[t + 0]] +
      byteToHex[e[t + 1]] +
      byteToHex[e[t + 2]] +
      byteToHex[e[t + 3]] +
      "-" +
      byteToHex[e[t + 4]] +
      byteToHex[e[t + 5]] +
      "-" +
      byteToHex[e[t + 6]] +
      byteToHex[e[t + 7]] +
      "-" +
      byteToHex[e[t + 8]] +
      byteToHex[e[t + 9]] +
      "-" +
      byteToHex[e[t + 10]] +
      byteToHex[e[t + 11]] +
      byteToHex[e[t + 12]] +
      byteToHex[e[t + 13]] +
      byteToHex[e[t + 14]] +
      byteToHex[e[t + 15]]
    ).toLowerCase();
  if (!validate(r)) throw TypeError("Stringified UUID is invalid");
  return r;
}
function v4(e, t, r) {
  var n = (e = e || {}).random || (e.rng || rng)();
  if (((n[6] = (15 & n[6]) | 64), (n[8] = (63 & n[8]) | 128), t)) {
    r = r || 0;
    for (var o = 0; o < 16; ++o) t[r + o] = n[o];
    return t;
  }
  return stringify$1(n);
}
function baseExtremum(e, t, r) {
  for (var n = -1, o = e.length; ++n < o; ) {
    var a = e[n],
      i = t(a);
    if (null != i && (void 0 === s ? i == i && !isSymbol_1(i) : r(i, s)))
      var s = i,
        u = a;
  }
  return u;
}
var _baseExtremum = baseExtremum;
function baseGt(e, t) {
  return e > t;
}
var _baseGt = baseGt;
function max(e) {
  return e && e.length ? _baseExtremum(e, identity_1, _baseGt) : void 0;
}
var max_1 = max,
  page = createCommonjsModule(function (e, t) {
    e.exports = (function () {
      var e =
          Array.isArray ||
          function (e) {
            return "[object Array]" == Object.prototype.toString.call(e);
          },
        t = function t(r, n, o) {
          return (
            e((n = n || [])) ? o || (o = {}) : ((o = n), (n = [])),
            r instanceof RegExp
              ? (function (e, t) {
                  var r = e.source.match(/\((?!\?)/g);
                  if (r)
                    for (var n = 0; n < r.length; n++)
                      t.push({
                        name: n,
                        prefix: null,
                        delimiter: null,
                        optional: !1,
                        repeat: !1,
                        pattern: null,
                      });
                  return l(e, t);
                })(r, n)
              : e(r)
              ? (function (e, r, n) {
                  for (var o = [], a = 0; a < e.length; a++)
                    o.push(t(e[a], r, n).source);
                  return l(new RegExp("(?:" + o.join("|") + ")", f(n)), r);
                })(r, n, o)
              : (function (e, t, r) {
                  for (var n = i(e), o = p(n, r), a = 0; a < n.length; a++)
                    "string" != typeof n[a] && t.push(n[a]);
                  return l(o, t);
                })(r, n, o)
          );
        },
        r = i,
        n = s,
        o = p,
        a = new RegExp(
          [
            "(\\\\.)",
            "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))",
          ].join("|"),
          "g"
        );
      function i(e) {
        for (var t, r = [], n = 0, o = 0, i = ""; null != (t = a.exec(e)); ) {
          var s = t[0],
            u = t[1],
            l = t.index;
          if (((i += e.slice(o, l)), (o = l + s.length), u)) i += u[1];
          else {
            i && (r.push(i), (i = ""));
            var f = t[2],
              p = t[3],
              d = t[4],
              h = t[5],
              g = t[6],
              m = t[7],
              y = "+" === g || "*" === g,
              b = "?" === g || "*" === g,
              v = f || "/",
              _ = d || h || (m ? ".*" : "[^" + v + "]+?");
            r.push({
              name: p || n++,
              prefix: f || "",
              delimiter: v,
              optional: b,
              repeat: y,
              pattern: c(_),
            });
          }
        }
        return o < e.length && (i += e.substr(o)), i && r.push(i), r;
      }
      function s(t) {
        for (var r = new Array(t.length), n = 0; n < t.length; n++)
          "object" == typeof t[n] &&
            (r[n] = new RegExp("^" + t[n].pattern + "$"));
        return function (n) {
          for (var o = "", a = n || {}, i = 0; i < t.length; i++) {
            var s = t[i];
            if ("string" != typeof s) {
              var u,
                c = a[s.name];
              if (null == c) {
                if (s.optional) continue;
                throw new TypeError('Expected "' + s.name + '" to be defined');
              }
              if (e(c)) {
                if (!s.repeat)
                  throw new TypeError(
                    'Expected "' +
                      s.name +
                      '" to not repeat, but received "' +
                      c +
                      '"'
                  );
                if (0 === c.length) {
                  if (s.optional) continue;
                  throw new TypeError(
                    'Expected "' + s.name + '" to not be empty'
                  );
                }
                for (var l = 0; l < c.length; l++) {
                  if (((u = encodeURIComponent(c[l])), !r[i].test(u)))
                    throw new TypeError(
                      'Expected all "' +
                        s.name +
                        '" to match "' +
                        s.pattern +
                        '", but received "' +
                        u +
                        '"'
                    );
                  o += (0 === l ? s.prefix : s.delimiter) + u;
                }
              } else {
                if (((u = encodeURIComponent(c)), !r[i].test(u)))
                  throw new TypeError(
                    'Expected "' +
                      s.name +
                      '" to match "' +
                      s.pattern +
                      '", but received "' +
                      u +
                      '"'
                  );
                o += s.prefix + u;
              }
            } else o += s;
          }
          return o;
        };
      }
      function u(e) {
        return e.replace(/([.+*?=^!:${}()[\]|\/])/g, "\\$1");
      }
      function c(e) {
        return e.replace(/([=!:$\/()])/g, "\\$1");
      }
      function l(e, t) {
        return (e.keys = t), e;
      }
      function f(e) {
        return e.sensitive ? "" : "i";
      }
      function p(e, t) {
        for (
          var r = (t = t || {}).strict,
            n = !1 !== t.end,
            o = "",
            a = e[e.length - 1],
            i = "string" == typeof a && /\/$/.test(a),
            s = 0;
          s < e.length;
          s++
        ) {
          var c = e[s];
          if ("string" == typeof c) o += u(c);
          else {
            var l = u(c.prefix),
              p = c.pattern;
            c.repeat && (p += "(?:" + l + p + ")*"),
              (o += p = c.optional
                ? l
                  ? "(?:" + l + "(" + p + "))?"
                  : "(" + p + ")?"
                : l + "(" + p + ")");
          }
        }
        return (
          r || (o = (i ? o.slice(0, -2) : o) + "(?:\\/(?=$))?"),
          (o += n ? "$" : r && i ? "" : "(?=\\/|$)"),
          new RegExp("^" + o, f(t))
        );
      }
      (t.parse = r),
        (t.compile = function (e) {
          return s(i(e));
        }),
        (t.tokensToFunction = n),
        (t.tokensToRegExp = o);
      var d,
        h = "undefined" != typeof document,
        g = "undefined" != typeof window,
        m = "undefined" != typeof history,
        y = "undefined" != typeof process,
        b = h && document.ontouchstart ? "touchstart" : "click",
        v = g && !(!window.history.location && !window.location);
      function _() {
        (this.callbacks = []),
          (this.exits = []),
          (this.current = ""),
          (this.len = 0),
          (this._decodeURLComponents = !0),
          (this._base = ""),
          (this._strict = !1),
          (this._running = !1),
          (this._hashbang = !1),
          (this.clickHandler = this.clickHandler.bind(this)),
          (this._onpopstate = this._onpopstate.bind(this));
      }
      function w(e, t) {
        if ("function" == typeof e) return w.call(this, "*", e);
        if ("function" == typeof t)
          for (var r = new A(e, null, this), n = 1; n < arguments.length; ++n)
            this.callbacks.push(r.middleware(arguments[n]));
        else
          "string" == typeof e
            ? this["string" == typeof t ? "redirect" : "show"](e, t)
            : this.start(e);
      }
      function T(e) {
        if (!e.handled) {
          var t = this._window;
          (this._hashbang
            ? v && this._getBase() + t.location.hash.replace("#!", "")
            : v && t.location.pathname + t.location.search) !==
            e.canonicalPath &&
            (this.stop(),
            (e.handled = !1),
            v && (t.location.href = e.canonicalPath));
        }
      }
      function O(e, t, r) {
        var n = (this.page = r || w),
          o = n._window,
          a = n._hashbang,
          i = n._getBase();
        "/" === e[0] && 0 !== e.indexOf(i) && (e = i + (a ? "#!" : "") + e);
        var s = e.indexOf("?");
        this.canonicalPath = e;
        var u = new RegExp(
          "^" + i.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1")
        );
        if (
          ((this.path = e.replace(u, "") || "/"),
          a && (this.path = this.path.replace("#!", "") || "/"),
          (this.title = h && o.document.title),
          (this.state = t || {}),
          (this.state.path = e),
          (this.querystring = ~s
            ? n._decodeURLEncodedURIComponent(e.slice(s + 1))
            : ""),
          (this.pathname = n._decodeURLEncodedURIComponent(
            ~s ? e.slice(0, s) : e
          )),
          (this.params = {}),
          (this.hash = ""),
          !a)
        ) {
          if (!~this.path.indexOf("#")) return;
          var c = this.path.split("#");
          (this.path = this.pathname = c[0]),
            (this.hash = n._decodeURLEncodedURIComponent(c[1]) || ""),
            (this.querystring = this.querystring.split("#")[0]);
        }
      }
      function A(e, r, n) {
        var o = (this.page = n || M),
          a = r || {};
        (a.strict = a.strict || o._strict),
          (this.path = "*" === e ? "(.*)" : e),
          (this.method = "GET"),
          (this.regexp = t(this.path, (this.keys = []), a));
      }
      (_.prototype.configure = function (e) {
        var t = e || {};
        (this._window = t.window || (g && window)),
          (this._decodeURLComponents = !1 !== t.decodeURLComponents),
          (this._popstate = !1 !== t.popstate && g),
          (this._click = !1 !== t.click && h),
          (this._hashbang = !!t.hashbang);
        var r = this._window;
        this._popstate
          ? r.addEventListener("popstate", this._onpopstate, !1)
          : g && r.removeEventListener("popstate", this._onpopstate, !1),
          this._click
            ? r.document.addEventListener(b, this.clickHandler, !1)
            : h && r.document.removeEventListener(b, this.clickHandler, !1),
          this._hashbang && g && !m
            ? r.addEventListener("hashchange", this._onpopstate, !1)
            : g && r.removeEventListener("hashchange", this._onpopstate, !1);
      }),
        (_.prototype.base = function (e) {
          if (0 === arguments.length) return this._base;
          this._base = e;
        }),
        (_.prototype._getBase = function () {
          var e = this._base;
          if (e) return e;
          var t = g && this._window && this._window.location;
          return (
            g &&
              this._hashbang &&
              t &&
              "file:" === t.protocol &&
              (e = t.pathname),
            e
          );
        }),
        (_.prototype.strict = function (e) {
          if (0 === arguments.length) return this._strict;
          this._strict = e;
        }),
        (_.prototype.start = function (e) {
          var t = e || {};
          if ((this.configure(t), !1 !== t.dispatch)) {
            var r;
            if (((this._running = !0), v)) {
              var n = this._window.location;
              r =
                this._hashbang && ~n.hash.indexOf("#!")
                  ? n.hash.substr(2) + n.search
                  : this._hashbang
                  ? n.search + n.hash
                  : n.pathname + n.search + n.hash;
            }
            this.replace(r, null, !0, t.dispatch);
          }
        }),
        (_.prototype.stop = function () {
          if (this._running) {
            (this.current = ""), (this.len = 0), (this._running = !1);
            var e = this._window;
            this._click &&
              e.document.removeEventListener(b, this.clickHandler, !1),
              g && e.removeEventListener("popstate", this._onpopstate, !1),
              g && e.removeEventListener("hashchange", this._onpopstate, !1);
          }
        }),
        (_.prototype.show = function (e, t, r, n) {
          var o = new O(e, t, this),
            a = this.prevContext;
          return (
            (this.prevContext = o),
            (this.current = o.path),
            !1 !== r && this.dispatch(o, a),
            !1 !== o.handled && !1 !== n && o.pushState(),
            o
          );
        }),
        (_.prototype.back = function (e, t) {
          var r = this;
          if (this.len > 0) {
            var n = this._window;
            m && n.history.back(), this.len--;
          } else
            e
              ? setTimeout(function () {
                  r.show(e, t);
                })
              : setTimeout(function () {
                  r.show(r._getBase(), t);
                });
        }),
        (_.prototype.redirect = function (e, t) {
          var r = this;
          "string" == typeof e &&
            "string" == typeof t &&
            w.call(this, e, function (e) {
              setTimeout(function () {
                r.replace(t);
              }, 0);
            }),
            "string" == typeof e &&
              void 0 === t &&
              setTimeout(function () {
                r.replace(e);
              }, 0);
        }),
        (_.prototype.replace = function (e, t, r, n) {
          var o = new O(e, t, this),
            a = this.prevContext;
          return (
            (this.prevContext = o),
            (this.current = o.path),
            (o.init = r),
            o.save(),
            !1 !== n && this.dispatch(o, a),
            o
          );
        }),
        (_.prototype.dispatch = function (e, t) {
          var r = 0,
            n = 0,
            o = this;
          function a() {
            var t = o.callbacks[r++];
            if (e.path === o.current) return t ? void t(e, a) : T.call(o, e);
            e.handled = !1;
          }
          t
            ? (function e() {
                var r = o.exits[n++];
                if (!r) return a();
                r(t, e);
              })()
            : a();
        }),
        (_.prototype.exit = function (e, t) {
          if ("function" == typeof e) return this.exit("*", e);
          for (var r = new A(e, null, this), n = 1; n < arguments.length; ++n)
            this.exits.push(r.middleware(arguments[n]));
        }),
        (_.prototype.clickHandler = function (e) {
          if (
            1 === this._which(e) &&
            !(e.metaKey || e.ctrlKey || e.shiftKey || e.defaultPrevented)
          ) {
            var t = e.target,
              r = e.path || (e.composedPath ? e.composedPath() : null);
            if (r)
              for (var n = 0; n < r.length; n++)
                if (
                  r[n].nodeName &&
                  "A" === r[n].nodeName.toUpperCase() &&
                  r[n].href
                ) {
                  t = r[n];
                  break;
                }
            for (; t && "A" !== t.nodeName.toUpperCase(); ) t = t.parentNode;
            if (t && "A" === t.nodeName.toUpperCase()) {
              var o =
                "object" == typeof t.href &&
                "SVGAnimatedString" === t.href.constructor.name;
              if (
                !t.hasAttribute("download") &&
                "external" !== t.getAttribute("rel")
              ) {
                var a = t.getAttribute("href");
                if (
                  (this._hashbang ||
                    !this._samePath(t) ||
                    (!t.hash && "#" !== a)) &&
                  !(a && a.indexOf("mailto:") > -1) &&
                  !(o ? t.target.baseVal : t.target) &&
                  (o || this.sameOrigin(t.href))
                ) {
                  var i = o
                    ? t.href.baseVal
                    : t.pathname + t.search + (t.hash || "");
                  (i = "/" !== i[0] ? "/" + i : i),
                    y &&
                      i.match(/^\/[a-zA-Z]:\//) &&
                      (i = i.replace(/^\/[a-zA-Z]:\//, "/"));
                  var s = i,
                    u = this._getBase();
                  0 === i.indexOf(u) && (i = i.substr(u.length)),
                    this._hashbang && (i = i.replace("#!", "")),
                    (!u ||
                      s !== i ||
                      (v && "file:" === this._window.location.protocol)) &&
                      (e.preventDefault(), this.show(s));
                }
              }
            }
          }
        }),
        (_.prototype._onpopstate =
          ((d = !1),
          g
            ? (h && "complete" === document.readyState
                ? (d = !0)
                : window.addEventListener("load", function () {
                    setTimeout(function () {
                      d = !0;
                    }, 0);
                  }),
              function (e) {
                if (d)
                  if (e.state) {
                    var t = e.state.path;
                    this.replace(t, e.state);
                  } else if (v) {
                    var r = this._window.location;
                    this.show(
                      r.pathname + r.search + r.hash,
                      void 0,
                      void 0,
                      !1
                    );
                  }
              })
            : function () {})),
        (_.prototype._which = function (e) {
          return null == (e = e || (g && this._window.event)).which
            ? e.button
            : e.which;
        }),
        (_.prototype._toURL = function (e) {
          var t = this._window;
          if ("function" == typeof URL && v)
            return new URL(e, t.location.toString());
          if (h) {
            var r = t.document.createElement("a");
            return (r.href = e), r;
          }
        }),
        (_.prototype.sameOrigin = function (e) {
          if (!e || !v) return !1;
          var t = this._toURL(e),
            r = this._window.location;
          return (
            r.protocol === t.protocol &&
            r.hostname === t.hostname &&
            (r.port === t.port ||
              ("" === r.port && (80 == t.port || 443 == t.port)))
          );
        }),
        (_.prototype._samePath = function (e) {
          if (!v) return !1;
          var t = this._window.location;
          return e.pathname === t.pathname && e.search === t.search;
        }),
        (_.prototype._decodeURLEncodedURIComponent = function (e) {
          return "string" != typeof e
            ? e
            : this._decodeURLComponents
            ? decodeURIComponent(e.replace(/\+/g, " "))
            : e;
        }),
        (O.prototype.pushState = function () {
          var e = this.page,
            t = e._window,
            r = e._hashbang;
          e.len++,
            m &&
              t.history.pushState(
                this.state,
                this.title,
                r && "/" !== this.path ? "#!" + this.path : this.canonicalPath
              );
        }),
        (O.prototype.save = function () {
          var e = this.page;
          m &&
            e._window.history.replaceState(
              this.state,
              this.title,
              e._hashbang && "/" !== this.path
                ? "#!" + this.path
                : this.canonicalPath
            );
        }),
        (A.prototype.middleware = function (e) {
          var t = this;
          return function (r, n) {
            if (t.match(r.path, r.params))
              return (r.routePath = t.path), e(r, n);
            n();
          };
        }),
        (A.prototype.match = function (e, t) {
          var r = this.keys,
            n = e.indexOf("?"),
            o = ~n ? e.slice(0, n) : e,
            a = this.regexp.exec(decodeURIComponent(o));
          if (!a) return !1;
          delete t[0];
          for (var i = 1, s = a.length; i < s; ++i) {
            var u = r[i - 1],
              c = this.page._decodeURLEncodedURIComponent(a[i]);
            (void 0 === c && hasOwnProperty.call(t, u.name)) || (t[u.name] = c);
          }
          return !0;
        });
      var M = (function e() {
          var t = new _();
          function r() {
            return w.apply(t, arguments);
          }
          return (
            (r.callbacks = t.callbacks),
            (r.exits = t.exits),
            (r.base = t.base.bind(t)),
            (r.strict = t.strict.bind(t)),
            (r.start = t.start.bind(t)),
            (r.stop = t.stop.bind(t)),
            (r.show = t.show.bind(t)),
            (r.back = t.back.bind(t)),
            (r.redirect = t.redirect.bind(t)),
            (r.replace = t.replace.bind(t)),
            (r.dispatch = t.dispatch.bind(t)),
            (r.exit = t.exit.bind(t)),
            (r.configure = t.configure.bind(t)),
            (r.sameOrigin = t.sameOrigin.bind(t)),
            (r.clickHandler = t.clickHandler.bind(t)),
            (r.create = e),
            Object.defineProperty(r, "len", {
              get: function () {
                return t.len;
              },
              set: function (e) {
                t.len = e;
              },
            }),
            Object.defineProperty(r, "current", {
              get: function () {
                return t.current;
              },
              set: function (e) {
                t.current = e;
              },
            }),
            (r.Context = O),
            (r.Route = A),
            r
          );
        })(),
        S = M,
        k = M;
      return (S.default = k), S;
    })();
  });
function timeAgo(e) {
  let t = Date.now() - e;
  return t >= 36e5
    ? ((t / 36e5) | 0) + "h"
    : t >= 6e4
    ? ((t / 6e4) | 0) + "m"
    : ((t / 1e3) | 0) + "s";
}

module.exports = {
  HeatmapResponse: HeatmapResponse,
  VolumeResponse: VolumeResponse,
  VolumeEntry: VolumeEntry,
  HeatmapEntry: HeatmapEntry,
  CandleResponse: CandleResponse,
};

// export {zonedTimeToUtc, mount_component, get_spread_update as B, get_spread_object as C, destroy_component as D, get_store_value as E, cloneDeep_1 as F, debounce_1 as G, isEqual_1 as H, IntlMessageFormat as I, remove_1 as J, identity as K, size_1 as L, sortBy_1 as M, round_1 as N, chunk_1 as O, get_1 as P, isArray_1 as Q, factorRoundUp as R, SvelteComponent as S, factorRoundDw as T, roundTime as U, recht$1 as V, mitt as W, scaleUtc as X, identity_1 as Y, readable as Z, format$2 as _, create_slot as a, preventOverflow$1 as a$, utcToZonedTime as a0, CandleResponse as a1, HeatmapResponse, HeatmapEntry as a3, StatsResponse as a4, VolumeResponse as a5, VolumeEntry as a6, noop as a7, HeatmapMessage as a8, factorIndexUp as a9, create_out_transition as aA, stop_propagation as aB, add_resize_listener as aC, tick as aD, tippy as aE, set_input_value as aF, select_option as aG, set_data as aH, fuzzysort as aI, select_value as aJ, bind as aK, add_flush_callback as aL, is_function as aM, addDays as aN, create_bidirectional_transition as aO, handle_promise as aP, format$1 as aQ, pickr_min as aR, formatRelative$1 as aS, afterUpdate as aT, prevent_default as aU, formatSize as aV, popperGenerator as aW, popperOffsets$1 as aX, computeStyles$1 as aY, applyStyles$1 as aZ, eventListeners as a_, factorIndexDw as aa, TradesMultiMessage as ab, CandleMultiMessage as ac, getCurrentTimeUnix as ad, StatMultiMessage as ae, VolumeMultiMessage as af, element as ag, space as ah, attr as ai, set_style as aj, toggle_class as ak, append as al, action_destroyer as am, listen as an, add_render_callback as ao, create_in_transition as ap, run_all as aq, createEventDispatcher as ar, binding_callbacks as as, createCommonjsModule as at, browser as au, svg_element as av, beforeUpdate as aw, set_store_value as ax, text as ay, destroy_each as az, bufferEs6 as b, globals as b0, HtmlTag as b1, Fuse as b2, without_1 as b3, set_1 as b4, null_to_empty as b5, timeFormat as b6, hour as b7, day as b8, month as b9, sunday as ba, year as bb, minute as bc, formatPrice as bd, formatDuration as be, v4 as bf, formatToHHMMSS as bg, getFutureTimeUnix as bh, time as bi, stubFalse_1 as bj, linear$1 as bk, update_keyed_each as bl, outro_and_destroy_block as bm, formatSizeSimple as bn, max_1 as bo, page as bp, bubble as bq, formatDistanceToNow as br, formatNumCeil as bs, to_number as bt, timeAgo as bu, formatNum as bv, formatISO as bw, subDays as bx, commonjsGlobal as c, derived as d, transition_out as e, fetchNpmBrowserify as f, global$1 as g, getContext as h, init$1 as i, component_subscribe as j, setContext as k, lib as l, empty as m, insert as n, onMount as o, group_outros as p, check_outros as q, detach as r, safe_not_equal as s, transition_in as t, update_slot as u, onDestroy as v, writable as w, assign$1 as x, exclude_internal_props as y, create_component as z};
