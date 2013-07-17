/*
 * JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function (e, t) {
  this.AeroGear = {}, AeroGear.Core = function () {
    if (this instanceof AeroGear.Core)throw"Invalid instantiation of base class AeroGear.Core";
    this.add = function (e) {
      var t, r, a = this[this.collectionName] || {};
      if (!e)return this;
      if ("string" == typeof e)a[e] = AeroGear[this.lib].adapters[this.type](e); else if (AeroGear.isArray(e))for (t = 0; e.length > t; t++)r = e[t], "string" == typeof r ? a[r] = AeroGear[this.lib].adapters[this.type](r) : a[r.name] = AeroGear[this.lib].adapters[r.type || this.type](r.name, r.settings || {}); else a[e.name] = AeroGear[this.lib].adapters[e.type || this.type](e.name, e.settings || {});
      return this[this.collectionName] = a, this
    }, this.remove = function (e) {
      var t, r, a = this[this.collectionName] || {};
      if ("string" == typeof e)delete a[e]; else if (AeroGear.isArray(e))for (t = 0; e.length > t; t++)r = e[t], "string" == typeof r ? delete a[r] : delete a[r.name]; else e && delete a[e.name];
      return this[this.collectionName] = a, this
    }
  }, AeroGear.isArray = function (e) {
    return"[object Array]" === {}.toString.call(e)
  }, function () {
    function e(e, t, r) {
      var a = t && r || 0, n = 0;
      for (t = t || [], e.toLowerCase().replace(/[0-9a-f]{2}/g, function (e) {
        16 > n && (t[a + n++] = l[e])
      }); 16 > n;)t[a + n++] = 0;
      return t
    }

    function t(e, t) {
      var r = t || 0, a = g;
      return a[e[r++]] + a[e[r++]] + a[e[r++]] + a[e[r++]] + "-" + a[e[r++]] + a[e[r++]] + "-" + a[e[r++]] + a[e[r++]] + "-" + a[e[r++]] + a[e[r++]] + "-" + a[e[r++]] + a[e[r++]] + a[e[r++]] + a[e[r++]] + a[e[r++]] + a[e[r++]]
    }

    function r(e, r, a) {
      var n = r && a || 0, i = r || [];
      e = e || {};
      var s = null != e.clockseq ? e.clockseq : v, o = null != e.msecs ? e.msecs : (new Date).getTime(), u = null != e.nsecs ? e.nsecs : S + 1, c = o - G + (u - S) / 1e4;
      if (0 > c && null == e.clockseq && (s = 16383 & s + 1), (0 > c || o > G) && null == e.nsecs && (u = 0), u >= 1e4)throw Error("uuid.v1(): Can't create more than 10M uuids/sec");
      G = o, S = u, v = s, o += 122192928e5;
      var p = (1e4 * (268435455 & o) + u) % 4294967296;
      i[n++] = 255 & p >>> 24, i[n++] = 255 & p >>> 16, i[n++] = 255 & p >>> 8, i[n++] = 255 & p;
      var d = 268435455 & 1e4 * (o / 4294967296);
      i[n++] = 255 & d >>> 8, i[n++] = 255 & d, i[n++] = 16 | 15 & d >>> 24, i[n++] = 255 & d >>> 16, i[n++] = 128 | s >>> 8, i[n++] = 255 & s;
      for (var h = e.node || A, f = 0; 6 > f; f++)i[n + f] = h[f];
      return r ? r : t(i)
    }

    function a(e, r, a) {
      var n = r && a || 0;
      "string" == typeof e && (r = "binary" == e ? new f(16) : null, e = null), e = e || {};
      var i = e.random || (e.rng || h)();
      if (i[6] = 64 | 15 & i[6], i[8] = 128 | 63 & i[8], r)for (var s = 0; 16 > s; s++)r[n + s] = i[s];
      return r || t(i)
    }

    var n, i, s, o = this, u = Array(16);
    if (n = function () {
      for (var e, e, t = u, r = 0, r = 0; 16 > r; r++)0 == (3 & r) && (e = 4294967296 * Math.random()), t[r] = 255 & e >>> ((3 & r) << 3);
      return t
    }, o.crypto && crypto.getRandomValues) {
      var c = new Uint32Array(4);
      s = function () {
        crypto.getRandomValues(c);
        for (var e = 0; 16 > e; e++)u[e] = 255 & c[e >> 2] >>> 8 * (3 & e);
        return u
      }
    }
    try {
      var p = require("crypto").randomBytes;
      i = p && function () {
        return p(16)
      }
    } catch (d) {
    }
    for (var h = i || s || n, f = "function" == typeof Buffer ? Buffer : Array, g = [], l = {}, y = 0; 256 > y; y++)g[y] = (y + 256).toString(16).substr(1), l[g[y]] = y;
    var m = h(), A = [1 | m[0], m[1], m[2], m[3], m[4], m[5]], v = 16383 & (m[6] << 8 | m[7]), G = 0, S = 0, j = a;
    if (j.v1 = r, j.v4 = a, j.parse = e, j.unparse = t, j.BufferClass = f, j.mathRNG = n, j.nodeRNG = i, j.whatwgRNG = s, "undefined" != typeof module)module.exports = j; else {
      var I = o.uuid;
      j.noConflict = function () {
        return o.uuid = I, j
      }, o.uuid = j
    }
  }(), AeroGear.Pipeline = function (e) {
    return this instanceof AeroGear.Pipeline ? (AeroGear.Core.call(this), this.lib = "Pipeline", this.type = e ? e.type || "Rest" : "Rest", this.collectionName = "pipes", this.add(e), t) : new AeroGear.Pipeline(e)
  }, AeroGear.Pipeline.prototype = AeroGear.Core, AeroGear.Pipeline.constructor = AeroGear.Pipeline, AeroGear.Pipeline.adapters = {}, AeroGear.Pipeline.adapters.Rest = function (e, r) {
    if (!(this instanceof AeroGear.Pipeline.adapters.Rest))return new AeroGear.Pipeline.adapters.Rest(e, r);
    r = r || {};
    var a = r.endpoint || e, n = {url:r.baseURL ? r.baseURL + a : a, contentType:"application/json", dataType:"json"}, i = r.recordId || "id", s = r.authenticator || null, o = r.pageConfig, u = r.timeout ? 1e3 * r.timeout : 6e4;
    this.addAuthIdentifier = function (e) {
      return s ? s.addAuthIdentifier(e) : e
    }, this.deauthorize = function () {
      s && s.deauthorize()
    }, this.getAjaxSettings = function () {
      return n
    }, this.getRecordId = function () {
      return i
    }, this.getTimeout = function () {
      return u
    }, this.getPageConfig = function () {
      return o
    }, this.updatePageConfig = function (e, t) {
      t ? (o = {}, o.metadataLocation = e.metadataLocation ? e.metadataLocation : "webLinking", o.previousIdentifier = e.previousIdentifier ? e.previousIdentifier : "previous", o.nextIdentifier = e.nextIdentifier ? e.nextIdentifier : "next", o.parameterProvider = e.parameterProvider ? e.parameterProvider : null) : jQuery.extend(o, e)
    }, o && this.updatePageConfig(o, !0), this.webLinkingPageParser = function (e) {
      var r, a, n, i, s, u = {};
      a = e.getResponseHeader("Link").split(",");
      for (var c in a) {
        r = a[c].trim().split(";");
        for (var p in r)n = r[p].trim(), 0 === n.indexOf("<") && n.lastIndexOf(">") === r[p].length - 1 ? i = n.substr(1, n.length - 2).split("?")[1] : 0 === n.indexOf("rel=") && (n.indexOf(o.previousIdentifier) >= 0 ? s = o.previousIdentifier : n.indexOf(o.nextIdentifier) >= 0 && (s = o.nextIdentifier));
        s && (u[s] = i, s = t)
      }
      return u
    }, this.headerPageParser = function (e) {
      var t = e.getResponseHeader(o.previousIdentifier), r = e.getResponseHeader(o.nextIdentifier), a = {}, n = {};
      return o.parameterProvider ? (a = o.parameterProvider(e), n[o.previousIdentifier] = a[o.previousIdentifier], n[o.nextIdentifier] = a[o.nextIdentifier]) : (n[o.previousIdentifier] = t ? t.split("?")[1] : null, n[o.nextIdentifier] = r ? r.split("?")[1] : null), n
    }, this.bodyPageParser = function (e) {
      var t = {}, r = {};
      return o.parameterProvider ? (r = o.parameterProvider(e), t[o.previousIdentifier] = r[o.previousIdentifier], t[o.nextIdentifier] = r[o.nextIdentifier]) : (t[o.previousIdentifier] = e[o.previousIdentifier], t[o.nextIdentifier] = e[o.nextIdentifier]), t
    }, this.formatJSONError = function (e) {
      if ("json" === this.getAjaxSettings().dataType)try {
        e.responseJSON = JSON.parse(e.responseText)
      } catch (t) {
      }
      return e
    }
  }, AeroGear.Pipeline.adapters.Rest.prototype.read = function (e) {
    var r, a, n, i, s = this, o = this.getRecordId(), u = this.getAjaxSettings(), c = this.getPageConfig();
    if (e = e ? e : {}, e.query = e.query ? e.query : {}, r = e[o] ? u.url + "/" + e[o] : u.url, c && e.paging !== !1) {
      e.paging || (e.paging = {offset:e.offsetValue || 0, limit:e.limitValue || 10}), e.query = e.query || {};
      for (var p in e.paging)e.query[p] = e.paging[p]
    }
    return a = function (r, a, n) {
      var i;
      c && e.paging !== !1 && (i = s[c.metadataLocation + "PageParser"]("body" === c.metadataLocation ? r : n), ["previous", "next"].forEach(function (a) {
        r[a] = function (e, r, a) {
          return function (n) {
            return a.paging = !0, a.offsetValue = a.limitValue = t, a.query = r, a.success = n && n.success ? n.success : a.success, a.error = n && n.error ? n.error : a.error, e.read(a)
          }
        }(s, i[c[a + "Identifier"]], e)
      })), e.success && e.success.apply(this, arguments)
    }, n = function (t) {
      t = s.formatJSONError(t), e.error && e.error.apply(this, arguments)
    }, i = {type:"GET", data:e.query, success:a, error:n, url:r, statusCode:e.statusCode, complete:e.complete, headers:e.headers, timeout:this.getTimeout()}, e.jsonp && (i.dataType = "jsonp", i.jsonp = e.jsonp.callback ? e.jsonp.callback : "callback", e.jsonp.customCallback && (i.jsonpCallback = e.jsonp.customCallback)), jQuery.ajax(this.addAuthIdentifier(jQuery.extend({}, this.getAjaxSettings(), i)))
  }, AeroGear.Pipeline.adapters.Rest.prototype.save = function (e, t) {
    var r, a, n, i, s, o = this, u = this.getRecordId(), c = this.getAjaxSettings();
    return e = e || {}, t = t || {}, r = e[u] ? "PUT" : "POST", a = e[u] ? c.url + "/" + e[u] : c.url, n = function () {
      t.success && t.success.apply(this, arguments)
    }, i = function (e) {
      e = o.formatJSONError(e), t.error && t.error.apply(this, arguments)
    }, s = jQuery.extend({}, c, {data:e, type:r, url:a, success:n, error:i, statusCode:t.statusCode, complete:t.complete, headers:t.headers, timeout:this.getTimeout()}), "application/json" === s.contentType && s.data && "string" != typeof s.data && (s.data = JSON.stringify(s.data)), jQuery.ajax(this.addAuthIdentifier(jQuery.extend({}, this.getAjaxSettings(), s)))
  }, AeroGear.Pipeline.adapters.Rest.prototype.remove = function (e, t) {
    var r, a, n, i, s, o = this, u = this.getRecordId(), c = this.getAjaxSettings(), p = "";
    return"string" == typeof e || "number" == typeof e ? r = e : e && e[u] ? r = e[u] : e && !t && (t = e), t = t || {}, p = r ? "/" + r : "", a = c.url + p, n = function () {
      t.success && t.success.apply(this, arguments)
    }, i = function (e) {
      e = o.formatJSONError(e), t.error && t.error.apply(this, arguments)
    }, s = {type:"DELETE", url:a, success:n, error:i, statusCode:t.statusCode, complete:t.complete, headers:t.headers, timeout:this.getTimeout()}, jQuery.ajax(this.addAuthIdentifier(jQuery.extend({}, c, s)))
  }, AeroGear.DataManager = function (e) {
    return this instanceof AeroGear.DataManager ? (AeroGear.Core.call(this), this.lib = "DataManager", this.type = e ? e.type || "Memory" : "Memory", this.collectionName = "stores", this.add(e), t) : new AeroGear.DataManager(e)
  }, AeroGear.DataManager.prototype = AeroGear.Core, AeroGear.DataManager.constructor = AeroGear.DataManager, AeroGear.DataManager.adapters = {}, AeroGear.DataManager.STATUS_NEW = 1, AeroGear.DataManager.STATUS_MODIFIED = 2, AeroGear.DataManager.STATUS_REMOVED = 0, AeroGear.DataManager.adapters.Memory = function (e, t) {
    if (!(this instanceof AeroGear.DataManager.adapters.Memory))return new AeroGear.DataManager.adapters.Memory(e, t);
    t = t || {};
    var r = t.recordId ? t.recordId : "id", a = null;
    this.getRecordId = function () {
      return r
    }, this.getData = function () {
      return a
    }, this.setData = function (e) {
      a = e
    }, this.emptyData = function () {
      a = null
    }, this.addDataRecord = function (e) {
      a = a || [], a.push(e)
    }, this.updateDataRecord = function (e, t) {
      a[e] = t
    }, this.removeDataRecord = function (e) {
      a.splice(e, 1)
    }, this.traverseObjects = function (e, t, r) {
      for (; "object" == typeof t && r;)e = Object.keys(t)[0], t = t[e], r = r[e];
      return t === r ? !0 : !1
    }
  }, AeroGear.DataManager.adapters.Memory.prototype.read = function (e) {
    var t = {};
    return t[this.getRecordId()] = e, e ? this.filter(t) : this.getData()
  }, AeroGear.DataManager.adapters.Memory.prototype.save = function (e, t) {
    var r = !1;
    if (e = AeroGear.isArray(e) ? e : [e], t)this.setData(e); else if (this.getData())for (var a = 0; e.length > a; a++) {
      for (var n in this.getData())if (this.getData()[n][this.getRecordId()] === e[a][this.getRecordId()]) {
        this.updateDataRecord(n, e[a]), r = !0;
        break
      }
      r || this.addDataRecord(e[a]), r = !1
    } else this.setData(e);
    return this.getData()
  }, AeroGear.DataManager.adapters.Memory.prototype.remove = function (e) {
    if (!e)return this.emptyData(), this.getData();
    e = AeroGear.isArray(e) ? e : [e];
    for (var t, r, a, n = 0; e.length > n; n++) {
      if ("string" == typeof e[n] || "number" == typeof e[n])t = e[n]; else {
        if (!e)continue;
        t = e[n][this.getRecordId()]
      }
      r = this.getData(!0);
      for (a in r)r[a][this.getRecordId()] === t && this.removeDataRecord(a)
    }
    return this.getData()
  }, AeroGear.DataManager.adapters.Memory.prototype.filter = function (e, t) {
    var r, a, n, i, s, o = this;
    return r = e ? this.getData().filter(function (r) {
      var u, c, p = t ? !1 : !0, d = Object.keys(e);
      for (a = 0; d.length > a; a++) {
        if (e[d[a]].data)for (u = e[d[a]], c = u.matchAny ? !1 : !0, n = 0; u.data.length > n; n++)if (AeroGear.isArray(r[d[a]]))if (r[d[a]].length) {
          if (0 === jQuery(r[d]).not(u.data).length && 0 === jQuery(u.data).not(r[d]).length) {
            c = !0;
            break
          }
          for (i = 0; r[d[a]].length > i; i++) {
            if (u.matchAny && u.data[n] === r[d[a]][i]) {
              if (c = !0, t)break;
              for (s = 0; r[d[a]].length > s; s++)if (!t && u.data[n] !== r[d[a]][s]) {
                c = !1;
                break
              }
            }
            if (!u.matchAny && u.data[n] !== r[d[a]][i]) {
              c = !1;
              break
            }
          }
        } else c = !1; else if ("object" == typeof u.data[n]) {
          if (u.matchAny && o.traverseObjects(d[a], u.data[n], r[d[a]])) {
            c = !0;
            break
          }
          if (!u.matchAny && !o.traverseObjects(d[a], u.data[n], r[d[a]])) {
            c = !1;
            break
          }
        } else {
          if (u.matchAny && u.data[n] === r[d[a]]) {
            c = !0;
            break
          }
          if (!u.matchAny && u.data[n] !== r[d[a]]) {
            c = !1;
            break
          }
        } else if (AeroGear.isArray(r[d[a]]))if (c = t ? !1 : !0, r[d[a]].length)for (n = 0; r[d[a]].length > n; n++) {
          if (t && e[d[a]] === r[d[a]][n]) {
            c = !0;
            break
          }
          if (!t && e[d[a]] !== r[d[a]][n]) {
            c = !1;
            break
          }
        } else c = !1; else c = "object" == typeof e[d[a]] ? o.traverseObjects(d[a], e[d[a]], r[d[a]]) : e[d[a]] === r[d[a]] ? !0 : !1;
        if (t && c) {
          p = !0;
          break
        }
        if (!t && !c) {
          p = !1;
          break
        }
      }
      return p
    }) : this.getData() || []
  }, AeroGear.DataManager.adapters.SessionLocal = function (t, r) {
    if (!(this instanceof AeroGear.DataManager.adapters.SessionLocal))return new AeroGear.DataManager.adapters.SessionLocal(t, r);
    AeroGear.DataManager.adapters.Memory.apply(this, arguments);
    var a = r.storageType || "sessionStorage", n = t, i = document.location.pathname.replace(/[\/\.]/g, "-"), s = n + i, o = JSON.parse(e[a].getItem(s));
    o && AeroGear.DataManager.adapters.Memory.prototype.save.call(this, o, !0), this.getStoreType = function () {
      return a
    }, this.getStoreKey = function () {
      return s
    }
  }, AeroGear.DataManager.adapters.SessionLocal.prototype = Object.create(new AeroGear.DataManager.adapters.Memory, {save:{value:function (t, r) {
    var a = r && r.reset ? r.reset : !1, n = e[this.getStoreType()].getItem(this.getStoreKey()), i = AeroGear.DataManager.adapters.Memory.prototype.save.apply(this, [arguments[0], a]);
    try {
      e[this.getStoreType()].setItem(this.getStoreKey(), JSON.stringify(i)), r && r.storageSuccess && r.storageSuccess(i)
    } catch (s) {
      if (n = n ? JSON.parse(n) : [], i = AeroGear.DataManager.adapters.Memory.prototype.save.apply(this, [n, !0]), !r || !r.storageError)throw s;
      r.storageError(s, t)
    }
    return i
  }, enumerable:!0, configurable:!0, writable:!0}, remove:{value:function () {
    var t = AeroGear.DataManager.adapters.Memory.prototype.remove.apply(this, arguments);
    return e[this.getStoreType()].setItem(this.getStoreKey(), JSON.stringify(t)), t
  }, enumerable:!0, configurable:!0, writable:!0}}), AeroGear.Auth = function (e) {
    return this instanceof AeroGear.Auth ? (AeroGear.Core.call(this), this.lib = "Auth", this.type = e ? e.type || "Rest" : "Rest", this.collectionName = "modules", this.add(e), t) : new AeroGear.Auth(e)
  }, AeroGear.Auth.prototype = AeroGear.Core, AeroGear.Auth.constructor = AeroGear.Auth, AeroGear.Auth.adapters = {}, AeroGear.Auth.adapters.Rest = function (e, t) {
    if (!(this instanceof AeroGear.Auth.adapters.Rest))return new AeroGear.Auth.adapters.Rest(e, t);
    t = t || {};
    var r = t.endpoints || {}, a = e, n = !!t.agAuth, i = t.baseURL || "", s = t.tokenName || "Auth-Token";
    this.isAuthenticated = function () {
      return n ? !!sessionStorage.getItem("ag-auth-" + a) : !0
    }, this.addAuthIdentifier = function (e) {
      return e.headers = e.headers ? e.headers : {}, e.headers[s] = sessionStorage.getItem("ag-auth-" + a), jQuery.extend({}, e)
    }, this.deauthorize = function () {
      sessionStorage.removeItem("ag-auth-" + a)
    }, this.getSettings = function () {
      return t
    }, this.getEndpoints = function () {
      return r
    }, this.getName = function () {
      return a
    }, this.getAGAuth = function () {
      return n
    }, this.getBaseURL = function () {
      return i
    }, this.getTokenName = function () {
      return s
    }, this.processOptions = function (e) {
      var t = {};
      return e.contentType ? t.contentType = e.contentType : n && (t.contentType = "application/json"), e.dataType ? t.dataType = e.dataType : n && (t.dataType = "json"), t.url = e.baseURL ? e.baseURL : i, t
    }
  }, AeroGear.Auth.adapters.Rest.prototype.enroll = function (e, t) {
    t = t || {};
    var r = this, a = this.getName(), n = this.getTokenName(), i = this.getEndpoints(), s = function (e, i, s) {
      sessionStorage.setItem("ag-auth-" + a, r.getAGAuth() ? s.getResponseHeader(n) : "true"), t.success && t.success.apply(this, arguments)
    }, o = function (e, r, a) {
      var n;
      try {
        e.responseJSON = JSON.parse(e.responseText), n = [e, r, a]
      } catch (i) {
        n = arguments
      }
      t.error && t.error.apply(this, n)
    }, u = jQuery.extend({}, this.processOptions(t), {complete:t.complete, success:s, error:o, data:e});
    return u.url += i.enroll ? i.enroll : "auth/enroll", "application/json" === u.contentType && u.data && "string" != typeof u.data && (u.data = JSON.stringify(u.data)), jQuery.ajax(jQuery.extend({}, this.getSettings(), {type:"POST"}, u))
  }, AeroGear.Auth.adapters.Rest.prototype.login = function (e, t) {
    t = t || {};
    var r = this, a = this.getName(), n = this.getTokenName(), i = this.getEndpoints(), s = function (e, i, s) {
      sessionStorage.setItem("ag-auth-" + a, r.getAGAuth() ? s.getResponseHeader(n) : "true"), t.success && t.success.apply(this, arguments)
    }, o = function (e, r, a) {
      var n;
      try {
        e.responseJSON = JSON.parse(e.responseText), n = [e, r, a]
      } catch (i) {
        n = arguments
      }
      t.error && t.error.apply(this, n)
    }, u = jQuery.extend({}, this.processOptions(t), {complete:t.complete, success:s, error:o, data:e});
    return u.url += i.login ? i.login : "auth/login", "application/json" === u.contentType && u.data && "string" != typeof u.data && (u.data = JSON.stringify(u.data)), jQuery.ajax(jQuery.extend({}, this.getSettings(), {type:"POST"}, u))
  }, AeroGear.Auth.adapters.Rest.prototype.logout = function (e) {
    e = e || {};
    var t = this, r = this.getName(), a = this.getTokenName(), n = this.getEndpoints(), i = function () {
      t.deauthorize(), e.success && e.success.apply(this, arguments)
    }, s = function (t, r, a) {
      var n;
      try {
        t.responseJSON = JSON.parse(t.responseText), n = [t, r, a]
      } catch (i) {
        n = arguments
      }
      e.error && e.error.apply(this, n)
    }, o = jQuery.extend({}, this.processOptions(e), {complete:e.complete, success:i, error:s});
    return o.url += n.logout ? n.logout : "auth/logout", o.headers = {}, o.headers[a] = sessionStorage.getItem("ag-auth-" + r), jQuery.ajax(jQuery.extend({}, this.getSettings(), {type:"POST"}, o))
  }
})(this);
//@ sourceMappingURL=aerogear.js.map